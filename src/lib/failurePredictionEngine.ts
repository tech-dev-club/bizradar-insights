/**
 * Business Failure Prediction Engine - Level B Feature
 * Estimates probability of business failure
 */

export interface FailurePrediction {
  failureRisk: number; // 0-100 (higher = more likely to fail)
  failureProbability: string; // "Very Low", "Low", "Moderate", "High", "Very High"
  timeToFailure: string; // "N/A", "Within 6 months", "6-12 months", "12-24 months", "24+ months"
  criticalWarnings: string[];
  protectiveFactors: string[];
  survivalRecommendations: string[];
  confidenceLevel: number; // 0-100
}

/**
 * Calculate business failure risk
 */
export function predictBusinessFailure(
  bizScoreToday: number,
  bizScore12M: number,
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated",
  financialViability: "Poor" | "Fair" | "Good" | "Excellent",
  demandMatch: number, // 0-100
  demographicFit: number, // 0-100
  breakEvenMonths: number,
  setupCost: number
): FailurePrediction {
  let failureRisk = 0;
  const criticalWarnings: string[] = [];
  const protectiveFactors: string[] = [];

  // BizScore analysis (weight: 25%)
  if (bizScoreToday < 40) {
    failureRisk += 25;
    criticalWarnings.push("Current BizScore is critically low");
  } else if (bizScoreToday < 55) {
    failureRisk += 15;
    criticalWarnings.push("BizScore indicates challenging market conditions");
  } else if (bizScoreToday >= 75) {
    protectiveFactors.push("Strong current BizScore provides buffer");
  }

  // Trend analysis
  const scoreChange = bizScore12M - bizScoreToday;
  if (scoreChange < -10) {
    failureRisk += 20;
    criticalWarnings.push("Declining market trend predicted");
  } else if (scoreChange > 10) {
    protectiveFactors.push("Growing market with positive momentum");
  }

  // Competition pressure (weight: 20%)
  const competitionRisk = {
    "Low": 5,
    "Balanced": 12,
    "High": 18,
    "Oversaturated": 25,
  };
  failureRisk += competitionRisk[competitionDensity];
  if (competitionDensity === "Oversaturated") {
    criticalWarnings.push("Market oversaturation significantly increases failure risk");
  }

  // Financial viability (weight: 25%)
  const financialRisk = {
    "Poor": 25,
    "Fair": 15,
    "Good": 8,
    "Excellent": 3,
  };
  failureRisk += financialRisk[financialViability];
  if (financialViability === "Poor") {
    criticalWarnings.push("Weak financial projections threaten sustainability");
  } else if (financialViability === "Excellent") {
    protectiveFactors.push("Strong financial foundation supports long-term viability");
  }

  // Break-even risk (weight: 15%)
  if (breakEvenMonths > 24) {
    failureRisk += 15;
    criticalWarnings.push("Long break-even period increases cash flow risk");
  } else if (breakEvenMonths > 18) {
    failureRisk += 10;
  } else if (breakEvenMonths <= 12) {
    protectiveFactors.push("Quick break-even reduces financial stress");
  }

  // Market fit (weight: 15%)
  const marketFitScore = (demandMatch + demographicFit) / 2;
  if (marketFitScore < 40) {
    failureRisk += 15;
    criticalWarnings.push("Poor market-idea fit detected");
  } else if (marketFitScore < 60) {
    failureRisk += 8;
  } else if (marketFitScore >= 75) {
    protectiveFactors.push("Excellent market-idea alignment");
  }

  // Capital risk
  if (setupCost > 3000000 && financialViability !== "Excellent") {
    criticalWarnings.push("High capital requirement with uncertain returns");
  }

  // Cap at 100
  failureRisk = Math.min(100, failureRisk);

  // Determine probability label
  let failureProbability: string;
  let timeToFailure: string;

  if (failureRisk >= 75) {
    failureProbability = "Very High";
    timeToFailure = "Within 6 months";
  } else if (failureRisk >= 60) {
    failureProbability = "High";
    timeToFailure = "6-12 months";
  } else if (failureRisk >= 40) {
    failureProbability = "Moderate";
    timeToFailure = "12-24 months";
  } else if (failureRisk >= 20) {
    failureProbability = "Low";
    timeToFailure = "24+ months";
  } else {
    failureProbability = "Very Low";
    timeToFailure = "N/A - Strong survival indicators";
  }

  // Survival recommendations
  const survivalRecommendations: string[] = [];

  if (failureRisk >= 60) {
    survivalRecommendations.push("URGENT: Reconsider this location or category entirely");
    survivalRecommendations.push("If proceeding, start with minimal investment (MVP approach)");
    survivalRecommendations.push("Secure 24+ months of operating capital as buffer");
  }

  if (criticalWarnings.some(w => w.includes("competition"))) {
    survivalRecommendations.push("Develop strong differentiation strategy before launch");
    survivalRecommendations.push("Consider alternative locations with lower competition");
  }

  if (criticalWarnings.some(w => w.includes("financial"))) {
    survivalRecommendations.push("Reduce initial investment through leasing and outsourcing");
    survivalRecommendations.push("Focus on high-margin products/services initially");
  }

  if (criticalWarnings.some(w => w.includes("market"))) {
    survivalRecommendations.push("Conduct customer validation before full launch");
    survivalRecommendations.push("Pivot positioning to better match local demographics");
  }

  if (breakEvenMonths > 18) {
    survivalRecommendations.push("Explore ways to accelerate break-even (reduce costs, increase prices)");
  }

  // General survival tactics
  if (failureRisk >= 40) {
    survivalRecommendations.push("Maintain lean operations - avoid fixed costs");
    survivalRecommendations.push("Build strong customer relationships for retention");
    survivalRecommendations.push("Monitor cash flow weekly and adjust quickly");
  }

  // Confidence level (based on data quality)
  const confidenceLevel = Math.min(100, 
    (bizScoreToday > 0 ? 25 : 0) +
    (competitionDensity ? 25 : 0) +
    (financialViability ? 25 : 0) +
    (demandMatch > 0 ? 25 : 0)
  );

  return {
    failureRisk,
    failureProbability,
    timeToFailure,
    criticalWarnings,
    protectiveFactors,
    survivalRecommendations,
    confidenceLevel,
  };
}
