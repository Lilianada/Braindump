
import React from 'react';
import NoteGraph from '@/components/graph/NoteGraph';
import { ReactFlowProvider } from '@xyflow/react'; // Import ReactFlowProvider

const GraphViewPage: React.FC = () => {
  return (
    <div className="container mx-auto p-0 md:p-0 h-[calc(100vh-4rem)] flex flex-col"> {/* Full height minus navbar */}
      {/* Header can be kept or removed */}
      {/* 
      <div className="p-4 md:p-6 border-b">
        <h1 className="text-2xl font-bold">Notes Graph</h1>
        <p className="text-muted-foreground">Visual representation of your interconnected notes.</p>
      </div>
      */}
      <div className="flex-grow w-full h-full"> {/* Ensure this div takes remaining space */}
        <ReactFlowProvider>
          <NoteGraph />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default GraphViewPage;
