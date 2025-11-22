/**
 * Idea Engine - BizRadar
 * Parses natural language business ideas into structured data
 * Uses AI to extract category, niche, requirements, and characteristics
 */

import { supabase } from "@/integrations/supabase/client";

export interface ParsedIdea {
  category: string;
  niche: string;
  pricingLevel: "Affordable" | "Mid-Range" | "Premium";
  targetAudience: string[];
  capitalIntensity: "Low" | "Medium" | "High" | "Very High";
  operationalComplexity: "Easy" | "Moderate" | "Difficult" | "Very Difficult";
  keywords: string[];
  uniqueSellingPoints: string[];
  requiredSpace: "Small" | "Medium" | "Large";
  staffingNeeds: "Minimal" | "Moderate" | "Extensive";
  inventoryNeeds: "Low" | "Medium" | "High";
  technologyRequirements: "Basic" | "Moderate" | "Advanced";
}

export interface IdeaAnalysisResult {
  parsed: ParsedIdea;
  categoryDifficulty: "Easy" | "Moderate" | "Difficult" | "Very Difficult";
  estimatedCapital: { min: number; max: number };
  demandEstimate: number;
  competitionLevel: "Low" | "Moderate" | "High";
}

/**
 * Parse a natural language business idea using AI
 */
export async function parseBusinessIdea(ideaText: string): Promise<ParsedIdea> {
  const { data, error } = await supabase.functions.invoke('parse-idea', {
    body: { ideaText }
  });

  if (error) {
    console.error("Error parsing idea:", error);
    throw new Error("Failed to parse business idea");
  }

  return data as ParsedIdea;
}

/**
 * Map parsed idea to category difficulty
 */
export function mapToCategoryDifficulty(parsed: ParsedIdea): "Easy" | "Moderate" | "Difficult" | "Very Difficult" {
  if (parsed.operationalComplexity === "Very Difficult") return "Very Difficult";
  if (parsed.operationalComplexity === "Difficult") return "Difficult";
  if (parsed.capitalIntensity === "Very High") return "Very Difficult";
  if (parsed.capitalIntensity === "High") return "Difficult";
  if (parsed.operationalComplexity === "Moderate") return "Moderate";
  return "Easy";
}

/**
 * Estimate capital requirements based on parsed data
 */
export function estimateCapitalRequirements(parsed: ParsedIdea): { min: number; max: number } {
  let baseMin = 300000;
  let baseMax = 1000000;

  // Adjust by capital intensity
  switch (parsed.capitalIntensity) {
    case "Very High":
      baseMin *= 5;
      baseMax *= 8;
      break;
    case "High":
      baseMin *= 3;
      baseMax *= 5;
      break;
    case "Medium":
      baseMin *= 1.5;
      baseMax *= 2.5;
      break;
    case "Low":
      baseMin *= 0.5;
      baseMax *= 1;
      break;
  }

  // Adjust by required space
  if (parsed.requiredSpace === "Large") {
    baseMin *= 1.5;
    baseMax *= 2;
  } else if (parsed.requiredSpace === "Small") {
    baseMin *= 0.7;
    baseMax *= 0.8;
  }

  // Adjust by inventory needs
  if (parsed.inventoryNeeds === "High") {
    baseMin *= 1.3;
    baseMax *= 1.5;
  }

  return {
    min: Math.round(baseMin),
    max: Math.round(baseMax)
  };
}

/**
 * Estimate demand based on category and characteristics
 */
export function estimateDemand(parsed: ParsedIdea): number {
  let demand = 50; // Base demand

  // Category boost
  const highDemandCategories = ["Cafe", "Restaurant", "Grocery Store", "Pharmacy"];
  if (highDemandCategories.includes(parsed.category)) {
    demand += 20;
  }

  // Pricing level impact
  if (parsed.pricingLevel === "Affordable") demand += 15;
  if (parsed.pricingLevel === "Premium") demand -= 5;

  // Target audience size
  if (parsed.targetAudience.length >= 3) demand += 10;

  // USP impact
  demand += parsed.uniqueSellingPoints.length * 5;

  // Technology requirements (lower tech = higher accessibility)
  if (parsed.technologyRequirements === "Basic") demand += 10;
  if (parsed.technologyRequirements === "Advanced") demand -= 5;

  return Math.min(95, Math.max(20, demand));
}

/**
 * Estimate competition level
 */
export function estimateCompetition(parsed: ParsedIdea): "Low" | "Moderate" | "High" {
  const saturatedCategories = ["Cafe", "Restaurant", "Salon", "Retail"];
  
  if (saturatedCategories.includes(parsed.category)) {
    return parsed.uniqueSellingPoints.length >= 2 ? "Moderate" : "High";
  }

  if (parsed.operationalComplexity === "Very Difficult") return "Low";
  if (parsed.capitalIntensity === "Very High") return "Low";

  return "Moderate";
}

/**
 * Full idea analysis pipeline
 */
export async function analyzeBusinessIdea(ideaText: string): Promise<IdeaAnalysisResult> {
  const parsed = await parseBusinessIdea(ideaText);
  
  return {
    parsed,
    categoryDifficulty: mapToCategoryDifficulty(parsed),
    estimatedCapital: estimateCapitalRequirements(parsed),
    demandEstimate: estimateDemand(parsed),
    competitionLevel: estimateCompetition(parsed)
  };
}