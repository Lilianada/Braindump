
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '@/types/content';
import { Link2, Tag as TagIcon } from 'lucide-react';

interface RelatedContentProps {
  backlinks: ContentItem[];
  relatedNotes: ContentItem[];
}

const RelatedContent: React.FC<RelatedContentProps> = ({ backlinks, relatedNotes }) => {
  if (backlinks.length === 0 && relatedNotes.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden mt-12 space-y-8 border-t pt-8"> {/* This class implies it's for mobile, consider if this should be always visible or configurable */}
      {backlinks.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-medium flex items-center">
            <Link2 className="h-4 w-4 mr-2" />
            Backlinks
          </h3>
          <ul className="space-y-1.5">
            {backlinks.map(item => (
              <li key={`mobile-backlink-${item.id}`}>
                <Link to={`/content/${item.path}`} className="text-sm custom-link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedNotes.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-medium flex items-center">
            <TagIcon className="h-4 w-4 mr-2" />
            Related Notes
          </h3>
          <ul className="space-y-1.5">
            {relatedNotes.map(item => (
              <li key={`mobile-related-${item.id}`}>
                <Link to={`/content/${item.path}`} className="text-xs custom-link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
       {(backlinks.length === 0 && relatedNotes.length > 0) && (
         <p className="text-sm text-muted-foreground">No backlinks found.</p>
       )}
       {(relatedNotes.length === 0 && backlinks.length > 0) && (
         <p className="text-sm text-muted-foreground">No related notes found.</p>
       )}
    </div>
  );
};

export default RelatedContent;
