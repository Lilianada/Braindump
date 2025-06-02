
import { useState, useEffect } from 'react';
import { fetchNotesFromFirebase } from '@/services/firebaseService';
import { ContentItem } from '@/types/content';
import { useOutletContext } from 'react-router-dom';
import { AppContextType } from '@/components/Layout';

// Convert Firebase notes to ContentItems and create virtual folder structure
const convertAndStructureFirebaseNotes = (firebaseNotes: any[]): {
  allNotesAndTopics: ContentItem[];
  sequencedNavigableItems: ContentItem[];
  glossaryTerms: ContentItem[];
  folderStructure: ContentItem[];
} => {
  // Convert Firebase notes to ContentItems
  const convertedNotes: ContentItem[] = firebaseNotes
    .filter(note => note.publish === true) // Only show published notes
    .map(note => {
      let type: ContentItem['type'] = 'note';
      
      // Extract type from category
      if (note.category?.name) {
        const categoryName = note.category.name.toLowerCase();
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
      };
    });

  // Create virtual folder structure from file paths
  const folderMap = new Map<string, ContentItem>();
  
  convertedNotes.forEach(item => {
    const pathParts = item.path.split('/');
    
    // Create folder hierarchy
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderPath = pathParts.slice(0, i + 1).join('/');
      const folderName = pathParts[i];
      
      if (!folderMap.has(folderPath)) {
        folderMap.set(folderPath, {
          id: `folder-${folderPath}`,
          title: folderName.charAt(0).toUpperCase() + folderName.slice(1),
          path: folderPath,
          type: 'folder',
          content: '',
          children: []
        });
      }
    }
  });

  // Add children to folders
  const folders = Array.from(folderMap.values());
  
  // Add notes to their parent folders
  convertedNotes.forEach(item => {
    const pathParts = item.path.split('/');
    if (pathParts.length > 1) {
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentFolder = folderMap.get(parentPath);
      if (parentFolder && parentFolder.children) {
        parentFolder.children.push(item);
      }
    }
  });

  // Add subfolders to parent folders
  folders.forEach(folder => {
    const pathParts = folder.path.split('/');
    if (pathParts.length > 1) {
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentFolder = folderMap.get(parentPath);
      if (parentFolder && parentFolder.children) {
        if (!parentFolder.children.find(child => child.id === folder.id)) {
          parentFolder.children.push(folder);
        }
      }
    }
  });

  // Get root level folders and notes, sorted alphabetically
  const rootItems = [
    ...folders.filter(folder => !folder.path.includes('/')),
    ...convertedNotes.filter(note => !note.path.includes('/'))
  ].sort((a, b) => a.title.localeCompare(b.title));

  // Sort children within each folder alphabetically
  folders.forEach(folder => {
    if (folder.children) {
      folder.children.sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  const allNotesAndTopics = convertedNotes.filter(item => item.type !== 'folder');
  const sequencedNavigableItems = [...allNotesAndTopics].sort((a, b) => a.path.localeCompare(b.path));
  const glossaryTerms = allNotesAndTopics.filter(item => item.type === 'glossary_term');

  return {
    allNotesAndTopics,
    sequencedNavigableItems,
    glossaryTerms,
    folderStructure: rootItems
  };
};

export const useFirebaseContentData = () => {
  const [allNotesAndTopics, setAllNotesAndTopics] = useState<ContentItem[]>([]);
  const [sequencedNavigableItems, setSequencedNavigableItems] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  const [contentSections, setContentSections] = useState<ContentItem[]>([]);

  // Try to get the context, but handle the case where it might not be available
  let setAllNotesForContext: ((notes: ContentItem[]) => void) | undefined;
  try {
    const context = useOutletContext<AppContextType>();
    setAllNotesForContext = context?.setAllNotesForContext;
  } catch (error) {
    // Context not available, which is fine for some components
    console.log('Outlet context not available, continuing without it');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseNotes = await fetchNotesFromFirebase();
        const structuredData = convertAndStructureFirebaseNotes(firebaseNotes);
        
        setAllNotesAndTopics(structuredData.allNotesAndTopics);
        setSequencedNavigableItems(structuredData.sequencedNavigableItems);
        setGlossaryTerms(structuredData.glossaryTerms);
        setContentSections(structuredData.folderStructure);
        
        if (setAllNotesForContext) {
          setAllNotesForContext(structuredData.allNotesAndTopics);
        }
      } catch (error) {
        console.error('Error fetching Firebase content data:', error);
        // Set empty arrays on error
        setAllNotesAndTopics([]);
        setSequencedNavigableItems([]);
        setGlossaryTerms([]);
        setContentSections([]);
        if (setAllNotesForContext) {
          setAllNotesForContext([]);
        }
      }
    };

    fetchData();
  }, [setAllNotesForContext]);

  return { 
    allNotesAndTopics, 
    sequencedNavigableItems, 
    glossaryTerms,
    contentSections 
  };
};
