
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types/content';
import { fetchAllContentItems, createFolderStructure } from '@/services/contentService';
import { useOutletContext } from 'react-router-dom';
import { AppContextType } from '@/components/Layout';

export const useContentData = () => {
  const [allNotesAndTopics, setAllNotesAndTopics] = useState<ContentItem[]>([]);
  const [sequencedNavigableItems, setSequencedNavigableItems] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  const [contentSections, setContentSections] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        setIsLoading(true);
        const allItems = await fetchAllContentItems();
        
        const notesAndTopics = allItems.filter(item => item.type !== 'folder');
        const sequenced = [...notesAndTopics].sort((a, b) => a.path.localeCompare(b.path));
        const glossary = notesAndTopics.filter(item => item.type === 'glossary_term');
        const folderStructure = createFolderStructure(allItems);
        
        setAllNotesAndTopics(notesAndTopics);
        setSequencedNavigableItems(sequenced);
        setGlossaryTerms(glossary);
        setContentSections(folderStructure);
        
        if (setAllNotesForContext) {
          setAllNotesForContext(notesAndTopics);
        }
      } catch (error) {
        console.error('Error fetching content data:', error);
        // Set empty arrays on error
        setAllNotesAndTopics([]);
        setSequencedNavigableItems([]);
        setGlossaryTerms([]);
        setContentSections([]);
        if (setAllNotesForContext) {
          setAllNotesForContext([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setAllNotesForContext]);

  return { 
    allNotesAndTopics, 
    sequencedNavigableItems, 
    glossaryTerms,
    contentSections,
    isLoading
  };
};
