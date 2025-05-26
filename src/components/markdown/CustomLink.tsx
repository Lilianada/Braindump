
import React from 'react';
import { Link } from 'react-router-dom';

interface CustomLinkProps extends React.PropsWithChildren<unknown> {
  href?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children }) => {
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="custom-link">{children}</a>;
  }
  // Check if it's an internal content link (e.g., /content/some-path or content/some-path)
  if (href && href.match(/^(\/?content\/.*|\/?zettels\/.*|\/?concepts\/.*|\/?projects\/.*)$/)) {
    // Ensure the link starts with a / for react-router-dom
    const internalPath = href.startsWith('/') ? href : `/${href}`;
    return <Link to={internalPath} className="custom-link">{children}</Link>;
  }
  // Fallback for other types of links or mailto, etc.
  return <a href={href} className="custom-link">{children}</a>;
};

export default CustomLink;
