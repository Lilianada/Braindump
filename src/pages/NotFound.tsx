import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Oops! This page seems to have wandered off <span className="text-primary">🌿</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Looks like the path you were searching for has taken a detour and is resting somewhere else in the garden.
          </p>
        </div>
        
        <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-lg border border-border">
          <p className="mb-4">
            But don't worry, the garden is full of other interesting ideas and notes waiting to be explored!
          </p>
          
          <div className="space-y-3 text-left max-w-md mx-auto">
            <p className="font-medium text-foreground">Here are some places you might want to visit instead:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <Link to="/" className="text-primary hover:underline">
                  Home
                </Link> — Start fresh and explore the garden from the beginning.
              </li>
              <li>
                <Link to="/dump" className="text-primary hover:underline">
                  Explore the Garden
                </Link> — Dive into the heart of Braindump and discover notes, wikis, and more.
              </li>
              <li>Use the search bar above to find what you're looking for.</li>
            </ul>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          Happy wandering! <span className="text-primary">🌱</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
