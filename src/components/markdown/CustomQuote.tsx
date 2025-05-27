import React from 'react';

interface CustomQuoteProps extends React.PropsWithChildren<unknown> {
  className?: string;
}

const CustomQuote: React.FC<CustomQuoteProps> = ({ children, className = '' }) => {
  return (
    <blockquote 
      className={`px-4 py-1 border-l-0 custom-quote ${className}`}
     
    >
      <div className="text-black my-0">
        {children}
      </div>
    </blockquote>
  );
};

export default CustomQuote;