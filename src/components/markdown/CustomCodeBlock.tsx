
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism as prismLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/contexts/ThemeContext';
import MermaidDiagram from './MermaidDiagram'; // Added import

interface CustomCodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any; // node is passed by react-markdown
  inline?: boolean;
}

const CustomCodeBlock: React.FC<CustomCodeBlockProps> = ({ node, inline, className, children, ...props }) => {
  const { theme } = useTheme();
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  if (match && match[1] === 'mermaid') {
    return <MermaidDiagram chart={codeString} />;
  }

  return match ? (
    <SyntaxHighlighter
      style={theme === 'dark' ? okaidia : prismLight}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {codeString}
    </SyntaxHighlighter>
  ) : (
    // Fallback for code blocks without a language, or if match is null
    // Render as a simple pre/code block without syntax highlighting
    // but ensure styling is consistent with prose.
    // Using SyntaxHighlighter with a common language like 'text' or no language
    // can provide consistent styling if desired.
    // For now, a simple pre/code:
    <pre className="not-prose bg-muted p-4 rounded-md overflow-x-auto">
      <code className={className} {...props}>
        {codeString}
      </code>
    </pre>
  );
};

export default CustomCodeBlock;
