
import { useEffect, useState } from 'react';
import { LinkMetadata } from '@/lib/link-metadata';

export function useLinkMetadata(url: string | undefined) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setMetadata(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/link-metadata?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch metadata');
        }
        
        const data = await response.json();
        const metadata: LinkMetadata = {
          title: data.title || new URL(url).hostname,
          description: data.description || '',
          url: data.url || url,
          image: data.image,
          siteName: data.siteName || new URL(url).hostname,
          mediaType: data.mediaType || 'website',
          contentType: data.contentType || 'text/html',
        };
        setMetadata(metadata);
      } catch (err) {
        console.error('Error fetching link metadata:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
        
        // Set fallback metadata
        const fallbackMetadata: LinkMetadata = {
          title: new URL(url).hostname,
          description: '',
          url: url,
          siteName: new URL(url).hostname,
          mediaType: 'website',
          contentType: 'text/html',
        };
        setMetadata(fallbackMetadata);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);
  
  return { metadata, loading, error };
}

