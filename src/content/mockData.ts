
// Re-export the ContentItem type
export type { ContentItem } from '../types/content';

// Re-export data loading functions
// Changed getAllContentItems to getAllFileContentItems
// Also re-exporting as getAllContentItems for backward compatibility
export { getAllFileContentItems, getAllFileContentItems as getAllContentItems } from '../lib/content-loader';

// Re-export tree construction and searching functions
export { getContentTree, findContentByPath } from '../lib/content-tree';

