
import { useMemo } from 'react';
import { ContentItem } from '@/types/content';

export const useBacklinks = (contentItem: ContentItem | null, allNotesAndTopics: ContentItem[]) => {
  return useMemo(() => {
    if (!contentItem || !allNotesAndTopics || allNotesAndTopics.length === 0) return [];
    const currentTitleLower = contentItem.title.toLowerCase();
    const currentPath = `/content/${contentItem.path}`;
    const foundBacklinks: ContentItem[] = [];

    allNotesAndTopics.forEach(note => {
      if (note.id === contentItem.id) return; 
      if (note.content) {
        const titleLinkRegex = /\[\[(.*?)\]\]/g;
        let match;
        while ((match = titleLinkRegex.exec(note.content)) !== null) {
          if (match[1].toLowerCase() === currentTitleLower) {
            if (!foundBacklinks.find(bl => bl.id === note.id)) foundBacklinks.push(note);
            return; 
          }
        }
        if (note.content.includes(currentPath) || note.content.includes(contentItem.path)) {
            if (!foundBacklinks.find(bl => bl.id === note.id)) {
                foundBacklinks.push(note);
            }
        }
      }
    });
    return foundBacklinks;
  }, [contentItem, allNotesAndTopics]);
};
