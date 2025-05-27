
import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { fetchLinkMetadata, LinkMetadata } from '@/lib/link-metadata';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink as ExternalLinkIcon } from "lucide-react"; // Renamed to avoid conflict

interface ExternalLinkPreviewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const ExternalLinkPreview: React.FC<ExternalLinkPreviewProps> = ({ href, children, className, target, rel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading true

  useEffect(() => {
    let isMounted = true;
    
    // Removed metadata check from condition to always fetch if not already fetched,
    // allowing for preloaded data to be potentially updated by a fetch if logic changes.
    // For now, fetchLinkMetadata handles caching internally.
    setIsLoading(true);
    fetchLinkMetadata(href)
      .then(data => {
        if (isMounted && data) {
          setMetadata(data);
        }
      })
      .catch(error => {
        if (isMounted) {
          // Ensure fallback metadata is set in case of error within fetchLinkMetadata not returning basic
          console.error("Error fetching metadata in component:", error);
          setMetadata({ title: href, url: href, description: "External link" });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, [href]); // Removed metadata from dependency array as fetchLinkMetadata handles caching

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <a href={href} className={className} target={target} rel={rel}>
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border text-sm">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        )}
        {!isLoading && metadata && (
          <div>
            {metadata.image && (
              <img 
                src={metadata.image} 
                alt={metadata.title || 'Preview'}
                className="max-h-32 w-full object-cover mb-2 rounded" 
                onError={(e) => (e.currentTarget.style.display = 'none')} 
              />
            )}
          
            {metadata.siteName && <p className="text-xs text-muted-foreground mb-1">{metadata.siteName}</p>}
            {metadata.description && <p className="text-xs text-muted-foreground line-clamp-3">{metadata.description}</p>}
            <p className="text-xs text-muted-foreground mt-2 truncate">
              <a href={metadata.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                {metadata.favicon && <img src={metadata.favicon} alt="" className="h-3 w-3 mr-1.5"/>}
                <span className="truncate">{metadata.url}</span>
                <ExternalLinkIcon className="h-3 w-3 ml-1 inline shrink-0" />
              </a>
            </p>
          </div>
        )}
        {!isLoading && !metadata && ( // This case should ideally be handled by fetchLinkMetadata returning basic fallback
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">External link to:</p>
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
  );
};

export default ExternalLinkPreview;

