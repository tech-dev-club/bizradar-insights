import { Map, Brain, BarChart3, Target, Zap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Map,
      title: "Location Intelligence",
      description: "Explore location characteristics and compare areas for a business concept.",
    },
    {
      icon: Brain,
      title: "Opportunity Scoring",
      description: "Review a consistent score built from the market assumptions shown in the app.",
    },
    {
      icon: BarChart3,
      title: "Planning Forecasts",
      description: "Explore six and twelve-month scenarios to support early-stage planning.",
    },
    {
      icon: Target,
      title: "Feasibility Reports",
      description: "Bring business assumptions, risk factors, and strategy guidance into one report.",
    },
    {
      icon: Zap,
      title: "Market Context",
      description: "Review category and competitive context while comparing possible locations.",
    },
    {
      icon: Shield,
      title: "Risk Considerations",
      description: "Consider regulatory friction, market barriers, and operational challenges before launch.",
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-24" aria-labelledby="features-heading">
      <div className="container relative z-10 mx-auto">
        <div className="mb-16 text-center">
          <h2 id="features-heading" className="mb-4 text-4xl font-bold md:text-5xl">
            Business Planning{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Toolkit
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Explore ideas, compare locations, and organize the factors behind a business decision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border bg-card p-6 transition-all duration-300 hover:border-primary/50"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
