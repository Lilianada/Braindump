
import express from 'express';
import { getLinkPreview } from 'link-preview-js';

const router = express.Router();

// List of allowed domains for security
const ALLOWED_DOMAINS = [
  'github.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'instagram.com',
  'youtube.com',
  'youtu.be',
  'braindump.lilyslab.xyz',
  // Add other trusted domains here
];

// Helper function to check if a URL is from an allowed domain
function isUrlAllowed(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.replace('www.', '');
    return ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch (e) {
    return false;
  }
}

// Helper function to check for property existence
const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return key in obj;
};

router.get('/', async (req, res) => {
  const url = req.query.url as string;
  
  // Validate URL parameter
  if (!url) {
    return res.status(400).json({ 
      error: 'Missing URL parameter',
      example: '/api/link-metadata?url=https://example.com'
    });
  }

  // Validate URL format and domain
  if (!isUrlAllowed(url)) {
    return res.status(403).json({
      error: 'Domain not allowed',
      details: 'Fetching metadata from this domain is not permitted'
    });
  }

  try {
    // Set a timeout for the request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const preview = await getLinkPreview(url, {
        timeout: 4000, // 4 second timeout for the actual request
        followRedirects: 'follow',
        handleRedirects: (baseURL: string, forwardedURL: string) => {
          try {
            // Only follow redirects within the same domain
            const base = new URL(baseURL).hostname;
            const target = new URL(forwardedURL).hostname;
            return base === target || forwardedURL.includes(base);
          } catch (e) {
            return false;
          }
        },
        headers: {
          'user-agent': 'Braindump/1.0',
        }
      }) as any;

      clearTimeout(timeout);

      // Construct metadata with careful checks
      const metadata = {
        title: (hasProperty(preview, 'title') && typeof preview.title === 'string') ? preview.title : new URL(url).hostname,
        description: (hasProperty(preview, 'description') && typeof preview.description === 'string') ? preview.description : '',
        image: (hasProperty(preview, 'images') && Array.isArray(preview.images) && preview.images.length > 0 && typeof preview.images[0] === 'string') ? preview.images[0] : undefined,
        url: (hasProperty(preview, 'url') && typeof preview.url === 'string') ? preview.url : url,
        siteName: (hasProperty(preview, 'siteName') && typeof preview.siteName === 'string') ? preview.siteName : new URL(url).hostname,
        mediaType: (hasProperty(preview, 'mediaType') && typeof preview.mediaType === 'string') ? preview.mediaType : 'website',
        contentType: (hasProperty(preview, 'contentType') && typeof preview.contentType === 'string') ? preview.contentType : 'text/html',
      };

      // Cache the response for 1 day
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      return res.json(metadata);

    } catch (error) {
      clearTimeout(timeout);
      console.error(`Error fetching link preview for ${url}:`, error);
      
      // Return a basic response with just the URL if we can't fetch metadata
      return res.status(200).json({
        title: new URL(url).hostname,
        description: '',
        url: url,
        siteName: new URL(url).hostname,
        mediaType: 'website',
        contentType: 'text/html',
      });
    }
  } catch (error) {
    console.error(`Unexpected error processing ${url}:`, error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
});

export default router;
