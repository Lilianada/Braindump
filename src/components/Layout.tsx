
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TocItem } from '@/types';
import { ContentItem } from '@/content/mockData';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ListOrdered } from 'lucide-react'; // Icon for TOC

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
  const [isTocPopoverOpen, setIsTocPopoverOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const getIndentClass = (level: number) => {
    if (level === 2) return "pl-3";
    if (level === 3) return "pl-6";
    return "pl-0";
  };
  
  const handleTocItemClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, itemId: string) => {
    e.preventDefault();
    document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth' });
    if (window.history.pushState) {
        window.history.pushState(null, '', `#${itemId}`);
    } else {
        window.location.hash = `#${itemId}`;
    }
    setIsTocPopoverOpen(false); // Close popover on item click
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

      {/* Floating TOC Button for mobile/tablet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Popover open={isTocPopoverOpen} onOpenChange={setIsTocPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-lg">
              <ListOrdered className="h-5 w-5" />
              <span className="sr-only">Table of Contents</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 mb-2 p-0" side="top" align="end">
            <ScrollArea className="max-h-72">
              <div className="p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Table of Contents</h3>
                {tocItems && tocItems.length > 0 ? (
                  <ul className="space-y-1.5">
                    {tocItems.map(item => (
                      <li key={`popover-toc-${item.id}`} className={cn(getIndentClass(item.level))}>
                        <a 
                          href={`#${item.id}`} 
                          className="text-xs text-foreground/70 hover:text-primary transition-colors custom-link"
                          onClick={(e) => handleTocItemClick(e, item.id)}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No headings found.</p>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Layout;
