import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a business idea analyzer. Extract structured information from business ideas.

Return a JSON object with these fields:
{
  "category": "main business category (Cafe/Restaurant/Gym/Salon/Grocery Store/Pharmacy/Tech Support/Tutoring Center/Retail/Healthcare/Entertainment/Services/Other)",
  "niche": "specific niche or subcategory",
  "pricingLevel": "Affordable/Mid-Range/Premium",
  "targetAudience": ["audience segment 1", "audience segment 2"],
  "capitalIntensity": "Low/Medium/High/Very High",
  "operationalComplexity": "Easy/Moderate/Difficult/Very Difficult",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "uniqueSellingPoints": ["USP 1", "USP 2"],
  "requiredSpace": "Small/Medium/Large",
  "staffingNeeds": "Minimal/Moderate/Extensive",
  "inventoryNeeds": "Low/Medium/High",
  "technologyRequirements": "Basic/Moderate/Advanced"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this business idea: "${ideaText}"` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const parsedIdea = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(parsedIdea), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in parse-idea:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});