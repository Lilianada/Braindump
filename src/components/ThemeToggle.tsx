
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="h-8 w-8 sm:h-10 sm:w-10"
    >
      {theme === 'light' ? 
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : 
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      }
    </Button>
  );
};

export default ThemeToggle;
