
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ContentItem } from '@/types/content';
import { AppContextType } from '@/components/Layout';

export const useTocObserver = (contentItem: ContentItem | null, tocItems: any[]) => {
  const { setActiveTocItemId, setTocItems } = useOutletContext<AppContextType>();

  useEffect(() => {
    if (!contentItem || contentItem.type === 'folder' || !setActiveTocItemId || !setTocItems) {
      // Clear TOC items when there's no content item or it's a folder
      setTocItems([]);
      setActiveTocItemId(null);
      return;
    }

    const timer = setTimeout(() => {
      const headingElements = Array.from(document.querySelectorAll('[id]'))
        .filter(el => el.tagName.match(/^H[1-3]$/) && el.id);
      
      if (headingElements.length === 0) {
        // Clear TOC if no headings found
        setTocItems([]);
        setActiveTocItemId(null);
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

  // Clear TOC when component unmounts or contentItem changes
  useEffect(() => {
    return () => {
      if (setTocItems && setActiveTocItemId) {
        setTocItems([]);
        setActiveTocItemId(null);
      }
    };
  }, [setTocItems, setActiveTocItemId]);
};
