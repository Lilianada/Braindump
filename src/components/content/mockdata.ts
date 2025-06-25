
// Re-export the ContentItem type
export type { ContentItem } from '../../types/content';

// Export the new local content service
export { fetchAllContentItems as getAllContentItems } from '../../services/contentService';
