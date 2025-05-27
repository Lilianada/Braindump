
export interface LinkMetadata {
  title: string;
  description?: string;
  image?: string; // API calls it image, could be a favicon or preview image
  url: string;
}

const linkMetadataCache = new Map<string, LinkMetadata>();
const API_BASE_URL = 'https://api.linkpreview.net/'; // Using ?q=URL format

export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  if (linkMetadataCache.has(url)) {
    return linkMetadataCache.get(url) || null;
  }

  try {
    // The free tier of linkpreview.net works by passing the URL in the 'q' parameter without an API key.
    // For higher rate limits or production use, an API key would be needed (?key=YOUR_KEY&q=URL).
    const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      console.error(`Error fetching link metadata for ${url}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data && data.title) { // Basic check for valid data
      const metadata: LinkMetadata = {
        title: data.title,
        description: data.description,
        image: data.image,
        url: data.url || url, // Fallback to original url if API doesn't return one
      };
      linkMetadataCache.set(url, metadata);
      return metadata;
    }
    return null;
  } catch (error) {
    console.error(`Exception fetching link metadata for ${url}:`, error);
    return null;
  }
};
