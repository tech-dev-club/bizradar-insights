import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Radar, Target, Zap, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Structured Decision-Making",
      description: "Organize market assumptions, risks, and planning considerations before choosing a direction.",
    },
    {
      icon: Zap,
      title: "Faster Exploration",
      description: "Compare business concepts and locations with a consistent set of planning tools.",
    },
    {
      icon: Shield,
      title: "Risk Awareness",
      description: "Review potential challenges and barriers before committing time or capital.",
    },
    {
      icon: Radar,
      title: "Scenario Planning",
      description: "Explore indicative projections to understand how assumptions can affect a business idea.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="px-4 pb-12 pt-24">
        <div className="mx-auto max-w-4xl container">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2">
              <Radar className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BizRadar
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A business planning platform for exploring ideas, comparing locations, and organizing early-stage research.
            </p>
          </div>

          <Card className="mb-12 border-border bg-card p-8">
            <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              BizRadar aims to make business planning tools easier to explore. It brings location context,
              opportunity scoring, scenario forecasts, and feasibility considerations into one workflow.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Some values and projections are indicative estimates generated from the assumptions available
              in the application. They are intended to support early exploration, not replace local research,
              verified market data, or professional advice.
            </p>
          </Card>

          <div className="mb-12">
            <h2 className="mb-8 text-center text-3xl font-bold">What Makes BizRadar Useful</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={value.title}
                    className="border-border bg-card p-6 transition-all hover:border-primary/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
            <h2 className="mb-6 text-2xl font-bold">The BizRadar Workflow</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Choose a location",
                  description: "Select an area and review the location context available in the app.",
                },
                {
                  title: "Explore an opportunity",
                  description: "Compare categories and review the assumptions behind opportunity scores.",
                },
                {
                  title: "Review scenarios",
                  description: "Explore indicative forecasts and consider how different assumptions affect the result.",
                },
                {
                  title: "Check feasibility",
                  description: "Use the report as a planning checklist, then validate important figures with reliable sources.",
                },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
