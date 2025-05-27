import { getLinkPreview, Preview } from 'link-preview-js';

export interface LinkMetadata {
  title: string;
  description?: string;
  image?: string; // Will use images[0] from link-preview-js
  favicon?: string; // Will use favicons[0] from link-preview-js
  siteName?: string;
  url: string;
  contentType?: string;
}

const linkMetadataCache = new Map<string, LinkMetadata>();

// Preloaded metadata for common external links
const preloadedMetadata: Record<string, LinkMetadata> = {
  'https://x.com/lilian_ada_': {
    title: 'Twitter / X',
    description: 'Lilian Ada on Twitter',
    url: 'https://x.com/lilian_ada_',
    siteName: 'X',
    favicon: 'https://abs.twimg.com/favicons/twitter.3.ico' // Example, actual might differ
  },
  'https://instagram.com/defitcreative': {
    title: 'Instagram',
    description: 'Defit Creative on Instagram',
    url: 'https://instagram.com/defitcreative',
    siteName: 'Instagram',
    favicon: 'https://www.instagram.com/static/images/ico/favicon.ico/36b3ee2d91ed.ico' // Example
  },
  'https://www.linkedin.com/in/lilianada': {
    title: 'LinkedIn',
    description: 'Lilian Ada on LinkedIn',
    url: 'https://www.linkedin.com/in/lilianada',
    siteName: 'LinkedIn',
    favicon: 'https://static.licdn.com/sc/h/akt4ae504epesldzj74ls4n83' // Example
  },
  'https://www.github.com/lilianada': {
    title: 'GitHub',
    description: 'Lilian Ada on GitHub',
    url: 'https://www.github.com/lilianada',
    siteName: 'GitHub',
    favicon: 'https://github.githubassets.com/favicons/favicon.svg' // Example
  },
  'https://braindump.lilyslab.xyz/rss.xml': {
    title: 'RSS Feed',
    description: 'Braindump RSS Feed',
    url: 'https://braindump.lilyslab.xyz/rss.xml',
    siteName: 'Lily\'s Lab Braindump'
  }
};

export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  if (linkMetadataCache.has(url)) {
    return linkMetadataCache.get(url) || null;
  }

  if (url in preloadedMetadata) {
    const metadata = preloadedMetadata[url];
    linkMetadataCache.set(url, metadata);
    return metadata;
  }

  try {
    // Using a proxy for CORS issues, as link-preview-js might face them client-side for some sites.
    // It's generally better to run this kind of fetching server-side if possible.
    // For client-side, a CORS proxy can help. Let's assume one is available or not needed for some URLs.
    // If no proxy, direct fetch: const preview = await getLinkPreview(url);
    // Using a simple public CORS proxy for demonstration. Replace with a more robust solution if needed.
    const proxyUrl = `https://cors-anywhere.herokuapp.com/`; // A common public proxy, might be rate-limited or unreliable.
                                                          // For a real app, host your own or use a service.
                                                          // Or, if link-preview-js handles this internally or it's not an issue, remove proxy.
                                                          // For now, let's try direct fetching first, as proxies can be problematic.
    
    const preview = await getLinkPreview(url) as Preview; // Type assertion corrected to use Preview

    const metadata: LinkMetadata = {
      title: preview.title || url,
      description: preview.description,
      image: preview.images && preview.images.length > 0 ? preview.images[0] : undefined,
      favicon: preview.favicons && preview.favicons.length > 0 ? preview.favicons[0] : undefined,
      siteName: preview.siteName,
      url: preview.url || url,
      contentType: preview.contentType as string | undefined, // Ensure contentType is string or undefined
    };
    linkMetadataCache.set(url, metadata);
    return metadata;
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error);
    // Fallback to basic metadata if API call fails
    const basicMetadata: LinkMetadata = {
      title: url, // Use URL as title if fetching fails
      description: 'External link',
      url: url
    };
    linkMetadataCache.set(url, basicMetadata); // Cache fallback to avoid re-fetching failing links
    return basicMetadata;
  }
};
