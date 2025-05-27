
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism as prismLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/contexts/ThemeContext';
import MermaidDiagram from './MermaidDiagram';

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
    // For inline code, apply a subtle muted background, padding, and rounded corners.
    // This makes it distinct but not as prominent as block code.
    return <code className={`${className} bg-muted/50 dark:bg-muted/70 px-1 py-0.5 rounded text-sm`} {...props}>{children}</code>;
  }

  if (match && match[1] === 'mermaid') {
    // MermaidDiagram now handles its own background and padding.
    return <MermaidDiagram chart={codeString} />;
  }

  const baseStyle = theme === 'dark' ? okaidia : prismLight;
  // Modify the syntax highlighter theme to have a transparent background
  // and remove its own padding/margin/border-radius, as the wrapper div will handle it.
  const transparentThemeStyle = {
    ...baseStyle,
    'pre[class*="language-"]': {
      ...baseStyle['pre[class*="language-"]'],
      background: 'transparent',
      padding: '0', // Wrapper div handles padding
      margin: '0',   // Wrapper div handles margin
      borderRadius: '0', // Wrapper div handles border-radius
      overflow: 'visible', // Wrapper div handles overflow
    },
  };

  return match ? (
    <div className="bg-muted p-4 rounded-md overflow-x-auto my-4"> {/* Added my-4 for spacing */}
      <SyntaxHighlighter
        style={transparentThemeStyle}
        language={match[1]}
        PreTag="div" // Use div to avoid <pre> inside <pre> if this component is wrapped by <pre> from react-markdown
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    // Fallback for code blocks without a language, or if match is null
    // This already uses bg-muted and desired styling. Added my-4 for spacing.
    <pre className="not-prose bg-muted text-foreground p-4 rounded-md overflow-x-auto my-4" {...props}>
      <code className={className}>
        {codeString}
      </code>
    </pre>
  );
};

export default CustomCodeBlock;
