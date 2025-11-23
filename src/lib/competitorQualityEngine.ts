/**
 * Competitor Quality Scoring Engine - Level A Feature
 * Scores competitors based on multiple quality factors
 */

export interface CompetitorQuality {
  name: string;
  distance: number;
  rating: number;
  reviews: number;
  visibility: "High" | "Medium" | "Low";
  pricing: "Budget" | "Mid-Range" | "Premium";
  brandStrength: number; // 0-100
  qualityScore: number; // Calculated composite score
  threatLevel: "Low" | "Medium" | "High" | "Critical";
}

export interface CompetitorAnalysis {
  totalCompetitors: number;
  averageQuality: number;
  strongCompetitors: number;
  weakCompetitors: number;
  dominantPlayer: CompetitorQuality | null;
  competitiveGaps: string[];
  recommendations: string[];
}

/**
 * Calculate quality score for a competitor
 */
export function calculateCompetitorQuality(
  rating: number,
  reviews: number,
  visibility: "High" | "Medium" | "Low",
  brandStrength: number,
  pricing: "Budget" | "Mid-Range" | "Premium",
  distance: number
): number {
  const visibilityScore = visibility === "High" ? 30 : visibility === "Medium" ? 20 : 10;
  const reviewScore = Math.min(30, (reviews / 100) * 30);
  const ratingScore = (rating / 5) * 20;
  const proximityPenalty = distance < 1 ? 10 : distance < 3 ? 5 : 0;
  
  return Math.round(
    ratingScore + reviewScore + visibilityScore + (brandStrength * 0.2) + proximityPenalty
  );
}

/**
 * Determine threat level based on quality score
 */
export function getThreatLevel(qualityScore: number): "Low" | "Medium" | "High" | "Critical" {
  if (qualityScore >= 80) return "Critical";
  if (qualityScore >= 60) return "High";
  if (qualityScore >= 40) return "Medium";
  return "Low";
}

/**
 * Analyze competitor landscape
 */
export function analyzeCompetitorQuality(
  competitors: Array<{
    name: string;
    distance: number;
    rating: number;
    reviews?: number;
    visibility?: "High" | "Medium" | "Low";
    pricing?: "Budget" | "Mid-Range" | "Premium";
    brandStrength?: number;
  }>
): CompetitorAnalysis {
  const qualityCompetitors: CompetitorQuality[] = competitors.map(c => {
    const qualityScore = calculateCompetitorQuality(
      c.rating,
      c.reviews || 50,
      c.visibility || "Medium",
      c.brandStrength || 50,
      c.pricing || "Mid-Range",
      c.distance
    );
    
    return {
      name: c.name,
      distance: c.distance,
      rating: c.rating,
      reviews: c.reviews || 50,
      visibility: c.visibility || "Medium",
      pricing: c.pricing || "Mid-Range",
      brandStrength: c.brandStrength || 50,
      qualityScore,
      threatLevel: getThreatLevel(qualityScore),
    };
  });

  const strongCompetitors = qualityCompetitors.filter(c => c.qualityScore >= 60).length;
  const weakCompetitors = qualityCompetitors.filter(c => c.qualityScore < 40).length;
  const averageQuality = qualityCompetitors.reduce((sum, c) => sum + c.qualityScore, 0) / qualityCompetitors.length || 0;
  
  const dominantPlayer = qualityCompetitors.reduce((prev, current) => 
    (prev.qualityScore > current.qualityScore) ? prev : current
  , qualityCompetitors[0] || null);

  // Identify competitive gaps
  const competitiveGaps: string[] = [];
  const hasPremium = qualityCompetitors.some(c => c.pricing === "Premium");
  const hasBudget = qualityCompetitors.some(c => c.pricing === "Budget");
  
  if (!hasPremium && averageQuality < 60) {
    competitiveGaps.push("Premium positioning opportunity - no strong premium players");
  }
  if (!hasBudget) {
    competitiveGaps.push("Budget-friendly option missing in market");
  }
  if (weakCompetitors > strongCompetitors) {
    competitiveGaps.push("Market has weak competition - easy entry opportunity");
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (strongCompetitors === 0) {
    recommendations.push("Excellent market - no strong competitors identified");
    recommendations.push("Focus on building brand presence quickly");
  } else if (strongCompetitors > 3) {
    recommendations.push("Saturated market - differentiation is critical");
    recommendations.push("Consider niche targeting or unique positioning");
  } else {
    recommendations.push("Balanced competition - quality execution matters");
    recommendations.push("Learn from strong competitors and improve on weaknesses");
  }

  return {
    totalCompetitors: qualityCompetitors.length,
    averageQuality: Math.round(averageQuality),
    strongCompetitors,
    weakCompetitors,
    dominantPlayer,
    competitiveGaps,
    recommendations,
  };
}
