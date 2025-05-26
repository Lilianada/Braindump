
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText } from 'lucide-react'; // Updated icons

const IndexPage = () => {
  return (
    <div className="container mx-auto py-12 md:py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] animate-fade-in">
      <BookOpenText className="h-16 w-16 md:h-20 md:w-20 text-primary mb-6" />
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
        Welcome to Braindump
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-xl md:max-w-2xl mb-8">
        Your personal space to capture, connect, and cultivate knowledge. Start building your digital garden today.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/content/zettels/note-a">
            Explore Your Notes
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
          <Link to="/about">
            Learn More
          </Link>
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-12 max-w-md">
        Braindump helps you organize thoughts, link ideas, and discover new insights through a simple and intuitive interface.
      </p>
    </div>
  );
};

export default IndexPage;
