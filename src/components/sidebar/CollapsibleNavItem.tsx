
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Folder, File as FileIcon } from 'lucide-react';
import { ContentItem } from '@/types/content';
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
  isLast?: boolean;
  parentIsLast?: boolean[];
  onItemClick?: (item: ContentItem) => void;
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({
  item,
  level = 0,
  isLast = false,
  parentIsLast = [],
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive =
    location.pathname === `/content/${item.path}` ||
    (item.type === 'folder' && location.pathname.startsWith(`/content/${item.path}/`));
  const hasChildren = item.children && item.children.length > 0;
  const colorClass = iconColors[Math.min(level, iconColors.length - 1)];
  const iconMargin = "mr-1";

  // Check if folder has content - only show as clickable link if it has content
  const folderHasContent = item.type === 'folder' && item.content && item.content.trim() !== '';
  const shouldShowAsLink = item.type !== 'folder' || folderHasContent;

  const handleLinkClick = (e: React.MouseEvent) => {
    if (item.type !== 'folder' && onItemClick) {
      onItemClick(item);
    }
  };

  // Helper to render lines for all parent levels + this level
  const renderLines = () => (
    <div className="absolute left-0 top-0 h-full" style={{ width: `${16 * level}px`, pointerEvents: 'none', zIndex: 0 }}>
      {parentIsLast.map((wasLast, idx) => (
        <svg
          key={idx}
          width="16"
          height="100%"
          style={{ position: 'absolute', left: `${idx * 16}px`, top: 0 }}
        >
          {!wasLast && (
            <line
              x1={8}
              y1={0}
              x2={8}
              y2="100%"
              stroke="#444"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
        </svg>
      ))}
      {level > 0 && (
        <svg
          width="16"
          height="24"
          style={{ position: 'absolute', left: `${(level - 1) * 16}px`, top: 0 }}
        >
          <line
            x1={8}
            y1={0}
            x2={8}
            y2={12}
            stroke="#444"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <line
            x1={8}
            y1={12}
            x2={16}
            y2={12}
            stroke="#444"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          {!isLast && (
            <line
              x1={8}
              y1={12}
              x2={8}
              y2={24}
              stroke="#444"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
        </svg>
      )}
    </div>
  );

  if (!hasChildren) {
    return (
      <div className="relative flex w-full overflow-hidden">
        {renderLines()}
        {shouldShowAsLink ? (
          <Link
            to={`/content/${item.path}`}
            onClick={handleLinkClick}
            style={{ paddingLeft: `${12 + level * 16}px`, position: "relative", zIndex: 1 }}
            className={cn(
              "flex items-center py-2 pr-3 rounded-md text-xs hover:bg-accent hover:text-accent-foreground transition-colors w-full group min-w-0",
              isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
            )}
          >
            {item.type === 'folder'
              ? <Folder className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, isActive ? "text-primary" : "")} />
              : <FileIcon className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, isActive ? "text-primary" : "")} />}
            <span className="truncate flex-1 capitalize text-xs min-w-0">{item.title}</span>
          </Link>
        ) : (
          <div
            style={{ paddingLeft: `${12 + level * 16}px`, position: "relative", zIndex: 1 }}
            className={cn(
              "flex items-center py-2 pr-3 rounded-md text-xs w-full group cursor-default min-w-0",
              "text-foreground/60"
            )}
          >
            <Folder className={cn("h-3 w-3 shrink-0", iconMargin, colorClass)} />
            <span className="truncate flex-1 capitalize text-xs min-w-0">{item.title}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {renderLines()}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <button
            style={{ paddingLeft: `${12 + level * 16}px`, position: "relative", zIndex: 1 }}
            className={cn(
              "flex items-center justify-start w-full py-2 pr-3 rounded-md text-xs hover:bg-accent hover:text-accent-foreground transition-colors group min-w-0",
              location.pathname === `/content/${item.path}` ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
            )}
          >
            {shouldShowAsLink ? (
              <Link
                to={`/content/${item.path}`}
                className="flex items-center truncate flex-1 min-w-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLinkClick(e);
                }}
              >
                <Folder className={cn("h-3 w-3 shrink-0", iconMargin, colorClass, isActive && item.type === 'folder' ? "text-accent-foreground" : (location.pathname === `/content/${item.path}` ? "text-primary" : ""))} />
                <span className="text-left ml-1 truncate flex-1 group-hover:text-accent-foreground min-w-0">{item.title}</span>
              </Link>
            ) : (
              <div className="flex items-center truncate flex-1 min-w-0">
                <Folder className={cn("h-3 w-3 shrink-0", iconMargin, colorClass)} />
                <span className="text-left ml-1 truncate flex-1 text-foreground/60 min-w-0">{item.title}</span>
              </div>
            )}
            {hasChildren && (isOpen ? <ChevronDown className="h-4 w-4 shrink-0 ml-1" /> : <ChevronRight className="h-4 w-4 shrink-0 ml-1" />)}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-0">
          {item.children?.map((child, idx) => (
            <CollapsibleNavItem
              key={child.id}
              item={child}
              level={level + 1}
              isLast={idx === item.children.length - 1}
              parentIsLast={[...parentIsLast, isLast]}
              onItemClick={onItemClick}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleNavItem;
