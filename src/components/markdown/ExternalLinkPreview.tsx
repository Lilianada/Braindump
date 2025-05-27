
import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { fetchLinkMetadata, LinkMetadata } from '@/lib/link-metadata';
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && !metadata && !isLoading && !error) {
      setIsLoading(true);
      fetchLinkMetadata(href)
        .then(data => {
          if (isMounted) {
            if (data) {
              setMetadata(data);
            } else {
              setError("Could not load preview.");
            }
          }
        })
        .catch(() => {
          if (isMounted) {
            setError("Failed to fetch preview.");
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
  }, [isOpen, href, metadata, isLoading, error]);

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
        {error && !isLoading && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && metadata && (
          <div>
            {metadata.image && (
              <img 
                src={metadata.image} 
                alt="Preview" 
                className="max-h-20 w-auto object-contain mb-2 rounded" 
                onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
              />
            )}
            <h4 className="font-semibold mb-1 text-base truncate" title={metadata.title}>{metadata.title}</h4>
            {metadata.description && <p className="text-xs text-muted-foreground line-clamp-3">{metadata.description}</p>}
            <p className="text-xs text-muted-foreground mt-1 truncate">
              <a href={metadata.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {metadata.url}
              </a>
            </p>
          </div>
        )}
        {!isLoading && !error && !metadata && (
          <p className="text-xs text-muted-foreground">No preview available. <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">Open link</a></p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default ExternalLinkPreview;
