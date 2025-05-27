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
        // Check if this item already exists in the TOC
        if (!prevItems.find(item => item.id === id)) {
          const newTocItem: TocItem = { id, text, level };
          // Simply add the new item to the end of the array to maintain order
          return [...prevItems, newTocItem];
        }
        return prevItems;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, text, level]); // setTocItems is stable, no need to include

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  let className = "";
  if (level === 1) className = "capitalize text-2xl font-medium mt-5 mb-3 pb-1.5";
  if (level === 2) className = "capitalize text-xl font-medium mt-4 mb-2 pb-1";
  if (level === 3) className = "capitalize text-lg font-medium mt-3 mb-1.5";

  return <HeadingTag id={id} className={className}>{children}</HeadingTag>;
};

export default CustomHeading;
