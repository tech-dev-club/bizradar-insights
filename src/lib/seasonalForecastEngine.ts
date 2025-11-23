/**
 * Seasonal Demand Forecasting Engine - Level A Feature
 * Predicts seasonal variations in demand
 */

export interface SeasonalData {
  month: string;
  demandMultiplier: number; // 0.5 = 50% of baseline, 1.5 = 150%
  expectedRevenue: number;
  reasoning: string;
}

export interface SeasonalForecast {
  category: string;
  seasonalityLevel: "High" | "Moderate" | "Low";
  peakMonths: string[];
  lowMonths: string[];
  monthlyData: SeasonalData[];
  annualVariance: number; // % difference between peak and trough
  recommendations: string[];
}

/**
 * Get seasonal patterns for different categories
 */
const seasonalPatterns: Record<string, number[]> = {
  // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  "Cafe": [0.9, 0.95, 1.0, 1.1, 1.15, 1.0, 0.85, 0.9, 1.0, 1.1, 1.2, 1.25],
  "Restaurant": [1.1, 1.0, 0.95, 1.0, 1.05, 0.9, 0.85, 0.9, 1.0, 1.15, 1.25, 1.3],
  "Retail": [0.95, 0.9, 1.0, 1.05, 1.0, 0.85, 0.8, 0.9, 1.1, 1.25, 1.35, 1.4],
  "Gym": [1.3, 1.2, 1.1, 1.0, 0.95, 0.9, 0.85, 0.9, 1.0, 1.05, 1.0, 0.95],
  "Salon": [1.0, 1.05, 1.1, 1.15, 1.1, 1.0, 0.95, 1.0, 1.05, 1.15, 1.25, 1.3],
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Generate seasonal forecast
 */
export function generateSeasonalForecast(
  category: string,
  baselineRevenue: number
): SeasonalForecast {
  const pattern = seasonalPatterns[category] || seasonalPatterns["Retail"];
  
  const monthlyData: SeasonalData[] = pattern.map((multiplier, index) => {
    const expectedRevenue = Math.round(baselineRevenue * multiplier);
    let reasoning = "";

    if (multiplier >= 1.2) {
      reasoning = "Peak season - high customer activity expected";
    } else if (multiplier >= 1.05) {
      reasoning = "Above average demand";
    } else if (multiplier >= 0.95) {
      reasoning = "Normal seasonal activity";
    } else if (multiplier >= 0.8) {
      reasoning = "Below average - off-season";
    } else {
      reasoning = "Low season - expect reduced footfall";
    }

    return {
      month: monthNames[index],
      demandMultiplier: multiplier,
      expectedRevenue,
      reasoning,
    };
  });

  // Find peaks and lows
  const maxMultiplier = Math.max(...pattern);
  const minMultiplier = Math.min(...pattern);
  
  const peakMonths = monthlyData
    .filter(d => d.demandMultiplier >= maxMultiplier - 0.05)
    .map(d => d.month);
  
  const lowMonths = monthlyData
    .filter(d => d.demandMultiplier <= minMultiplier + 0.05)
    .map(d => d.month);

  const annualVariance = Math.round(((maxMultiplier - minMultiplier) / minMultiplier) * 100);

  let seasonalityLevel: "High" | "Moderate" | "Low";
  if (annualVariance > 40) seasonalityLevel = "High";
  else if (annualVariance > 20) seasonalityLevel = "Moderate";
  else seasonalityLevel = "Low";

  // Generate recommendations
  const recommendations: string[] = [];

  if (seasonalityLevel === "High") {
    recommendations.push("Prepare for significant seasonal variations");
    recommendations.push(`Stock up inventory before ${peakMonths[0]}`);
    recommendations.push(`Plan cost-cutting measures for ${lowMonths.join(", ")}`);
    recommendations.push("Consider seasonal promotions during low months");
  } else if (seasonalityLevel === "Moderate") {
    recommendations.push("Moderate seasonal impact - maintain flexible staffing");
    recommendations.push("Run targeted campaigns during peak periods");
  } else {
    recommendations.push("Low seasonality - consistent operations year-round");
    recommendations.push("Focus on building steady customer base");
  }

  if (category === "Gym" && peakMonths.includes("Jan")) {
    recommendations.push("Capitalize on New Year fitness resolutions");
  }

  if (category === "Retail" && peakMonths.includes("Nov")) {
    recommendations.push("Prepare for festive season rush - stock premium items");
  }

  return {
    category,
    seasonalityLevel,
    peakMonths,
    lowMonths,
    monthlyData,
    annualVariance,
    recommendations,
  };
}
