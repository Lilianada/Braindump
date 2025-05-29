
import { useEffect, useState } from 'react';
import { LinkMetadata } from '@/lib/link-metadata';

function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    // Extract path segments for better titles
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
    
    if (pathSegments.length > 0) {
      // Use the last meaningful path segment as title
      const lastSegment = pathSegments[pathSegments.length - 1];
      const cleanSegment = lastSegment.replace(/[-_]/g, ' ').replace(/\.(html|php|asp|jsp)$/i, '');
      if (cleanSegment.length > 0) {
        return `${cleanSegment} | ${hostname}`;
      }
    }
    
    return hostname;
  } catch (error) {
    return url;
  }
}

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

    const generateMetadata = () => {
      setLoading(true);
      setError(null);
      
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        
        const metadata: LinkMetadata = {
          title: extractTitleFromUrl(url),
          description: `External link to ${hostname}`,
          url: url,
          siteName: hostname,
          mediaType: 'website',
          contentType: 'text/html',
        };
        
        setMetadata(metadata);
      } catch (err) {
        console.error('Error processing URL:', err);
        setError('Invalid URL');
        
        // Set fallback metadata
        const fallbackMetadata: LinkMetadata = {
          title: url,
          description: 'External link',
          url: url,
          siteName: 'External Site',
          mediaType: 'website',
          contentType: 'text/html',
        };
        setMetadata(fallbackMetadata);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to simulate loading state briefly
    setTimeout(generateMetadata, 100);
  }, [url]);
  
  return { metadata, loading, error };
}
