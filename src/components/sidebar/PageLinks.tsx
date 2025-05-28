
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Tag, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLinksProps {
  onItemClick?: () => void;
}

const PageLinks: React.FC<PageLinksProps> = ({ onItemClick }) => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Home", exact: true },
  { to: "/about", icon: Info, label: "About" },
  { to: "/docs", icon: FileTextIcon, label: "Docs" },
  { to: "/tags", icon: TagIcon, label: "Tags" },
  ];

  return (
    <div>
      <h3 className="px-3 mb-2 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Navigation</h3>
      <div className="space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onItemClick}
            className={cn(
              "flex items-center px-3 py-2 text-xs rounded-md transition-colors hover:bg-accent hover:text-accent-foreground group",
              location.pathname === to ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
            )}
          >
            <Icon className={cn("h-3 w-3 mr-2 shrink-0", location.pathname === to ? "text-primary" : "text-muted-foreground")} />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PageLinks;
