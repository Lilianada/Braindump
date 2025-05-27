
import React from 'react';
import { Link } from 'react-router-dom';
import ExternalLinkPreview from './ExternalLinkPreview'; // Added import

interface CustomLinkProps extends React.PropsWithChildren<unknown> {
  href?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children }) => {
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    return (
      <ExternalLinkPreview 
        href={href} 
        className="custom-link" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </ExternalLinkPreview>
    );
  }
  // Check if it's an internal content link (e.g., /content/some-path or content/some-path)
  if (href && href.match(/^(\/?content\/.*|\/?zettels\/.*|\/?concepts\/.*|\/?projects\/.*)$/)) {
    // Ensure the link starts with a / for react-router-dom
    const internalPath = href.startsWith('/') ? href : `/${href}`;
    return <Link to={internalPath} className="custom-link">{children}</Link>;
  }
  // Fallback for other types of links or mailto, etc.
  // For non-http/https links that aren't internal, we still render them as <a>
  // but without the preview component.
  return <a href={href} className="custom-link">{children}</a>;
};

export default CustomLink;
