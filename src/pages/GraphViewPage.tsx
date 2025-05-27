
import React from 'react';
import { Share2 } from 'lucide-react'; // Or GitFork, or another appropriate icon

const GraphViewPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Share2 className="w-16 h-16 text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">Graph View</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          This is where the visual graph of note interconnections will be displayed.
          This feature is currently under development and will be available soon!
        </p>
      </div>
    </div>
  );
};

export default GraphViewPage;
