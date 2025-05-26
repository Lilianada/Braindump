
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const IndexPage = () => {
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-primary">
          Welcome to Braindump
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personal digital garden. Cultivate your thoughts, link your ideas, and watch your knowledge grow.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border hover-scale transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-primary/90">Explore Your Notes</h2>
          <p className="text-muted-foreground mb-4">
            Dive into your Zettels, wikis, and daily logs. Discover connections and insights.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/content/zettels/note-a">Start Exploring</Link>
          </Button>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border hover-scale transition-transform">
          <h2 className="text-2xl font-semibold mb-3 text-primary/90">What is a Digital Garden?</h2>
          <p className="text-muted-foreground mb-4">
            Learn more about the philosophy behind Braindump and how to make the most of your personal knowledge base.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      <section className="text-center">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">
          Ready to start planting seeds of knowledge?
        </p>
      </section>
    </div>
  );
};

export default IndexPage;
