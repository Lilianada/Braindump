
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Tag, FolderOpen, Search as SearchIcon, Filter as FilterIcon, ArrowUpDown, Tags as TagsIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { getAllContentItems, ContentItem } from '@/content/mockData'; // Ensure this path is correct

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the types that should be displayed in "Pages & Notes"
const pageAndNoteTypes: ContentItem['type'][] = ['note', 'topic', 'log', 'dictionary_entry'];

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (open) { // Fetch or update data only when dialog is opened or data changes
      const fetchedItems = getAllContentItems();
      setAllItems(fetchedItems);

      const tags = new Set<string>();
      fetchedItems.forEach(item => {
        item.tags?.forEach(tag => tags.add(tag));
      });
      setUniqueTags(Array.from(tags).sort());

      const fetchedCategories = fetchedItems.filter(item => item.type === 'folder');
      setCategories(fetchedCategories);
    }
  }, [open]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  const handleSelectContent = (path: string) => {
    runCommand(() => navigate(`/content/${path}`));
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
              console.log('Sort action triggered');
              onOpenChange(false);
            }}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span>Sort Items...</span>
          </CommandItem>
          <CommandItem
            key="command-filter"
            value="Filter items by type or status"
            onSelect={() => {
              console.log('Filter action triggered');
              onOpenChange(false);
            }}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            <span>Filter Items...</span>
          </CommandItem>
          <CommandItem
            key="command-view-tags"
            value="View all tags"
            onSelect={() => {
              console.log('View all tags action triggered');
              // In future, could navigate to a dedicated tags page: runCommand(() => navigate(`/tags`));
              onOpenChange(false);
            }}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
          >
            <TagsIcon className="mr-2 h-4 w-4" />
            <span>View All Tags</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />

        {allItems.length > 0 && (
          <CommandGroup heading="Pages & Notes">
            {allItems
              .filter(item => pageAndNoteTypes.includes(item.type)) // Simplified and fixed filter
              .map((item) => (
              <CommandItem
                key={`content-${item.id}`}
                value={`${item.title} ${item.path} ${item.tags?.join(' ')} ${item.content?.substring(0,50)}`}
                onSelect={() => handleSelectContent(item.path)}
                className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <FileText className="mr-2 h-4 w-4" />
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
                  <FolderOpen className="mr-2 h-4 w-4" />
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
                  onSelect={() => {
                    console.log('Selected tag:', tag);
                    // Placeholder: In a real app, you might navigate to a tag search page
                    // e.g., runCommand(() => navigate(`/search?tag=${encodeURIComponent(tag)}`))
                    onOpenChange(false);
                  }}
                  className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <Tag className="mr-2 h-4 w-4" />
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
