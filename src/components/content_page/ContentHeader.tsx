
import React from 'react';
import { ContentItem } from '@/types/content'; // Assuming ContentItem is in src/types/content.ts
import { FileText, CalendarDays, Info, Tag as TagIcon, Folder, Sprout, TreePalm } from 'lucide-react';

interface ContentHeaderProps {
  contentItem: ContentItem;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ contentItem }) => {
  const categoryTag = contentItem.tags?.find(tag => tag.toLowerCase().startsWith('category:'));
  const category = categoryTag ? categoryTag.substring('category:'.length).trim() : null;

  return (
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
            <span>Type: {contentItem.type}</span>
          </div>
        {contentItem.created && (
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            <span>Planted: {new Date(contentItem.created).toLocaleDateString()}</span>
          </div>
        )}
        {contentItem.lastUpdated && (
          <div className="flex items-center gap-2">
            <TreePalm className="h-4 w-4" />
            <span>Last Tended: {new Date(contentItem.lastUpdated).toLocaleDateString()}</span>
          </div>
        )}
        {category && (
           <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span>Category: {category}</span>
          </div>
        )}
        {/* {contentItem.frontmatter && Object.entries(contentItem.frontmatter)
          .filter(([key]) => !['id', 'title', 'path', 'type', 'tags', 'created', 'lastUpdated', 'author', 'source', 'slug', 'content', 'category'].includes(key.toLowerCase()))
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
        } */}
      </div>

      {contentItem.tags && contentItem.tags.filter(tag => !tag.toLowerCase().startsWith('category:')).length > 0 && (
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
  );
};

export default ContentHeader;
