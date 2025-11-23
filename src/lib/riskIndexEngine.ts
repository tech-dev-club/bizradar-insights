/**
 * Risk Index Engine - Level A Feature
 * Calculates comprehensive risk scores
 */

export interface RiskBreakdown {
  competitionRisk: number; // 0-100
  financialRisk: number;
  operationalRisk: number;
  regulatoryRisk: number;
  overallRisk: number;
  riskLevel: "Very Low" | "Low" | "Moderate" | "High" | "Very High";
  criticalFactors: string[];
  mitigationSteps: string[];
}

/**
 * Calculate competition risk
 */
function calculateCompetitionRisk(
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated",
  competitionIndex: number
): number {
  const densityRisk = {
    "Low": 20,
    "Balanced": 45,
    "High": 70,
    "Oversaturated": 90,
  };

  const baseRisk = densityRisk[competitionDensity];
  const adjustedRisk = (baseRisk * 0.7) + (competitionIndex * 0.3);
  
  return Math.round(Math.min(100, adjustedRisk));
}

/**
 * Calculate financial risk
 */
function calculateFinancialRisk(
  setupCostMin: number,
  breakEvenMonths: number,
  profitMarginMin: number
): number {
  let risk = 0;

  // High setup cost = high risk
  if (setupCostMin > 2000000) risk += 35;
  else if (setupCostMin > 1000000) risk += 25;
  else if (setupCostMin > 500000) risk += 15;
  else risk += 5;

  // Long break-even = high risk
  if (breakEvenMonths > 24) risk += 35;
  else if (breakEvenMonths > 18) risk += 25;
  else if (breakEvenMonths > 12) risk += 15;
  else risk += 5;

  // Low margin = high risk
  if (profitMarginMin < 10) risk += 30;
  else if (profitMarginMin < 20) risk += 20;
  else if (profitMarginMin < 30) risk += 10;
  else risk += 5;

  return Math.min(100, risk);
}

/**
 * Calculate operational risk
 */
function calculateOperationalRisk(
  categoryDifficulty: "Easy" | "Moderate" | "Difficult" | "Very Difficult",
  staffingNeeds: "Minimal" | "Moderate" | "Extensive"
): number {
  const difficultyRisk = {
    "Easy": 15,
    "Moderate": 35,
    "Difficult": 60,
    "Very Difficult": 85,
  };

  const staffingRisk = {
    "Minimal": 10,
    "Moderate": 25,
    "Extensive": 40,
  };

  return Math.round((difficultyRisk[categoryDifficulty] * 0.7) + (staffingRisk[staffingNeeds] * 0.3));
}

/**
 * Calculate regulatory risk
 */
function calculateRegulatoryRisk(category: string): number {
  const regulatoryComplexity: Record<string, number> = {
    "Restaurant": 60,
    "Cafe": 45,
    "Bar": 75,
    "Pharmacy": 70,
    "Hospital": 80,
    "Gym": 40,
    "Salon": 35,
    "Retail": 30,
    "Office": 25,
  };

  return regulatoryComplexity[category] || 40;
}

/**
 * Generate comprehensive risk index
 */
export function generateRiskIndex(
  category: string,
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated",
  competitionIndex: number,
  categoryDifficulty: "Easy" | "Moderate" | "Difficult" | "Very Difficult",
  setupCostMin: number,
  breakEvenMonths: number,
  profitMarginMin: number,
  staffingNeeds: "Minimal" | "Moderate" | "Extensive" = "Moderate"
): RiskBreakdown {
  const competitionRisk = calculateCompetitionRisk(competitionDensity, competitionIndex);
  const financialRisk = calculateFinancialRisk(setupCostMin, breakEvenMonths, profitMarginMin);
  const operationalRisk = calculateOperationalRisk(categoryDifficulty, staffingNeeds);
  const regulatoryRisk = calculateRegulatoryRisk(category);

  const overallRisk = Math.round(
    (competitionRisk * 0.3) +
    (financialRisk * 0.35) +
    (operationalRisk * 0.2) +
    (regulatoryRisk * 0.15)
  );

  let riskLevel: "Very Low" | "Low" | "Moderate" | "High" | "Very High";
  if (overallRisk >= 75) riskLevel = "Very High";
  else if (overallRisk >= 60) riskLevel = "High";
  else if (overallRisk >= 40) riskLevel = "Moderate";
  else if (overallRisk >= 25) riskLevel = "Low";
  else riskLevel = "Very Low";

  // Identify critical factors
  const criticalFactors: string[] = [];
  if (competitionRisk >= 70) criticalFactors.push("High competition saturation");
  if (financialRisk >= 70) criticalFactors.push("High capital requirement and long ROI");
  if (operationalRisk >= 70) criticalFactors.push("Complex operations and staffing");
  if (regulatoryRisk >= 70) criticalFactors.push("Strict regulatory compliance needed");

  if (criticalFactors.length === 0 && overallRisk > 50) {
    criticalFactors.push("Multiple moderate risk factors combined");
  }

  // Generate mitigation steps
  const mitigationSteps: string[] = [];
  
  if (competitionRisk >= 60) {
    mitigationSteps.push("Develop strong differentiation strategy");
    mitigationSteps.push("Focus on niche targeting to avoid direct competition");
  }

  if (financialRisk >= 60) {
    mitigationSteps.push("Secure adequate funding buffer for 18-24 months");
    mitigationSteps.push("Consider phased rollout to reduce initial capital");
    mitigationSteps.push("Negotiate favorable payment terms with suppliers");
  }

  if (operationalRisk >= 60) {
    mitigationSteps.push("Hire experienced operations manager");
    mitigationSteps.push("Implement strong training programs");
    mitigationSteps.push("Use technology to simplify operations");
  }

  if (regulatoryRisk >= 60) {
    mitigationSteps.push("Consult legal expert for compliance roadmap");
    mitigationSteps.push("Budget for licensing and certification costs");
    mitigationSteps.push("Stay updated on regulatory changes");
  }

  if (mitigationSteps.length === 0) {
    mitigationSteps.push("Maintain lean operations initially");
    mitigationSteps.push("Focus on customer satisfaction and retention");
    mitigationSteps.push("Monitor market trends regularly");
  }

  return {
    competitionRisk,
    financialRisk,
    operationalRisk,
    regulatoryRisk,
    overallRisk,
    riskLevel,
    criticalFactors,
    mitigationSteps,
  };
}
