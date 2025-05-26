
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism as prismLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/contexts/ThemeContext';

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
    <code className={className} {...props}>
      {codeString}
    </code>
  );
};

export default CustomCodeBlock;
