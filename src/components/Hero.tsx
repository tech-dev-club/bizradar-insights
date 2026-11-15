import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, MapPin, BarChart3, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Business Opportunity & Planning Tools</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center animate-fade-in-up leading-tight">
            Make Smarter Business
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Decisions with Context
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-center animate-fade-in-up delay-200 leading-relaxed">
            Explore business ideas, compare locations, and review planning scenarios with a structured set of market and feasibility tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-300">
            <Link to="/opportunities">
              <Button size="lg" className="group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Explore Opportunities
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/idea-analyzer">
              <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50 transition-colors">
                <Sparkles className="mr-2 w-4 h-4" aria-hidden="true" />
                Analyze Your Idea
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up delay-500">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-2">Location Context</h3>
              <p className="text-sm text-muted-foreground">
                Explore location characteristics and compare areas for a business idea.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-success" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-2">Planning Scenarios</h3>
              <p className="text-sm text-muted-foreground">
                Review six and twelve-month projections based on the displayed assumptions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-secondary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-2">Decision Reports</h3>
              <p className="text-sm text-muted-foreground">
                Bring feasibility, competition, and risk considerations together.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in-up delay-1000">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Structured Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-success" aria-hidden="true" />
              <span className="text-sm font-medium">Interactive Planning</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-secondary" aria-hidden="true" />
              <span className="text-sm font-medium">Idea Exploration</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
