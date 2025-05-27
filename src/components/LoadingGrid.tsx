import React from 'react';

const LoadingGrid: React.FC = () => {
  // Create a grid of 15 cells with different animation delays
  const cells = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 0.08, // Staggered delay for ripple effect
    size: Math.random() * 0.5 + 0.5, // Random size between 0.5 and 1
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-4xl">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="aspect-square relative overflow-hidden rounded-lg"
              style={{
                opacity: 0.7,
                transform: `scale(${0.8 + Math.random() * 0.4})`,
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/50"
                style={{
                  animation: `pulse 2s infinite ${cell.delay}s cubic-bezier(0.4, 0, 0.6, 1)`,
                  transform: `scale(${cell.size})`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-block">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Braindump
            </h1>
            <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-primary/30 to-primary/60 rounded-full">
              <div className="h-full w-1/3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoadingGrid;
