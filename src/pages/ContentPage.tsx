
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import { findContentByPath, getAllContentItems, ContentItem } from '@/content/mockData'; // mockContentData removed from imports
import { AlertCircle, FileText } from 'lucide-react';
import SimpleRenderer from '@/components/SimpleRenderer';
import { TocItem } from '@/types';

const ContentPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(undefined); // Initialize to undefined for loading state
  const { setTocItems } = useOutletContext<{ setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>> }>();

  const [allNotesAndTopics, setAllNotesAndTopics] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Fetch all content items once to be used for linking and glossary
    const allItems = getAllContentItems(true); // true for forceRefresh, remove mockContentData argument
    
    const notesAndTopics = allItems.filter(item => 
      item.type === 'note' || 
      item.type === 'topic' || 
      item.type === 'log' || 
      item.type === 'dictionary_entry'
    );
    setAllNotesAndTopics(notesAndTopics);

    const terms = allItems.filter(item => item.type === 'glossary_term');
    setGlossaryTerms(terms);

    const path = params['*'];
    if (path) {
      // console.log(`ContentPage: Attempting to find content for path: ${path}`);
      const item = findContentByPath(path);
      // console.log(`ContentPage: Found item for path ${path}:`, item);
      setContentItem(item); // This can be undefined if not found, or null explicitly if logic changes
      if (!item || !item.content) { // If item is found but has no content (e.g. folder page not yet handled this way)
        setTocItems([]);
      }
    } else {
      setContentItem(null); // No path, so no content
      setTocItems([]);
    }
  }, [params, location.pathname, setTocItems]); // location.pathname ensures re-fetch on path change

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

  // Handling for 'folder' type pages
  if (contentItem.type === 'folder') {
     React.useEffect(() => { // Effect to clear TOC for folder pages
        setTocItems([]);
     }, [setTocItems, contentItem.path]); // Depend on contentItem.path to re-run if folder changes

     return (
      <div className="container mx-auto py-8 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{contentItem.title}</h1>
          <p className="text-sm text-muted-foreground">
            Type: {contentItem.type} | Path: /content/{contentItem.path}
          </p>
        </header>
        <p className="text-muted-foreground mb-4">This is a category or folder. Select an item from its children in the sidebar, or this folder might have its own content below.</p>
        
        {/* Render content if folder itself has content (e.g. an _index.md equivalent) */}
        {contentItem.content ? (
           <SimpleRenderer 
            content={contentItem.content} 
            setTocItems={setTocItems} // TOC will be for the folder's own content
            allNotes={allNotesAndTopics}
            glossaryTerms={glossaryTerms}
          />
        ) : (
          // Display children if no direct content for the folder
          contentItem.children && contentItem.children.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 mt-6">Contents:</h2>
              <ul className="list-disc list-inside space-y-1">
                {contentItem.children.map(child => (
                  <li key={child.id}>
                    <Link to={`/content/${child.path}`} className="custom-link">
                      {child.title} ({child.type})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
        {/* If no content AND no children, show a specific message */}
        {!contentItem.content && (!contentItem.children || contentItem.children.length === 0) && (
            <p className="text-muted-foreground">This folder is currently empty or has no overview content.</p>
        )}
      </div>
    );
  }

  // Default rendering for notes, topics, etc.
  return (
    <article className="container mx-auto py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">{contentItem.title}</h1>
        <p className="text-sm text-muted-foreground">
          Type: {contentItem.type} | Path: /content/{contentItem.path}
          {contentItem.created && ` | Created: ${contentItem.created}`}
          {contentItem.lastUpdated && ` | Updated: ${contentItem.lastUpdated}`}
        </p>
        {contentItem.frontmatter?.source && ( // Example of showing other frontmatter
             <p className="text-xs text-muted-foreground">Source: {contentItem.frontmatter.source}</p>
        )}
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
          allNotes={allNotesAndTopics} // Changed prop name
          glossaryTerms={glossaryTerms}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mb-4" />
          <p>No content available for this item yet.</p>
          <p className="text-sm">This might be a note that is pending content.</p>
        </div>
      )}
    </article>
  );
};

export default ContentPage;
