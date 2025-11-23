/**
 * Idea Enhancement AI - Level B Feature
 * Suggests improvements to business ideas
 */

export interface IdeaEnhancement {
  betterNiches: string[];
  pricingTweaks: string[];
  profitableExpansions: string[];
  differentiationStrategies: string[];
  uspImprovements: string[];
  quickWins: string[];
}

/**
 * Generate idea enhancements based on analysis
 */
export function generateIdeaEnhancements(
  category: string,
  niche: string,
  pricingLevel: "Affordable" | "Mid-Range" | "Premium",
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated",
  demandIndex: number,
  uniqueSellingPoints: string[]
): IdeaEnhancement {
  const betterNiches: string[] = [];
  const pricingTweaks: string[] = [];
  const profitableExpansions: string[] = [];
  const differentiationStrategies: string[] = [];
  const uspImprovements: string[] = [];
  const quickWins: string[] = [];

  // Better niches based on category
  const nicheIdeas: Record<string, string[]> = {
    "Cafe": [
      "Specialty coffee roastery with tasting sessions",
      "Pet-friendly cafe with outdoor seating",
      "Study cafe with private booths and unlimited coffee",
      "Health-focused cafe with organic & vegan options",
    ],
    "Restaurant": [
      "Cloud kitchen focusing on delivery optimization",
      "Farm-to-table concept with local sourcing",
      "Themed dining experience (e.g., underwater, treehouse)",
      "Fusion cuisine blending regional flavors",
    ],
    "Gym": [
      "Women-only boutique fitness studio",
      "24/7 unmanned smart gym with app-based access",
      "Specialized training (crossfit, martial arts, yoga)",
      "Recovery-focused facility with spa and nutrition",
    ],
    "Salon": [
      "Men's grooming lounge with premium services",
      "Express salon for quick services (15-min cuts)",
      "Natural & organic beauty treatments only",
      "Bridal makeup specialist with trial packages",
    ],
    "Retail": [
      "Curated local artisan marketplace",
      "Sustainable fashion with rental options",
      "Pop-up concept store with rotating brands",
      "Experiential retail with workshops",
    ],
  };

  betterNiches.push(...(nicheIdeas[category] || nicheIdeas["Retail"]).slice(0, 3));

  // Pricing tweaks
  if (pricingLevel === "Affordable" && demandIndex >= 70) {
    pricingTweaks.push("Consider 'premium tier' add-on for high-end customers");
    pricingTweaks.push("Introduce membership/loyalty program for repeat customers");
  } else if (pricingLevel === "Premium" && competitionDensity === "High") {
    pricingTweaks.push("Add 'budget line' to capture broader market");
    pricingTweaks.push("Offer promotional packages during off-peak hours");
  } else if (pricingLevel === "Mid-Range") {
    pricingTweaks.push("Create tiered pricing (basic, standard, premium)");
    pricingTweaks.push("Dynamic pricing based on demand/time");
  }

  // Profitable expansions
  if (category === "Cafe") {
    profitableExpansions.push("Add bakery items for takeaway sales");
    profitableExpansions.push("Launch merchandise (mugs, t-shirts, beans)");
    profitableExpansions.push("Evening transformation: wine bar concept");
  } else if (category === "Restaurant") {
    profitableExpansions.push("Cloud kitchen for delivery-only brands");
    profitableExpansions.push("Catering services for events and corporates");
    profitableExpansions.push("Packaged sauces/masalas under own brand");
  } else if (category === "Gym") {
    profitableExpansions.push("Personal training and nutrition consulting");
    profitableExpansions.push("Online workout programs and app");
    profitableExpansions.push("Supplement and fitness gear retail");
  }

  // Differentiation strategies
  if (competitionDensity === "High" || competitionDensity === "Oversaturated") {
    differentiationStrategies.push("Focus on underserved customer segment");
    differentiationStrategies.push("Offer unique experience (Instagram-worthy interiors)");
    differentiationStrategies.push("Build strong community and loyalty program");
    differentiationStrategies.push("Leverage technology (app, AI recommendations)");
  } else {
    differentiationStrategies.push("Be the premium player in emerging market");
    differentiationStrategies.push("Establish category leadership early");
    differentiationStrategies.push("Create memorable brand identity");
  }

  // USP improvements
  if (uniqueSellingPoints.length < 3) {
    uspImprovements.push("Add sustainability angle (eco-friendly, zero waste)");
    uspImprovements.push("Introduce convenience features (online ordering, home delivery)");
    uspImprovements.push("Create signature product/service unique to your brand");
  }
  
  uspImprovements.push("Develop strong social media presence and influencer partnerships");
  uspImprovements.push("Offer personalization or customization options");

  // Quick wins
  quickWins.push("Launch with limited-time opening promotions");
  quickWins.push("Partner with local businesses for cross-promotion");
  quickWins.push("Create referral program with incentives");
  quickWins.push("Host community events or workshops");
  quickWins.push("Build email list before launch for early customers");

  return {
    betterNiches,
    pricingTweaks,
    profitableExpansions,
    differentiationStrategies,
    uspImprovements,
    quickWins,
  };
}
