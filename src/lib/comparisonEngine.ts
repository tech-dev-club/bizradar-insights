/**
 * Comparison Engine - BizRadar
 * Compares multiple business opportunities side-by-side
 * Generates comparison matrices and visualizations
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

/**
 * Compare multiple business ideas
 */
export function compareIdeas(items: ComparisonItem[]): ComparisonResult {
  if (items.length < 2) {
    throw new Error("Need at least 2 items to compare");
  }

  // Find best in each category
  const bestScore = items.reduce((best, item) => 
    item.bizScoreToday > best.bizScoreToday ? item : best
  );

  const bestGrowth = items.reduce((best, item) => 
    item.forecastGrowth > best.forecastGrowth ? item : best
  );

  const lowestRisk = items.reduce((best, item) => {
    const itemRisk = getRiskScore(item);
    const bestRisk = getRiskScore(best);
    return itemRisk < bestRisk ? item : best;
  });

  const fastestBreakEven = items.reduce((best, item) => 
    item.breakEvenMonths < best.breakEvenMonths ? item : best
  );

  const highestProfit = items.reduce((best, item) => 
    item.profitMarginMax > best.profitMarginMax ? item : best
  );

  // Calculate overall scores
  const scoreBreakdown: ComparisonResult['scoreBreakdown'] = {};
  
  items.forEach(item => {
    const score = calculateOverallScore(item);
    const strengths = identifyStrengths(item, items);
    const weaknesses = identifyWeaknesses(item, items);

    scoreBreakdown[item.id] = {
      score,
      rank: 0, // Will be calculated after
      strengths,
      weaknesses
    };
  });

  // Rank items
  const sortedScores = Object.entries(scoreBreakdown)
    .sort((a, b) => b[1].score - a[1].score);

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
      highestProfit
    },
    scoreBreakdown
  };
}

/**
 * Calculate overall comparison score (0-100)
 */
function calculateOverallScore(item: ComparisonItem): number {
  const weights = {
    bizScore: 0.25,
    growth: 0.20,
    demand: 0.15,
    competition: 0.15,
    profitability: 0.15,
    breakEven: 0.10
  };

  const scores = {
    bizScore: item.bizScoreToday,
    growth: Math.min(100, (item.forecastGrowth - 1) * 200),
    demand: item.demandIndex,
    competition: getCompetitionScore(item.competitionDensity),
    profitability: (item.profitMarginMax / 50) * 100,
    breakEven: Math.max(0, 100 - (item.breakEvenMonths / 36) * 100)
  };

  const weightedScore = Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (scores[key as keyof typeof scores] * weight);
  }, 0);

  return Math.round(weightedScore);
}

/**
 * Get competition score (higher is better)
 */
function getCompetitionScore(density: string): number {
  switch (density) {
    case "Low": return 90;
    case "Balanced": return 70;
    case "High": return 40;
    case "Oversaturated": return 20;
    default: return 50;
  }
}

/**
 * Calculate risk score (lower is better)
 */
function getRiskScore(item: ComparisonItem): number {
  let risk = 50;

  // Competition risk
  if (item.competitionDensity === "Oversaturated") risk += 30;
  else if (item.competitionDensity === "High") risk += 20;
  else if (item.competitionDensity === "Low") risk -= 20;

  // Demand risk
  if (item.demandIndex < 40) risk += 20;
  else if (item.demandIndex > 70) risk -= 15;

  // Growth risk
  if (item.forecastGrowth < 1.0) risk += 25;
  else if (item.forecastGrowth > 1.2) risk -= 15;

  // Break-even risk
  if (item.breakEvenMonths > 24) risk += 15;
  else if (item.breakEvenMonths < 12) risk -= 10;

  return Math.max(0, Math.min(100, risk));
}

/**
 * Identify strengths compared to other items
 */
function identifyStrengths(item: ComparisonItem, allItems: ComparisonItem[]): string[] {
  const strengths: string[] = [];
  
  const avgBizScore = allItems.reduce((sum, i) => sum + i.bizScoreToday, 0) / allItems.length;
  if (item.bizScoreToday > avgBizScore + 5) {
    strengths.push("Above-average market score");
  }

  const avgGrowth = allItems.reduce((sum, i) => sum + i.forecastGrowth, 0) / allItems.length;
  if (item.forecastGrowth > avgGrowth) {
    strengths.push("Strong growth potential");
  }

  const minBreakEven = Math.min(...allItems.map(i => i.breakEvenMonths));
  if (item.breakEvenMonths === minBreakEven) {
    strengths.push("Fastest break-even time");
  }

  if (item.competitionDensity === "Low" || item.competitionDensity === "Balanced") {
    strengths.push("Favorable competitive landscape");
  }

  if (item.profitMarginMax > 30) {
    strengths.push("High profit margins");
  }

  return strengths;
}

/**
 * Identify weaknesses compared to other items
 */
function identifyWeaknesses(item: ComparisonItem, allItems: ComparisonItem[]): string[] {
  const weaknesses: string[] = [];
  
  const avgBizScore = allItems.reduce((sum, i) => sum + i.bizScoreToday, 0) / allItems.length;
  if (item.bizScoreToday < avgBizScore - 5) {
    weaknesses.push("Below-average market score");
  }

  if (item.forecastGrowth < 1.05) {
    weaknesses.push("Limited growth prospects");
  }

  const maxBreakEven = Math.max(...allItems.map(i => i.breakEvenMonths));
  if (item.breakEvenMonths === maxBreakEven && item.breakEvenMonths > 18) {
    weaknesses.push("Longest break-even time");
  }

  if (item.competitionDensity === "High" || item.competitionDensity === "Oversaturated") {
    weaknesses.push("Intense competition");
  }

  if (item.demandIndex < 50) {
    weaknesses.push("Lower market demand");
  }

  return weaknesses;
}