
// Import the Geist font CSS files directly
// import 'geist/dist/geist-sans.css'; // REMOVED
// import 'geist/dist/geist-mono.css'; // REMOVED

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import DocsPage from "./pages/DocsPage";
import ContentPage from "./pages/ContentPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";

// The GeistSans and GeistMono JS components and their initialization are no longer needed here
// GeistSans.style;
// GeistMono.style;

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
              <Route path="/content/*" element={<ContentPage />} /> {/* Catch-all for content */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

