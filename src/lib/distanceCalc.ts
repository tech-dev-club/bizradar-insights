/**
 * Distance Calculation Utilities
 * Uses the Haversine formula for distance calculation between coordinates.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers, rounded to two decimal places
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(coord2.lat - coord1.lat);
  const longitudeDelta = toRadians(coord2.lng - coord1.lng);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(longitudeDelta / 2) ** 2;

  // Floating-point rounding can move the value a tiny amount outside [0, 1].
  const boundedHaversine = Math.min(1, Math.max(0, haversine));
  const centralAngle =
    2 * Math.atan2(Math.sqrt(boundedHaversine), Math.sqrt(1 - boundedHaversine));

  return Math.round(earthRadiusKm * centralAngle * 100) / 100;
}

/** Convert degrees to radians. */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format a distance for display.
 * Invalid values are shown as unavailable instead of leaking NaN or Infinity.
 */
export function formatDistance(distanceKm: number): string {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    return "N/A";
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }

  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Sort locations by distance from a reference point without mutating the input.
 */
export function sortByDistance<T extends { coordinates: Coordinates }>(
  locations: T[],
  referencePoint: Coordinates,
): T[] {
  return [...locations].sort((a, b) => {
    const distanceA = calculateDistance(referencePoint, a.coordinates);
    const distanceB = calculateDistance(referencePoint, b.coordinates);
    return distanceA - distanceB;
  });
}
