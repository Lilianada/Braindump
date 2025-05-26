import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tag, Home, Info, FileText, ChevronDown, ChevronRight, Folder, File } from 'lucide-react';
import { getContentTree, ContentItem } from '@/content/mockData'; // Updated import
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const NavLink: React.FC<{ to: string; icon: React.ElementType; label: string; exact?: boolean }> = ({ to, icon: Icon, label, exact }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
        isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const iconColors = [
  'text-sky-500',    // level 0
  'text-teal-500',   // level 1
  'text-emerald-500',// level 2
  'text-lime-500',   // level 3
  'text-amber-500',  // level 4
  'text-orange-500', // level 5
  'text-red-500',    // level 6+
];

const CollapsibleNavItem: React.FC<{ item: ContentItem; level?: number }> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === `/content/${item.path}` || (item.type === 'folder' && location.pathname.startsWith(`/content/${item.path}/`));
  const hasChildren = item.children && item.children.length > 0;
  const colorClass = iconColors[Math.min(level, iconColors.length - 1)];

  if (!hasChildren) {
    return (
      <Link
        to={`/content/${item.path}`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        className={cn(
          "flex items-center space-x-2 py-2 pr-3 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full group",
          isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
        )}
      >
        {item.type === 'folder' 
            ? <Folder className={cn("h-4 w-4 shrink-0", colorClass, isActive ? "text-primary": "")} /> 
            : <File className={cn("h-4 w-4 shrink-0", colorClass, isActive ? "text-primary": "")} />}
        <span className="truncate flex-1">{item.title}</span>
      </Link>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button
          style={{ paddingLeft: `${12 + level * 16}px` }}
          className={cn(
            "flex items-center justify-between w-full space-x-2 py-2 pr-3 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors group",
            isActive && item.type === 'folder' ? "bg-accent text-accent-foreground font-medium" : "", // Style for active open folder
            location.pathname === `/content/${item.path}` ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80" // Specific style if it's the exact page
          )}
          onClick={(e) => {
            // If it's a folder, toggle open state.
            // If it's also a page (e.g. folder with an index content), Link navigation will handle it.
            // Here, we just ensure the button toggles.
            if (item.type === 'folder' && item.path && location.pathname !== `/content/${item.path}`) {
                // Allow click to navigate if it's a folder that has its own page
                // Link component below will handle navigation for item.path
                // This button is mainly for expand/collapse
            }
          }}
        >
          <Link to={`/content/${item.path}`} className="flex items-center space-x-2 truncate flex-1" onClick={(e) => e.stopPropagation()}>
            {item.type === 'folder' 
                ? <Folder className={cn("h-4 w-4 shrink-0", colorClass, isActive && item.type === 'folder' ? "text-accent-foreground": (location.pathname === `/content/${item.path}` ? "text-primary": "") )} /> 
                : <File className={cn("h-4 w-4 shrink-0", colorClass, location.pathname === `/content/${item.path}` ? "text-primary": "")} />}
            <span className="truncate flex-1 group-hover:text-accent-foreground">{item.title}</span>
          </Link>
          {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-0">
        {item.children?.map(child => (
          <CollapsibleNavItem key={child.id} item={child} level={level + 1} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};


const LeftSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const pages = [
    { to: "/", icon: Home, label: "Home", exact: true },
    { to: "/about", icon: Info, label: "About" },
    { to: "/docs", icon: FileText, label: "Docs" },
  ];

  const tags = ["React", "JavaScript", "Design", "Productivity", "AI"]; // Placeholder, can be dynamic later

  const [contentSections, setContentSections] = useState<ContentItem[]>([]);

  useEffect(() => {
    setContentSections(getContentTree(true)); // Fetch tree structure, true for forceRefresh on mount
  }, []);


  return (
    <aside className={cn(
      "fixed md:sticky top-0 left-0 h-screen pt-16 md:pt-0 md:w-72 bg-background border-r border-border flex-col z-40 md:z-30 transition-transform duration-300 ease-in-out",
      "md:flex", 
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" 
    )}>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 md:hidden" />}
      
      <div className={cn(
        "fixed top-0 left-0 h-screen pt-16 w-72 bg-background border-r border-border flex flex-col z-40 transition-transform duration-300 ease-in-out",
         isOpen ? "translate-x-0" : "-translate-x-full", "md:relative md:translate-x-0 md:pt-4"
      )}>
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-6">
            <div>
              <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Pages</h3>
              <div className="space-y-1">
                {pages.map(page => <NavLink key={page.label} {...page} />)}
              </div>
            </div>

            {contentSections.length > 0 && (
              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Content Sections</h3>
                <div className="space-y-1">
                  {contentSections.map(item => (
                    <CollapsibleNavItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-2 px-3">
                {tags.map(tag => (
                  <Button key={tag} variant="outline" size="sm" className="text-xs bg-secondary hover:bg-secondary/80">
                    <Tag className="h-3 w-3 mr-1.5" /> {tag}
                  </Button>
                ))}
              </div>
            </div>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default LeftSidebar;
