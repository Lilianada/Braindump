
import React from 'react';
import { renderInteractiveText } from '@/lib/markdown/renderInteractiveText';
import { ContentItem } from '@/content/mockData';

interface InteractiveFragmentProps extends React.PropsWithChildren<unknown> {
  allNotes: ContentItem[];
  glossaryTerms: ContentItem[];
  baseKeyPrefix: string;
}

const InteractiveFragment: React.FC<InteractiveFragmentProps> = ({ children, allNotes, glossaryTerms, baseKeyPrefix }) => {
  const processChildren = (childNodes: React.ReactNode, currentKeyPrefix: string): React.ReactNode => {
    return React.Children.map(childNodes, (child, index) => {
      const key = `${currentKeyPrefix}-${index}`;
      if (typeof child === 'string') {
        // Only render if there are notes or terms to avoid unnecessary processing,
        // or if the string contains potential wiki links or glossary terms.
        // For simplicity, we'll always process if there's potential,
        // renderInteractiveText handles missing links gracefully.
        return renderInteractiveText(child, allNotes, glossaryTerms, key);
      }
      // Check if child is a valid React element and has props.children
      if (React.isValidElement(child) && child.props && typeof child.props.children !== 'undefined') {
        // Type assertion for cloneElement's first argument if necessary, often React infers it.
        return React.cloneElement(child as React.ReactElement<any>, {
          ...child.props,
          children: processChildren(child.props.children, key)
        });
      }
      return child;
    });
  };

  return <>{processChildren(children, baseKeyPrefix)}</>;
};

export default InteractiveFragment;
