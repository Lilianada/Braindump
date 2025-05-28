import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllContentItems } from '@/content/mockData';
import { Tag as TagIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { getNormalizedTags } from '@/lib/utils';

type TagWithCount = {
  tag: string;
  count: number;
};

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allItems = getAllContentItems();
    const tagMap = new Map<string, number>();
    allItems.forEach(item => {
      getNormalizedTags(item.tags).forEach(tag => {
        if (tag) tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    const tagsArray = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
    setTags(tagsArray);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg font-medium text-muted-foreground animate-pulse">Loading tags...</span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="w-full px-0 py-12">
        <div className="flex flex-col items-center gap-2 mb-8">
          <TagIcon className="h-7 w-7 text-primary mb-1" />
          <CardTitle className="text-2xl font-bold tracking-tight text-center">All Tags</CardTitle>
          <CardDescription className="text-center max-w-xl mx-auto text-muted-foreground">
            Browse by tag. Click a tag to see all related notes.
          </CardDescription>
        </div>
        {tags.length > 0 ? (
          <ul className="w-full max-w-2xl mx-auto">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  to={`/tags/${encodeURIComponent(tag)}`}
                  className="block group"
                >
                  <div className="flex items-center w-full py-3">
                    {/* Tag name */}
                    <span className="flex items-center gap-2 text-base font-medium text-primary group-hover:underline">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      {tag}
                    </span>
                    {/* Connecting dashed line */}
                    <span className="flex-1 mx-3 h-0.5 relative">
                      <span
                        aria-hidden
                        className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-border"
                        style={{ transform: 'translateY(-50%)' }}
                      />
                    </span>
                    {/* Tag count */}
                    <span className="rounded-full px-2 py-0.5 text-xs text-muted-foreground font-mono font-semibold whitespace-nowrap bg-transparent">
                      {count} {count === 1 ? 'note' : 'notes'}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-12">
            <TagIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-lg">No tags found.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default TagsPage;