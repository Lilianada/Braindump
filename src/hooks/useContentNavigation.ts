
import { useMemo } from 'react';
import { ContentItem } from '@/types/content';

export const useContentNavigation = (contentItem: ContentItem | null, sequencedNavigableItems: ContentItem[]) => {
  return useMemo(() => {
    if (!contentItem || sequencedNavigableItems.length === 0 || contentItem.type === 'folder') {
      return { prevItem: null, nextItem: null };
    }
    const currentIndex = sequencedNavigableItems.findIndex(item => item.id === contentItem.id);
    if (currentIndex === -1) {
      console.warn("Current item not found in sequenced navigable items for prev/next calculation:", contentItem.title, contentItem.type);
      return { prevItem: null, nextItem: null };
    }
    const prev = currentIndex > 0 ? sequencedNavigableItems[currentIndex - 1] : null;
    const next = currentIndex < sequencedNavigableItems.length - 1 ? sequencedNavigableItems[currentIndex + 1] : null;
    return { prevItem: prev, nextItem: next };
  }, [contentItem, sequencedNavigableItems]);
};
