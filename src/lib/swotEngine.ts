/**
 * SWOT Engine - BizRadar V4
 * Generates Strengths, Weaknesses, Opportunities, and Threats analysis
 * Based on market metrics and competitive landscape
 */

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface SWOTInputs {
  demandIndex: number;
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated";
  categoryDifficulty: "Easy" | "Moderate" | "Difficult" | "Very Difficult";
  forecastGrowth: number;
  strategicOpportunityIndex: number;
  bizScoreToday: number;
  bizScore12M: number;
  populationDensity: number;
}

export function generateSWOT(inputs: SWOTInputs): SWOTAnalysis {
  const clamp = (value: number, fallback = 0) =>
    Math.min(100, Math.max(0, Number.isFinite(value) ? value : fallback));
  const safeInputs: SWOTInputs = {
    ...inputs,
    demandIndex: clamp(inputs.demandIndex),
    forecastGrowth: Number.isFinite(inputs.forecastGrowth) ? inputs.forecastGrowth : 1,
    strategicOpportunityIndex: clamp(inputs.strategicOpportunityIndex),
    bizScoreToday: clamp(inputs.bizScoreToday),
    bizScore12M: clamp(inputs.bizScore12M),
    populationDensity: Math.max(0, Number.isFinite(inputs.populationDensity) ? inputs.populationDensity : 0),
  };
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  // STRENGTHS ANALYSIS
  if (safeInputs.demandIndex >= 80) {
    strengths.push("High market demand with strong customer base");
  } else if (safeInputs.demandIndex >= 60) {
    strengths.push("Solid market demand showing consistent interest");
  }

  if (safeInputs.forecastGrowth >= 1.3) {
    strengths.push("Excellent growth trajectory and positive market momentum");
  } else if (safeInputs.forecastGrowth >= 1.15) {
    strengths.push("Healthy growth potential with expanding market");
  }

  if (safeInputs.populationDensity >= 5000) {
    strengths.push("Dense population providing large customer pool");
  }

  if (safeInputs.competitionDensity === "Low" || safeInputs.competitionDensity === "Balanced") {
    strengths.push("Favorable competitive landscape with room for entry");
  }

  if (safeInputs.strategicOpportunityIndex >= 75) {
    strengths.push("Strong strategic positioning and market gaps identified");
  }

  // WEAKNESSES ANALYSIS
  if (safeInputs.categoryDifficulty === "Difficult" || safeInputs.categoryDifficulty === "Very Difficult") {
    weaknesses.push("High operational complexity requiring specialized expertise");
  } else if (safeInputs.categoryDifficulty === "Moderate") {
    weaknesses.push("Moderate entry barriers and operational requirements");
  }

  if (safeInputs.demandIndex < 50) {
    weaknesses.push("Limited market demand may impact revenue potential");
  }

  if (safeInputs.competitionDensity === "High" || safeInputs.competitionDensity === "Oversaturated") {
    weaknesses.push("Saturated market with intense competitive pressure");
  }

  if (safeInputs.forecastGrowth < 1.05) {
    weaknesses.push("Stagnant or declining market growth prospects");
  }

  if (safeInputs.bizScoreToday < 60) {
    weaknesses.push("Below-average market conditions requiring careful strategy");
  }

  // OPPORTUNITIES ANALYSIS
  if (safeInputs.forecastGrowth >= 1.2) {
    opportunities.push("Capitalize on rapidly expanding market demand");
  }

  if (safeInputs.competitionDensity === "Low") {
    opportunities.push("First-mover advantage in underserved market");
  }

  if (safeInputs.strategicOpportunityIndex >= 70) {
    opportunities.push("Niche differentiation strategies available");
  }

  if (safeInputs.bizScore12M > safeInputs.bizScoreToday + 5) {
    opportunities.push("Strong future outlook with improving conditions");
  }

  if (safeInputs.categoryDifficulty === "Easy" || safeInputs.categoryDifficulty === "Moderate") {
    opportunities.push("Accessible entry with manageable operational complexity");
  }

  if (safeInputs.populationDensity >= 3000 && safeInputs.demandIndex >= 60) {
    opportunities.push("Large addressable market with proven demand");
  }

  // THREATS ANALYSIS
  if (safeInputs.competitionDensity === "Oversaturated") {
    threats.push("Severe market saturation leading to price wars");
  } else if (safeInputs.competitionDensity === "High") {
    threats.push("Aggressive competitors with established market presence");
  }

  if (safeInputs.forecastGrowth < 1.0) {
    threats.push("Market contraction and declining customer base");
  }

  if (safeInputs.bizScore12M < safeInputs.bizScoreToday - 5) {
    threats.push("Deteriorating market conditions over time");
  }

  if (safeInputs.categoryDifficulty === "Very Difficult") {
    threats.push("High failure risk due to operational challenges");
  }

  if (safeInputs.demandIndex < 40) {
    threats.push("Insufficient demand may not sustain business operations");
  }

  if (safeInputs.competitionDensity !== "Low" && safeInputs.forecastGrowth < 1.1) {
    threats.push("New market entrants may intensify competition");
  }

  // Ensure minimum entries per category
  if (strengths.length === 0) strengths.push("Location-specific advantages to be leveraged");
  if (weaknesses.length === 0) weaknesses.push("Standard market entry challenges expected");
  if (opportunities.length === 0) opportunities.push("Potential for strategic positioning exists");
  if (threats.length === 0) threats.push("Monitor market dynamics and competitor activity");

  return {
    strengths,
    weaknesses,
    opportunities,
    threats,
  };
}

// TODO V5: Add AI enhancement layer for more nuanced SWOT analysis
// TODO V5: Consider location-specific factors (regulations, demographics)
// TODO V5: Integrate real competitor data for threat analysis
