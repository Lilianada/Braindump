
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { TocItem } from '@/types';
import { ContentItem } from '@/content/mockData'; // Import ContentItem for props
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"; // Import HoverCard components

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

interface SimpleRendererProps {
  content: string;
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
  allNotes: ContentItem[]; // New prop
  glossaryTerms: ContentItem[]; // New prop
}

const renderInteractiveText = (
  lineContent: string,
  allNotes: ContentItem[],
  glossaryTerms: ContentItem[],
  lineKey: string // Add a key for list items within this render
): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remainingText = lineContent;

  const glossaryTitles = glossaryTerms.map(term => term.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  const combinedRegexParts = [];
  // Regex for [[Note Title]]
  combinedRegexParts.push(`\\[\\[(.*?)\\]\\]`); 
  // Regex for glossary terms (only if there are any)
  if (glossaryTitles.length > 0) {
    combinedRegexParts.push(`\\b(${glossaryTitles.join('|')})\\b`);
  }

  // If no patterns to match, return early
  if (combinedRegexParts.length === 0) {
    return [remainingText];
  }

  const combinedRegex = new RegExp(combinedRegexParts.join('|'), 'gi');

  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = combinedRegex.exec(remainingText)) !== null) {
    const matchIndex = match.index;
    
    // Add text before the match
    if (matchIndex > lastIndex) {
      parts.push(remainingText.substring(lastIndex, matchIndex));
    }

    const noteTitle = match[1]; // From [[Note Title]] - group 1
    const glossaryWord = glossaryTitles.length > 0 && match[2] ? match[2] : null; // From \b(Term1|Term2)\b - group 2

    if (noteTitle && !glossaryWord) { // It's a [[Note Title]]
      const note = allNotes.find(n => n.title.toLowerCase() === noteTitle.toLowerCase());
      if (note) {
        parts.push(
          <Link key={`${lineKey}-note-${partIndex}`} to={`/content/${note.path}`} className="custom-link">
            {noteTitle}
          </Link>
        );
      } else {
        parts.push(`[[${noteTitle}]]`); // Fallback if note not found
      }
    } else if (glossaryWord) { // It's a glossary term
      const term = glossaryTerms.find(t => t.title.toLowerCase() === glossaryWord.toLowerCase());
      if (term && term.content) {
        parts.push(
          <HoverCard key={`${lineKey}-glossary-${partIndex}`}>
            <HoverCardTrigger asChild>
              <span className="text-primary underline decoration-dotted cursor-pointer">{glossaryWord}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border">
              <h4 className="font-semibold mb-1">{term.title}</h4>
              <p className="text-sm">{term.content.split('\\n')[0]}</p> {/* Show first line of definition */}
            </HoverCardContent>
          </HoverCard>
        );
      } else {
        parts.push(glossaryWord); // Fallback if term not found or no content
      }
    } else if (noteTitle) { // If glossary is empty, match[1] will be noteTitle
         const note = allNotes.find(n => n.title.toLowerCase() === noteTitle.toLowerCase());
         if (note) {
           parts.push(
             <Link key={`${lineKey}-note-${partIndex}`} to={`/content/${note.path}`} className="custom-link">
               {noteTitle}
             </Link>
           );
         } else {
           parts.push(`[[${noteTitle}]]`); // Fallback if note not found
         }
    }


    lastIndex = combinedRegex.lastIndex;
    partIndex++;
  }

  // Add any remaining text after the last match
  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  if (parts.length === 0 && lastIndex === 0) {
      return [lineContent];
  }

  return parts;
};


const SimpleRenderer: React.FC<SimpleRendererProps> = ({ content, setTocItems, allNotes, glossaryTerms }) => {
  const lines = content.split('\\n');

  React.useEffect(() => {
    setTocItems([]); 
    const headings: TocItem[] = [];
    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        const text = line.substring(4);
        const id = generateSlug(text);
        headings.push({ id, text, level: 3 });
      } else if (line.startsWith('## ')) {
        const text = line.substring(3);
        const id = generateSlug(text);
        headings.push({ id, text, level: 2 });
      } else if (line.startsWith('# ')) {
        const text = line.substring(2);
        const id = generateSlug(text);
        headings.push({ id, text, level: 1 });
      }
    });
    setTocItems(headings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]); // setTocItems is stable

  return (
    <div className="prose dark:prose-invert max-w-none text-foreground space-y-3 text-sm"> {/* text-sm for 14px body */}
      {lines.map((line, index) => {
        const lineKey = `line-${index}`;
        if (line.startsWith('### ')) {
          const text = line.substring(4);
          const id = generateSlug(text);
          // Using text-base (16px) for h3 as text-sm (14px) is body. Tailwind prose defaults might conflict.
          // Adjusted heading sizes relative to 14px body.
          return <h3 key={lineKey} id={id} className="text-lg font-semibold mt-3 mb-1.5">{text}</h3>;
        }
        if (line.startsWith('## ')) {
          const text = line.substring(3);
          const id = generateSlug(text);
          return <h2 key={lineKey} id={id} className="text-xl font-semibold mt-4 mb-2 border-b pb-1">{text}</h2>;
        }
        if (line.startsWith('# ')) {
          const text = line.substring(2);
          const id = generateSlug(text);
          return <h1 key={lineKey} id={id} className="text-2xl font-bold mt-5 mb-3 border-b pb-1.5">{text}</h1>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={lineKey}><strong>{line.substring(2, line.length - 2)}</strong></p>;
        }
        if (line.trim() === '') {
          // Use a div with margin for empty lines to ensure consistent spacing like <br> but respecting prose.
          return <div key={lineKey} className="h-[1em]" aria-hidden="true"></div>;
        }
        
        // For regular paragraphs, use the interactive text renderer
        // Pass allNotes and glossaryTerms to the rendering function
        const interactiveContent = renderInteractiveText(line, allNotes, glossaryTerms, lineKey);
        return <p key={lineKey}>{interactiveContent.map((part, partIndex) => <React.Fragment key={partIndex}>{part}</React.Fragment>)}</p>;
      })}
    </div>
  );
};

export default SimpleRenderer;

