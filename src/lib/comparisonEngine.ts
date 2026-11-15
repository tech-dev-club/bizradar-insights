/**
 * Comparison Engine - BizRadar
 * Compares multiple business opportunities side-by-side.
 */

export interface ComparisonItem {
  id: string;
  name: string;
  location: string;
  category: string;
  bizScoreToday: number;
  bizScore12M: number;
  demandIndex: number;
  competitionDensity: string;
  forecastGrowth: number;
  breakEvenMonths: number;
  profitMarginMin: number;
  profitMarginMax: number;
  setupCostMin: number;
  setupCostMax: number;
  strategicOpportunityIndex: number;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface ComparisonResult {
  items: ComparisonItem[];
  winner: string;
  analysis: {
    bestScore: ComparisonItem;
    bestGrowth: ComparisonItem;
    lowestRisk: ComparisonItem;
    fastestBreakEven: ComparisonItem;
    highestProfit: ComparisonItem;
  };
  scoreBreakdown: {
    [key: string]: {
      score: number;
      rank: number;
      strengths: string[];
      weaknesses: string[];
    };
  };
}

const clampScore = (value: number): number =>
  Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

export function compareIdeas(items: ComparisonItem[]): ComparisonResult {
  if (items.length < 2) {
    throw new Error("Need at least 2 items to compare");
  }

  const ids = new Set(items.map((item) => item.id));
  if (ids.size !== items.length) {
    throw new Error("Comparison items must have unique IDs");
  }

  const bestScore = items.reduce((best, item) =>
    item.bizScoreToday > best.bizScoreToday ? item : best,
  );
  const bestGrowth = items.reduce((best, item) =>
    item.forecastGrowth > best.forecastGrowth ? item : best,
  );
  const lowestRisk = items.reduce((best, item) =>
    getRiskScore(item) < getRiskScore(best) ? item : best,
  );
  const fastestBreakEven = items.reduce((best, item) =>
    item.breakEvenMonths < best.breakEvenMonths ? item : best,
  );
  const highestProfit = items.reduce((best, item) =>
    item.profitMarginMax > best.profitMarginMax ? item : best,
  );

  const scoreBreakdown: ComparisonResult["scoreBreakdown"] = {};

  items.forEach((item) => {
    scoreBreakdown[item.id] = {
      score: calculateOverallScore(item),
      rank: 0,
      strengths: identifyStrengths(item, items),
      weaknesses: identifyWeaknesses(item, items),
    };
  });

  const sortedScores = Object.entries(scoreBreakdown).sort(
    (a, b) => b[1].score - a[1].score,
  );

  sortedScores.forEach(([id], index) => {
    scoreBreakdown[id].rank = index + 1;
  });

  const winner = sortedScores[0][0];

  return {
    items,
    winner,
    analysis: {
      bestScore,
      bestGrowth,
      lowestRisk,
      fastestBreakEven,
      highestProfit,
    },
    scoreBreakdown,
  };
}

function calculateOverallScore(item: ComparisonItem): number {
  const weights = {
    bizScore: 0.25,
    growth: 0.2,
    demand: 0.15,
    competition: 0.15,
    profitability: 0.15,
    breakEven: 0.1,
  };

  const growthScore = Number.isFinite(item.forecastGrowth)
    ? (item.forecastGrowth - 1) * 200
    : 0;

  const scores = {
    bizScore: clampScore(item.bizScoreToday),
    growth: clampScore(growthScore),
    demand: clampScore(item.demandIndex),
    competition: getCompetitionScore(item.competitionDensity),
    profitability: clampScore((item.profitMarginMax / 50) * 100),
    breakEven: clampScore(100 - (item.breakEvenMonths / 36) * 100),
  };

  const weightedScore = Object.entries(weights).reduce((total, [key, weight]) => {
    return total + scores[key as keyof typeof scores] * weight;
  }, 0);

  return clampScore(Math.round(weightedScore));
}

function getCompetitionScore(density: string): number {
  switch (density) {
    case "Low": return 90;
    case "Balanced": return 70;
    case "High": return 40;
    case "Oversaturated": return 20;
    default: return 50;
  }
}

function getRiskScore(item: ComparisonItem): number {
  let risk = 50;

  if (item.competitionDensity === "Oversaturated") risk += 30;
  else if (item.competitionDensity === "High") risk += 20;
  else if (item.competitionDensity === "Low") risk -= 20;

  if (item.demandIndex < 40) risk += 20;
  else if (item.demandIndex > 70) risk -= 15;

  if (item.forecastGrowth < 1.0) risk += 25;
  else if (item.forecastGrowth > 1.2) risk -= 15;

  if (item.breakEvenMonths > 24) risk += 15;
  else if (item.breakEvenMonths < 12) risk -= 10;

  return clampScore(risk);
}

function identifyStrengths(item: ComparisonItem, allItems: ComparisonItem[]): string[] {
  const strengths: string[] = [];
  const avgBizScore = allItems.reduce((sum, current) => sum + current.bizScoreToday, 0) / allItems.length;
  if (item.bizScoreToday > avgBizScore + 5) strengths.push("Above-average market score");

  const avgGrowth = allItems.reduce((sum, current) => sum + current.forecastGrowth, 0) / allItems.length;
  if (item.forecastGrowth > avgGrowth) strengths.push("Strong growth potential");

  const minBreakEven = Math.min(...allItems.map((current) => current.breakEvenMonths));
  if (item.breakEvenMonths === minBreakEven) strengths.push("Fastest break-even time");

  if (item.competitionDensity === "Low" || item.competitionDensity === "Balanced") {
    strengths.push("Favorable competitive landscape");
  }
  if (item.profitMarginMax > 30) strengths.push("High profit margins");

  return strengths;
}

function identifyWeaknesses(item: ComparisonItem, allItems: ComparisonItem[]): string[] {
  const weaknesses: string[] = [];
  const avgBizScore = allItems.reduce((sum, current) => sum + current.bizScoreToday, 0) / allItems.length;
  if (item.bizScoreToday < avgBizScore - 5) weaknesses.push("Below-average market score");

  if (item.forecastGrowth < 1.05) weaknesses.push("Limited growth prospects");

  const maxBreakEven = Math.max(...allItems.map((current) => current.breakEvenMonths));
  if (item.breakEvenMonths === maxBreakEven && item.breakEvenMonths > 18) {
    weaknesses.push("Longest break-even time");
  }

  if (item.competitionDensity === "High" || item.competitionDensity === "Oversaturated") {
    weaknesses.push("Intense competition");
  }
  if (item.demandIndex < 50) weaknesses.push("Lower market demand");

  return weaknesses;
}
