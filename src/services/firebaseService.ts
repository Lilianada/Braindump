import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentItem } from '@/types/content';

export interface FirebaseNote {
  id: string;
  noteTitle: string;
  content: string;
  filePath: string;
  slug: string;
  userId: string;
  publish?: boolean;
  tags?: string[];
  category?: {
    id: string;
    name: string;
    color: string;
  };
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

// Type guard to validate ContentItem type
const isValidContentType = (type: string): type is ContentItem['type'] => {
  const validTypes: ContentItem['type'][] = [
    'folder', 'note', 'topic', 'glossary_term', 'dictionary_entry', 
    'log', 'zettel', 'book', 'language', 'concept', 'links'
  ];
  return validTypes.includes(type as ContentItem['type']);
};

export const fetchNotesFromFirebase = async (): Promise<FirebaseNote[]> => {
  try {
    const notesCollection = collection(db, 'notes');
    // Only fetch published notes
    const publishedQuery = query(notesCollection, where('publish', '==', true));
    const notesSnapshot = await getDocs(publishedQuery);
    
    const notes: FirebaseNote[] = notesSnapshot.docs.map(doc => {
      const data = doc.data() as FirebaseNote;
      
      return {
        id: doc.id,
        noteTitle: data.noteTitle || 'Untitled',
        filePath: data.filePath || doc.id,
        content: data.content || '',
        slug: data.slug || doc.id,
        userId: data.userId || '',
        publish: data.publish,
        tags: data.tags || [],
        category: data.category,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        ...data
      } as FirebaseNote;
    });
    
    return notes;
  } catch (error) {
    console.error('Error fetching notes from Firebase:', error);
    return [];
  }
};

export const fetchNoteByPath = async (path: string): Promise<FirebaseNote | null> => {
  try {
    // Search by filePath field and ensure it's published
    const notesCollection = collection(db, 'notes');
    const pathQuery = query(
      notesCollection, 
      where('filePath', '==', path),
      where('publish', '==', true)
    );
    const notesSnapshot = await getDocs(pathQuery);
    
    if (!notesSnapshot.empty) {
      const doc = notesSnapshot.docs[0];
      const data = doc.data() as FirebaseNote;
      
      return {
        id: doc.id,
        noteTitle: data.noteTitle || 'Untitled',
        filePath: data.filePath || doc.id,
        content: data.content || '',
        slug: data.slug || doc.id,
        userId: data.userId || '',
        publish: data.publish,
        tags: data.tags || [],
        category: data.category,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        ...data
      } as FirebaseNote;
    }
    
    // Fallback: try to find by document ID if it's published
    const docRef = doc(db, 'notes', path);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirebaseNote;
      
      // Check if it's published
      if (data.publish === true) {
        return {
          id: docSnap.id,
          noteTitle: data.noteTitle || 'Untitled',
          filePath: data.filePath || docSnap.id,
          content: data.content || '',
          slug: data.slug || docSnap.id,
          userId: data.userId || '',
          publish: data.publish,
          tags: data.tags || [],
          category: data.category,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          ...data
        } as FirebaseNote;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching note by path from Firebase:', error);
    return null;
  }
};

// Convert Firebase notes to ContentItems for compatibility
export const getAllContentItems = async (): Promise<ContentItem[]> => {
  try {
    const firebaseNotes = await fetchNotesFromFirebase();
    
    return firebaseNotes.map(note => {
      let type: ContentItem['type'] = 'note';
      
      // Extract type from category
      if (note.category?.name) {
        const categoryName = note.category.name.toLowerCase();
        if (isValidContentType(categoryName)) {
          type = categoryName as ContentItem['type'];
        }
      }
      
      // Fix date conversion
      const convertFirebaseDate = (firebaseDate: any): string | undefined => {
        if (!firebaseDate) return undefined;
        
        // If it's a Firebase Timestamp
        if (firebaseDate.toDate && typeof firebaseDate.toDate === 'function') {
          return firebaseDate.toDate().toISOString();
        }
        
        // If it's already a Date object
        if (firebaseDate instanceof Date) {
          return firebaseDate.toISOString();
        }
        
        // If it's a string, try to parse it
        if (typeof firebaseDate === 'string') {
          const parsed = new Date(firebaseDate);
          return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
        }
        
        return undefined;
      };
      
      return {
        id: note.id,
        title: note.noteTitle || 'Untitled',
        path: note.filePath || note.id,
        type,
        content: note.content || '',
        tags: note.tags || [],
        created: convertFirebaseDate(note.createdAt),
        lastUpdated: convertFirebaseDate(note.updatedAt),
        slug: note.slug,
        ...note
      } as ContentItem;
    });
  } catch (error) {
    console.error('Error fetching content items from Firebase:', error);
    return [];
  }
};
