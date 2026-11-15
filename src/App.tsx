import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const FeasibilityReport = lazy(() => import("./pages/FeasibilityReport"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const SavedIdeas = lazy(() => import("./pages/SavedIdeas"));
const Compare = lazy(() => import("./pages/Compare"));
const IdeaAnalyzer = lazy(() => import("./pages/IdeaAnalyzer"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground"
    role="status"
    aria-live="polite"
  >
    Loading page…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/feasibility-report" element={<FeasibilityReport />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/saved" element={<SavedIdeas />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/idea-analyzer" element={<IdeaAnalyzer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
