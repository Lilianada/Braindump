
import React, { useState, useEffect, useRef } from 'react';
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
import { AlignLeft } from 'lucide-react';

export interface AppContextType {
  tocItems: TocItem[];
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
  setCurrentContentItem: React.Dispatch<React.SetStateAction<ContentItem | null>>;
  setAllNotesForContext: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  activeTocItemId: string | null;
  setActiveTocItemId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Layout: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [currentContentItem, setCurrentContentItem] = useState<ContentItem | null>(null);
  const [allNotesForContext, setAllNotesForContext] = useState<ContentItem[]>([]);
  const [isTocPopoverOpen, setIsTocPopoverOpen] = useState(false);
  const [activeTocItemId, setActiveTocItemId] = useState<string | null>(null);

  const popoverScrollAreaRef = useRef<HTMLDivElement>(null);
  const activePopoverTocItemRef = useRef<HTMLLIElement>(null);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const getIndentClass = (level: number) => {
    if (level === 2) return "pl-4 sm:pl-5";
    if (level === 3) return "pl-6 sm:pl-8";
    return "pl-2";
  };
  
  const handleTocItemClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, itemId: string) => {
    e.preventDefault();
    document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth' });
    if (window.history.pushState) {
        window.history.pushState(null, '', `#${itemId}`);
    } else {
        window.location.hash = `#${itemId}`;
    }
    setActiveTocItemId(itemId);
    setIsTocPopoverOpen(false); 
  };

  useEffect(() => {
    if (isTocPopoverOpen && activeTocItemId && activePopoverTocItemRef.current) {
      activePopoverTocItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeTocItemId, isTocPopoverOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground max-h-screen overflow-hidden">
      <Navbar onToggleSidebar={toggleLeftSidebar} />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <LeftSidebar isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} />
        <main className="flex-1 flex max-w-full overflow-x-hidden">
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)] scrollbar-hide overflow-y-auto">
            <div className={cn("container p-4 sm:p-6 lg:p-0 max-w-full sm:max-w-2xl mx-auto text-justify w-full")}>
               <Outlet context={{ tocItems, setTocItems, setCurrentContentItem, setAllNotesForContext, activeTocItemId, setActiveTocItemId } satisfies AppContextType} />
            </div>
          </ScrollArea>
          <RightSidebar 
            tocItems={tocItems} 
            currentContentItem={currentContentItem}
            allNotes={allNotesForContext}
            activeTocItemId={activeTocItemId}
          />
        </main>
      </div>
      <Toaster />

      {/* Floating TOC Button for mobile/tablet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Popover open={isTocPopoverOpen} onOpenChange={setIsTocPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-lg h-10 w-10 sm:h-12 sm:w-12">
              <AlignLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">On This Page</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 sm:w-64 mb-2 p-0" side="top" align="end">
            <ScrollArea ref={popoverScrollAreaRef} className="max-h-64 sm:max-h-72 scrollbar-hide">
              <div className="p-3 sm:p-4">
                <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center">
                  <AlignLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> On this page
                </h3>
                {tocItems && tocItems.length > 0 ? (
                  <ul className="space-y-0.5">
                    {tocItems.map(item => {
                      const isActive = item.id === activeTocItemId;
                      return (
                        <li 
                          key={`popover-toc-${item.id}`} 
                          ref={isActive ? activePopoverTocItemRef : null}
                          className={cn(
                            getIndentClass(item.level),
                            "relative py-1"
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"></span>
                          )}
                          <a 
                            href={`#${item.id}`} 
                            className={cn(
                              "text-xs sm:text-sm transition-colors internal-link block w-full truncate",
                              isActive ? "text-primary font-medium" : "text-foreground/70 hover:text-primary"
                            )}
                            onClick={(e) => handleTocItemClick(e, item.id)}
                          >
                            {item.text}
                          </a>
                        </li>
                      );
                    })}
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
