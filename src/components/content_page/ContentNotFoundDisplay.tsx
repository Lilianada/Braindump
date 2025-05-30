
import React from 'react';
import { AlertCircle } from 'lucide-react';
import ContentBreadcrumb from './ContentBreadcrumb';

interface ContentNotFoundDisplayProps {
  path?: string;
}

const ContentNotFoundDisplay: React.FC<ContentNotFoundDisplayProps> = ({ path }) => {
  return (
    <div className="animate-fade-in">
      {path && <ContentBreadcrumb path={path} isNotFound />}
      <div className="container mx-auto py-8 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Content Not Found</h1>
        <p className="text-muted-foreground">
          The page or note you were looking for ({path || 'unknown path'}) could not be found.
        </p>
        <p className="mt-4">
          Please check the URL or navigate using the sidebar.
        </p>
      </div>
    </div>
  );
};

export default ContentNotFoundDisplay;
