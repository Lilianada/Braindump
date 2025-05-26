
import React from 'react';
import { ContentItem } from '@/content/mockData';
import { renderInteractiveText } from '@/lib/markdown/renderInteractiveText';

interface CustomParagraphProps extends React.PropsWithChildren<unknown> {
  allNotes: ContentItem[];
  glossaryTerms: ContentItem[];
  // node is passed by react-markdown but we don't use it directly here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any; 
}

const CustomParagraph: React.FC<CustomParagraphProps> = ({ children, allNotes, glossaryTerms }) => {
  const processNode = (node: React.ReactNode, keyPrefix: string): React.ReactNode => {
    if (typeof node === 'string') {
      return renderInteractiveText(node, allNotes, glossaryTerms, keyPrefix);
    }
    if (React.isValidElement(node) && node.props.children) {
      // If the element is a link (<a> tag from markdown), its children might be simple text
      // or already processed. We want to avoid re-processing if it's already a custom link.
      // However, react-markdown typically gives us text children here.
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

export default CustomParagraph;
