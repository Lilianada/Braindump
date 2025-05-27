
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Panel,
  useReactFlow,
  BackgroundVariant, // Import BackgroundVariant
} from '@xyflow/react';
import { useNavigate } from 'react-router-dom';

import '@xyflow/react/dist/style.css'; // Base React Flow styles
import '@/styles/react-flow-theme.css'; // Custom theme
import '@/styles/custom-graph-styles.css'; // Additional custom styles

import { generateGraphData } from '@/lib/graph-utils';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const NoteGraph: React.FC = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const loadGraphData = useCallback(() => {
    console.log('Generating graph data...');
    setIsLoading(true);
    try {
      const { nodes: initialNodes, edges: initialEdges } = generateGraphData();
      console.log(`Loaded ${initialNodes.length} nodes, ${initialEdges.length} edges.`);
      setNodes(initialNodes);
      setEdges(initialEdges);
      // Fit view after a short delay to ensure nodes are rendered
      setTimeout(() => fitView({duration: 800 }), 100);
    } catch (error) {
      console.error("Error generating graph data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges, fitView]);

  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      console.log('Node clicked:', node);
      // Assuming node.id is the content path
      if (node.id) {
        navigate(`/content/${node.id}`);
      }
    },
    [navigate],
  );
  
  // Memoize the ReactFlow component if nodes/edges don't change frequently after initial load
  // For now, direct render is fine.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading graph...</p>
      </div>
    );
  }

  return (
    <div className="note-graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2, duration: 800 }}
        attributionPosition="bottom-left"
        nodesDraggable={true}
        nodesConnectable={true} // Usually true by default
        elementsSelectable={true} // Usually true by default
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={16} color="hsl(var(--border))" variant={BackgroundVariant.Dots} /> {/* Changed "dots" to BackgroundVariant.Dots */}
        <Panel position="top-right">
          <Button onClick={loadGraphData} variant="outline" size="sm" className="shadow-md">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Graph
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// ReactFlowProvider is needed if useReactFlow is used outside of ReactFlow component context
// Since NoteGraph is the direct child, we might need to wrap GraphViewPage's content
// Or, create a wrapper component. Let's try to use ReactFlowProvider in GraphViewPage.
// For now, we will create a wrapper here to ensure useReactFlow hook works.

const NoteGraphWrapper: React.FC = () => {
  // Need to import ReactFlowProvider from @xyflow/react for useReactFlow() to work
  // but it's better to wrap the entire graph page with it.
  // For now, this component itself will not use ReactFlowProvider,
  // it will be responsibility of GraphViewPage or its parent.
  // Actually, if NoteGraph is rendered inside <ReactFlowProvider> in GraphViewPage,
  // useReactFlow() will work. Let's assume GraphViewPage will provide it.
  // UPDATE: No, if NoteGraph uses useReactFlow, it needs to be a child of ReactFlowProvider.
  // So GraphViewPage should render <ReactFlowProvider><NoteGraph /></ReactFlowProvider>
  return <NoteGraph />;
}


export default NoteGraphWrapper;
