/**
 * Advanced Analytics Panel - Display Level A & B Features
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Calendar, 
  Shield, 
  Target,
  Lightbulb,
  XCircle
} from "lucide-react";
import { CompetitorAnalysis } from "@/lib/competitorQualityEngine";
import { RentEstimate } from "@/lib/rentEstimationEngine";
import { PersonaMatch } from "@/lib/customerPersonaEngine";
import { SeasonalForecast } from "@/lib/seasonalForecastEngine";
import { RiskBreakdown } from "@/lib/riskIndexEngine";
import { IdeaEnhancement } from "@/lib/ideaEnhancementEngine";
import { FailurePrediction } from "@/lib/failurePredictionEngine";

interface AdvancedAnalyticsPanelProps {
  competitorAnalysis?: CompetitorAnalysis;
  rentEstimate?: RentEstimate;
  personaMatch?: PersonaMatch;
  seasonalForecast?: SeasonalForecast;
  riskBreakdown?: RiskBreakdown;
  ideaEnhancement?: IdeaEnhancement;
  failurePrediction?: FailurePrediction;
}

export const AdvancedAnalyticsPanel = ({
  competitorAnalysis,
  rentEstimate,
  personaMatch,
  seasonalForecast,
  riskBreakdown,
  ideaEnhancement,
  failurePrediction,
}: AdvancedAnalyticsPanelProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="risk" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="market">Market Fit</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
        </TabsList>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-4">
          {riskBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  Risk Index
                </CardTitle>
                <CardDescription>Comprehensive risk assessment across multiple factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                    <p className="text-3xl font-bold">{riskBreakdown.overallRisk}/100</p>
                  </div>
                  <Badge 
                    variant={
                      riskBreakdown.riskLevel === "Very High" || riskBreakdown.riskLevel === "High" 
                        ? "destructive" 
                        : riskBreakdown.riskLevel === "Moderate" 
                        ? "default" 
                        : "secondary"
                    }
                  >
                    {riskBreakdown.riskLevel} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Competition</p>
                    <p className="text-xl font-bold">{riskBreakdown.competitionRisk}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Financial</p>
                    <p className="text-xl font-bold">{riskBreakdown.financialRisk}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Operational</p>
                    <p className="text-xl font-bold">{riskBreakdown.operationalRisk}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Regulatory</p>
                    <p className="text-xl font-bold">{riskBreakdown.regulatoryRisk}%</p>
                  </div>
                </div>

                {riskBreakdown.criticalFactors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Critical Risk Factors
                    </h4>
                    <ul className="space-y-1">
                      {riskBreakdown.criticalFactors.map((factor, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Mitigation Strategies</h4>
                  <ul className="space-y-1">
                    {riskBreakdown.mitigationSteps.map((step, i) => (
                      <li key={i} className="text-sm">✓ {step}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {failurePrediction && (
            <Card className={
              failurePrediction.failureRisk >= 60 
                ? "border-destructive/50" 
                : failurePrediction.failureRisk >= 40 
                ? "border-warning/50" 
                : "border-success/50"
            }>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Failure Prediction Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failure Probability</p>
                    <p className="text-2xl font-bold">{failurePrediction.failureProbability}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="text-2xl font-bold text-destructive">{failurePrediction.failureRisk}%</p>
                  </div>
                </div>

                {failurePrediction.criticalWarnings.length > 0 && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-destructive">⚠️ Critical Warnings</h4>
                    <ul className="space-y-1">
                      {failurePrediction.criticalWarnings.map((warning, i) => (
                        <li key={i} className="text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {failurePrediction.protectiveFactors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-success">✓ Protective Factors</h4>
                    <ul className="space-y-1">
                      {failurePrediction.protectiveFactors.map((factor, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Survival Recommendations</h4>
                  <ol className="space-y-1">
                    {failurePrediction.survivalRecommendations.map((rec, i) => (
                      <li key={i} className="text-sm">{i + 1}. {rec}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Market Fit Tab */}
        <TabsContent value="market" className="space-y-4">
          {competitorAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Competitor Quality Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Avg Quality</p>
                    <p className="text-2xl font-bold">{competitorAnalysis.averageQuality}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Strong</p>
                    <p className="text-2xl font-bold text-destructive">{competitorAnalysis.strongCompetitors}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Weak</p>
                    <p className="text-2xl font-bold text-success">{competitorAnalysis.weakCompetitors}</p>
                  </div>
                </div>

                {competitorAnalysis.competitiveGaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Market Gaps Identified</h4>
                    <ul className="space-y-1">
                      {competitorAnalysis.competitiveGaps.map((gap, i) => (
                        <li key={i} className="text-sm">🎯 {gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Strategic Recommendations</h4>
                  <ul className="space-y-1">
                    {competitorAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {personaMatch && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Customer Persona Match
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Match Score</p>
                    <p className="text-3xl font-bold">{personaMatch.overallMatch}%</p>
                  </div>
                  <Badge>{personaMatch.demographicFit.zoneType} Zone</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Youth Density</p>
                    <p className="text-xl font-bold">{personaMatch.demographicFit.youthDensity}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Income Alignment</p>
                    <p className="text-xl font-bold">{personaMatch.demographicFit.incomeAlignment}</p>
                  </div>
                </div>

                {personaMatch.insights.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Key Insights</h4>
                    <ul className="space-y-1">
                      {personaMatch.insights.map((insight, i) => (
                        <li key={i} className="text-sm">💡 {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {personaMatch.warnings.length > 0 && (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-warning">Warnings</h4>
                    <ul className="space-y-1">
                      {personaMatch.warnings.map((warning, i) => (
                        <li key={i} className="text-sm">⚠️ {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {rentEstimate && (
            <Card>
              <CardHeader>
                <CardTitle>Real Estate Suitability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Rent</p>
                    <p className="text-2xl font-bold">
                      ₹{rentEstimate.minRent}-{rentEstimate.maxRent}/{rentEstimate.per}
                    </p>
                  </div>
                  <Badge variant="outline">Grade: {rentEstimate.locationGrade}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Suitability</p>
                    <p className="text-xl font-bold">{rentEstimate.suitabilityScore}/100</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Affordability</p>
                    <p className="text-xl font-bold">{rentEstimate.affordabilityIndex}/100</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Footfall:</span>
                    <span className="ml-2 font-medium">{rentEstimate.factors.footfall}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Access:</span>
                    <span className="ml-2 font-medium">{rentEstimate.factors.accessibility}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Competition:</span>
                    <span className="ml-2 font-medium">{rentEstimate.factors.competition}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Infrastructure:</span>
                    <span className="ml-2 font-medium">{rentEstimate.factors.infrastructure}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          {ideaEnhancement && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Idea Enhancement Suggestions
                </CardTitle>
                <CardDescription>AI-powered recommendations to improve your concept</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {ideaEnhancement.betterNiches.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Better Niche Ideas</h4>
                    <ul className="space-y-2">
                      {ideaEnhancement.betterNiches.map((niche, i) => (
                        <li key={i} className="text-sm p-3 bg-muted/50 rounded-lg">🎯 {niche}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ideaEnhancement.pricingTweaks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Pricing Optimization</h4>
                    <ul className="space-y-1">
                      {ideaEnhancement.pricingTweaks.map((tweak, i) => (
                        <li key={i} className="text-sm">💰 {tweak}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ideaEnhancement.profitableExpansions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Profitable Expansions</h4>
                    <ul className="space-y-1">
                      {ideaEnhancement.profitableExpansions.map((expansion, i) => (
                        <li key={i} className="text-sm">📈 {expansion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ideaEnhancement.differentiationStrategies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Differentiation Strategies</h4>
                    <ul className="space-y-1">
                      {ideaEnhancement.differentiationStrategies.map((strategy, i) => (
                        <li key={i} className="text-sm">⚡ {strategy}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ideaEnhancement.quickWins.length > 0 && (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-success">🚀 Quick Wins</h4>
                    <ul className="space-y-1">
                      {ideaEnhancement.quickWins.map((win, i) => (
                        <li key={i} className="text-sm">• {win}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecast" className="space-y-4">
          {seasonalForecast && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Seasonal Demand Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Seasonality Level</p>
                    <p className="text-2xl font-bold">{seasonalForecast.seasonalityLevel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Annual Variance</p>
                    <p className="text-2xl font-bold">{seasonalForecast.annualVariance}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Peak Months</p>
                    <p className="font-semibold">{seasonalForecast.peakMonths.join(", ")}</p>
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Low Months</p>
                    <p className="font-semibold">{seasonalForecast.lowMonths.join(", ")}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Monthly Revenue Forecast</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {seasonalForecast.monthlyData.map((month, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-lg text-center ${
                          month.demandMultiplier >= 1.15 
                            ? "bg-success/20 border border-success/30" 
                            : month.demandMultiplier <= 0.85 
                            ? "bg-muted border border-border" 
                            : "bg-card border border-border"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">{month.month}</p>
                        <p className="text-lg font-bold">₹{(month.expectedRevenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">{(month.demandMultiplier * 100).toFixed(0)}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Seasonal Recommendations</h4>
                  <ul className="space-y-1">
                    {seasonalForecast.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm">📅 {rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
