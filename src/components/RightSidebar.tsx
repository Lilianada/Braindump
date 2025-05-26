
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const RightSidebar: React.FC = () => {
  // Placeholder content
  const tocItems = ["Introduction", "Section 1", "Subsection 1.1", "Section 2", "Conclusion"];
  const backlinks = ["Related Note A", "Mention in Daily Log 001"];

  return (
    <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] w-64 border-l border-border">
      <ScrollArea className="h-full px-4 py-6">
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Table of Contents</h3>
            <ul className="space-y-1.5">
              {tocItems.map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground tracking-wider">Backlinks</h3>
            <ul className="space-y-1.5">
              {backlinks.map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
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
