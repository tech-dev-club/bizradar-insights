import { MarketData } from "./marketData";

export interface ForecastData {
  demandIndex6M: number;
  demandIndex12M: number;
  competitionIndex6M: number;
  competitionIndex12M: number;
  bizScore6M: number;
  bizScore12M: number;
  growthRate: number;
  trendDirection: "growing" | "flat" | "declining";
}

/**
 * Forecast Engine - Predicts future market conditions
 * Uses growth rate formulas to project 6 and 12 month values
 */
export const generateForecast = (
  marketData: MarketData,
  category: string,
  currentBizScore: number
): ForecastData => {
  // Category-based growth rates (annual %)
  const categoryGrowthRates: Record<string, number> = {
    "food-beverage": 0.15,
    "retail": 0.10,
    "technology": 0.25,
    "education": 0.18,
    "health-wellness": 0.20,
  };

  const categoryKey = Object.keys(categoryGrowthRates).find(
    (key) => key.toLowerCase() === category.trim().toLowerCase(),
  );
  const annualGrowthRate = categoryKey ? categoryGrowthRates[categoryKey] : 0.12;
  const safeDemandIndex = Number.isFinite(marketData.demandIndex)
    ? Math.min(100, Math.max(0, marketData.demandIndex))
    : 0;
  const safeCompetitionIndex = Number.isFinite(marketData.competitionIndex)
    ? Math.min(100, Math.max(0, marketData.competitionIndex))
    : 0;
  const safePopulationDensity = Number.isFinite(marketData.populationDensity)
    ? Math.max(0, marketData.populationDensity)
    : 0;
  const safeCurrentBizScore = Number.isFinite(currentBizScore)
    ? Math.min(100, Math.max(0, currentBizScore))
    : 0;

  // Calculate 6-month and 12-month growth factors
  const growth6M = 1 + (annualGrowthRate * 0.5);
  const growth12M = 1 + annualGrowthRate;

  // Competition typically grows slower than demand
  const competitionGrowth6M = 1 + (annualGrowthRate * 0.3);
  const competitionGrowth12M = 1 + (annualGrowthRate * 0.6);

  // Project demand
  const demandIndex6M = Math.min(100, Math.round(safeDemandIndex * growth6M));
  const demandIndex12M = Math.min(100, Math.round(safeDemandIndex * growth12M));

  // Project competition
  const competitionIndex6M = Math.min(100, Math.round(safeCompetitionIndex * competitionGrowth6M));
  const competitionIndex12M = Math.min(100, Math.round(safeCompetitionIndex * competitionGrowth12M));

  // Calculate future BizScores using enhanced formula
  const calculateFutureBizScore = (demand: number, competition: number, density: number) => {
    const normalizedDensity = Math.min(100, (density / 20000) * 100);
    const competitionPenalty = Math.max(0, 100 - competition);
    
    return Math.round(
      Math.min(100, Math.max(0, 
        (0.4 * demand) + 
        (0.2 * annualGrowthRate * 100) + 
        (0.2 * normalizedDensity) + 
        (0.2 * competitionPenalty)
      ))
    );
  };

  const bizScore6M = calculateFutureBizScore(demandIndex6M, competitionIndex6M, safePopulationDensity);
  const bizScore12M = calculateFutureBizScore(demandIndex12M, competitionIndex12M, safePopulationDensity);

  // Determine trend direction
  let trendDirection: "growing" | "flat" | "declining";
  const scoreDiff = bizScore12M - safeCurrentBizScore;
  
  if (scoreDiff > 5) {
    trendDirection = "growing";
  } else if (scoreDiff < -5) {
    trendDirection = "declining";
  } else {
    trendDirection = "flat";
  }

  return {
    demandIndex6M,
    demandIndex12M,
    competitionIndex6M,
    competitionIndex12M,
    bizScore6M,
    bizScore12M,
    growthRate: annualGrowthRate,
    trendDirection,
  };
};
