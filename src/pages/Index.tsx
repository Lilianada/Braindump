
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAllContentItems, ContentItem } from '@/components/content/mockdata';
import SimpleRenderer from '@/components/SimpleRenderer';
import { TocItem } from '@/types';
import { AppContextType } from '@/components/Layout';
import homeContentRaw from '@/pages_files/index.md?raw';

const IndexPage = () => {
  const { setTocItems: setGlobalTocItems, setActiveTocItemId } = useOutletContext<AppContextType>();
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
  
  // Update global TOC when local TOC changes
  useEffect(() => {
    setGlobalTocItems(tocItems);
    // Reset active TOC item when TOC changes
    if (tocItems.length > 0) {
      setActiveTocItemId(null);
    }
  }, [tocItems, setGlobalTocItems, setActiveTocItemId]);

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
