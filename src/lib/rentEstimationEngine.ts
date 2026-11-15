/**
 * Rent & Real Estate Suitability Engine - Level A Feature
 * Estimates commercial rent and location suitability
 */

export interface RentEstimate {
  minRent: number;
  maxRent: number;
  avgRent: number;
  currency: string;
  per: "sqft" | "month";
  suitabilityScore: number; // 0-100
  affordabilityIndex: number; // 0-100 (higher = more affordable)
  locationGrade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";
  factors: {
    footfall: "High" | "Medium" | "Low";
    accessibility: "Excellent" | "Good" | "Average" | "Poor";
    competition: "Low" | "Moderate" | "High";
    infrastructure: "Modern" | "Good" | "Average" | "Basic";
  };
  recommendations: string[];
}

/**
 * Calculate rent estimate based on location and business type
 */
export function estimateRent(
  city: string,
  category: string,
  requiredSpace: "Small" | "Medium" | "Large",
  populationDensity: number,
  demandIndex: number
): RentEstimate {
  // Base rent calculation (INR per sq ft). Normalize user/stored values first.
  const safeDemandIndex = Math.min(100, Math.max(0, Number.isFinite(demandIndex) ? demandIndex : 0));
  const safePopulationDensity = Math.max(
    0,
    Number.isFinite(populationDensity) ? populationDensity : 0,
  );
  const cityKey = city.split(",")[0].trim().toLowerCase();
  const categoryKey = category.trim().toLowerCase();
  let baseRent = 50;

  // City tier adjustment
  const tierMultipliers: Record<string, number> = {
    mumbai: 3.5,
    delhi: 3.2,
    bangalore: 3.0,
    bengaluru: 3.0,
    pune: 2.5,
    hyderabad: 2.3,
    chennai: 2.2,
    kolkata: 2.0,
  };

  baseRent *= tierMultipliers[cityKey] || 1.5;

  // Category adjustment
  const categoryMultipliers: Record<string, number> = {
    cafe: 1.2,
    restaurant: 1.3,
    retail: 1.4,
    salon: 1.0,
    gym: 1.1,
    office: 0.9,
  };

  baseRent *= categoryMultipliers[categoryKey] || 1.0;

  // Space adjustment
  const spaceMultipliers = {
    "Small": 0.8,
    "Medium": 1.0,
    "Large": 1.3,
  };

  baseRent *= spaceMultipliers[requiredSpace];

  // Demand adjustment
  baseRent *= 1 + safeDemandIndex / 200;

  const minRent = Math.round(baseRent * 0.8);
  const maxRent = Math.round(baseRent * 1.4);
  const avgRent = Math.round((minRent + maxRent) / 2);

  // Calculate suitability score
  const densityScore = Math.min(100, (safePopulationDensity / 150) * 100);
  const demandScore = safeDemandIndex;
  const suitabilityScore = Math.round((densityScore * 0.4) + (demandScore * 0.6));

  // Affordability index (inverse of rent burden)
  const affordabilityIndex = Math.max(0, Math.min(100, 100 - (avgRent / 100)));

  // Determine location grade
  let locationGrade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";
  if (suitabilityScore >= 85) locationGrade = "A+";
  else if (suitabilityScore >= 75) locationGrade = "A";
  else if (suitabilityScore >= 65) locationGrade = "B+";
  else if (suitabilityScore >= 55) locationGrade = "B";
  else if (suitabilityScore >= 45) locationGrade = "C+";
  else if (suitabilityScore >= 35) locationGrade = "C";
  else locationGrade = "D";

  // Generate factors
  const factors = {
    footfall: demandIndex >= 70 ? "High" : demandIndex >= 50 ? "Medium" : "Low" as "High" | "Medium" | "Low",
    accessibility: suitabilityScore >= 70 ? "Excellent" : suitabilityScore >= 50 ? "Good" : suitabilityScore >= 30 ? "Average" : "Poor" as "Excellent" | "Good" | "Average" | "Poor",
    competition: safePopulationDensity > 100 ? "High" : safePopulationDensity > 50 ? "Moderate" : "Low" as "Low" | "Moderate" | "High",
    infrastructure: suitabilityScore >= 75 ? "Modern" : suitabilityScore >= 55 ? "Good" : suitabilityScore >= 35 ? "Average" : "Basic" as "Modern" | "Good" | "Average" | "Basic",
  };

  // Generate recommendations
  const recommendations: string[] = [];
  if (avgRent > 80) {
    recommendations.push("High rent area - ensure strong revenue projections");
    recommendations.push("Consider negotiating long-term lease for better rates");
  } else {
    recommendations.push("Reasonable rent expectations for this location");
  }

  if (factors.footfall === "High") {
    recommendations.push("Excellent footfall potential - premium rent justified");
  }

  if (locationGrade === "A+" || locationGrade === "A") {
    recommendations.push("Prime location - high visibility and customer access");
  } else if (locationGrade === "C" || locationGrade === "D") {
    recommendations.push("Consider alternative locations with better infrastructure");
  }

  return {
    minRent,
    maxRent,
    avgRent,
    currency: "INR",
    per: "sqft",
    suitabilityScore,
    affordabilityIndex,
    locationGrade,
    factors,
    recommendations,
  };
}
