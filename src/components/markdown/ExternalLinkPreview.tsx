
import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { fetchLinkMetadata, LinkMetadata } from '@/lib/link-metadata';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fetch metadata when component mounts
  useEffect(() => {
    let isMounted = true;
    
    if (!metadata) {
      setIsLoading(true);
      fetchLinkMetadata(href)
        .then(data => {
          if (isMounted && data) {
            setMetadata(data);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }
    
    return () => {
      isMounted = false;
    };
  }, [href, metadata]);

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
                alt="Preview" 
                className="max-h-20 w-auto object-contain mb-2 rounded" 
                onError={(e) => (e.currentTarget.style.display = 'none')} 
              />
            )}
            <h4 className="font-semibold mb-1 text-base truncate" title={metadata.title}>{metadata.title}</h4>
            {metadata.description && <p className="text-xs text-muted-foreground line-clamp-3">{metadata.description}</p>}
            <p className="text-xs text-muted-foreground mt-1 truncate">
              <a href={metadata.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                <span className="truncate">{metadata.url}</span>
                <ExternalLink className="h-3 w-3 ml-1 inline shrink-0" />
              </a>
            </p>
          </div>
        )}
        {!isLoading && !metadata && (
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground mb-2">External link to</p>
            <div className="flex items-center justify-between">
              <span className="truncate text-sm">{href}</span>
              <ExternalLink className="h-3 w-3 ml-1 shrink-0" />
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ExternalLinkPreview;
