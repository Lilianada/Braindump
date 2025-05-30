
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContextType } from '@/components/Layout';
import LoadingGrid from '@/components/LoadingGrid';
import ContentNotFoundDisplay from '@/components/content_page/ContentNotFoundDisplay';
import ContentHeader from '@/components/content_page/ContentHeader';
import ContentBody from '@/components/content_page/ContentBody';
import RelatedContent from '@/components/content_page/RelatedContent';
import ContentNavigation from '@/components/content_page/ContentNavigation';
import ContentBreadcrumb from '@/components/content_page/ContentBreadcrumb';
import { useContentItem } from '@/hooks/useContentItem';
import { useContentData } from '@/hooks/useContentData';
import { useBacklinks } from '@/hooks/useBacklinks';
import { useRelatedNotes } from '@/hooks/useRelatedNotes';
import { useContentNavigation } from '@/hooks/useContentNavigation';
import { useTocObserver } from '@/hooks/useTocObserver';

const ContentPage: React.FC = () => {
  const { contentItem, currentPath } = useContentItem();
  const { allNotesAndTopics, sequencedNavigableItems, glossaryTerms } = useContentData();
  const { tocItems, setTocItems } = useOutletContext<AppContextType>();
  
  const backlinks = useBacklinks(contentItem, allNotesAndTopics);
  const relatedNotes = useRelatedNotes(contentItem, allNotesAndTopics);
  const { prevItem, nextItem } = useContentNavigation(contentItem, sequencedNavigableItems);
  
  useTocObserver(contentItem, tocItems);

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
