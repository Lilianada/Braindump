
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SimpleRenderer from '@/components/SimpleRenderer';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import { TocItem } from '@/types';
import { AppContextType } from '@/components/Layout';
import docsContentRaw from '@/pages_files/docs.md?raw'; // Updated import path

const DocsPage = () => {
  const { setTocItems: setGlobalTocItems } = useOutletContext<AppContextType>();
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);


  useEffect(() => {
    // Fetched for potential [[links]] or other interactions within the Docs page content.
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
      <SimpleRenderer
        content={docsContentRaw}
        setTocItems={setTocItems} 
        allNotes={allNotes}
        glossaryTerms={glossaryTerms}
      />
    </div>
  );
};

export default DocsPage;
