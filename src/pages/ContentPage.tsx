
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { findContentByPath, ContentItem } from '@/content/mockData';
import { AlertCircle, FileText } from 'lucide-react';

// A very basic Markdown-like renderer for demonstration
const SimpleRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\\n');
  return (
    <div className="prose dark:prose-invert max-w-none text-foreground space-y-3">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mt-5 mb-3 border-b pb-1">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-6 mb-4 border-b pb-2">{line.substring(2)}</h1>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index}><strong>{line.substring(2, line.length -2)}</strong></p>
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
};


const ContentPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(null); // undefined for loading, null for not found

  useEffect(() => {
    const path = params['*'];
    if (path) {
      const item = findContentByPath(path);
      setContentItem(item);
    } else {
      setContentItem(null); // No path provided
    }
  }, [params, location]);

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
                  <a href={`/content/${child.path}`} className="text-primary hover:underline">
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
        <SimpleRenderer content={contentItem.content} />
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
