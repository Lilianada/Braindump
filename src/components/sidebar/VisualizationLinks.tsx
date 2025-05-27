
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Share2 } from 'lucide-react'; // Using Share2 as an example
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, exact }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
        isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80"
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </Link>
  );
};

const visualizationPages = [
  { to: "/graph-view", icon: Share2, label: "Graph View", exact: true },
];

const VisualizationLinks: React.FC = () => {
  return (
    <div>
      <h3 className="px-3 mb-2 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Visualizations</h3>
      <div className="space-y-0.5">
        {visualizationPages.map(page => <NavLink key={page.label} {...page} />)}
      </div>
    </div>
  );
};

export default VisualizationLinks;
