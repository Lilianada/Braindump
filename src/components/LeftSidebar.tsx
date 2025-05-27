
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContentTree, getAllContentItems, ContentItem } from '@/content/mockData';
import { cn } from '@/lib/utils';
import { getNormalizedTags } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import PageLinks from './sidebar/PageLinks';
import ContentNavigation from './sidebar/ContentNavigation';
import VisualizationLinks from './sidebar/VisualizationLinks'; // Import VisualizationLinks

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onClose }) => {
  const [contentSections, setContentSections] = useState<ContentItem[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rawContentTree = getContentTree(true);
    const rootContentPathsToExclude: string[] = []; 
    
    const filteredContentTree = rawContentTree.filter(item => {
      if (item.type === 'folder') return true;
      if (!item.path.includes('/')) { 
        return !rootContentPathsToExclude.includes(item.path);
      }
      return true;
    });
    setContentSections(filteredContentTree);
    
    const allItems = getAllContentItems(true);
    const tagsSet = new Set<string>();
    allItems.forEach(item => {
      const normalizedItemTags = getNormalizedTags(item.tags); 
      normalizedItemTags.forEach(tag => {
        if (tag) tagsSet.add(tag);
      });
    });
    const sortedTags = Array.from(tagsSet).sort();
    setUniqueTags(sortedTags);

    if (allItems.length > 0 && tagsSet.size === 0) {
      console.warn("LeftSidebar: No tags found in any content items from 'content_files'. Ensure tags are defined and correctly parsed.");
    } 
  }, []);

  const handleTagClick = (tag: string) => {
    navigate(`/tags/${encodeURIComponent(tag)}`);
    if (onClose && isOpen) {
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
      // Close sidebar on navigation
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

  return (
    <aside className={cn(
      "fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-4rem)] md:top-16 pt-16 md:pt-0 w-72 bg-background border-r border-border flex-col z-40 md:z-30 transition-transform duration-300 ease-in-out",
      "md:flex md:flex-col", 
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" 
    )}>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 md:hidden" aria-hidden="true" />}
      
      <div className={cn(
        "fixed top-0 left-0 h-[calc(100vh-4rem)] md:h-full w-72 bg-background border-r border-border flex flex-col z-40 transition-transform duration-300 ease-in-out overflow-y-auto", // Changed this from ScrollArea wrapper to simple div with overflow-y-auto for direct control
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0 md:pt-0"
      )}>
        <ScrollArea className="h-full w-full"> {/* ScrollArea now wraps the content div */}
          <div className="px-4 py-4">
            <nav className="space-y-6">
              <PageLinks />
              <ContentNavigation contentSections={contentSections} />
              <VisualizationLinks /> {/* Add VisualizationLinks */}
              {/* <TagList tags={uniqueTags} onTagClick={handleTagClick} /> */}
              {/* <Separator />
               <div className="text-xs uppercase font-geist-sans font-semibold text-primary p-4">
               Lily's Garden
               </div> */}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default LeftSidebar;
