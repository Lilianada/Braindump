import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import CommandPalette from "@/components/CommandPalette";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4 overflow-hidden">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground"> Oops!</h1>
          <h2 className="text-xl font-semibold text-foreground">
           This page seems to have wandered off...
          </h2>
          <p className="text-muted-foreground">
          Looks like the path you were searching for has taken a detour and is resting somewhere else in the garden. But don't worry, the garden is full of other interesting ideas and notes waiting to be explored!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        
        <div className="pt-6 border-t border-border mt-6">
          <p className="text-sm text-muted-foreground">
            Looking for something specific? Try using the search or browse our content.
          </p>
        </div>
      </div>
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  );
};

export default NotFound;
