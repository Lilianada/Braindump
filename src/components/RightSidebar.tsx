
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { TocItem } from '@/types'; // Import TocItem
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  tocItems: TocItem[]; // Accept tocItems as a prop
}

const RightSidebar: React.FC<RightSidebarProps> = ({ tocItems }) => {
  // Placeholder content for backlinks
  const backlinks = ["Related Note A", "Mention in Daily Log 001"];

  const getIndentClass = (level: number) => {
    if (level === 2) return "pl-3";
    if (level === 3) return "pl-6";
    return "pl-0";
  };

  return (
    <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] w-64 border-l border-border">
      <ScrollArea className="h-full px-4 py-6">
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Table of Contents</h3>
            {tocItems && tocItems.length > 0 ? (
              <ul className="space-y-1.5">
                {tocItems.map(item => (
                  <li key={item.id} className={cn(getIndentClass(item.level))}>
                    <a 
                      href={`#${item.id}`} 
                      className="text-xs text-foreground/70 hover:text-primary transition-colors custom-link"
                      // Smooth scroll behavior can be added here with JS if needed, or CSS scroll-behavior
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        // Update URL hash without page reload for better UX
                        if (window.history.pushState) {
                            window.history.pushState(null, '', `#${item.id}`);
                        } else {
                            window.location.hash = `#${item.id}`;
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No headings found for TOC.</p>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Backlinks</h3>
            <ul className="space-y-1.5">
              {backlinks.map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-foreground/70 hover:text-primary transition-colors custom-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default RightSidebar;
