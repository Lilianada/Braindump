
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import DocsPage from "./pages/DocsPage";
import ContentPage from "./pages/ContentPage";
import TagsPage from "./pages/TagsPage"; 
import TagDetailPage from "./pages/TagDetailPage"; 
import GraphViewPage from "./pages/GraphViewPage"; // Add import for GraphViewPage
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/content/*" element={<ContentPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/tags/:tagName" element={<TagDetailPage />} />
              <Route path="/graph-view" element={<GraphViewPage />} /> {/* Add route for GraphViewPage */}
            </Route>
            {/* Catch-all route outside of Layout to handle all unmatched routes */}
            <Route path="*" element={
              <div className="min-h-screen bg-background">
                <NotFound />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
