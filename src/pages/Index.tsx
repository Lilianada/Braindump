
import { useState, useEffect } from 'react';
import { getAllContentItems, ContentItem } from '@/components/content/mockdata';
import SimpleRenderer from '@/components/SimpleRenderer';
import { TocItem } from '@/types';
import homeContentRaw from '@/pages_files/index.md?raw';

const IndexPage = () => {
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const items = await getAllContentItems();
      setAllNotes(items);
      setGlossaryTerms(items.filter(item => item.type === 'glossary_term'));
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 animate-fade-in">
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
