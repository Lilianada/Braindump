
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism as prismLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/contexts/ThemeContext';
// Removed: import MermaidDiagram from './MermaidDiagram';

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
    // For inline code, apply a subtle muted background with consistent styling
    return <code className={`${className} bg-muted/60 dark:bg-muted/70 px-1 py-0.5 rounded text-sm`} {...props}>{children}</code>;
  }

  const baseStyle = theme === 'dark' ? okaidia : prismLight;
  // Modify the syntax highlighter theme to have a transparent background
  const transparentThemeStyle = {
    ...baseStyle,
    'pre[class*="language-"]': {
      ...baseStyle['pre[class*="language-"]'],
      background: 'transparent',
      padding: '0',
      margin: '0',
      borderRadius: '0',
      overflow: 'visible',
    },
  };

  return match ? (
    <div className="bg-muted p-4 rounded-md overflow-x-auto my-4">
      <SyntaxHighlighter
        style={transparentThemeStyle}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <pre className="not-prose bg-muted text-foreground p-4 rounded-md overflow-x-auto my-4" {...props}>
      <code className={className}>
        {codeString}
      </code>
    </pre>
  );
};

export default CustomCodeBlock;
