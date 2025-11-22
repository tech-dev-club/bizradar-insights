import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Lightbulb, MapPin, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { analyzeBusinessIdea } from "@/lib/ideaEngine";
import { buildFullReport } from "@/lib/reportBuilder";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const IdeaAnalyzer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ideaText, setIdeaText] = useState("");
  const [location, setLocation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!ideaText.trim()) {
      toast.error("Please describe your business idea");
      return;
    }

    if (!location.trim() && !pinCode.trim()) {
      toast.error("Please provide a location or PIN code");
      return;
    }

    if (!user) {
      toast.error("Please sign in to analyze your idea");
      navigate("/auth");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Parse the business idea using AI
      toast.info("Analyzing your business idea...");
      const analysis = await analyzeBusinessIdea(ideaText);

      // Get location data (mock for now - will be replaced with real API)
      const coordinates = { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
      const populationDensity = 11000;

      // Map competition level to density
      const competitionDensityMap = {
        "Low": "Low" as const,
        "Moderate": "Balanced" as const,
        "High": "High" as const
      };

      // Build full feasibility report
      const report = buildFullReport({
        location: location || `PIN: ${pinCode}`,
        category: analysis.parsed.category,
        coordinates,
        demandIndex: analysis.demandEstimate,
        competitionDensity: competitionDensityMap[analysis.competitionLevel],
        populationDensity,
        bizScoreToday: 70 // Will be calculated more accurately
      });

      // Save to database
      const { data: savedIdea, error } = await supabase
        .from('custom_ideas')
        .insert([{
          user_id: user.id,
          idea_text: ideaText,
          parsed_data: analysis.parsed as any,
          category: analysis.parsed.category,
          niche: analysis.parsed.niche,
          location: location || `PIN: ${pinCode}`,
          coordinates: coordinates as any,
          analysis_result: report as any,
          biz_score: report.bizScoreToday
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Analysis complete!");
      navigate(`/feasibility-report?ideaId=${savedIdea.id}`);
    } catch (error) {
      console.error("Error analyzing idea:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze idea");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exampleIdeas = [
    "I want to start a Korean themed fusion cafe with affordable pricing and late night seating",
    "A mobile pet grooming van that provides on-site services for busy professionals",
    "An eco-friendly laundry service using sustainable products and energy-efficient machines",
    "A boutique fitness studio specializing in high-intensity interval training for women"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
            <Lightbulb className="h-10 w-10 text-primary" />
            Idea Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Describe your business idea in natural language and get a comprehensive feasibility analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Input Area */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Describe Your Business Idea</CardTitle>
              <CardDescription>
                Write a detailed paragraph about your business concept, target market, and unique features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="idea">Business Idea</Label>
                <Textarea
                  id="idea"
                  placeholder="Example: I want to start a Korean themed fusion cafe with affordable pricing targeting students and young professionals. The cafe will serve fusion dishes combining Korean flavors with local cuisine, have free WiFi, and stay open until midnight to cater to late-night study groups and remote workers..."
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  rows={8}
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    City/Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code (Optional)</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g., 400001"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Your Idea...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Analyze Idea
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Examples & Tips */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Ideas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exampleIdeas.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setIdeaText(example)}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-muted-foreground">
                <p>✓ Include your target audience</p>
                <p>✓ Mention pricing strategy</p>
                <p>✓ Describe unique features</p>
                <p>✓ Note operational details</p>
                <p>✓ Specify any special requirements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaAnalyzer;