
import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteGraph from '@/components/graph/NoteGraph';
import { ReactFlowProvider } from '@xyflow/react'; // Import ReactFlowProvider
import { AppContextType } from '@/components/Layout';

const GraphViewPage: React.FC = () => {
  const { setTocItems, setActiveTocItemId } = useOutletContext<AppContextType>();

  // Clear TOC when component mounts
  useEffect(() => {
    // Reset TOC and active TOC item when GraphViewPage mounts
    setTocItems([]);
    setActiveTocItemId(null);
  }, [setTocItems, setActiveTocItemId]);
  
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
