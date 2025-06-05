
// Re-export the ContentItem type
export type { ContentItem } from '../../types/content';

// For now, we'll use Firebase as the primary data source
// This file maintains compatibility while the app transitions to Firebase-only
export { getAllContentItems } from '../../services/firebaseService';
