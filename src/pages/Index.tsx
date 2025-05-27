
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import SimpleRenderer from '@/components/SimpleRenderer';
import { TocItem } from '@/types';
import homeContentRaw from '@/pages_files/index.md?raw'; // Updated import path

const IndexPage = () => {
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // These are still fetched for potential [[links]] or other interactions within the Home page content.
    // If Home page content never links to items from content_files, this could be omitted.
    const items = getAllContentItems(); 
    setAllNotes(items);
    setGlossaryTerms(items.filter(item => item.type === 'glossary_term'));
  }, []);

  return (
    <div className="container mx-auto px-0 py-8 animate-fade-in">
        <SimpleRenderer 
          content={homeContentRaw} 
          setTocItems={setTocItems} 
          allNotes={allNotes} 
          glossaryTerms={glossaryTerms} 
        />
    </div>
  );
};

export default IndexPage;
