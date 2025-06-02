
import { useState, useEffect } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import { fetchNoteByPath } from '@/services/firebaseService';
import { ContentItem } from '@/types/content';
import { AppContextType } from '@/components/Layout';

// Convert Firebase note to ContentItem format
const convertFirebaseToContentItem = (firebaseNote: any): ContentItem | null => {
  if (!firebaseNote) return null;
  
  // Extract category from category object or tags
  let type: ContentItem['type'] = 'note';
  if (firebaseNote.category?.name) {
    const categoryName = firebaseNote.category.name.toLowerCase();
    const validTypes = ['folder', 'note', 'topic', 'glossary_term', 'dictionary_entry', 'log', 'zettel', 'book', 'language', 'concept', 'links'];
    if (validTypes.includes(categoryName)) {
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
    id: firebaseNote.id,
    title: firebaseNote.noteTitle || 'Untitled',
    path: firebaseNote.filePath || firebaseNote.id,
    type,
    content: firebaseNote.content || '',
    tags: firebaseNote.tags || [],
    created: convertFirebaseDate(firebaseNote.createdAt),
    lastUpdated: convertFirebaseDate(firebaseNote.updatedAt),
    slug: firebaseNote.slug,
    // Include other Firebase fields
    ...firebaseNote
  };
};

export const useFirebaseContentItem = () => {
  const params = useParams();
  const location = useLocation();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(undefined);
  
  const { setTocItems, setCurrentContentItem, setActiveTocItemId } = useOutletContext<AppContextType>();

  useEffect(() => {
    const path = params['*'];
    
    const fetchContent = async () => {
      if (path) {
        try {
          const firebaseNote = await fetchNoteByPath(path);
          const item = convertFirebaseToContentItem(firebaseNote);
          setContentItem(item);
          if (setCurrentContentItem) setCurrentContentItem(item);
        } catch (error) {
          console.error('Error fetching Firebase content:', error);
          setContentItem(null);
          if (setCurrentContentItem) setCurrentContentItem(null);
        }
      } else {
        setContentItem(null);
        if (setCurrentContentItem) setCurrentContentItem(null);
      }
      
      if (setTocItems) setTocItems([]);
      if (setActiveTocItemId) setActiveTocItemId(null);
    };

    fetchContent();
  }, [params, location.pathname, setCurrentContentItem, setTocItems, setActiveTocItemId]);

  return { contentItem, currentPath: params['*'] || '' };
};
