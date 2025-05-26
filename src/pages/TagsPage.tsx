
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllContentItems } from '@/content/mockData'; // Removed ContentItem as it's not directly used
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNormalizedTags } from '@/lib/utils';

const TagsPage: React.FC = () => {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allItems = getAllContentItems();
    const tagsSet = new Set<string>();
    allItems.forEach(item => {
      const normalizedItemTags = getNormalizedTags(item.tags);
      normalizedItemTags.forEach(tag => {
        if (tag) tagsSet.add(tag);
      });
    });
    setUniqueTags(Array.from(tagsSet).sort());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading tags...</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">All Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {uniqueTags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {uniqueTags.map(tag => (
                  <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`}>
                    <Badge variant="secondary" className="text-sm px-3 py-1.5 hover:bg-accent cursor-pointer">
                      <TagIcon className="h-4 w-4 mr-2" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tags found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TagsPage;
