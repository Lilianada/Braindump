
import React from 'react';
import { TocItem } from '@/types'; // We'll create this type file next

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
};

interface SimpleRendererProps {
  content: string;
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
}

const SimpleRenderer: React.FC<SimpleRendererProps> = ({ content, setTocItems }) => {
  const lines = content.split('\\n');
  const extractedHeadings: TocItem[] = [];

  React.useEffect(() => {
    // Clear TOC items when content changes or component mounts
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
  }, [content]); // Only re-run if content changes, setTocItems is stable

  return (
    <div className="prose dark:prose-invert max-w-none text-foreground space-y-3">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          const text = line.substring(4);
          const id = generateSlug(text);
          return <h3 key={index} id={id} className="text-lg font-semibold mt-3 mb-1.5">{text}</h3>;
        }
        if (line.startsWith('## ')) {
          const text = line.substring(3);
          const id = generateSlug(text);
          return <h2 key={index} id={id} className="text-xl font-semibold mt-4 mb-2 border-b pb-1">{text}</h2>;
        }
        if (line.startsWith('# ')) {
          const text = line.substring(2);
          const id = generateSlug(text);
          return <h1 key={index} id={id} className="text-2xl font-bold mt-5 mb-3 border-b pb-1.5">{text}</h1>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index}><strong>{line.substring(2, line.length - 2)}</strong></p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        // Basic link detection for demonstration, can be expanded
        // This will style any text that looks like a link, e.g. https://... or www...
        // A more robust solution would use a regex or markdown parser
        if (line.includes('http://') || line.includes('https://') || line.includes('www.')) {
            // This is a very naive way to "linkify", ideally replace with actual <a> tags if they exist
            // or make this part of a more complex renderer
            return <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/(https?:\/\/[^\s]+|www\.[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="custom-link">$1</a>') }} />;
        }
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
};

export default SimpleRenderer;
