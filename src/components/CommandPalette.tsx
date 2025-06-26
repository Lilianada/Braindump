
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Tag, FolderOpen, ArrowUpDown, Filter as FilterIcon, Tags as TagsIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { getAllContentItems, ContentItem } from '@/content/data';
import { toast } from 'sonner';
import { getNormalizedTags } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pageAndNoteTypes: ContentItem['type'][] = ['note', 'topic', 'log', 'dictionary_entry', 'glossary_term'];

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const fetchedItems = await getAllContentItems();
        setAllItems(fetchedItems);

        const tagsSet = new Set<string>();
        fetchedItems.forEach(item => {
          const normalizedItemTags = getNormalizedTags(item.tags);
          normalizedItemTags.forEach(tag => {
           if (tag) tagsSet.add(tag);
          });
        });
        const sortedTags = Array.from(tagsSet).sort();
        setUniqueTags(sortedTags);

        const fetchedCategories = fetchedItems.filter(item => item.type === 'folder');
        setCategories(fetchedCategories);
      };

      fetchData();
    }
  }, [open]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  const handleSelectContent = (path: string) => {
    runCommand(() => navigate(`/content/${path}`));
  };

  const handleSelectTag = (tag: string) => {
    runCommand(() => navigate(`/tags/${encodeURIComponent(tag)}`));
  };

  const handleViewAllTags = () => {
    runCommand(() => navigate('/tags'));
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem
            key="command-sort"
            value="Sort items by criteria"
            onSelect={() => {
              toast.info('Sort Items action selected.', { description: 'Full functionality for sorting will be implemented soon.'});
              onOpenChange(false);
            }}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
          >
            <ArrowUpDown className="mr-2 h-3 w-3" />
            <span>Sort Items...</span>
          </CommandItem>
          <CommandItem
            key="command-filter"
            value="Filter items by type or status"
            onSelect={() => {
              toast.info('Filter Items action selected.', { description: 'Full functionality for filtering will be implemented soon.'});
              onOpenChange(false);
            }}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
          >
            <FilterIcon className="mr-2 h-3 w-3" />
            <span>Filter Items...</span>
          </CommandItem>
          <CommandItem
            key="command-view-tags"
            value="View all tags"
            onSelect={handleViewAllTags}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
          >
            <TagsIcon className="mr-2 h-3 w-3" />
            <span>View All Tags</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />

        {allItems.length > 0 && (
          <CommandGroup heading="Pages & Notes">
            {allItems
              .filter(item => pageAndNoteTypes.includes(item.type))
              .map((item) => (
              <CommandItem
                key={`content-${item.id}`}
                value={`${item.title} ${item.path} ${getNormalizedTags(item.tags).join(' ')} ${item.content?.substring(0,50)}`}
                onSelect={() => handleSelectContent(item.path)}
                className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <FileText className="mr-2 h-3 w-3" />
                <span>{item.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">{item.type}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {categories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Categories">
              {categories.map((category) => (
                <CommandItem
                  key={`category-${category.id}`}
                  value={category.title}
                  onSelect={() => handleSelectContent(category.path)}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <FolderOpen className="mr-2 h-3 w-3" />
                  <span>{category.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {uniqueTags.length > 0 && (
           <>
            <CommandSeparator />
            <CommandGroup heading="Tags">
              {uniqueTags.map((tag) => (
                <CommandItem
                  key={`tag-${tag}`} 
                  value={tag}
                  onSelect={() => handleSelectTag(tag)}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <Tag className="mr-2 h-3 w-3" />
                  <span>{tag}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
