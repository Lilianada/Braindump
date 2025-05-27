
import express from 'express';
import { getLinkPreview, ILinkPreviewResponse } from 'link-preview-js';

const router = express.Router();

// Helper function to check for property existence (similar to the one in src/lib/link-metadata.ts)
// This helps ensure type safety when accessing properties from the getLinkPreview response.
const hasProperty = <T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> => {
  return key in obj;
};

router.get('/', async (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // Cast to any to handle the library's flexible response types before our checks
    const preview = await getLinkPreview(url) as any; 

    // Construct metadata with careful checks
    const metadata = {
      title: (hasProperty(preview, 'title') && typeof preview.title === 'string') ? preview.title : url,
      description: (hasProperty(preview, 'description') && typeof preview.description === 'string') ? preview.description : undefined,
      image: (hasProperty(preview, 'images') && Array.isArray(preview.images) && preview.images.length > 0 && typeof preview.images[0] === 'string') ? preview.images[0] : undefined,
      favicon: (hasProperty(preview, 'favicons') && Array.isArray(preview.favicons) && preview.favicons.length > 0 && typeof preview.favicons[0] === 'string') ? preview.favicons[0] : undefined,
      siteName: (hasProperty(preview, 'siteName') && typeof preview.siteName === 'string') ? preview.siteName : undefined,
      url: (hasProperty(preview, 'url') && typeof preview.url === 'string') ? preview.url : url,
      contentType: (hasProperty(preview, 'contentType') && typeof preview.contentType === 'string') ? preview.contentType : undefined,
    };
    res.json(metadata);
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url} on server:`, error);
    // Send a structured error response
    res.status(500).json({ 
      error: 'Failed to fetch metadata', 
      details: error instanceof Error ? error.message : 'Unknown error',
      fallbackMetadata: { // Provide basic fallback metadata
        title: url,
        description: 'Could not load preview.',
        url: url,
      }
    });
  }
});

export default router;
