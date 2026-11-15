/**
 * Financial Projection Engine - BizRadar
 * Produces indicative financial estimates from the supplied planning inputs.
 */

export interface FinancialProjection {
  setupCost: { min: number; max: number; currency: string };
  monthlyOperatingCost: { min: number; max: number; currency: string };
  expectedMonthlyRevenue: { min: number; max: number; currency: string };
  breakEvenMonths: number;
  profitMargin: { min: number; max: number; unit: string };
  projections: {
    year1: {
      revenue: { min: number; max: number };
      profit: { min: number; max: number };
    };
    year3: {
      revenue: { min: number; max: number };
      profit: { min: number; max: number };
    };
  };
}

export interface FinancialInputs {
  category: string;
  demandIndex: number;
  competitionDensity: "Low" | "Balanced" | "High" | "Oversaturated";
  populationDensity: number;
  forecastGrowth: number;
}

const BASE_SETUP_COSTS: Record<string, { min: number; max: number }> = {
  Cafe: { min: 800000, max: 2000000 },
  Restaurant: { min: 1500000, max: 5000000 },
  Gym: { min: 1000000, max: 3000000 },
  Salon: { min: 500000, max: 1500000 },
  "Grocery Store": { min: 1000000, max: 2500000 },
  Pharmacy: { min: 800000, max: 2000000 },
  "Tech Support": { min: 300000, max: 800000 },
  "Tutoring Center": { min: 400000, max: 1000000 },
};

const DEFAULT_COSTS = { min: 500000, max: 1500000 };

const REVENUE_MULTIPLIERS: Record<string, number> = {
  Cafe: 1200,
  Restaurant: 2000,
  Gym: 1500,
  Salon: 1000,
  "Grocery Store": 1800,
  Pharmacy: 1600,
  "Tech Support": 800,
  "Tutoring Center": 1000,
};

const DEFAULT_REVENUE_MULTIPLIER = 1000;
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const finiteOr = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export function generateFinancialProjection(inputs: FinancialInputs): FinancialProjection {
  const demandIndex = clamp(finiteOr(inputs.demandIndex, 0), 0, 100);
  const populationDensity = Math.max(0, finiteOr(inputs.populationDensity, 0));
  const forecastGrowth = clamp(finiteOr(inputs.forecastGrowth, 1), 0.1, 2);

  const categoryKey = Object.keys(BASE_SETUP_COSTS).find(
    (key) => key.toLowerCase() === inputs.category.trim().toLowerCase(),
  );
  const baseCosts = categoryKey ? BASE_SETUP_COSTS[categoryKey] : DEFAULT_COSTS;

  const locationMultiplier =
    populationDensity >= 5000 ? 1.3 :
    populationDensity >= 3000 ? 1.15 :
    populationDensity >= 1000 ? 1.0 : 0.85;

  const setupCostMin = Math.round(baseCosts.min * locationMultiplier);
  const setupCostMax = Math.round(baseCosts.max * locationMultiplier);

  const operatingCostMin = Math.round(setupCostMin * 0.12);
  const operatingCostMax = Math.round(setupCostMax * 0.16);

  const revenueKey = Object.keys(REVENUE_MULTIPLIERS).find(
    (key) => key.toLowerCase() === inputs.category.trim().toLowerCase(),
  );
  const revenueMultiplier = revenueKey
    ? REVENUE_MULTIPLIERS[revenueKey]
    : DEFAULT_REVENUE_MULTIPLIER;

  const competitionPenalty =
    inputs.competitionDensity === "Oversaturated" ? 0.5 :
    inputs.competitionDensity === "High" ? 0.7 :
    inputs.competitionDensity === "Balanced" ? 0.85 : 1.0;

  const baseRevenueMin = Math.round(demandIndex * revenueMultiplier * competitionPenalty * 0.8);
  const baseRevenueMax = Math.round(demandIndex * revenueMultiplier * competitionPenalty * 1.2);

  const avgSetupCost = (setupCostMin + setupCostMax) / 2;
  const avgRevenue = (baseRevenueMin + baseRevenueMax) / 2;
  const avgOperatingCost = (operatingCostMin + operatingCostMax) / 2;
  const monthlyProfit = avgRevenue - avgOperatingCost;

  const breakEvenMonths =
    monthlyProfit > 0 ? Math.ceil(avgSetupCost / monthlyProfit) : 36;

  const calculateProfitMargin = (revenue: number, operatingCost: number) =>
    revenue > 0 ? Math.round(((revenue - operatingCost) / revenue) * 100) : 0;

  const profitMarginMin = calculateProfitMargin(baseRevenueMin, operatingCostMax);
  const profitMarginMax = calculateProfitMargin(baseRevenueMax, operatingCostMin);

  const year1GrowthFactor = Math.min(forecastGrowth, 1.3);
  const year3GrowthFactor = Math.pow(forecastGrowth, 3);

  const year1RevenueMin = Math.round(baseRevenueMin * 12 * year1GrowthFactor);
  const year1RevenueMax = Math.round(baseRevenueMax * 12 * year1GrowthFactor);
  const year1CostTotal = avgOperatingCost * 12;
  const year1ProfitMin = Math.round(year1RevenueMin - year1CostTotal);
  const year1ProfitMax = Math.round(year1RevenueMax - year1CostTotal);

  const year3RevenueMin = Math.round(baseRevenueMin * 12 * year3GrowthFactor);
  const year3RevenueMax = Math.round(baseRevenueMax * 12 * year3GrowthFactor);
  const year3CostTotal = year1CostTotal * 1.15;
  const year3ProfitMin = Math.round(year3RevenueMin - year3CostTotal);
  const year3ProfitMax = Math.round(year3RevenueMax - year3CostTotal);

  return {
    setupCost: { min: setupCostMin, max: setupCostMax, currency: "INR" },
    monthlyOperatingCost: { min: operatingCostMin, max: operatingCostMax, currency: "INR" },
    expectedMonthlyRevenue: { min: baseRevenueMin, max: baseRevenueMax, currency: "INR" },
    breakEvenMonths,
    profitMargin: { min: profitMarginMin, max: profitMarginMax, unit: "%" },
    projections: {
      year1: {
        revenue: { min: year1RevenueMin, max: year1RevenueMax },
        profit: { min: year1ProfitMin, max: year1ProfitMax },
      },
      year3: {
        revenue: { min: year3RevenueMin, max: year3RevenueMax },
        profit: { min: year3ProfitMin, max: year3ProfitMax },
      },
    },
  };
}

/** Format values using the application's compact currency notation. */
export function formatCurrency(amount: number, currency = "INR"): string {
  if (!Number.isFinite(amount)) {
    return `${currency} --`;
  }

  const sign = amount < 0 ? "-" : "";
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 10000000) {
    return `${sign}${currency} ${(absoluteAmount / 10000000).toFixed(2)}Cr`;
  }
  if (absoluteAmount >= 100000) {
    return `${sign}${currency} ${(absoluteAmount / 100000).toFixed(2)}L`;
  }
  if (absoluteAmount >= 1000) {
    return `${sign}${currency} ${(absoluteAmount / 1000).toFixed(0)}K`;
  }

  return `${sign}${currency} ${absoluteAmount.toLocaleString("en-IN")}`;
}
