/**
 * Trend Simulator - Generates illustrative historical trend data.
 * The returned series are simulated and must not be presented as measured history.
 */

export interface TrendData {
  demandTrend: number[];
  competitionTrend: number[];
  growthTrend: number[];
  months: string[];
}

const clampIndex = (value: number, fallback: number): number =>
  Math.min(100, Math.max(0, Number.isFinite(value) ? value : fallback));

const createSeededRandom = (seedText: string): (() => number) => {
  let seed = 2166136261;

  for (let index = 0; index < seedText.length; index += 1) {
    seed = Math.imul(seed ^ seedText.charCodeAt(index), 16777619);
  }

  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

/**
 * Generate an illustrative six-month trend for the supplied inputs.
 * Repeated calls with identical inputs return identical data.
 */
export const generateHistoricalTrends = (
  currentDemand: number,
  currentCompetition: number,
  category: string,
): TrendData => {
  const demand = clampIndex(currentDemand, 0);
  const competitionIndex = clampIndex(currentCompetition, 0);
  const normalizedCategory = category.trim().toLowerCase();
  const random = createSeededRandom(
    `${demand.toFixed(2)}:${competitionIndex.toFixed(2)}:${normalizedCategory}`,
  );

  const months = ["6mo ago", "5mo ago", "4mo ago", "3mo ago", "2mo ago", "1mo ago", "Now"];

  const volatilityByCategory: Record<string, number> = {
    "food-beverage": 0.08,
    retail: 0.12,
    technology: 0.15,
    education: 0.06,
    "health-wellness": 0.1,
  };

  const volatility = volatilityByCategory[normalizedCategory] ?? 0.1;

  const demandTrend: number[] = [];
  let projectedDemand = demand * 0.75;

  for (let month = 0; month < 7; month += 1) {
    const noise = (random() - 0.5) * volatility * 100;
    projectedDemand = Math.min(100, Math.max(0, projectedDemand + noise + 3));
    demandTrend.push(Math.round(projectedDemand));
  }
  demandTrend[6] = Math.round(demand);

  const competitionTrend: number[] = [];
  let projectedCompetition = competitionIndex * 0.85;

  for (let month = 0; month < 7; month += 1) {
    const noise = (random() - 0.5) * volatility * 50;
    projectedCompetition = Math.min(
      100,
      Math.max(0, projectedCompetition + noise + 2),
    );
    competitionTrend.push(Math.round(projectedCompetition));
  }
  competitionTrend[6] = Math.round(competitionIndex);

  const growthTrend = demandTrend.map((demandValue, index) =>
    Math.round((demandValue - competitionTrend[index] * 0.5) * 0.8),
  );

  return {
    demandTrend,
    competitionTrend,
    growthTrend,
    months,
  };
};

/** Get a visual label for a forecast direction. */
export const getTrendBadge = (direction: "growing" | "flat" | "declining") => {
  switch (direction) {
    case "growing":
      return { label: "Growing", icon: "↑", color: "success" };
    case "declining":
      return { label: "Declining", icon: "↓", color: "destructive" };
    default:
      return { label: "Stable", icon: "→", color: "warning" };
  }
};
