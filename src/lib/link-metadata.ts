
export interface LinkMetadata {
  title: string;
  description?: string;
  image?: string;
  url: string;
}

const linkMetadataCache = new Map<string, LinkMetadata>();

// Preloaded metadata for common external links
// This will be available immediately without API calls
const preloadedMetadata: Record<string, LinkMetadata> = {
  'https://x.com/lilian_ada_': {
    title: 'Twitter / X',
    description: 'Lilian Ada on Twitter',
    url: 'https://x.com/lilian_ada_'
  },
  'https://instagram.com/defitcreative': {
    title: 'Instagram',
    description: 'Defit Creative on Instagram',
    url: 'https://instagram.com/defitcreative'
  },
  'https://www.linkedin.com/in/lilianada': {
    title: 'LinkedIn',
    description: 'Lilian Ada on LinkedIn',
    url: 'https://www.linkedin.com/in/lilianada'
  },
  'https://www.github.com/lilianada': {
    title: 'GitHub',
    description: 'Lilian Ada on GitHub',
    url: 'https://www.github.com/lilianada'
  },
  'https://braindump.lilyslab.xyz/rss.xml': {
    title: 'RSS Feed',
    description: 'Braindump RSS Feed',
    url: 'https://braindump.lilyslab.xyz/rss.xml'
  }
};

export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata | null> => {
  // First check our cache
  if (linkMetadataCache.has(url)) {
    return linkMetadataCache.get(url) || null;
  }
  
  // Then check preloaded data
  if (url in preloadedMetadata) {
    const metadata = preloadedMetadata[url];
    linkMetadataCache.set(url, metadata);
    return metadata;
  }

  // If no preloaded data, return basic metadata without API call
  // This avoids API failures and ensures immediate display
  const basicMetadata: LinkMetadata = {
    title: url,
    description: 'External link',
    url: url
  };
  
  linkMetadataCache.set(url, basicMetadata);
  return basicMetadata;

  // Note: We've removed the API call to linkpreview.net since it was failing with 403 errors
  // and we're now using preloaded data + fallbacks instead
};
