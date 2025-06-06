
import React from 'react';
import { ContentItem } from '@/content/mockData';
import CollapsibleNavItem from './CollapsibleNavItem';

interface ContentNavigationProps {
  contentSections: ContentItem[];
  onItemClick?: (item: ContentItem) => void;
}

const ContentNavigation: React.FC<ContentNavigationProps> = ({ contentSections, onItemClick }) => {
  if (contentSections.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="px-3 mb-2 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Content Sections</h3>
      <div className="space-y-0.5 overflow-hidden">
        {contentSections.map(item => (
          <CollapsibleNavItem key={item.id} item={item} onItemClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};

export default ContentNavigation;
