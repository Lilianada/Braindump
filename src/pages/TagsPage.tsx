
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllContentItems } from '@/content/mockData';
import { Tag as TagIcon, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getNormalizedTags } from '@/lib/utils';

type TagWithCount = {
  tag: string;
  count: number;
};

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagWithCount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      .sort((a, b) => b.count - a.count); // Sort by count descending
    setTags(tagsArray);
    setFilteredTags(tagsArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(({ tag }) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchTerm, tags]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg font-medium text-muted-foreground animate-pulse">Loading tags...</span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="w-full px-4 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <TagIcon className="h-8 w-8 text-primary mb-2" />
          <CardTitle className="text-3xl font-bold tracking-tight text-center">All Tags</CardTitle>
          <CardDescription className="text-center max-w-2xl mx-auto text-muted-foreground text-lg">
            Browse by tag. Click a tag to see all related notes. Use the search below to find specific tags.
          </CardDescription>
          
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Total: {tags.length} tags</span>
            {searchTerm && <span>Found: {filteredTags.length} tags</span>}
          </div>
        </div>

        {filteredTags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTags.map(({ tag, count }) => (
              <Link
                key={tag}
                to={`/tags/${encodeURIComponent(tag)}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors h-full flex flex-col justify-between">
                  <div className="flex items-start gap-2 mb-3">
                    <TagIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                      {tag}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {count} {count === 1 ? 'note' : 'notes'}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12">
            <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
            {searchTerm ? (
              <>
                <p className="text-muted-foreground text-lg mb-2">No tags found for "{searchTerm}"</p>
                <p className="text-muted-foreground text-sm">Try adjusting your search term</p>
              </>
            ) : (
              <p className="text-muted-foreground text-lg">No tags found.</p>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default TagsPage;
