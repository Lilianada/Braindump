
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
    <div className="mt-12 pt-8 flex justify-between items-center gap-4">
      {prevItem ? (
        <Button variant="outline" asChild className="flex-1 max-w-48">
          <Link to={`/content/${prevItem.path}`} className="flex items-center justify-center sm:justify-start">
            <ArrowLeft className="h-4 w-4 mr-0 sm:mr-2 flex-shrink-0" />
            <span className="hidden sm:inline truncate">{prevItem.title}</span>
            <span className="sm:hidden text-xs">Prev</span>
          </Link>
        </Button>
      ) : <div className="flex-1 max-w-48" />}
      
      {nextItem ? (
        <Button variant="outline" asChild className="flex-1 max-w-48">
          <Link to={`/content/${nextItem.path}`} className="flex items-center justify-center sm:justify-end">
            <span className="hidden sm:inline truncate mr-0 sm:mr-2">{nextItem.title}</span>
            <span className="sm:hidden text-xs mr-2">Next</span>
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        </Button>
      ) : <div className="flex-1 max-w-48" />}
    </div>
  );
};

export default ContentNavigation;
