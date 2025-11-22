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
 * Search locations using OpenStreetMap Nominatim API
 * Returns matching locations worldwide
 */
export const searchLocations = async (query: string): Promise<LocationData[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&` +
      `format=json&` +
      `limit=5&` +
      `addressdetails=1`,
      {
        headers: {
          'User-Agent': 'BizRadar/1.0'
        }
      }
    );
    
    if (!response.ok) throw new Error("Geocoding failed");
    
    const data: NominatimResult[] = await response.json();
    
    return data.map(result => ({
      name: result.name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      formattedAddress: result.display_name,
      state: extractState(result.display_name),
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    // Fallback to local Indian cities
    return searchIndianCities(query);
  }
};

/**
 * Extract state/region from display name
 */
const extractState = (displayName: string): string | undefined => {
  const parts = displayName.split(', ');
  return parts.length > 1 ? parts[parts.length - 2] : undefined;
};

/**
 * Search for Indian cities by name (fallback)
 * Returns matching cities from our database
 */
export const searchIndianCities = (query: string): LocationData[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return INDIAN_CITIES
    .filter(city => 
      city.name.toLowerCase().includes(searchTerm) || 
      city.state.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5)
    .map(city => ({
      name: city.name,
      state: city.state,
      lat: city.lat,
      lng: city.lng,
      population: city.population,
      formattedAddress: `${city.name}, ${city.state}, India`,
    }));
};

/**
 * Get coordinates for a specific city
 * Handles both simple city names and formatted addresses
 */
export const getCityCoordinates = (cityNameOrAddress: string): LocationData | null => {
  // Extract city name from formatted address (e.g., "Mumbai, Maharashtra, India" -> "Mumbai")
  const cityName = cityNameOrAddress.split(',')[0].trim();
  
  const city = INDIAN_CITIES.find(
    c => c.name.toLowerCase() === cityName.toLowerCase()
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

/**
 * Parse PIN code format (basic validation)
 * Note: Real PIN code to location would require external API
 */
export const parsePinCode = (pinCode: string): boolean => {
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pinCode);
};

/**
 * Get city by PIN code (mock implementation)
 * In production, use India Post API or similar service
 */
export const getCityByPinCode = async (pinCode: string): Promise<LocationData | null> => {
  if (!parsePinCode(pinCode)) return null;
  
  // Mock: Return a random Indian city (replace with real API in production)
  const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
  
  return {
    name: randomCity.name,
    state: randomCity.state,
    lat: randomCity.lat,
    lng: randomCity.lng,
    population: randomCity.population,
    formattedAddress: `${randomCity.name}, ${randomCity.state}, India (PIN: ${pinCode})`,
  };
};
