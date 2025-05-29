import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useOutletContext, useNavigate } from 'react-router-dom';
import { findContentByPath, getAllContentItems, getFlattenedNavigableTree } from '@/content/mockData';
import { ContentItem } from '@/types/content';
import { AppContextType } from '@/components/Layout';
import LoadingGrid from '@/components/LoadingGrid';
import ContentNotFoundDisplay from '@/components/content_page/ContentNotFoundDisplay';
import ContentHeader from '@/components/content_page/ContentHeader';
import ContentBody from '@/components/content_page/ContentBody';
import RelatedContent from '@/components/content_page/RelatedContent';
import ContentNavigation from '@/components/content_page/ContentNavigation';
import ContentBreadcrumb from '@/components/content_page/ContentBreadcrumb';

const ContentPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(undefined);
  
  const { tocItems, setTocItems, setCurrentContentItem, setAllNotesForContext, setActiveTocItemId } = useOutletContext<AppContextType>();

  const [allNotesAndTopics, setAllNotesAndTopics] = useState<ContentItem[]>([]);
  const [sequencedNavigableItems, setSequencedNavigableItems] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);

  useEffect(() => {
    const allItems = getAllContentItems(true); 
    
    const notesAndTopicsItems = allItems.filter(item => 
      item.type !== 'folder'
    ).sort((a, b) => a.path.localeCompare(b.path));
    
    setAllNotesAndTopics(notesAndTopicsItems);
    if (setAllNotesForContext) setAllNotesForContext(notesAndTopicsItems); 

    const sequencedItems = getFlattenedNavigableTree(true);
    setSequencedNavigableItems(sequencedItems);

    const terms = allItems.filter(item => item.type === 'glossary_term');
    setGlossaryTerms(terms);

    const path = params['*'];
    if (path) {
      const item = findContentByPath(path);
      setContentItem(item);
      if (setCurrentContentItem) setCurrentContentItem(item); 
      if (setTocItems) setTocItems([]); 
      if (setActiveTocItemId) setActiveTocItemId(null);

      // Removed TOC generation logic from here, SimpleRenderer/ContentBody handles it
    } else {
      setContentItem(null); 
      if (setCurrentContentItem) setCurrentContentItem(null);
      if (setTocItems) setTocItems([]);
      if (setActiveTocItemId) setActiveTocItemId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, location.pathname, setCurrentContentItem, setAllNotesForContext, setTocItems, setActiveTocItemId]);

  useEffect(() => {
    if (!contentItem || contentItem.type === 'folder' || !setActiveTocItemId || !setTocItems) {
      return;
    }

    const timer = setTimeout(() => {
      const headingElements = Array.from(document.querySelectorAll('[id]'))
        .filter(el => el.tagName.match(/^H[1-3]$/) && el.id);
      
      if (headingElements.length === 0) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          let bestVisibleEntry: IntersectionObserverEntry | null = null;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!bestVisibleEntry || entry.boundingClientRect.top < bestVisibleEntry.boundingClientRect.top) {
                if (entry.boundingClientRect.top >=0) {
                     bestVisibleEntry = entry;
                }
              }
            }
          });
          if (bestVisibleEntry) {
            setActiveTocItemId(bestVisibleEntry.target.id);
          }
        },
        { rootMargin: '-15% 0px -70% 0px', threshold: 0.1 }
      );

      headingElements.forEach((el) => observer.observe(el));
      return () => {
        headingElements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }, 100); 

    return () => clearTimeout(timer);
  }, [contentItem, setActiveTocItemId, tocItems, setTocItems]);

  const backlinks = useMemo(() => {
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

  const relatedNotes = useMemo(() => {
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

  const { prevItem, nextItem } = useMemo(() => {
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

  const currentPath = params['*'] || '';

  if (contentItem === undefined) {
    return <LoadingGrid />;
  }

  if (!contentItem) {
    return <ContentNotFoundDisplay path={currentPath} />;
  }
  
  if (contentItem.type === 'folder') {
    return (
      <div className="animate-fade-in">
        <ContentBreadcrumb path={contentItem.path} />
        <div className="px-4 sm:px-6 lg:px-8">
          <ContentBody
            contentItem={contentItem}
            allNotesAndTopics={allNotesAndTopics}
            glossaryTerms={glossaryTerms}
            setTocItems={setTocItems}
          />
        </div>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      <ContentBreadcrumb path={contentItem.path} />
      <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <ContentHeader contentItem={contentItem} />
        <ContentBody
          contentItem={contentItem}
          allNotesAndTopics={allNotesAndTopics}
          glossaryTerms={glossaryTerms}
          setTocItems={setTocItems}
        />
        <RelatedContent backlinks={backlinks} relatedNotes={relatedNotes} />
        <ContentNavigation prevItem={prevItem} nextItem={nextItem} />
      </div>
    </article>
  );
};

export default ContentPage;
