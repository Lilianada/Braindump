
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SimpleRenderer from '@/components/SimpleRenderer';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import { TocItem } from '@/types';
import { AppContextType } from '@/components/Layout'; // Import AppContextType
import aboutContentRaw from '@/content_files/about.md?raw';

const AboutPage = () => {
  const { setTocItems: setGlobalTocItems } = useOutletContext<AppContextType>();
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
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
        content={aboutContentRaw}
        setTocItems={setTocItems} // Pass local setter
        allNotes={allNotes}
        glossaryTerms={glossaryTerms}
      />
    </div>
  );
};

export default AboutPage;
