
import { useEffect, useState } from 'react';
import { LinkMetadata } from '@/lib/link-metadata'; // Re-use existing interface

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

    setLoading(true);
    setError(null);
    setMetadata(null); // Clear previous metadata

    fetch(`/api/link-metadata?url=${encodeURIComponent(url)}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          // Use fallbackMetadata from server if available, or construct a basic one
          const fallbackTitle = data?.fallbackMetadata?.title || url;
          const fallbackDescription = data?.fallbackMetadata?.description || `Failed to load preview for ${url}.`;
          setMetadata({
            title: fallbackTitle,
            description: fallbackDescription,
            url: url,
          });
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        return data as LinkMetadata;
      })
      .then(data => {
        setMetadata(data);
      })
      .catch(e => {
        console.error("Error fetching link metadata via API:", e);
        setError(e.message || 'Failed to fetch metadata.');
        // Ensure some metadata is set on error for display consistency
        if (!metadata) { // only set if not already set by server's fallback
            setMetadata({ title: url, url: url, description: "Preview not available." });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]); // Removed metadata from dependency array to avoid re-triggering on error setMetadata

  return { metadata, loading, error };
}
