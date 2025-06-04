// Re-export the ContentItem type
export type { ContentItem } from '../types/content';

// Re-export data loading functions
export { getAllFileContentItems, getAllContentItems } from '../lib/content-loader';

// Re-export tree construction and searching functions
export { getContentTree, findContentByPath, getFlattenedNavigableTree } from '../lib/content-tree'; // Added getFlattenedNavigableTree

