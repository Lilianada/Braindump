
import { useEffect, useState } from 'react';
import { LinkMetadata } from '@/lib/link-metadata'; // Re-use existing interface

export function useLinkMetadata(url: string | undefined) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(false); // Initialize loading to false
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
        if (response.ok) {
          // Successful response (2xx)
          try {
            const data = await response.json();
            setMetadata(data as LinkMetadata);
          } catch (jsonError: any) {
            console.error("Failed to parse JSON from successful response:", jsonError);
            setError('Received invalid data from server. ' + jsonError.message);
            setMetadata({ title: url, url: url, description: "Preview data is malformed." });
          }
        } else {
          // Error response (4xx, 5xx)
          const contentType = response.headers.get("content-type");
          let errorData;
          let errorMessage = `Failed to fetch preview (HTTP ${response.status})`;
          let serverErrorDetails = '';

          if (contentType && contentType.includes("application/json")) {
            try {
              errorData = await response.json();
              serverErrorDetails = errorData.details || (errorData.error ? JSON.stringify(errorData.error) : '');
              errorMessage = errorData.error || errorMessage; // Use server's error message if available
              if (errorData.fallbackMetadata) {
                setMetadata(errorData.fallbackMetadata as LinkMetadata);
              } else {
                setMetadata({ title: url, url: url, description: `Could not load preview: ${errorMessage}` });
              }
            } catch (jsonParseError: any) {
              console.error("Failed to parse JSON from error response:", jsonParseError);
              serverErrorDetails = "Could not parse error message from server. " + jsonParseError.message;
              setMetadata({ title: url, url: url, description: "Preview error message is malformed." });
            }
          } else {
            // Non-JSON error response (e.g. HTML error page)
            try {
                const textError = await response.text();
                console.error(`Server returned non-JSON error response (status ${response.status}):`, textError.substring(0, 500)); // Log part of the HTML
                serverErrorDetails = `Expected JSON, got ${contentType || 'unknown content type'}.`;
            } catch (textErrorErr: any) {
                console.error("Failed to read text from non-JSON error response:", textErrorErr)
                serverErrorDetails = `Expected JSON, got ${contentType || 'unknown content type'}. Also failed to read response body.`;
            }
            setMetadata({ title: url, url: url, description: "Server returned an unexpected error format." });
          }
          const finalErrorMessage = `${errorMessage}${serverErrorDetails ? `. Details: ${serverErrorDetails}` : ''}`;
          console.error("Error message from API:", finalErrorMessage);
          setError(finalErrorMessage);
        }
      })
      .catch((networkOrOtherError: any) => { // Catch fetch failures (network error) or errors thrown in .then()
        console.error("Network or client-side error fetching link metadata:", networkOrOtherError);
        setError(networkOrOtherError.message || 'Failed to fetch metadata due to a network or client-side issue.');
        // Ensure metadata is set if not already by error handlers above.
        // Check metadata state before setting to avoid potential infinite loops if setError causes re-render.
        if (!metadata) { 
            setMetadata({ title: url, url: url, description: "Preview not available." });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]); // Removed metadata from dependency array as it's managed internally

  return { metadata, loading, error };
}

