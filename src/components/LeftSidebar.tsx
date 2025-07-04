
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentItem } from '@/types/content';
import { cn } from '@/lib/utils';
import { getNormalizedTags } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContentData } from '@/hooks/useContentData';
import PageLinks from './sidebar/PageLinks';
import ContentNavigation from './sidebar/ContentNavigation';
import VisualizationLinks from './sidebar/VisualizationLinks';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onClose }) => {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const { contentSections, allNotesAndTopics } = useContentData();

  useEffect(() => {
    // Extract unique tags from content data
    const tagsSet = new Set<string>();
    allNotesAndTopics.forEach(item => {
      const normalizedItemTags = getNormalizedTags(item.tags); 
      normalizedItemTags.forEach(tag => {
        if (tag) tagsSet.add(tag);
      });
    });
    const sortedTags = Array.from(tagsSet).sort();
    setUniqueTags(sortedTags);

    if (allNotesAndTopics.length > 0 && tagsSet.size === 0) {
      console.warn("LeftSidebar: No tags found in content items. Ensure tags are defined correctly.");
    } 
  }, [allNotesAndTopics]);

  const handleTagClick = (tag: string) => {
    navigate(`/tags/${encodeURIComponent(tag)}`);
    if (onClose && isOpen) {
        onClose();
    }
  };

  const handleItemClick = (item: ContentItem) => {
    // Only close sidebar on mobile when clicking on files (not folders)
    if (onClose && isOpen && item.type !== 'folder') {
      onClose();
    }
  };
  
  useEffect(() => {
    if (isOpen && onClose) {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      const handleClose = () => {
        if (typeof onClose === 'function') {
          onClose();
        }
      };
      
      history.pushState = function (...args) {
        handleClose();
        return originalPushState.apply(this, args);
      };
      history.replaceState = function (...args) {
        return originalReplaceState.apply(this, args);
      };

      window.addEventListener('popstate', handleClose);

      return () => {
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        window.removeEventListener('popstate', handleClose);
      };
    }
  }, [isOpen, onClose, navigate]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClose) {
              onClose();
            }
          }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          aria-hidden="true" 
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-4rem)] md:top-16 pt-16 md:pt-0 w-64 sm:w-72 bg-background border-r border-border flex-col z-40 md:z-30 transition-transform duration-700 ease-in-out",
        "md:flex md:flex-col", 
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" 
      )}>
        <div className="h-full w-full overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-3 sm:px-4 py-3 sm:py-4">
              <nav className="space-y-4 sm:space-y-6">
                <PageLinks onItemClick={() => onClose?.()} />
                <ContentNavigation contentSections={contentSections} onItemClick={handleItemClick} />
                <VisualizationLinks onItemClick={() => onClose?.()} />
              </nav>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;
