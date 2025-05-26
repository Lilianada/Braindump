
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { TocItem } from '@/types';
import { ContentItem } from '@/content/mockData'; // Import ContentItem
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  tocItems: TocItem[];
  currentContentItem: ContentItem | null; // Add current content item
  allNotes: ContentItem[]; // Add all notes for context
}

const RightSidebar: React.FC<RightSidebarProps> = ({ tocItems, currentContentItem, allNotes }) => {
  const getIndentClass = (level: number) => {
    if (level === 2) return "pl-3";
    if (level === 3) return "pl-6";
    return "pl-0";
  };

  const backlinks = useMemo(() => {
    if (!currentContentItem || !allNotes || allNotes.length === 0) return [];
    
    const currentTitleLower = currentContentItem.title.toLowerCase();
    const currentPath = `/content/${currentContentItem.path}`;
    const foundBacklinks: ContentItem[] = [];

    allNotes.forEach(note => {
      if (note.id === currentContentItem.id) return; // Don't link to self

      if (note.content) {
        // Check for [[Title]] style links
        const titleLinkRegex = /\[\[(.*?)\]\]/g;
        let match;
        while ((match = titleLinkRegex.exec(note.content)) !== null) {
          if (match[1].toLowerCase() === currentTitleLower) {
            foundBacklinks.push(note);
            return; // Found in this note, move to next note
          }
        }
        // Check for path-based links (simplified, assumes direct path match)
        // This is a basic check; more robust path checking might be needed for complex linking
        if (note.content.includes(currentPath) || note.content.includes(currentContentItem.path)) {
             // A more robust check would be to find markdown links `[text](path)`
             // For now, simple string inclusion
            if (!foundBacklinks.find(bl => bl.id === note.id)) { // Avoid duplicates if both title and path link exist
                foundBacklinks.push(note);
            }
        }
      }
    });
    return foundBacklinks;
  }, [currentContentItem, allNotes]);

  const relatedNotes = useMemo(() => {
    if (!currentContentItem || !currentContentItem.tags || currentContentItem.tags.length === 0 || !allNotes || allNotes.length === 0) {
      return [];
    }
    
    const currentTags = new Set(currentContentItem.tags.map(tag => tag.toLowerCase()));
    const foundRelated: ContentItem[] = [];

    allNotes.forEach(note => {
      if (note.id === currentContentItem.id) return; // Don't relate to self
      if (note.tags && note.tags.some(tag => currentTags.has(tag.toLowerCase()))) {
        foundRelated.push(note);
      }
    });
    // Optional: sort related notes by number of shared tags or other criteria
    return foundRelated;
  }, [currentContentItem, allNotes]);


  return (
    <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] w-64 border-l border-border">
      <ScrollArea className="h-full px-4 py-6">
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Table of Contents</h3>
            {tocItems && tocItems.length > 0 ? (
              <ul className="space-y-1.5">
                {tocItems.map(item => (
                  <li key={item.id} className={cn(getIndentClass(item.level))}>
                    <a 
                      href={`#${item.id}`} 
                      className="text-xs text-foreground/70 hover:text-primary transition-colors custom-link"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        if (window.history.pushState) {
                            window.history.pushState(null, '', `#${item.id}`);
                        } else {
                            window.location.hash = `#${item.id}`;
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No headings found for TOC.</p>
            )}
          </div>
          
          {currentContentItem && (
            <>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Backlinks</h3>
                {backlinks.length > 0 ? (
                  <ul className="space-y-1.5">
                    {backlinks.map(item => (
                      <li key={`backlink-${item.id}`}>
                        <Link to={`/content/${item.path}`} className="text-xs text-foreground/70 hover:text-primary transition-colors custom-link">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No backlinks found.</p>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Related Notes</h3>
                {relatedNotes.length > 0 ? (
                  <ul className="space-y-1.5">
                    {relatedNotes.map(item => (
                      <li key={`related-${item.id}`}>
                        <Link to={`/content/${item.path}`} className="text-xs text-foreground/70 hover:text-primary transition-colors custom-link">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No related notes found.</p>
                )}
              </div>
            </>
          )}

        </div>
      </ScrollArea>
    </aside>
  );
};

export default RightSidebar;
