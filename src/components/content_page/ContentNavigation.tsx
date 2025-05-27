
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '@/types/content';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ContentNavigationProps {
  prevItem: ContentItem | null;
  nextItem: ContentItem | null;
}

const ContentNavigation: React.FC<ContentNavigationProps> = ({ prevItem, nextItem }) => {
  if (!prevItem && !nextItem) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 flex justify-between items-center">
      {prevItem ? (
        <Button variant="outline" asChild>
          <Link to={`/content/${prevItem.path}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {prevItem.title}
          </Link>
        </Button>
      ) : <div />} {/* Empty div to maintain layout with justify-between */}
      {nextItem ? (
        <Button variant="outline" asChild>
          <Link to={`/content/${nextItem.path}`}>
            {nextItem.title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : <div />} {/* Empty div to maintain layout with justify-between */}
    </div>
  );
};

export default ContentNavigation;
