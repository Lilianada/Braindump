
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText as FileTextIcon, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TagDetailPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const [relatedItems, setRelatedItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const decodedTagName = tagName ? decodeURIComponent(tagName) : '';

  useEffect(() => {
    if (decodedTagName) {
      const allItems = getAllContentItems();
      const filteredItems = allItems.filter(item => {
        if (!item.tags) return false;
        if (Array.isArray(item.tags)) {
          return item.tags.map(t => t.trim()).includes(decodedTagName);
        } else if (typeof item.tags === 'string') {
          return item.tags.split(',').map(t => t.trim()).includes(decodedTagName);
        }
        return false;
      });
      setRelatedItems(filteredItems);
    }
    setIsLoading(false);
  }, [decodedTagName]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading content for tag: {decodedTagName}...</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <TagIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Content tagged with: <span className="text-primary">{decodedTagName}</span>
              </CardTitle>
            </div>
            <CardDescription>
              Found {relatedItems.length} item(s) matching this tag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {relatedItems.length > 0 ? (
              <ul className="space-y-4">
                {relatedItems.map(item => (
                  <li key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <Link to={`/content/${item.path}`} className="group">
                      <h3 className="text-lg font-medium text-primary group-hover:underline flex items-center">
                        <FileTextIcon className="h-5 w-5 mr-2 shrink-0" />
                        {item.title}
                      </h3>
                      {item.path && <p className="text-sm text-muted-foreground">Path: {item.path}</p>}
                      {item.content && (
                        <p className="text-sm text-foreground/80 mt-1 line-clamp-2">
                          {item.content.substring(0, 150)}...
                        </p>
                      )}
                       {item.tags && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(Array.isArray(item.tags) ? item.tags : item.tags.split(',').map(t=>t.trim())).map(tag => (
                            tag.trim() && <Badge key={tag} variant="outline" className="text-xs">{tag.trim()}</Badge>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No content found for this tag.</p>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Link to="/tags" className="text-sm text-primary hover:underline">
            View all tags
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TagDetailPage;
