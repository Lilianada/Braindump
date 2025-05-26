import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { TocItem } from '@/types';
import { ContentItem } from '@/content/mockData';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { extractMarkdownBody } from '@/lib/utils';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

interface SimpleRendererProps {
  content: string;
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
  allNotes: ContentItem[];
  glossaryTerms: ContentItem[];
}

const renderInteractiveText = (
  textNode: string,
  allNotes: ContentItem[],
  glossaryTerms: ContentItem[],
  baseKey: string
): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remainingText = textNode;

  const escapedGlossaryTitles = glossaryTerms.map(term => 
    term.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  
  const combinedRegexParts = [];
  combinedRegexParts.push(`\\[\\[(.*?)\\]\\]`); 
  if (escapedGlossaryTitles.length > 0) {
    combinedRegexParts.push(`\\b(${escapedGlossaryTitles.join('|')})\\b`);
  }

  if (combinedRegexParts.length === 0) {
    return [remainingText]; // No patterns to match, return original text
  }

  const combinedRegex = new RegExp(combinedRegexParts.join('|'), 'gi');

  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = combinedRegex.exec(remainingText)) !== null) {
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(remainingText.substring(lastIndex, matchIndex));
    }

    const noteTitle = match[1]; 
    const glossaryWord = escapedGlossaryTitles.length > 0 && match[2] ? match[2] : null;

    if (noteTitle && !glossaryWord) { // It's a [[Note Title]]
      const note = allNotes.find(n => n.title.toLowerCase() === noteTitle.toLowerCase());
      if (note) {
        parts.push(
          <Link key={`${baseKey}-note-${partIndex}`} to={`/content/${note.path}`} className="custom-link">
            {noteTitle}
          </Link>
        );
      } else {
        parts.push(`[[${noteTitle}]]`); // Fallback if note not found
      }
    } else if (glossaryWord) { // It's a glossary term
      const term = glossaryTerms.find(t => t.title.toLowerCase() === glossaryWord.toLowerCase());
      const termContentForHover = term?.content ? extractMarkdownBody(term.content.replace(/\\n/g, '\n')).split('\n')[0] : '';

      if (term && termContentForHover) {
        parts.push(
          <HoverCard key={`${baseKey}-glossary-${partIndex}`}>
            <HoverCardTrigger asChild>
              <span className="text-primary underline decoration-dotted cursor-pointer">{glossaryWord}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-popover text-popover-foreground p-4 shadow-md rounded-md border">
              <h4 className="font-semibold mb-1">{term.title}</h4>
              <p className="text-sm">{termContentForHover}</p>
            </HoverCardContent>
          </HoverCard>
        );
      } else {
        parts.push(glossaryWord); // Fallback if term not found or no content
      }
    } else if (noteTitle) { // Fallback if glossary is empty or didn't match, but [[...]] did
         const note = allNotes.find(n => n.title.toLowerCase() === noteTitle.toLowerCase());
         if (note) {
           parts.push(
             <Link key={`${baseKey}-note-${partIndex}`} to={`/content/${note.path}`} className="custom-link">
               {noteTitle}
             </Link>
           );
         } else {
           parts.push(`[[${noteTitle}]]`); 
         }
    } else {
        parts.push(match[0]); // Fallback for unexpected match case
    }

    lastIndex = combinedRegex.lastIndex;
    partIndex++;
  }

  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [textNode]; // Ensure original text is returned if no processing occurs
};

const SimpleRenderer: React.FC<SimpleRendererProps> = ({ content, setTocItems, allNotes, glossaryTerms }) => {
  
  useEffect(() => {
    setTocItems([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const CustomHeading: React.FC<React.PropsWithChildren<{level: 1 | 2 | 3}>> = ({ level, children }) => {
    const text = React.Children.toArray(children).join('');
    const id = generateSlug(text);
    
    useEffect(() => {
      setTocItems(prevItems => {
        if (!prevItems.find(item => item.id === id)) {
          const newTocItem: TocItem = { id, text, level };
          const updatedItems = [...prevItems, newTocItem];
          updatedItems.sort((a, b) => {
            if (a.level !== b.level) return a.level - b.level;
            return 0; 
          });
          return updatedItems;
        }
        return prevItems;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, text, level]); // setTocItems is stable

    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    let className = "";
    if (level === 1) className = "text-2xl font-bold mt-5 mb-3 border-b pb-1.5";
    if (level === 2) className = "text-xl font-semibold mt-4 mb-2 border-b pb-1";
    if (level === 3) className = "text-lg font-semibold mt-3 mb-1.5";

    return <HeadingTag id={id} className={className}>{children}</HeadingTag>;
  };

  const CustomParagraph: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const processNode = (node: React.ReactNode, keyPrefix: string): React.ReactNode => {
      if (typeof node === 'string') {
        return renderInteractiveText(node, allNotes, glossaryTerms, keyPrefix);
      }
      if (React.isValidElement(node) && node.props.children) {
        const processedChildren = React.Children.map(node.props.children, (child, index) => 
          processNode(child, `${keyPrefix}-child-${index}`)
        );
        return React.cloneElement(node, { ...node.props }, processedChildren);
      }
      return node;
    };
  
    const processedChildren = React.Children.map(children, (child, index) => 
      processNode(child, `p-${index}`)
    );
  
    return <p>{processedChildren}</p>;
  };
  
  const CustomLink: React.FC<React.PropsWithChildren<any>> = ({ href, children }) => {
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      return <a href={href} target="_blank" rel="noopener noreferrer" className="custom-link">{children}</a>;
    }
    if (href && href.match(/^\/?content\/(.*)/)) {
      return <Link to={href} className="custom-link">{children}</Link>;
    }
    return <a href={href} className="custom-link">{children}</a>;
  };

  return (
    <div className="prose dark:prose-invert max-w-none text-foreground space-y-3 text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <CustomHeading level={1} {...props} />,
          h2: ({node, ...props}) => <CustomHeading level={2} {...props} />,
          h3: ({node, ...props}) => <CustomHeading level={3} {...props} />,
          p: ({node, ...props}) => <CustomParagraph {...props} />,
          a: CustomLink,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SimpleRenderer;
