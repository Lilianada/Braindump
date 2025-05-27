
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'; // Added
import rehypeKatex from 'rehype-katex'; // Added
import { TocItem } from '@/types';
import { ContentItem } from '@/content/mockData';

import CustomHeading from './markdown/CustomHeading';
import CustomParagraph from './markdown/CustomParagraph';
import CustomLink from './markdown/CustomLink';
import CustomCodeBlock from './markdown/CustomCodeBlock';
import CustomQuote from './markdown/CustomQuote';
import { extractMarkdownBody } from '@/lib/utils';

interface SimpleRendererProps {
  content: string;
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
  allNotes: ContentItem[];
  glossaryTerms: ContentItem[];
}

const SimpleRenderer: React.FC<SimpleRendererProps> = ({ content, setTocItems, allNotes, glossaryTerms }) => {
  useEffect(() => {
    setTocItems([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]); // setTocItems is stable

  // Extract markdown body without frontmatter
  const markdownBody = extractMarkdownBody(content);

  return (
    <div className="prose dark:prose-invert max-w-none text-foreground space-y-3 text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]} // Added remarkMath
        rehypePlugins={[rehypeKatex]} // Added rehypeKatex
        components={{
          h1: (props) => <CustomHeading {...props} level={1} setTocItems={setTocItems} />,
          h2: (props) => <CustomHeading {...props} level={2} setTocItems={setTocItems} />,
          h3: (props) => <CustomHeading {...props} level={3} setTocItems={setTocItems} />,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({node, ...props}) => <CustomParagraph {...props} allNotes={allNotes} glossaryTerms={glossaryTerms} />,
          a: CustomLink,
          code: CustomCodeBlock,
          blockquote: CustomQuote,
        }}
      >
        {markdownBody}
      </ReactMarkdown>
    </div>
  );
};

export default SimpleRenderer;
