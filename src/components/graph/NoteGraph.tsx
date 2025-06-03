
import React, { useCallback, useEffect, useState } from 'react';
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
  BackgroundVariant,
} from '@xyflow/react';
import { useNavigate } from 'react-router-dom';

import '@xyflow/react/dist/style.css';
import '@/styles/react-flow-theme.css';
import '@/styles/custom-graph-styles.css';

import { generateGraphData } from '@/lib/graph-utils';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import LoadingGrid from '@/components/LoadingGrid';

const NoteGraph: React.FC = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const loadGraphData = useCallback(async () => {
    console.log('Loading graph data from Firebase...');
    setIsLoading(true);
    try {
      const { nodes: initialNodes, edges: initialEdges } = await generateGraphData();
      console.log(`Loaded ${initialNodes.length} nodes, ${initialEdges.length} edges from Firebase.`);
      setNodes(initialNodes);
      setEdges(initialEdges);
      setTimeout(() => fitView({duration: 800 }), 100);
    } catch (error) {
      console.error("Error loading graph data from Firebase:", error);
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
      if (node.id) {
        navigate(`/content/${node.id}`);
      }
    },
    [navigate],
  );

  if (isLoading) {
    return <LoadingGrid />;
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
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={16} color="hsl(var(--border))" variant={BackgroundVariant.Dots} />
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

const NoteGraphWrapper: React.FC = () => {
  return <NoteGraph />;
}

export default NoteGraphWrapper;
