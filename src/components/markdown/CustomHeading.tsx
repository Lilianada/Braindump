
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
    if (text && id) {
      setTocItems(prevItems => {
        if (!prevItems.find(item => item.id === id)) {
          const newTocItem: TocItem = { id, text, level };
          return [...prevItems, newTocItem];
        }
        return prevItems;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, text, level]);

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  let className = "font-semibold"; // Common style for all headings

  // Obsidian-like heading styles
  if (level === 1) { // e.g., "Goals MOC"
    className += " text-3xl lg:text-4xl mt-8 mb-6 text-[hsl(var(--foreground-strong))]";
  } else if (level === 2) { // e.g., "So, you want to chart a course?"
    className += " text-2xl lg:text-3xl mt-10 mb-4 pb-2 border-b-2 border-primary text-[hsl(var(--foreground-strong))]";
  } else if (level === 3) {
    className += " text-xl lg:text-2xl mt-8 mb-3 text-foreground";
  }
  // Add more levels if needed

  return <HeadingTag id={id} className={className}>{children}</HeadingTag>;
};

export default CustomHeading;

