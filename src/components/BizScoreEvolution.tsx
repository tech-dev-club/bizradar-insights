import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar } from "lucide-react";

interface BizScoreEvolutionProps {
  currentScore: number;
  score6M: number;
  score12M: number;
  rating: string;
  color: string;
}

const BizScoreEvolution = ({
  currentScore,
  score6M,
  score12M,
  rating,
  color,
}: BizScoreEvolutionProps) => {
  const safeCurrentScore = Number.isFinite(currentScore) ? Math.min(100, Math.max(0, currentScore)) : 0;
  const safeScore6M = Number.isFinite(score6M) ? Math.min(100, Math.max(0, score6M)) : 0;
  const safeScore12M = Number.isFinite(score12M) ? Math.min(100, Math.max(0, score12M)) : 0;

  const getScoreChange = (futureScore: number) => {
    const diff = futureScore - safeCurrentScore;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 65) return "text-primary";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          BizScore Evolution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(safeCurrentScore)}`}>
              {safeCurrentScore}
            </span>
          </div>
          <Progress value={safeCurrentScore} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            Rating: <span className="font-semibold text-foreground">{rating}</span>
          </p>
        </div>

        {/* 6 Month Projection */}
        <div className="space-y-2 p-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">6 Months</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(safeScore6M)}`}>
                {safeScore6M}
              </span>
              <span className={`text-sm ${safeScore6M > safeCurrentScore ? "text-success" : safeScore6M < safeCurrentScore ? "text-destructive" : "text-muted-foreground"}`}>
                ({getScoreChange(safeScore6M)})
              </span>
            </div>
          </div>
          <Progress value={safeScore6M} className="h-2" />
        </div>

        {/* 12 Month Projection */}
        <div className="space-y-2 p-4 bg-card/50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">12 Months</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(safeScore12M)}`}>
                {safeScore12M}
              </span>
              <span className={`text-sm ${safeScore12M > safeCurrentScore ? "text-success" : safeScore12M < safeCurrentScore ? "text-destructive" : "text-muted-foreground"}`}>
                ({getScoreChange(safeScore12M)})
              </span>
            </div>
          </div>
          <Progress value={safeScore12M} className="h-2" />
        </div>

        {/* Projection Summary */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-center text-muted-foreground">
            {safeScore12M > safeCurrentScore + 10 ? (
              <span className="text-success font-semibold">Strong upward trajectory expected</span>
            ) : safeScore12M < safeCurrentScore - 10 ? (
              <span className="text-destructive font-semibold">Declining trend projected</span>
            ) : (
              <span className="text-warning font-semibold">Relatively stable outlook</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BizScoreEvolution;
