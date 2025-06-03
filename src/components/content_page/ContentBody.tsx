
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '@/types/content';
import SimpleRenderer from '@/components/SimpleRenderer';
import { AppContextType } from '@/components/Layout'; // Assuming AppContextType is needed for setTocItems

interface ContentBodyProps {
  contentItem: ContentItem;
  allNotesAndTopics: ContentItem[];
  glossaryTerms: ContentItem[];
  setTocItems: AppContextType['setTocItems']; // Or more specific type if AppContextType is broad
}

const ContentBody: React.FC<ContentBodyProps> = ({ contentItem, allNotesAndTopics, glossaryTerms, setTocItems }) => {
  if (contentItem.type === 'folder') {
    const markdownContentToRender = contentItem.content; 
    
    // Only render folder as a page if it has actual content, otherwise redirect or show children
    if (!markdownContentToRender || markdownContentToRender.trim() === '') {
      if (contentItem.children && contentItem.children.length > 0) {
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
            
            <div>
              <h2 className="text-xl font-semibold mb-2 mt-6">Contents:</h2>
              <ul className="list-disc list-inside space-y-1">
                {contentItem.children.map(child => (
                  <li key={child.id}>
                    <Link to={`/content/${child.path}`} className="internal-link">
                      {child.title} ({child.type})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      } else {
        // Empty folder - don't show as a page, return null or redirect
        return null;
      }
    }
    
    // Folder has content, render it
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
        
        <SimpleRenderer 
          content={markdownContentToRender} 
          setTocItems={setTocItems} 
          allNotes={allNotesAndTopics}
          glossaryTerms={glossaryTerms}
        />
      </div>
    );
  }

  // For non-folder types
  return (
    <SimpleRenderer 
      content={contentItem.content || ''} 
      setTocItems={setTocItems}
      allNotes={allNotesAndTopics}
      glossaryTerms={glossaryTerms}
    />
  );
};

export default ContentBody;
