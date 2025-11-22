-- Create comprehensive cities database
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  pin_code TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  population INTEGER NOT NULL,
  population_density NUMERIC,
  area_sq_km NUMERIC,
  gdp_per_capita NUMERIC,
  literacy_rate NUMERIC,
  urbanization_level TEXT,
  tier TEXT,
  avg_income NUMERIC,
  employment_rate NUMERIC,
  internet_penetration NUMERIC,
  key_industries JSONB,
  demographics JSONB,
  infrastructure_score NUMERIC,
  business_ease_score NUMERIC,
  rent_index NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast location queries
CREATE INDEX idx_cities_coordinates ON public.cities (latitude, longitude);
CREATE INDEX idx_cities_state ON public.cities (state);
CREATE INDEX idx_cities_tier ON public.cities (tier);
CREATE INDEX idx_cities_name ON public.cities (name);
CREATE INDEX idx_cities_pin_code ON public.cities (pin_code);

-- Create custom ideas table for Idea Analyzer
CREATE TABLE IF NOT EXISTS public.custom_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  idea_text TEXT NOT NULL,
  parsed_data JSONB,
  category TEXT,
  niche TEXT,
  location TEXT,
  coordinates JSONB,
  city_id UUID REFERENCES public.cities(id),
  analysis_result JSONB,
  biz_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on custom_ideas
ALTER TABLE public.custom_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom ideas"
ON public.custom_ideas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom ideas"
ON public.custom_ideas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom ideas"
ON public.custom_ideas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom ideas"
ON public.custom_ideas FOR DELETE
USING (auth.uid() = user_id);

-- Create comparisons table for decision matrix
CREATE TABLE IF NOT EXISTS public.idea_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  idea_ids JSONB NOT NULL,
  weights JSONB,
  matrix_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.idea_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own comparisons"
ON public.idea_comparisons FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons"
ON public.idea_comparisons FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons"
ON public.idea_comparisons FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
ON public.idea_comparisons FOR DELETE
USING (auth.uid() = user_id);

-- Create AI conversation memory table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI conversations"
ON public.ai_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI conversations"
ON public.ai_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI conversations"
ON public.ai_conversations FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_cities_updated_at
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_ideas_updated_at
BEFORE UPDATE ON public.custom_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_idea_comparisons_updated_at
BEFORE UPDATE ON public.idea_comparisons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();