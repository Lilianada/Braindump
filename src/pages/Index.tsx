
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import SimpleRenderer from '@/components/SimpleRenderer';
import { TocItem } from '@/types';
import homeContentRaw from '@/content_files/index.md?raw'; // Updated import path

const IndexPage = () => {
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const items = getAllContentItems();
    setAllNotes(items);
    setGlossaryTerms(items.filter(item => item.type === 'glossary_term'));
  }, []);

  return (
    <div className="container mx-auto py-12 md:py-20 flex justify-center min-h-[calc(100vh-10rem)] animate-fade-in">
      <div className="max-w-3xl w-full flex flex-col items-start text-left">
        {/* Title removed as it's likely in the markdown now, or can be added there as H1 */}
        
        <SimpleRenderer 
          content={homeContentRaw} 
          setTocItems={setTocItems} 
          allNotes={allNotes} 
          glossaryTerms={glossaryTerms} 
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/content/zettels">
              Start Exploring Notes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
            <Link to="/about">
              Learn More About Braindump
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
