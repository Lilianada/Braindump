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
import { ListOrdered, PanelLeft } from 'lucide-react'; // Added PanelLeft for consistency

export interface AppContextType {
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
  setCurrentContentItem: React.Dispatch<React.SetStateAction<ContentItem | null>>;
  setAllNotesForContext: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  activeTocItemId: string | null; // New
  setActiveTocItemId: React.Dispatch<React.SetStateAction<string | null>>; // New
}

const Layout: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [currentContentItem, setCurrentContentItem] = useState<ContentItem | null>(null);
  const [allNotesForContext, setAllNotesForContext] = useState<ContentItem[]>([]);
  const [isTocPopoverOpen, setIsTocPopoverOpen] = useState(false);
  const [activeTocItemId, setActiveTocItemId] = useState<string | null>(null); // New state for active TOC item

  const popoverScrollAreaRef = useRef<HTMLDivElement>(null); // Ref for popover scroll area
  const activePopoverTocItemRef = useRef<HTMLLIElement>(null); // Ref for the active item in popover

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const getIndentClass = (level: number) => {
    if (level === 2) return "pl-5"; // Increased indent
    if (level === 3) return "pl-8"; // Increased indent
    return "pl-2"; // Base indent for h1
  };
  
  const handleTocItemClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, itemId: string) => {
    e.preventDefault();
    document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth' });
    if (window.history.pushState) {
        window.history.pushState(null, '', `#${itemId}`);
    } else {
        window.location.hash = `#${itemId}`;
    }
    setActiveTocItemId(itemId); // Set active on click
    setIsTocPopoverOpen(false); 
  };

  // Auto-scroll for popover TOC
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
      <div className="flex flex-1 pt-16 overflow-hidden"> {/* Ensure this flex container also handles overflow if necessary */}
        <LeftSidebar isOpen={isLeftSidebarOpen} onClose={() => setIsLeftSidebarOpen(false)} />
        <main className="flex-1 flex max-w-full overflow-x-hidden">
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)] scrollbar-hide"> {/* Added scrollbar-hide */}
            <div className={cn("container mx-auto px-4 md:px-6 lg:px-8 py-8 w-full max-w-4xl")}>
               <Outlet context={{ setTocItems, setCurrentContentItem, setAllNotesForContext, activeTocItemId, setActiveTocItemId } satisfies AppContextType} />
            </div>
          </ScrollArea>
          <RightSidebar 
            tocItems={tocItems} 
            currentContentItem={currentContentItem}
            allNotes={allNotesForContext}
            activeTocItemId={activeTocItemId} // Pass activeTocItemId
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
              <span className="sr-only">On This Page</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 mb-2 p-0" side="top" align="end">
            <ScrollArea ref={popoverScrollAreaRef} className="max-h-72 scrollbar-hide"> {/* Added scrollbar-hide */}
              <div className="p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center">
                  <PanelLeft className="h-4 w-4 mr-2" /> On this page
                </h3>
                {tocItems && tocItems.length > 0 ? (
                  <ul className="space-y-0.5"> {/* Reduced space-y */}
                    {tocItems.map(item => {
                      const isActive = item.id === activeTocItemId;
                      return (
                        <li 
                          key={`popover-toc-${item.id}`} 
                          ref={isActive ? activePopoverTocItemRef : null}
                          className={cn(
                            getIndentClass(item.level),
                            "relative py-1" // Added py-1 for spacing
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"></span>
                          )}
                          <a 
                            href={`#${item.id}`} 
                            className={cn(
                              "text-xs transition-colors custom-link block w-full",
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
