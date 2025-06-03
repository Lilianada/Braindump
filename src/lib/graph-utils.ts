
import { fetchNotesFromFirebase } from '@/services/firebaseService';
import { ContentItem } from '@/types/content';
import { Node, Edge, MarkerType } from '@xyflow/react';

const WIKI_LINK_REGEX = /\[\[(.*?)\]\]/g;

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// Convert Firebase notes to ContentItems
const convertFirebaseToContentItem = (firebaseNote: any): ContentItem => {
  let type: ContentItem['type'] = 'note';
  
  if (firebaseNote.category?.name) {
    const categoryName = firebaseNote.category.name.toLowerCase();
    const validTypes = ['folder', 'note', 'topic', 'glossary_term', 'dictionary_entry', 'log', 'zettel', 'book', 'language', 'concept', 'links'];
    if (validTypes.includes(categoryName)) {
      type = categoryName as ContentItem['type'];
    }
  }
  
  const convertFirebaseDate = (firebaseDate: any): string | undefined => {
    if (!firebaseDate) return undefined;
    
    if (firebaseDate.toDate && typeof firebaseDate.toDate === 'function') {
      return firebaseDate.toDate().toISOString();
    }
    
    if (firebaseDate instanceof Date) {
      return firebaseDate.toISOString();
    }
    
    if (typeof firebaseDate === 'string') {
      const parsed = new Date(firebaseDate);
      return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
    }
    
    return undefined;
  };
  
  return {
    id: firebaseNote.id,
    title: firebaseNote.noteTitle || 'Untitled',
    path: firebaseNote.filePath || firebaseNote.id,
    type,
    content: firebaseNote.content || '',
    tags: firebaseNote.tags || [],
    created: convertFirebaseDate(firebaseNote.createdAt),
    lastUpdated: convertFirebaseDate(firebaseNote.updatedAt),
    slug: firebaseNote.slug,
    ...firebaseNote
  };
};

export async function generateGraphData(): Promise<GraphData> {
  try {
    console.log('Fetching notes from Firebase for graph...');
    const firebaseNotes = await fetchNotesFromFirebase();
    const allNotes = firebaseNotes.map(convertFirebaseToContentItem);
    
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
    
    console.log(`Generated ${nodes.length} nodes and ${edges.length} edges from Firebase data.`);
    return { nodes, edges };
  } catch (error) {
    console.error('Error generating graph data from Firebase:', error);
    return { nodes: [], edges: [] };
  }
}
