-- Enable RLS on cities table and make it publicly readable
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are publicly readable"
ON public.cities FOR SELECT
USING (true);