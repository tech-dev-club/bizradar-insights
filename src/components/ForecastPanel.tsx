import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { ForecastData } from "@/services/forecastEngine";
import { getTrendBadge } from "@/services/trendSimulator";

interface ForecastPanelProps {
  forecast: ForecastData;
  currentBizScore: number;
}

const ForecastPanel = ({ forecast, currentBizScore }: ForecastPanelProps) => {
  const trendBadge = getTrendBadge(forecast.trendDirection);

  const trendBadgeClassName = {
    growing: "border-success text-success",
    declining: "border-destructive text-destructive",
    flat: "border-warning text-warning",
  }[forecast.trendDirection];

  const getTrendIcon = (direction: ForecastData["trendDirection"]) => {
    switch (direction) {
      case "growing":
        return <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />;
      case "declining":
        return <TrendingDown className="h-5 w-5 text-destructive" aria-hidden="true" />;
      default:
        return <Minus className="h-5 w-5 text-warning" aria-hidden="true" />;
    }
  };

  const getScoreChangeColor = (score: number, baseline: number) => {
    const diff = score - baseline;
    if (diff > 5) return "text-success";
    if (diff < -5) return "text-destructive";
    return "text-warning";
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            Market Forecast
          </CardTitle>
          <Badge variant="outline" className={trendBadgeClassName}>
            <span aria-hidden="true">{trendBadge.icon}</span>
            <span>{trendBadge.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">6 Month Outlook</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(forecast.trendDirection)}
              <span className={`text-lg font-bold ${getScoreChangeColor(forecast.bizScore6M, currentBizScore)}`}>
                BizScore: {forecast.bizScore6M}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3">
            <div>
              <p className="text-xs text-muted-foreground">Demand Index</p>
              <p className="text-sm font-semibold">{forecast.demandIndex6M}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Competition Index</p>
              <p className="text-sm font-semibold">{forecast.competitionIndex6M}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">12 Month Outlook</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(forecast.trendDirection)}
              <span className={`text-lg font-bold ${getScoreChangeColor(forecast.bizScore12M, currentBizScore)}`}>
                BizScore: {forecast.bizScore12M}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3">
            <div>
              <p className="text-xs text-muted-foreground">Demand Index</p>
              <p className="text-sm font-semibold">{forecast.demandIndex12M}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Competition Index</p>
              <p className="text-sm font-semibold">{forecast.competitionIndex12M}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Annual Growth Rate</span>
            <span className="text-lg font-bold text-primary">
              +{(forecast.growthRate * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastPanel;
