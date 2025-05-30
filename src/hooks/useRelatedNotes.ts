
import { useMemo } from 'react';
import { ContentItem } from '@/types/content';

export const useRelatedNotes = (contentItem: ContentItem | null, allNotesAndTopics: ContentItem[]) => {
  return useMemo(() => {
    if (!contentItem || !contentItem.tags || contentItem.tags.length === 0 || !allNotesAndTopics || allNotesAndTopics.length === 0) {
      return [];
    }
    const currentTags = new Set(contentItem.tags.map(tag => tag.toLowerCase()));
    const foundRelated: ContentItem[] = [];

    allNotesAndTopics.forEach(note => {
      if (note.id === contentItem.id) return; 
      if (note.tags && note.tags.some(tag => currentTags.has(tag.toLowerCase()))) {
        if (!foundRelated.find(rl => rl.id === note.id)) foundRelated.push(note);
      }
    });
    return foundRelated;
  }, [contentItem, allNotesAndTopics]);
};
