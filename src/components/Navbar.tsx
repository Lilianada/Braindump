import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Ellipsis, Menu as MenuIcon } from 'lucide-react'; // Removed Brain import
import ThemeToggle from './ThemeToggle';
import FontToggle from './FontToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommandPalette from './CommandPalette';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onToggleSidebar?: () => void; // For mobile sidebar toggle
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          {onToggleSidebar && (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden mr-2">
              <MenuIcon className="h-6 w-6" />
            </Button>
          )}
          <Link to="/" className="flex items-center text-2xl font-bold text-primary font-geist-sans">
            <div className="bg-primary rounded-xl p-1 flex items-center justify-center mr-2"> {/* Adjusted padding and added flex centering */}
              <img src="/lovable-uploads/3b5f7e39-d88c-43fa-a6d9-fa7e346e86fa.png" alt="Braindump Logo" className="h-5 w-5" />
            </div>
            Braindump
          </Link>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {isMobile ? (
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsCommandOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="h-9 px-3 text-muted-foreground text-sm justify-start w-40 sm:w-64" 
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search...
              <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Ellipsis className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="p-0">
                <div className="py-2 px-2 w-full">
                   <p className="text-xs text-muted-foreground px-2 pb-1">Font</p>
                   <FontToggle />
                </div>
              </DropdownMenuItem>
              {/* Add other menu items here if needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
};

export default Navbar;
