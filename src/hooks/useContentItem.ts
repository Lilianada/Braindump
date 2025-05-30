
import { useState, useEffect } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import { findContentByPath } from '@/content/mockData';
import { ContentItem } from '@/types/content';
import { AppContextType } from '@/components/Layout';

export const useContentItem = () => {
  const params = useParams();
  const location = useLocation();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(undefined);
  
  const { setTocItems, setCurrentContentItem, setActiveTocItemId } = useOutletContext<AppContextType>();

  useEffect(() => {
    const path = params['*'];
    if (path) {
      const item = findContentByPath(path);
      setContentItem(item);
      if (setCurrentContentItem) setCurrentContentItem(item); 
      if (setTocItems) setTocItems([]); 
      if (setActiveTocItemId) setActiveTocItemId(null);
    } else {
      setContentItem(null); 
      if (setCurrentContentItem) setCurrentContentItem(null);
      if (setTocItems) setTocItems([]);
      if (setActiveTocItemId) setActiveTocItemId(null);
    }
  }, [params, location.pathname, setCurrentContentItem, setTocItems, setActiveTocItemId]);

  return { contentItem, currentPath: params['*'] || '' };
};
