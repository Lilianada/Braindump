import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useOutletContext, Link, useNavigate } from 'react-router-dom';
import { findContentByPath, getAllContentItems, ContentItem, getFlattenedNavigableTree } from '@/content/mockData';
import { AlertCircle, FileText, Info, Tag as TagIcon, CalendarDays, ArrowLeft, ArrowRight, Link2, Folder } from 'lucide-react';
import SimpleRenderer from '@/components/SimpleRenderer';
import { AppContextType } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import LoadingGrid from '@/components/LoadingGrid';

const NAVIGABLE_PAGE_TYPES: ContentItem['type'][] = [
  'note', 'topic', 'log', 'dictionary_entry', 'zettel', 
  'glossary_term', 'book', 'language', 'concept'
];

const ContentPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(undefined);
  
  const { tocItems, setTocItems, setCurrentContentItem, setAllNotesForContext, setActiveTocItemId } = useOutletContext<AppContextType>();

  const [allNotesAndTopics, setAllNotesAndTopics] = useState<ContentItem[]>([]);
  const [sequencedNavigableItems, setSequencedNavigableItems] = useState<ContentItem[]>([]); // New state for ordered navigation
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);

  useEffect(() => {
    const allItems = getAllContentItems(true); // Force refresh to get latest
    
    // For backlinks, related notes, context - include ALL content types
    const notesAndTopicsItems = allItems.filter(item => 
      item.type !== 'folder' // Include everything except folders
    ).sort((a, b) => a.path.localeCompare(b.path)); // Consistent order for these lists
    
    setAllNotesAndTopics(notesAndTopicsItems);
    setAllNotesForContext(notesAndTopicsItems); 

    // For sequential prev/next navigation - use flattened tree with ALL content types
    const sequencedItems = getFlattenedNavigableTree(true);
    setSequencedNavigableItems(sequencedItems);

    const terms = allItems.filter(item => item.type === 'glossary_term');
    setGlossaryTerms(terms);

    const path = params['*'];
    if (path) {
      const item = findContentByPath(path);
      setContentItem(item);
      setCurrentContentItem(item); 
      setTocItems([]); 
      setActiveTocItemId(null);

      if (item) {
        // ... keep existing code
      } else {
        setTocItems([]);
      }
    } else {
      setContentItem(null); 
      setCurrentContentItem(null);
      setTocItems([]);
      setActiveTocItemId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, location.pathname, setCurrentContentItem, setAllNotesForContext, setTocItems, setActiveTocItemId]);

  useEffect(() => {
    if (!contentItem || contentItem.type === 'folder' || !setActiveTocItemId) {
      return;
    }

    const timer = setTimeout(() => {
      const headingElements = Array.from(document.querySelectorAll('[id]'))
        .filter(el => el.tagName.match(/^H[1-3]$/) && el.id);
      
      if (headingElements.length === 0) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          let bestVisibleEntry: IntersectionObserverEntry | null = null;

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!bestVisibleEntry || entry.boundingClientRect.top < bestVisibleEntry.boundingClientRect.top) {
                if (entry.boundingClientRect.top >=0) {
                     bestVisibleEntry = entry;
                }
              }
            }
          });
          
          if (bestVisibleEntry) {
            setActiveTocItemId(bestVisibleEntry.target.id);
          }
        },
        {
          rootMargin: '-15% 0px -70% 0px', 
          threshold: 0.1, 
        }
      );

      headingElements.forEach((el) => observer.observe(el));

      return () => {
        headingElements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }, 100); 

    return () => clearTimeout(timer);
  }, [contentItem, setActiveTocItemId, tocItems]);

  const backlinks = useMemo(() => {
    if (!contentItem || !allNotesAndTopics || allNotesAndTopics.length === 0) return [];
    // ... keep existing code (backlinks calculation logic using allNotesAndTopics)
    const currentTitleLower = contentItem.title.toLowerCase();
    const currentPath = `/content/${contentItem.path}`;
    const foundBacklinks: ContentItem[] = [];

    allNotesAndTopics.forEach(note => {
      if (note.id === contentItem.id) return; 

      if (note.content) {
        const titleLinkRegex = /\[\[(.*?)\]\]/g;
        let match;
        while ((match = titleLinkRegex.exec(note.content)) !== null) {
          if (match[1].toLowerCase() === currentTitleLower) {
            if (!foundBacklinks.find(bl => bl.id === note.id)) foundBacklinks.push(note);
            return; 
          }
        }
        if (note.content.includes(currentPath) || note.content.includes(contentItem.path)) {
            if (!foundBacklinks.find(bl => bl.id === note.id)) {
                foundBacklinks.push(note);
            }
        }
      }
    });
    return foundBacklinks;
  }, [contentItem, allNotesAndTopics]);

  const relatedNotes = useMemo(() => {
    if (!contentItem || !contentItem.tags || contentItem.tags.length === 0 || !allNotesAndTopics || allNotesAndTopics.length === 0) {
      return [];
    }
    // ... keep existing code (relatedNotes calculation logic using allNotesAndTopics)
    const currentTags = new Set(contentItem.tags.map(tag => tag.toLowerCase()));
    const foundRelated: ContentItem[] = [];

    allNotesAndTopics.forEach(note => {
      if (note.id === contentItem.id) return; 
      if (note.tags && note.tags.some(tag => currentTags.has(tag.toLowerCase()))) {
        if (!foundRelated.find(rl => rl.id === note.id)) foundRelated.push(note);
      }
    });
    return foundRelated;
  }, [contentItem, allNotesAndTopics]);

  const { prevItem, nextItem } = useMemo(() => {
    // Use sequencedNavigableItems for prev/next logic
    if (!contentItem || sequencedNavigableItems.length === 0 || contentItem.type === 'folder') {
      return { prevItem: null, nextItem: null };
    }
    const currentIndex = sequencedNavigableItems.findIndex(item => item.id === contentItem.id);
    if (currentIndex === -1) {
      // Fallback if current item not in sequenced list (should not happen for navigable types)
      // This might happen if a 'folder' type page is somehow accessed directly and has prev/next
      // Or if a non-navigable type page is accessed.
      console.warn("Current item not found in sequenced navigable items for prev/next calculation:", contentItem.title, contentItem.type);
      return { prevItem: null, nextItem: null };
    }
    const prev = currentIndex > 0 ? sequencedNavigableItems[currentIndex - 1] : null;
    const next = currentIndex < sequencedNavigableItems.length - 1 ? sequencedNavigableItems[currentIndex + 1] : null;
    return { prevItem: prev, nextItem: next };
  }, [contentItem, sequencedNavigableItems]); // Changed dependency to sequencedNavigableItems

  if (contentItem === undefined) {
    return (
      <LoadingGrid />
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
  
  const markdownContentToRender = contentItem.type === 'folder' ? contentItem.content : null;

  const categoryTag = contentItem.tags?.find(tag => tag.toLowerCase().startsWith('category:'));
  const category = categoryTag ? categoryTag.substring('category:'.length).trim() : null;


  if (contentItem.type === 'folder') {
    return (
      <div className="container mx-auto py-4 animate-fade-in">
        <header className="mb-8 flex items-center gap-3">
          <div>
            <h1 className="capitalize text-2xl font-semibold">{contentItem.title}</h1>
            <p className="text-sm text-muted-foreground">
              Path: /content/{contentItem.path}
            </p>
          </div>
        </header>
        
        {markdownContentToRender && markdownContentToRender.trim() !== '' ? (
          <SimpleRenderer 
            content={markdownContentToRender} 
            setTocItems={setTocItems} 
            allNotes={allNotesAndTopics} // SimpleRenderer still uses allNotesAndTopics for its [[link]] resolution
            glossaryTerms={glossaryTerms}
          />
        ) : (
          contentItem.children && contentItem.children.length > 0 ? (
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
          ) : (
             <p className="text-muted-foreground">This folder is currently empty or has no overview content.</p>
          )
        )}
      </div>
    );
  }

  return (
    <article className="container mx-auto py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold capitalize mb-2">{contentItem.title}</h1>
        
        <div className="mt-3 mb-1 text-xs text-muted-foreground space-y-1.5">
          {contentItem.frontmatter?.type && contentItem.type !== contentItem.frontmatter.type && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Type (File): {contentItem.frontmatter.type}</span>
            </div>
          )}
           <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Type (System): {contentItem.type}</span>
            </div>
          {contentItem.created && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Created: {new Date(contentItem.created).toLocaleDateString()}</span>
            </div>
          )}
          {contentItem.lastUpdated && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Last Updated: {new Date(contentItem.lastUpdated).toLocaleDateString()}</span>
            </div>
          )}
          {category && (
             <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>Category: {category}</span>
            </div>
          )}
          {contentItem.frontmatter && Object.entries(contentItem.frontmatter)
            .filter(([key]) => !['id', 'title', 'path', 'type', 'tags', 'created', 'lastUpdated', 'author', 'source', 'slug', 'content'].includes(key.toLowerCase()))
            .map(([key, value]) => {
              if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) return null;
              const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
              return (
                <div key={key} className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}: {displayValue}</span>
                </div>
              );
            })
          }
        </div>

        {contentItem.tags && contentItem.tags.length > 0 && (
          <div className="mb-6 flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <TagIcon className="h-4 w-4" />
              <span>Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contentItem.tags.filter(tag => !tag.toLowerCase().startsWith('category:')).map(tag => (
                <span key={tag} className="text-xs text-muted-foreground font-medium">#{tag}</span>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <SimpleRenderer 
        content={contentItem.content || ''} 
        setTocItems={setTocItems}
        allNotes={allNotesAndTopics} // SimpleRenderer uses allNotesAndTopics for [[link]] resolution
        glossaryTerms={glossaryTerms}
      />

      <div className="lg:hidden mt-12 space-y-8 border-t pt-8">
        {contentItem && (
          <>
            <div>
              <h3 className="mb-3 text-base font-medium flex items-center">
                <Link2 className="h-4 w-4 mr-2" />
                Backlinks
              </h3>
              {backlinks.length > 0 ? (
                <ul className="space-y-1.5">
                  {backlinks.map(item => (
                    <li key={`mobile-backlink-${item.id}`}>
                      <Link to={`/content/${item.path}`} className="text-sm custom-link">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No backlinks found.</p>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-base font-medium flex items-center">
                <TagIcon className="h-4 w-4 mr-2" />
                Related Notes
              </h3>
              {relatedNotes.length > 0 ? (
                <ul className="space-y-1.5">
                  {relatedNotes.map(item => (
                    <li key={`mobile-related-${item.id}`}>
                      <Link to={`/content/${item.path}`} className="text-xs custom-link">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No related notes found.</p>
              )}
            </div>
          </>
        )}
      </div>

      {(prevItem || nextItem) && (
        <div className="mt-12 pt-8 flex justify-between items-center">
          {prevItem ? (
            <Button variant="outline" asChild>
              <Link to={`/content/${prevItem.path}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {prevItem.title}
              </Link>
            </Button>
          ) : <div />}
          {nextItem ? (
            <Button variant="outline" asChild>
              <Link to={`/content/${nextItem.path}`}>
                {nextItem.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : <div />}
        </div>
      )}
    </article>
  );
};

export default ContentPage;
