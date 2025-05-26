import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContentTree, getAllContentItems, ContentItem } from '@/content/mockData';
import { cn } from '@/lib/utils';
import { getNormalizedTags } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import PageLinks from './sidebar/PageLinks';
import ContentNavigation from './sidebar/ContentNavigation';
import TagList from './sidebar/TagList';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onClose }) => {
  const [contentSections, setContentSections] = useState<ContentItem[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rawContentTree = getContentTree(true); // Get all items including non-folder types at root
    const rootContentPathsToExclude = ['index.md', 'about.md', 'docs.md']; 
    
    // Filter out specific root files (like about.md, docs.md, index.md) from appearing as content sections
    // if they are not explicitly part of a folder structure.
    // This logic ensures that top-level markdown files configured as pages (Home, About, Docs)
    // do not also appear in the "Content Sections" if they are not in a subfolder.
    const filteredContentTree = rawContentTree.filter(item => {
      // If it's a folder, always include it.
      if (item.type === 'folder') return true;
      // If it's not a folder (e.g., a note, topic), and it's a root file, exclude if it's one of the special page files.
      if (!item.path.includes('/')) { // Root file
        return !rootContentPathsToExclude.includes(item.path);
      }
      // Otherwise (not a folder, and not a root file, OR a root file not in exclude list), include it.
      return true;
    });
    setContentSections(filteredContentTree);
    
    const allItems = getAllContentItems();
    const tagsSet = new Set<string>();
    allItems.forEach(item => {
      const normalizedItemTags = getNormalizedTags(item.tags);
      normalizedItemTags.forEach(tag => {
        if (tag) tagsSet.add(tag);
      });
    });
    setUniqueTags(Array.from(tagsSet).sort());

    if (allItems.length > 0 && tagsSet.size === 0) {
      console.warn("LeftSidebar: No tags found in any content items. Ensure tags are defined in your markdown frontmatter (e.g., --- tags: [tag1, tag2] --- or --- tags: tag1, tag2 ---).");
    } else if (tagsSet.size > 0) {
        console.log("LeftSidebar: Tags found:", Array.from(tagsSet).sort());
    }
  }, []);

  const handleTagClick = (tag: string) => {
    navigate(`/tags/${encodeURIComponent(tag)}`);
    if (onClose && isOpen) { // Close sidebar on mobile after navigation
        onClose();
    }
  };
  
  // This effect handles closing the mobile sidebar when navigating via its links
  // It relies on `isOpen` and `onClose` being passed correctly for mobile behavior
  useEffect(() => {
    if (isOpen && onClose) {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      const handleClose = () => {
        onClose();
      };

      // Close sidebar on navigation
      history.pushState = function (...args) {
        handleClose();
        return originalPushState.apply(this, args);
      };
      history.replaceState = function (...args) {
        // For replaceState, we might not always want to close,
        // but for direct link clicks it's usually desired.
        // handleClose(); 
        return originalReplaceState.apply(this, args);
      };

      // Add event listener for popstate (back/forward browser buttons)
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
      "fixed md:sticky top-0 left-0 h-screen pt-16 md:pt-0 md:w-72 bg-background border-r border-border flex-col z-40 md:z-30 transition-transform duration-300 ease-in-out",
      "md:flex", 
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" 
    )}>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 md:hidden" aria-hidden="true" />}
      
      <div className={cn(
        "fixed top-0 left-0 h-screen pt-16 w-72 bg-background border-r border-border flex flex-col z-40 transition-transform duration-300 ease-in-out",
         isOpen ? "translate-x-0" : "-translate-x-full", "md:relative md:translate-x-0 md:pt-4"
      )}>
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-6">
            <PageLinks />
            <ContentNavigation contentSections={contentSections} />
            <TagList tags={uniqueTags} onTagClick={handleTagClick} />
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default LeftSidebar;
