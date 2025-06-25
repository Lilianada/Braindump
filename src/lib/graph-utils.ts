
import { fetchAllContentItems } from '@/services/contentService';
import { ContentItem } from '@/types/content';
import { Node, Edge, MarkerType } from '@xyflow/react';

const WIKI_LINK_REGEX = /\[\[(.*?)\]\]/g;

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export async function generateGraphData(): Promise<GraphData> {
  try {
    console.log('Fetching notes from content directory for graph...');
    const allNotes = await fetchAllContentItems();
    
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const noteMapByPath: Map<string, ContentItem> = new Map();
    const noteMapByTitle: Map<string, ContentItem> = new Map();

    allNotes.forEach(note => {
      noteMapByPath.set(note.path, note);
      noteMapByTitle.set(note.title.toLowerCase(), note);
    });

    const columns = 5;
    const spacingX = 200;
    const spacingY = 150;

    allNotes.forEach((note, index) => {
      nodes.push({
        id: note.path,
        position: { 
          x: (index % columns) * spacingX + Math.random() * 20 - 10,
          y: Math.floor(index / columns) * spacingY + Math.random() * 20 - 10,
        },
        data: { label: note.title },
        type: 'default',
      });

      if (note.content) {
        let match;
        while ((match = WIKI_LINK_REGEX.exec(note.content)) !== null) {
          const linkedNoteTitle = match[1].toLowerCase();
          const targetNote = noteMapByTitle.get(linkedNoteTitle);

          if (targetNote && targetNote.path !== note.path) {
            const edgeId = `e-${note.path}-${targetNote.path}`;
            if (!edges.find(e => e.id === edgeId)) {
              edges.push({
                id: edgeId,
                source: note.path,
                target: targetNote.path,
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#FF0072' },
                style: { stroke: '#FF0072' },
              });
            }
          }
        }
      }
    });
    
    console.log(`Generated ${nodes.length} nodes and ${edges.length} edges from local content.`);
    return { nodes, edges };
  } catch (error) {
    console.error('Error generating graph data from content:', error);
    return { nodes: [], edges: [] };
  }
}
