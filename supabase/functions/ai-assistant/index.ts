import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const authHeader = req.headers.get("Authorization")!;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Retrieve conversation history
    const { data: conversation } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single();

    const messages = conversation?.messages || [];
    
    // Build context-aware system prompt
    const systemPrompt = `You are BizRadar AI Assistant, an expert business analyst helping users evaluate business opportunities.

Context Available:
${context ? JSON.stringify(context, null, 2) : 'No specific context'}

Previous Conversation:
${messages.length > 0 ? messages.slice(-5).map((m: any) => `${m.role}: ${m.content}`).join('\n') : 'New conversation'}

Capabilities:
- Analyze business ideas and feasibility
- Interpret BizScores, forecasts, and competition data
- Provide actionable recommendations
- Explain SWOT analysis and financial projections
- Suggest improvements and strategies
- Compare multiple business opportunities

Be concise, actionable, and data-driven in your responses.`;

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
          ...messages.slice(-10),
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Update conversation history
    const updatedMessages = [
      ...messages,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: assistantMessage, timestamp: new Date().toISOString() }
    ];

    if (conversation) {
      await supabase
        .from('ai_conversations')
        .update({ messages: updatedMessages, context, updated_at: new Date().toISOString() })
        .eq('id', conversation.id);
    } else {
      await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          messages: updatedMessages,
          context
        });
    }

    return new Response(JSON.stringify({ response: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-assistant:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});