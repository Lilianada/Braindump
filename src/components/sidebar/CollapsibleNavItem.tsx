
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Folder, File as FileIcon } from 'lucide-react';
import { ContentItem } from '@/content/mockData';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const iconColors = [
  'text-yellow-400',   // level 0
  'text-emerald-500',  // level 1
  'text-sky-500',      // level 2
  'text-purple-500',   // level 3
  'text-orange-500',   // level 4
  'text-rose-500',     // level 5
  'text-teal-500',     // level 6+
];

interface CollapsibleNavItemProps {
  item: ContentItem;
  level?: number;
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === `/content/${item.path}` || (item.type === 'folder' && location.pathname.startsWith(`/content/${item.path}/`));
  const hasChildren = item.children && item.children.length > 0;
  const colorClass = iconColors[Math.min(level, iconColors.length - 1)];
  const iconMargin = "mr-1";

  if (!hasChildren) {
    return (
      <Link
        to={`/content/${item.path}`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        className={cn(
          "flex items-center py-2 pr-3 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full group",
          isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
        )}
      >
        {item.type === 'folder' 
            ? <Folder className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, isActive ? "text-primary": "")} /> 
            : <FileIcon className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, isActive ? "text-primary": "")} />}
        <span className="truncate flex-1 capitalize tex-sm">{item.title}</span>
      </Link>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button
          style={{ paddingLeft: `${12 + level * 16}px` }}
          className={cn(
            "flex items-center justify-start w-full py-2 pr-3 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors group",
            isActive && item.type === 'folder' ? "bg-accent text-accent-foreground font-medium" : "",
            location.pathname === `/content/${item.path}` ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
          )}
        >
          <Link to={`/content/${item.path}`} className="flex items-center truncate flex-1" onClick={(e) => e.stopPropagation()}>
            {item.type === 'folder' 
                ? <Folder className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, isActive && item.type === 'folder' ? "text-accent-foreground": (location.pathname === `/content/${item.path}` ? "text-primary": "") )} /> 
                : <FileIcon className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, location.pathname === `/content/${item.path}` ? "text-primary": "")} />}
            <span className="text-left ml-1 truncate flex-1 group-hover:text-accent-foreground">{item.title}</span>
          </Link>
          {hasChildren && (isOpen ? <ChevronDown className="h-3 w-3 shrink-0 ml-1" /> : <ChevronRight className="h-4 w-4 shrink-0 ml-1" />)}
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

export default CollapsibleNavItem;
