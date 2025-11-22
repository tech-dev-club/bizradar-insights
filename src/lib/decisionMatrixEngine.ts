/**
 * Decision Matrix Engine - BizRadar
 * Advanced weighted scoring system for business opportunity evaluation
 * Ranks multiple ideas based on customizable criteria weights
 */

export interface MatrixCriteria {
  bizScore: number;
  growthPotential: number;
  demandLevel: number;
  competitionFavorability: number;
  profitability: number;
  breakEvenSpeed: number;
  capitalRequirements: number;
  operationalComplexity: number;
  riskLevel: number;
  strategicFit: number;
}

export interface MatrixWeights {
  bizScore?: number;
  growthPotential?: number;
  demandLevel?: number;
  competitionFavorability?: number;
  profitability?: number;
  breakEvenSpeed?: number;
  capitalRequirements?: number;
  operationalComplexity?: number;
  riskLevel?: number;
  strategicFit?: number;
}

export interface MatrixInput {
  id: string;
  name: string;
  bizScoreToday: number;
  bizScore12M: number;
  forecastGrowth: number;
  demandIndex: number;
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated";
  profitMarginMax: number;
  breakEvenMonths: number;
  setupCostMax: number;
  categoryDifficulty: "Easy" | "Moderate" | "Difficult" | "Very Difficult";
  strategicOpportunityIndex: number;
}

export interface MatrixResult {
  id: string;
  name: string;
  totalScore: number;
  normalizedScore: number;
  rank: number;
  criteriaScores: MatrixCriteria;
  weightedScores: MatrixCriteria;
  recommendation: string;
  confidence: number;
}

export interface DecisionMatrixOutput {
  results: MatrixResult[];
  topChoice: MatrixResult;
  weights: MatrixWeights;
  analysis: {
    spread: number;
    confidence: number;
    clearWinner: boolean;
  };
}

/**
 * Default weights (must sum to 1.0)
 */
export const DEFAULT_WEIGHTS: MatrixWeights = {
  bizScore: 0.20,
  growthPotential: 0.15,
  demandLevel: 0.12,
  competitionFavorability: 0.12,
  profitability: 0.12,
  breakEvenSpeed: 0.10,
  capitalRequirements: 0.08,
  operationalComplexity: 0.05,
  riskLevel: 0.04,
  strategicFit: 0.02
};

/**
 * Generate decision matrix for multiple business ideas
 */
export function generateDecisionMatrix(
  inputs: MatrixInput[],
  customWeights?: MatrixWeights
): DecisionMatrixOutput {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  
  // Normalize weights to sum to 1
  const weightSum = Object.values(weights).reduce((sum, w) => sum + (w || 0), 0);
  Object.keys(weights).forEach(key => {
    weights[key as keyof MatrixWeights] = (weights[key as keyof MatrixWeights] || 0) / weightSum;
  });

  // Calculate scores for each input
  const results: MatrixResult[] = inputs.map(input => {
    const criteriaScores = calculateCriteriaScores(input);
    const weightedScores = applyWeights(criteriaScores, weights);
    const totalScore = Object.values(weightedScores).reduce((sum, score) => sum + score, 0);

    return {
      id: input.id,
      name: input.name,
      totalScore,
      normalizedScore: 0, // Will be calculated after
      rank: 0,
      criteriaScores,
      weightedScores,
      recommendation: "",
      confidence: 0
    };
  });

  // Normalize scores to 0-100
  const maxScore = Math.max(...results.map(r => r.totalScore));
  const minScore = Math.min(...results.map(r => r.totalScore));
  
  results.forEach(result => {
    result.normalizedScore = maxScore === minScore 
      ? 100 
      : ((result.totalScore - minScore) / (maxScore - minScore)) * 100;
  });

  // Rank results
  results.sort((a, b) => b.totalScore - a.totalScore);
  results.forEach((result, index) => {
    result.rank = index + 1;
    result.recommendation = generateRecommendation(result, results.length);
    result.confidence = calculateConfidence(result, results);
  });

  const topChoice = results[0];
  
  // Calculate analysis metrics
  const spread = maxScore - minScore;
  const avgScore = results.reduce((sum, r) => sum + r.normalizedScore, 0) / results.length;
  const confidence = topChoice.normalizedScore - avgScore;
  const clearWinner = confidence > 20;

  return {
    results,
    topChoice,
    weights,
    analysis: {
      spread,
      confidence,
      clearWinner
    }
  };
}

/**
 * Calculate raw scores for each criterion (0-100)
 */
function calculateCriteriaScores(input: MatrixInput): MatrixCriteria {
  return {
    bizScore: input.bizScoreToday,
    growthPotential: Math.min(100, ((input.forecastGrowth - 1) * 200)),
    demandLevel: input.demandIndex,
    competitionFavorability: getCompetitionScore(input.competitionDensity),
    profitability: (input.profitMarginMax / 50) * 100,
    breakEvenSpeed: Math.max(0, 100 - (input.breakEvenMonths / 36) * 100),
    capitalRequirements: Math.max(0, 100 - (input.setupCostMax / 10000000) * 100),
    operationalComplexity: getDifficultyScore(input.categoryDifficulty),
    riskLevel: calculateRiskScore(input),
    strategicFit: input.strategicOpportunityIndex
  };
}

/**
 * Apply weights to criteria scores
 */
function applyWeights(scores: MatrixCriteria, weights: MatrixWeights): MatrixCriteria {
  return {
    bizScore: scores.bizScore * (weights.bizScore || 0),
    growthPotential: scores.growthPotential * (weights.growthPotential || 0),
    demandLevel: scores.demandLevel * (weights.demandLevel || 0),
    competitionFavorability: scores.competitionFavorability * (weights.competitionFavorability || 0),
    profitability: scores.profitability * (weights.profitability || 0),
    breakEvenSpeed: scores.breakEvenSpeed * (weights.breakEvenSpeed || 0),
    capitalRequirements: scores.capitalRequirements * (weights.capitalRequirements || 0),
    operationalComplexity: scores.operationalComplexity * (weights.operationalComplexity || 0),
    riskLevel: scores.riskLevel * (weights.riskLevel || 0),
    strategicFit: scores.strategicFit * (weights.strategicFit || 0)
  };
}

/**
 * Get competition favorability score
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
 * Get difficulty score (inverted - easier is better)
 */
function getDifficultyScore(difficulty: string): number {
  switch (difficulty) {
    case "Easy": return 90;
    case "Moderate": return 70;
    case "Difficult": return 40;
    case "Very Difficult": return 20;
    default: return 50;
  }
}

/**
 * Calculate composite risk score
 */
function calculateRiskScore(input: MatrixInput): number {
  let risk = 50;

  if (input.competitionDensity === "Oversaturated") risk -= 25;
  else if (input.competitionDensity === "Low") risk += 20;

  if (input.demandIndex < 40) risk -= 15;
  else if (input.demandIndex > 70) risk += 15;

  if (input.forecastGrowth < 1.0) risk -= 20;
  else if (input.forecastGrowth > 1.2) risk += 15;

  if (input.breakEvenMonths > 24) risk -= 10;

  return Math.max(0, Math.min(100, risk));
}

/**
 * Generate recommendation based on ranking
 */
function generateRecommendation(result: MatrixResult, totalItems: number): string {
  if (result.rank === 1) {
    return result.confidence > 80 
      ? "Strongly Recommended - Clear Top Choice"
      : "Recommended - Best Overall Score";
  }
  
  if (result.rank === 2) {
    return "Good Alternative - Consider as Backup";
  }

  if (result.rank <= Math.ceil(totalItems / 2)) {
    return "Viable Option - Worth Further Investigation";
  }

  return "Not Recommended - Consider Alternatives";
}

/**
 * Calculate confidence in this result
 */
function calculateConfidence(result: MatrixResult, allResults: MatrixResult[]): number {
  const avgScore = allResults.reduce((sum, r) => sum + r.normalizedScore, 0) / allResults.length;
  const deviation = Math.abs(result.normalizedScore - avgScore);
  return Math.min(100, result.normalizedScore + (deviation / 2));
}