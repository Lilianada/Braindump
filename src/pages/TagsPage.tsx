
import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Tag as TagIcon, Search, X, ChevronDown, ArrowUpDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNormalizedTags } from '@/lib/utils';
import { getAllContentItems, ContentItem } from '@/components/content/data';
import { cn } from '@/lib/utils';
import LoadingGrid from '@/components/LoadingGrid';
import { AppContextType } from '@/components/Layout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TagWithCount = {
  tag: string;
  count: number;
};

type SortOption = 'nameAsc' | 'nameDesc' | 'countAsc' | 'countDesc';
type SortField = 'name' | 'count';

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagWithCount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('countDesc');
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setTocItems, setActiveTocItemId } = useOutletContext<AppContextType>();

  // Clear TOC when component mounts
  useEffect(() => {
    // Reset TOC and active TOC item when TagsPage mounts
    setTocItems([]);
    setActiveTocItemId(null);
  }, [setTocItems, setActiveTocItemId]);

  // Load content data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const items = await getAllContentItems();
        setAllNotes(items);
        setError(null);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Update sort option when field or direction changes
  useEffect(() => {
    if (sortField === 'name') {
      setSortOption(sortDirection === 'asc' ? 'nameAsc' : 'nameDesc');
    } else {
      setSortOption(sortDirection === 'asc' ? 'countAsc' : 'countDesc');
    }
  }, [sortField, sortDirection]);

  useEffect(() => {
    if (allNotes && allNotes.length > 0) {
      const tagMap = new Map<string, number>();
      allNotes.forEach(item => {
        getNormalizedTags(item.tags).forEach(tag => {
          if (tag) tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      });
      
      const tagsArray = Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
      
      setTags(tagsArray);
      setFilteredTags(tagsArray);
    }
  }, [allNotes]);

  // Handle search and sorting
  useEffect(() => {
    let result = [...tags];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(({ tag }) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result = sortTags(result, sortOption);
    
    setFilteredTags(result);
  }, [searchTerm, tags, sortOption]);

  const handleSortFieldChange = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default direction
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc'); // Default to A-Z for name, Most to Least for count
    }
  };

  const sortTags = (tagsToSort: TagWithCount[], option: SortOption): TagWithCount[] => {
    switch (option) {
      case 'nameAsc':
        return [...tagsToSort].sort((a, b) => a.tag.localeCompare(b.tag));
      case 'nameDesc':
        return [...tagsToSort].sort((a, b) => b.tag.localeCompare(a.tag));
      case 'countAsc':
        return [...tagsToSort].sort((a, b) => a.count - b.count);
      case 'countDesc':
        return [...tagsToSort].sort((a, b) => b.count - a.count);
      default:
        return tagsToSort;
    }
  };

  if (isLoading) {
    return <LoadingGrid />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg font-medium text-destructive">Error loading tags</span>
        <span className="text-sm text-muted-foreground mt-2">Please try refreshing the page</span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="w-full px-4 py-8 max-w-6xl mx-auto">
        {/* Header - matching content page design */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold capitalize mb-2">All Tags</h1>
          <p className="text-base text-muted-foreground mb-4">
            Browse by tag. Click a tag to see all related notes.
          </p>
          
          <div className="mt-3 mb-1 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              <span>
                {searchTerm ? 
                  `${filteredTags.length} of ${tags.length} tags found` : 
                  `${tags.length} total tags`
                }
              </span>
            </div>
          </div>
        </header>
        
        {/* Search and Sort - combined in one row */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search area - takes up most space */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1.5 flex-shrink-0"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>
                    Sort: {sortField === 'name' ? 'Name' : 'Count'} 
                    {sortDirection === 'asc' ? ' (A→Z)' : ' (Z→A)'}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    sortField === 'name' && "font-medium"
                  )}
                  onClick={() => handleSortFieldChange('name')}
                >
                  <span>Name</span>
                  {sortField === 'name' && (
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    sortField === 'count' && "font-medium"
                  )}
                  onClick={() => handleSortFieldChange('count')}
                >
                  <span>Count</span>
                  {sortField === 'count' && (
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {filteredTags.length > 0 ? (
          /* List View - Clean and minimal design */
          <div className="rounded-xl overflow-hidden border border-border">
            {filteredTags.map(({ tag, count }) => (
              <Link
                key={tag}
                to={`/tags/${encodeURIComponent(tag)}`}
                className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{tag}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {count} {count === 1 ? 'note' : 'notes'}
                </Badge>
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
              <p className="text-muted-foreground text-lg">No tags found in notes.</p>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default TagsPage;
