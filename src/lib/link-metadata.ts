
export interface LinkMetadata {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  url: string;
  contentType?: string;
  mediaType?: string;
}

const linkMetadataCache = new Map<string, LinkMetadata>();

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

export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  if (linkMetadataCache.has(url)) {
    return linkMetadataCache.get(url) || null;
  }

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
    
    linkMetadataCache.set(url, metadata);
    return metadata;
  } catch (error) {
    console.warn(`Failed to process URL ${url}:`, error);
    
    const basicMetadata: LinkMetadata = {
      title: url,
      description: 'External link',
      url: url,
      siteName: 'External Site',
      mediaType: 'website',
      contentType: 'text/html',
    };
    
    linkMetadataCache.set(url, basicMetadata);
    return basicMetadata;
  }
};
