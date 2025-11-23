/**
 * Customer Persona Match Engine - Level A Feature
 * Matches business idea with local demographics
 */

export interface CustomerPersona {
  ageGroup: string;
  incomeLevel: "Low" | "Middle" | "Upper-Middle" | "High";
  lifestyle: string[];
  interests: string[];
  spendingPower: number; // 0-100
  matchScore: number; // 0-100
}

export interface PersonaMatch {
  primaryPersona: CustomerPersona;
  secondaryPersona: CustomerPersona | null;
  overallMatch: number; // 0-100
  demographicFit: {
    youthDensity: number; // % of population 18-35
    incomeAlignment: "Excellent" | "Good" | "Fair" | "Poor";
    lifestyleMatch: "Strong" | "Moderate" | "Weak";
    zoneType: "Residential" | "Commercial" | "Mixed" | "Industrial";
  };
  insights: string[];
  warnings: string[];
}

/**
 * Generate customer persona based on category
 */
export function generatePersona(
  category: string,
  pricingLevel: "Affordable" | "Mid-Range" | "Premium"
): CustomerPersona {
  const personas: Record<string, Partial<CustomerPersona>> = {
    "Cafe": {
      ageGroup: "18-35",
      lifestyle: ["Urban", "Social", "Tech-savvy"],
      interests: ["Coffee culture", "Socializing", "Remote work"],
    },
    "Restaurant": {
      ageGroup: "25-45",
      lifestyle: ["Family-oriented", "Food enthusiasts"],
      interests: ["Dining out", "Celebrations", "Cuisine variety"],
    },
    "Gym": {
      ageGroup: "20-40",
      lifestyle: ["Health-conscious", "Active"],
      interests: ["Fitness", "Wellness", "Sports"],
    },
    "Salon": {
      ageGroup: "20-50",
      lifestyle: ["Fashion-conscious", "Appearance-focused"],
      interests: ["Beauty", "Grooming", "Self-care"],
    },
    "Retail": {
      ageGroup: "18-60",
      lifestyle: ["Shopping enthusiasts", "Brand-conscious"],
      interests: ["Fashion", "Lifestyle products", "Quality goods"],
    },
  };

  const basePersona = personas[category] || personas["Retail"];

  const incomeLevelMap: Record<string, "Low" | "Middle" | "Upper-Middle" | "High"> = {
    "Affordable": "Middle",
    "Mid-Range": "Upper-Middle",
    "Premium": "High",
  };

  const spendingPowerMap = {
    "Affordable": 45,
    "Mid-Range": 65,
    "Premium": 85,
  };

  return {
    ageGroup: basePersona.ageGroup || "18-50",
    incomeLevel: incomeLevelMap[pricingLevel],
    lifestyle: basePersona.lifestyle || ["Urban"],
    interests: basePersona.interests || ["General"],
    spendingPower: spendingPowerMap[pricingLevel],
    matchScore: 70,
  };
}

/**
 * Calculate persona match score
 */
export function calculatePersonaMatch(
  category: string,
  pricingLevel: "Affordable" | "Mid-Range" | "Premium",
  populationDensity: number,
  demandIndex: number,
  location: string
): PersonaMatch {
  const primaryPersona = generatePersona(category, pricingLevel);
  
  // Estimate demographics
  const youthDensity = populationDensity > 100 ? 45 : populationDensity > 50 ? 35 : 25;
  
  // Income alignment
  let incomeAlignment: "Excellent" | "Good" | "Fair" | "Poor";
  if (primaryPersona.incomeLevel === "High" && populationDensity > 100) {
    incomeAlignment = "Excellent";
  } else if (primaryPersona.incomeLevel === "Middle" && populationDensity > 30) {
    incomeAlignment = "Good";
  } else if (primaryPersona.incomeLevel === "Upper-Middle") {
    incomeAlignment = "Good";
  } else {
    incomeAlignment = "Fair";
  }

  // Lifestyle match
  const lifestyleMatch = demandIndex >= 70 ? "Strong" : demandIndex >= 50 ? "Moderate" : "Weak";

  // Zone type determination
  let zoneType: "Residential" | "Commercial" | "Mixed" | "Industrial";
  if (location.includes("Market") || location.includes("Mall")) {
    zoneType = "Commercial";
  } else if (populationDensity > 80) {
    zoneType = "Mixed";
  } else if (populationDensity > 40) {
    zoneType = "Residential";
  } else {
    zoneType = "Industrial";
  }

  // Overall match calculation
  const densityScore = Math.min(100, (youthDensity / 50) * 100);
  const incomeScore = incomeAlignment === "Excellent" ? 90 : incomeAlignment === "Good" ? 70 : incomeAlignment === "Fair" ? 50 : 30;
  const lifestyleScore = lifestyleMatch === "Strong" ? 80 : lifestyleMatch === "Moderate" ? 60 : 40;
  const overallMatch = Math.round((densityScore * 0.3) + (incomeScore * 0.4) + (lifestyleScore * 0.3));

  primaryPersona.matchScore = overallMatch;

  // Generate insights
  const insights: string[] = [];
  const warnings: string[] = [];

  if (overallMatch >= 75) {
    insights.push("Excellent demographic match - target audience is prevalent");
    insights.push(`${youthDensity}% youth density aligns well with ${category} category`);
  } else if (overallMatch >= 50) {
    insights.push("Moderate demographic fit - marketing will be important");
  } else {
    warnings.push("Demographic mismatch detected - consider repositioning");
  }

  if (zoneType === "Commercial") {
    insights.push("Commercial zone - high foot traffic expected");
  } else if (zoneType === "Residential") {
    insights.push("Residential area - focus on local customer base");
  }

  if (pricingLevel === "Premium" && incomeAlignment !== "Excellent") {
    warnings.push("Premium pricing may not align with local income levels");
  }

  if (youthDensity < 20 && category === "Cafe") {
    warnings.push("Low youth density - cafe concept may face challenges");
  }

  return {
    primaryPersona,
    secondaryPersona: null,
    overallMatch,
    demographicFit: {
      youthDensity,
      incomeAlignment,
      lifestyleMatch,
      zoneType,
    },
    insights,
    warnings,
  };
}
