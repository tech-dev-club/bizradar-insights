import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Bookmark,
  BookmarkCheck,
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target
} from "lucide-react";
import { buildFullReport, FeasibilityReport } from "@/lib/reportBuilder";
import { formatCurrency } from "@/lib/financeEngine";

const FeasibilityReportPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingReport, setSavingReport] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      generateReport();
    }
  }, [user, searchParams]);

  const generateReport = async () => {
    const location = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const currentScore = parseInt(searchParams.get("score") || "50");

    if (!location || !category) {
      toast.error("Missing location or category information");
      navigate("/opportunities");
      return;
    }

    try {
      // Generate full feasibility report using V4 engines
      const fullReport = buildFullReport({
        location,
        category,
        coordinates: { lat: 0, lng: 0 }, // Would be passed from actual location
        demandIndex: currentScore,
        competitionDensity: currentScore >= 70 ? "Low" : currentScore >= 50 ? "Balanced" : "High",
        populationDensity: 3000,
        bizScoreToday: currentScore,
      });

      setReport(fullReport);

      // Check if already saved
      const { data: savedIdeas } = await supabase
        .from("saved_ideas")
        .select("id")
        .eq("user_id", user!.id)
        .eq("location", location)
        .eq("category", category)
        .limit(1);

      setIsSaved(savedIdeas && savedIdeas.length > 0);
    } catch (error: any) {
      toast.error("Failed to generate report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async () => {
    if (!user || !report) return;

    setSavingReport(true);
    try {
      const { error } = await supabase.from("saved_ideas").insert([{
        user_id: user.id,
        location: report.location,
        category: report.category,
        coordinates: report.coordinates as any,
        biz_score_today: report.bizScoreToday,
        biz_score_12m: report.bizScore12M,
        demand_index: report.demandIndex,
        competition_density: report.competitionDensity,
        forecast_growth: report.forecastGrowth,
        swot: report.swot as any,
        financials: report.financials as any,
        recommendation: report.recommendation as any,
      }]);

      if (error) throw error;

      setIsSaved(true);
      toast.success("Business idea saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save idea: " + error.message);
    } finally {
      setSavingReport(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "start-now":
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case "start-caution":
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      case "wait-monitor":
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      case "avoid":
        return <XCircle className="w-6 h-6 text-destructive" />;
      default:
        return <Target className="w-6 h-6 text-primary" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "start-now":
        return "bg-success/10 border-success/20";
      case "start-caution":
        return "bg-warning/10 border-warning/20";
      case "wait-monitor":
        return "bg-warning/10 border-warning/20";
      case "avoid":
        return "bg-destructive/10 border-destructive/20";
      default:
        return "bg-primary/10 border-primary/20";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Opportunities
          </Button>
          
          <Button
            onClick={handleSaveIdea}
            disabled={isSaved || savingReport}
            variant={isSaved ? "outline" : "default"}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="mr-2 h-4 w-4" />
                Save Idea
              </>
            )}
          </Button>
        </div>

        {/* Report Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{report.category} Business</CardTitle>
                <p className="text-muted-foreground">{report.location}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{report.bizScoreToday}</div>
                <div className="text-sm text-muted-foreground">Current BizScore</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Final Recommendation */}
        <Card className={`mb-6 ${getRecommendationColor(report.recommendation.type)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRecommendationIcon(report.recommendation.type)}
              Final Recommendation: {report.recommendation.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                Confidence: {report.recommendation.confidence}%
              </Badge>
              <Badge variant="outline" className="mb-2 ml-2">
                Risk: {report.recommendation.riskLevel}
              </Badge>
              <Badge variant="outline" className="mb-2 ml-2">
                {report.recommendation.timeframe}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Reasoning:</h4>
              <ul className="space-y-1">
                {report.recommendation.reasoning.map((reason, i) => (
                  <li key={i} className="text-sm">• {reason}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommended Action Steps:</h4>
              <ol className="space-y-1">
                {report.recommendation.actionSteps.map((step, i) => (
                  <li key={i} className="text-sm">{i + 1}. {step}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="financials" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
            <TabsTrigger value="market">Market Overview</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Financial Projections */}
          <TabsContent value="financials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Financial Projections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Setup Cost</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(report.financials.setupCost.min)} - {formatCurrency(report.financials.setupCost.max)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Monthly Operating Cost</h4>
                    <p className="text-2xl font-bold text-warning">
                      {formatCurrency(report.financials.monthlyOperatingCost.min)} - {formatCurrency(report.financials.monthlyOperatingCost.max)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Expected Monthly Revenue</h4>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(report.financials.expectedMonthlyRevenue.min)} - {formatCurrency(report.financials.expectedMonthlyRevenue.max)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Break-Even Period</h4>
                    <p className="text-2xl font-bold">{report.financials.breakEvenMonths} months</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Profit Margin</h4>
                  <p className="text-xl font-bold">
                    {report.financials.profitMargin.min}% - {report.financials.profitMargin.max}%
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Year 1 Projection</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-bold">
                          {formatCurrency(report.financials.projections.year1.revenue.min)} - {formatCurrency(report.financials.projections.year1.revenue.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="font-bold text-success">
                          {formatCurrency(report.financials.projections.year1.profit.min)} - {formatCurrency(report.financials.projections.year1.profit.max)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Year 3 Projection</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-bold">
                          {formatCurrency(report.financials.projections.year3.revenue.min)} - {formatCurrency(report.financials.projections.year3.revenue.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="font-bold text-success">
                          {formatCurrency(report.financials.projections.year3.profit.min)} - {formatCurrency(report.financials.projections.year3.profit.max)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SWOT Analysis */}
          <TabsContent value="swot">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-success/5 border-success/20">
                <CardHeader>
                  <CardTitle className="text-success">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.swot.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-warning/5 border-warning/20">
                <CardHeader>
                  <CardTitle className="text-warning">Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.swot.weaknesses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.swot.opportunities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.swot.threats.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Overview */}
          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Indicators</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Demand Index</h4>
                  <p className="text-2xl font-bold">{report.demandIndex}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Competition Level</h4>
                  <Badge>{report.competitionDensity}</Badge>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Category Difficulty</h4>
                  <Badge variant="outline">{report.categoryDifficulty}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecast */}
          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  BizScore Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Today</p>
                    <p className="text-3xl font-bold text-primary">{report.bizScoreToday}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">6 Months</p>
                    <p className="text-3xl font-bold">{report.bizScore6M}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">12 Months</p>
                    <p className="text-3xl font-bold text-success">{report.bizScore12M}</p>
                  </div>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Growth Trend:</strong> {report.trendDirection === "growing" ? "📈 Growing" : "📊 Stable"} 
                    {" "}with {((report.forecastGrowth - 1) * 100).toFixed(1)}% projected growth
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeasibilityReportPage;
