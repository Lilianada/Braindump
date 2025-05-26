
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TocItem } from '@/types';
import { ContentItem } from '@/content/mockData'; // Added ContentItem

// Define context type here or import from types/index.ts
export interface AppContextType {
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
  setCurrentContentItem: React.Dispatch<React.SetStateAction<ContentItem | null>>;
  setAllNotesForContext: React.Dispatch<React.SetStateAction<ContentItem[]>>;
}

const Layout: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [currentContentItem, setCurrentContentItem] = useState<ContentItem | null>(null);
  const [allNotesForContext, setAllNotesForContext] = useState<ContentItem[]>([]);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar onToggleSidebar={toggleLeftSidebar} />
      <div className="flex flex-1 pt-16">
        <LeftSidebar isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} />
        <main className="flex-1 flex max-w-full overflow-x-hidden">
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
            <div className={cn("container mx-auto px-4 md:px-6 lg:px-8 py-8 w-full max-w-4xl")}>
               <Outlet context={{ setTocItems, setCurrentContentItem, setAllNotesForContext } satisfies AppContextType} />
            </div>
          </ScrollArea>
          <RightSidebar 
            tocItems={tocItems} 
            currentContentItem={currentContentItem}
            allNotes={allNotesForContext}
          />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
