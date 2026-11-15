import { Map, Brain, BarChart3, Target, Zap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Map,
      title: "Location Intelligence",
      description: "Transform any location into actionable market insights with location-aware analysis.",
      color: "primary",
    },
    {
      icon: Brain,
      title: "Business Opportunity Scoring",
      description: "Compare demand, competition, and planning assumptions with a consistent score.",
      color: "secondary",
    },
    {
      icon: BarChart3,
      title: "Scenario Forecasting",
      description: "Explore six and twelve-month projections as planning scenarios, not guarantees.",
      color: "success",
    },
    {
      icon: Target,
      title: "Feasibility Reports",
      description: "Review business assumptions, risks, and strategy guidance in one report.",
      color: "primary",
    },
    {
      icon: Zap,
      title: "Market Context",
      description: "Review competitive density and category context for a location.",
      color: "secondary",
    },
    {
      icon: Shield,
      title: "Risk Intelligence",
      description: "Consider regulatory friction, market barriers, and operational challenges before you start.",
      color: "success",
    },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden" aria-labelledby="features-heading">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-4">
            Complete Entrepreneurial{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Intelligence System
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tools to explore, compare, and plan business opportunities in one platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative">
                  <div className="mb-4 relative">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
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
