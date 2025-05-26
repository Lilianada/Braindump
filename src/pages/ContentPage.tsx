import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import { findContentByPath, getAllContentItems, ContentItem } from '@/content/mockData';
import { AlertCircle, FileText } from 'lucide-react';
import SimpleRenderer from '@/components/SimpleRenderer';
import { TocItem } from '@/types';

const ContentPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(null);
  const { setTocItems } = useOutletContext<{ setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>> }>();

  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Fetch all content items once to be used for linking and glossary
    // In a real app, this might come from a context or a global store
    const allItems = getAllContentItems();
    
    const notes = allItems.filter(item => 
      item.type === 'note' || 
      item.type === 'topic' || 
      item.type === 'log' || 
      item.type === 'dictionary_entry'
    );
    setAllNotes(notes);

    const terms = allItems.filter(item => item.type === 'glossary_term');
    setGlossaryTerms(terms);

    const path = params['*'];
    if (path) {
      const item = findContentByPath(path);
      setContentItem(item);
      if (!item || !item.content) {
        setTocItems([]);
      }
    } else {
      setContentItem(null);
      setTocItems([]);
    }
  }, [params, location, setTocItems]);

  if (contentItem === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  if (!contentItem) {
    return (
      <div className="container mx-auto py-8 text-center animate-fade-in">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Content Not Found</h1>
        <p className="text-muted-foreground">
          The page or note you were looking for ({params['*']}) could not be found.
        </p>
        <p className="mt-4">
          Please check the URL or navigate using the sidebar.
        </p>
      </div>
    );
  }

  if (contentItem.type === 'folder') {
     React.useEffect(() => {
        setTocItems([]);
     }, [setTocItems]);

     return (
      <div className="container mx-auto py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-primary">{contentItem.title}</h1>
        <p className="text-muted-foreground mb-4">This is a category or folder. Select an item from its children in the sidebar.</p>
        {contentItem.children && contentItem.children.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Contents:</h2>
            <ul className="list-disc list-inside space-y-1">
              {contentItem.children.map(child => (
                <li key={child.id}>
                  <a href={`/content/${child.path}`} className="custom-link">
                    {child.title} ({child.type})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <article className="container mx-auto py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">{contentItem.title}</h1>
        <p className="text-sm text-muted-foreground">
          Type: {contentItem.type} | Path: /content/{contentItem.path}
        </p>
        {contentItem.tags && contentItem.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {contentItem.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </header>
      
      {contentItem.content ? (
        <SimpleRenderer 
          content={contentItem.content} 
          setTocItems={setTocItems}
          allNotes={allNotes}
          glossaryTerms={glossaryTerms}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mb-4" />
          <p>No content available for this item yet.</p>
          <p className="text-sm">This might be a category or a note that is pending content.</p>
        </div>
      )}
    </article>
  );
};

export default ContentPage;
