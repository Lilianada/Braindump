
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { useLinkMetadata } from '@/hooks/useLinkMetadata'; // Import the new hook
import { cn } from '@/lib/utils';
// LinkMetadata interface can be removed if useLinkMetadata provides it or if not directly used here

interface ExternalLinkPreviewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const ExternalLinkPreview: React.FC<ExternalLinkPreviewProps> = ({ href, children, className, target, rel }) => {
  // Note: isOpen state for HoverCard is managed internally by default if not controlled
  // const [isOpen, setIsOpen] = useState(false); // Can be removed if not strictly needed for control
  
  const { metadata, loading: isLoading, error } // Use the hook
    = useLinkMetadata(href);

  // Default content for when metadata is not fully loaded or available
  const displayTitle = metadata?.title || href;
  const displayUrl = metadata?.url || href;
  const displayDescription = metadata?.description;
  const displayImage = metadata?.image;
  const displayFavicon = metadata?.favicon;
  const displaySiteName = metadata?.siteName;

  // Use a span as the root element to avoid invalid DOM nesting
  return (
    <span className="inline-block">
      <HoverCard /* open={isOpen} onOpenChange={setIsOpen} */ >
        <HoverCardTrigger asChild>
          <a
            href={href}
            target={target}
            rel={rel}
            className={cn("inline-flex items-center gap-1 hover:underline underline-offset-2", className)}
            onClick={(e) => {
              if (!href || href.startsWith('#')) {
                e.preventDefault();
              }
            }}
          >
            {children}
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border text-sm">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-16 w-full mt-2" />
            </div>
          )}
          {!isLoading && error && (
            <div className="flex flex-col space-y-1">
              <p className="font-semibold mb-1 text-sm uppercase text-destructive">Preview Error</p>
              <p className="text-xs text-muted-foreground line-clamp-3">{error}</p>
              <p className="text-xs text-muted-foreground mt-2 truncate">
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                  <ExternalLinkIcon className="h-3 w-3 mr-1.5 shrink-0" />
                  <span className="truncate">{href}</span>
                </a>
              </p>
            </div>
          )}
          {!isLoading && !error && metadata && (
            <div>
              {displayImage && (
                <img 
                  src={displayImage} 
                  alt={displayTitle}
                  className="max-h-32 w-full object-cover mb-2 rounded" 
                  onError={(e) => (e.currentTarget.style.display = 'none')} 
                />
              )}
              <p className="flex justify-between font-semibold mb-1 text-sm uppercase">
                External Link
                <ExternalLinkIcon className="h-3 w-3 ml-1 inline shrink-0" />
              </p>
              <h4 className="font-medium text-foreground mb-0.5 truncate">{displayTitle}</h4>
              {displaySiteName && <p className="text-xs text-muted-foreground mb-1">{displaySiteName}</p>}
              {displayDescription && <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{displayDescription}</p>}
              <p className="text-xs text-muted-foreground mt-2 truncate">
                <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                  {displayFavicon && <img src={displayFavicon} alt="" className="h-3 w-3 mr-1.5"/>}
                  <span className="truncate">{displayUrl}</span>
                </a>
              </p>
            </div>
          )}
          {!isLoading && !error && !metadata && (
            <div className="flex flex-col space-y-1">
              <p className="text-xs text-muted-foreground">Loading preview for:</p>
              <div className="flex items-center">
                <span className="truncate text-sm font-medium">{href}</span>
                <a href={href} target="_blank" rel="noopener noreferrer" className="ml-1.5">
                  <ExternalLinkIcon className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground" />
                </a>
              </div>
            </div>
          )}
        </HoverCardContent>
      </HoverCard>
    </span>
  );
};

export default ExternalLinkPreview;
