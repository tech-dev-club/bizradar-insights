import { INDIAN_CITIES } from "@/lib/constants";

export interface LocationData {
  name: string;
  state?: string;
  lat: number;
  lng: number;
  population?: number;
  formattedAddress: string;
}

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  name: string;
  display_name: string;
  type: string;
  class: string;
  addresstype: string;
  boundingbox: string[];
}

/**
 * Search locations using OpenStreetMap Nominatim API.
 * Returns matching locations worldwide.
 */
export const searchLocations = async (query: string): Promise<LocationData[]> => {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(normalizedQuery)}&` +
        `format=json&` +
        `limit=5&` +
        `addressdetails=1`,
      {
        headers: {
          "User-Agent": "BizRadar/1.0",
        },
      },
    );

    if (!response.ok) throw new Error("Geocoding failed");

    const data: NominatimResult[] = await response.json();

    return data.map((result) => ({
      name: result.name,
      lat: Number.parseFloat(result.lat),
      lng: Number.parseFloat(result.lon),
      formattedAddress: result.display_name,
      state: extractState(result.display_name),
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    // Keep the local fallback useful when the external provider is unavailable.
    return searchIndianCities(normalizedQuery);
  }
};

/** Extract state/region from a formatted address. */
const extractState = (displayName: string): string | undefined => {
  const parts = displayName.split(", ");
  return parts.length > 1 ? parts[parts.length - 2] : undefined;
};

/** Search the bundled Indian city list by city or state name. */
export const searchIndianCities = (query: string): LocationData[] => {
  const searchTerm = query.trim().toLocaleLowerCase();
  if (searchTerm.length < 2) return [];

  return INDIAN_CITIES
    .filter((city) =>
      city.name.toLocaleLowerCase().includes(searchTerm) ||
      city.state.toLocaleLowerCase().includes(searchTerm),
    )
    .slice(0, 5)
    .map((city) => ({
      name: city.name,
      state: city.state,
      lat: city.lat,
      lng: city.lng,
      population: city.population,
      formattedAddress: `${city.name}, ${city.state}, India`,
    }));
};

/**
 * Get coordinates for a specific city.
 * Handles both simple city names and formatted addresses.
 */
export const getCityCoordinates = (cityNameOrAddress: string): LocationData | null => {
  const cityName = cityNameOrAddress.split(",")[0].trim();

  const city = INDIAN_CITIES.find(
    (candidate) => candidate.name.toLocaleLowerCase() === cityName.toLocaleLowerCase(),
  );

  if (!city) {
    console.warn(`City not found: ${cityName}`);
    return null;
  }

  return {
    name: city.name,
    state: city.state,
    lat: city.lat,
    lng: city.lng,
    population: city.population,
    formattedAddress: `${city.name}, ${city.state}, India`,
  };
};

/** Validate the six-digit Indian PIN-code format. */
export const parsePinCode = (pinCode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pinCode.trim());
};

/**
 * Resolve a PIN code to a city.
 *
 * No PIN-code dataset or external lookup provider is currently configured.
 * Return null rather than inventing a city for a valid-looking PIN.
 */
export const getCityByPinCode = async (
  pinCode: string,
): Promise<LocationData | null> => {
  if (!parsePinCode(pinCode)) return null;
  return null;
};
