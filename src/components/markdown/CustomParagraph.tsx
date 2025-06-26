
import React from 'react';
import { ContentItem } from '@/components/content/data';
import { renderInteractiveText } from '@/lib/markdown/renderInteractiveText';

interface CustomParagraphProps extends React.PropsWithChildren<unknown> {
  allNotes: ContentItem[];
  glossaryTerms: ContentItem[];
  node?: any; 
}

const CustomParagraph: React.FC<CustomParagraphProps> = ({ children, allNotes, glossaryTerms }) => {
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

  return <p className='font-normal'>{processedChildren}</p>;
};

export default CustomParagraph;
