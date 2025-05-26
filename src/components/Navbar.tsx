
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Ellipsis, Menu as MenuIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FontToggle from './FontToggle';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onToggleSidebar?: () => void; // For mobile sidebar toggle
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden mr-2">
            <MenuIcon className="h-6 w-6" />
          </Button>
        )}
        <Link to="/" className="text-2xl font-bold text-primary font-lancelot">
          Braindump
        </Link>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <FontToggle />
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Ellipsis className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
