
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Ellipsis, Menu as MenuIcon } from 'lucide-react';
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
  onToggleSidebar?: () => void;
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
              <MenuIcon className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-end text-sm sm:text-base font-medium font-geist-sans">
            <img src="/logo.png" alt="Braindump Logo" className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
            <span className="hidden sm:inline">Braindump</span>
          </Link>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {isMobile ? (
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsCommandOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-8 sm:h-9 px-2 sm:px-3 text-muted-foreground text-xs sm:text-sm justify-start w-32 sm:w-40 lg:w-64"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="pointer-events-none ml-auto hidden h-4 sm:h-5 select-none items-center gap-1 rounded border bg-muted px-1 sm:px-1.5 font-mono text-[9px] sm:text-[10px] font-medium opacity-100 lg:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          )}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="h-8 w-8 sm:h-10 sm:w-10">
                <Ellipsis className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56" side="bottom" sideOffset={8}>
              <DropdownMenuItem 
                className="p-0 focus:bg-transparent"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="py-2 px-2 w-full">
                  <p className="text-xs text-muted-foreground px-2 pb-1">Font</p>
                  <FontToggle />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
};

export default Navbar;
