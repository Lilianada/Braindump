
import { useState, useEffect } from 'react';
import { getAllContentItems, getFlattenedNavigableTree } from '@/content/mockData';
import { ContentItem } from '@/types/content';
import { useOutletContext } from 'react-router-dom';
import { AppContextType } from '@/components/Layout';

export const useContentData = () => {
  const [allNotesAndTopics, setAllNotesAndTopics] = useState<ContentItem[]>([]);
  const [sequencedNavigableItems, setSequencedNavigableItems] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);

  const { setAllNotesForContext } = useOutletContext<AppContextType>();

  useEffect(() => {
    const allItems = getAllContentItems(true); 
    
    const notesAndTopicsItems = allItems.filter(item => 
      item.type !== 'folder'
    ).sort((a, b) => a.path.localeCompare(b.path));
    
    setAllNotesAndTopics(notesAndTopicsItems);
    if (setAllNotesForContext) setAllNotesForContext(notesAndTopicsItems); 

    const sequencedItems = getFlattenedNavigableTree(true);
    setSequencedNavigableItems(sequencedItems);

    const terms = allItems.filter(item => item.type === 'glossary_term');
    setGlossaryTerms(terms);
  }, [setAllNotesForContext]);

  return { allNotesAndTopics, sequencedNavigableItems, glossaryTerms };
};
