
import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TagListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, onTagClick }) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="px-3 mb-2 text-[10px] font-medium uppercase text-muted-foreground tracking-wider hover-bg-primary/70">Tags</h3>
      <div className="flex flex-wrap gap-2 px-3">
        {tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="cursor-pointer hover:bg-accent"
            onClick={() => onTagClick(tag)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTagClick(tag);}}
          >
           #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagList;
