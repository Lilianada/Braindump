
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SimpleRenderer from '@/components/SimpleRenderer';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import { TocItem } from '@/types';
import { AppContextType } from '@/components/Layout'; // Import AppContextType
import docsContentRaw from '@/content_files/docs.md?raw';

const DocsPage = () => {
  const { setTocItems: setGlobalTocItems } = useOutletContext<AppContextType>();
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  // Local TOC items for this page, distinct from global TOC items from context if needed,
  // but SimpleRenderer usually updates the global one passed via props.
  // For simplicity, we'll manage local TOC and pass it to SimpleRenderer's setTocItems.
  const [tocItems, setTocItems] = useState<TocItem[]>([]);


  useEffect(() => {
    const items = getAllContentItems();
    setAllNotes(items);
    setGlossaryTerms(items.filter(item => item.type === 'glossary_term'));
  }, []);
  
  // Update global TOC when local TOC changes
  useEffect(() => {
    setGlobalTocItems(tocItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tocItems]); // setGlobalTocItems is stable

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      {/* The H1 title will come from the markdown itself */}
      <SimpleRenderer
        content={docsContentRaw}
        setTocItems={setTocItems} // Pass local setter
        allNotes={allNotes}
        glossaryTerms={glossaryTerms}
      />
    </div>
  );
};

export default DocsPage;
