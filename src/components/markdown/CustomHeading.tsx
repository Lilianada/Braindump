import React, { useEffect } from 'react';
import { TocItem } from '@/types';
import { generateSlug } from '@/lib/stringUtils';

interface CustomHeadingProps extends React.PropsWithChildren<{ level: 1 | 2 | 3 }> {
  setTocItems: React.Dispatch<React.SetStateAction<TocItem[]>>;
}

const CustomHeading: React.FC<CustomHeadingProps> = ({ level, children, setTocItems }) => {
  const text = React.Children.toArray(children).filter(child => typeof child === 'string' || typeof child === 'number').join('');
  const id = generateSlug(text);

  useEffect(() => {
    if (text && id) { // Ensure text and id are valid before updating TOC
      setTocItems(prevItems => {
        if (!prevItems.find(item => item.id === id)) {
          const newTocItem: TocItem = { id, text, level };
          // Create a new array, add the item, then sort
          const updatedItems = [...prevItems, newTocItem];
          updatedItems.sort((a, b) => {
            // A simple sort: first by level, then by order of appearance (implicit if not sorting by text)
            // For more sophisticated sorting (like document order for same-level headers),
            // an index or a more complex tracking mechanism would be needed.
            // This sort keeps levels grouped.
            if (a.level !== b.level) return a.level - b.level;
            // If you need to maintain appearance order strictly for same level headers,
            // you might need to rely on the order they are added or assign an index.
            // For now, this basic sort will group by level.
            return 0; // Or implement a secondary sort criterion if needed
          });
          return updatedItems;
        }
        return prevItems;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, text, level]); // setTocItems is stable, no need to include

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  let className = "";
  if (level === 1) className = "capitalize text-2xl font-bold mt-5 mb-3 pb-1.5";
  if (level === 2) className = "capitalize text-xl font-semibold mt-4 mb-2 pb-1";
  if (level === 3) className = "capitalize text-lg font-semibold mt-3 mb-1.5";

  return <HeadingTag id={id} className={className}>{children}</HeadingTag>;
};

export default CustomHeading;
