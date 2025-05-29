
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentItem } from '@/types/content';

export interface FirebaseNote {
  id: string;
  title: string;
  content: string;
  path: string;
  type: string;
  tags?: string[];
  created?: string;
  lastUpdated?: string;
  [key: string]: any;
}

export const fetchNotesFromFirebase = async (): Promise<ContentItem[]> => {
  try {
    const notesCollection = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCollection);
    
    const notes: ContentItem[] = notesSnapshot.docs.map(doc => {
      const data = doc.data() as FirebaseNote;
      return {
        id: doc.id,
        title: data.title || 'Untitled',
        path: data.path || doc.id,
        type: (data.type as ContentItem['type']) || 'note',
        content: data.content || '',
        tags: data.tags || [],
        created: data.created,
        lastUpdated: data.lastUpdated,
        ...data
      };
    });
    
    return notes;
  } catch (error) {
    console.error('Error fetching notes from Firebase:', error);
    return [];
  }
};

export const fetchNoteByPath = async (path: string): Promise<ContentItem | null> => {
  try {
    // Try to find by document ID first
    const docRef = doc(db, 'notes', path);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirebaseNote;
      return {
        id: docSnap.id,
        title: data.title || 'Untitled',
        path: data.path || docSnap.id,
        type: (data.type as ContentItem['type']) || 'note',
        content: data.content || '',
        tags: data.tags || [],
        created: data.created,
        lastUpdated: data.lastUpdated,
        ...data
      };
    }
    
    // If not found by ID, search by path field
    const notesCollection = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCollection);
    
    for (const doc of notesSnapshot.docs) {
      const data = doc.data() as FirebaseNote;
      if (data.path === path) {
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          path: data.path || doc.id,
          type: (data.type as ContentItem['type']) || 'note',
          content: data.content || '',
          tags: data.tags || [],
          created: data.created,
          lastUpdated: data.lastUpdated,
          ...data
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching note by path from Firebase:', error);
    return null;
  }
};
