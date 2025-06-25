
import { useState, useEffect } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import { fetchContentItemByPath } from '@/services/contentService';
import { ContentItem } from '@/types/content';
import { AppContextType } from '@/components/Layout';

export const useContentItem = () => {
  const params = useParams();
  const location = useLocation();
  const [contentItem, setContentItem] = useState<ContentItem | null | undefined>(undefined);
  
  const { setTocItems, setCurrentContentItem, setActiveTocItemId } = useOutletContext<AppContextType>();

  useEffect(() => {
    const path = params['*'];
    
    const fetchContent = async () => {
      if (path) {
        try {
          const item = await fetchContentItemByPath(path);
          setContentItem(item);
          if (setCurrentContentItem) setCurrentContentItem(item);
        } catch (error) {
          console.error('Error fetching content:', error);
          setContentItem(null);
          if (setCurrentContentItem) setCurrentContentItem(null);
        }
      } else {
        setContentItem(null);
        if (setCurrentContentItem) setCurrentContentItem(null);
      }
      
      if (setTocItems) setTocItems([]);
      if (setActiveTocItemId) setActiveTocItemId(null);
    };

    fetchContent();
  }, [params, location.pathname, setCurrentContentItem, setTocItems, setActiveTocItemId]);

  return { contentItem, currentPath: params['*'] || '' };
};
