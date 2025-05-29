
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

interface ContentBreadcrumbProps {
  path: string;
  isNotFound?: boolean;
}

const ContentBreadcrumb: React.FC<ContentBreadcrumbProps> = ({ path, isNotFound = false }) => {
  const pathSegments = path ? path.split('/').filter(Boolean) : [];
  
  return (
    <div className="mb-4 px-4 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                <span className="sr-only sm:not-sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathSegments.length > 0 && <BreadcrumbSeparator />}
          
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const segmentPath = pathSegments.slice(0, index + 1).join('/');
            const displayName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
            
            if (isLast) {
              return (
                <BreadcrumbItem key={segmentPath}>
                  <BreadcrumbPage className={isNotFound ? "text-destructive" : ""}>
                    {displayName}
                    {isNotFound && " (Not Found)"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              );
            }
            
            return (
              <React.Fragment key={segmentPath}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/content/${segmentPath}`}>
                      {displayName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ContentBreadcrumb;
