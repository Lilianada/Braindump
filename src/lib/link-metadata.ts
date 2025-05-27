
import { getLinkPreview } from 'link-preview-js';

export interface LinkMetadata {
  title: string;
  description?: string;
  image?: string; // Will use images[0] from link-preview-js
  favicon?: string; // Will use favicons[0] from link-preview-js
  siteName?: string;
  url: string;
  contentType?: string;
  mediaType?: string; // e.g., 'website', 'article', 'video', etc.
}

const linkMetadataCache = new Map<string, LinkMetadata>();

// Helper function to check for property existence
const hasProperty = <T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> => {
  return key in obj;
};

export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  if (linkMetadataCache.has(url)) {
    return linkMetadataCache.get(url) || null;
  }

  try {
    // Using a proxy for CORS issues, as link-preview-js might face them client-side for some sites.
    // It's generally better to run this kind of fetching server-side if possible.
    const preview = await getLinkPreview(url);

    const metadata: LinkMetadata = {
      title: (hasProperty(preview, 'title') && typeof preview.title === 'string') ? preview.title : url,
      description: (hasProperty(preview, 'description') && typeof preview.description === 'string') ? preview.description : undefined,
      image: (hasProperty(preview, 'images') && Array.isArray(preview.images) && preview.images.length > 0 && typeof preview.images[0] === 'string') ? preview.images[0] : undefined,
      favicon: (Array.isArray(preview.favicons) && preview.favicons.length > 0 && typeof preview.favicons[0] === 'string') ? preview.favicons[0] : undefined,
      siteName: (hasProperty(preview, 'siteName') && typeof preview.siteName === 'string') ? preview.siteName : undefined,
      url: (hasProperty(preview, 'url') && typeof preview.url === 'string') ? preview.url : url,
      contentType: (hasProperty(preview, 'contentType') && typeof preview.contentType === 'string') ? preview.contentType : undefined,
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
