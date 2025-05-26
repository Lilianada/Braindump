
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllContentItems, ContentItem } from '@/content/mockData';
import InteractiveFragment from '@/components/InteractiveFragment'; // New import

const IndexPage = () => {
  const [allNotes, setAllNotes] = useState<ContentItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<ContentItem[]>([]);

  useEffect(() => {
    const items = getAllContentItems();
    setAllNotes(items);
    setGlossaryTerms(items.filter(item => item.type === 'glossary_term'));
  }, []);

  return (
    <div className="container mx-auto py-12 md:py-20 flex justify-center min-h-[calc(100vh-10rem)] animate-fade-in">
      <div className="max-w-3xl w-full flex flex-col items-start text-left">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
          <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="main-heading">
            Welcome to my Braindump
          </InteractiveFragment>
        </h1>
        
        <p className="text-base text-muted-foreground mb-6">
          <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="intro-1">
            My [[personal knowledge management]] space of evolving knowledge where I collect, connect, and grow ideas over time.
          </InteractiveFragment>
        </p>

        <p className="text-base text-muted-foreground mb-6">
          <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="intro-2">
            Braindump is my personal [[digital garden]], a space to cultivate and connect my thoughts, learnings, and ideas over time. Unlike a traditional blog or a fleeting note-taking app, a digital garden is a living collection of interconnected notes that evolve as you do.
          </InteractiveFragment>
        </p>

        <h2 className="text-xl md:text-3xl font-semibold mt-8 mb-4 text-foreground">
          What's Inside?
        </h2>
        <p className="text-base text-muted-foreground mb-4">
          My garden is made up of two main types of notes:
        </p>
        <ul className="list-disc list-inside text-lg text-muted-foreground mb-6 space-y-3 pl-4">
          <li>
            <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="list-wikis">
              <strong>[[Personal wikis]]:</strong> Detailed, fact-based articles with sources and structured links, focused on concepts I’m learning or exploring.
            </InteractiveFragment>
          </li>
          <li>
            <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="list-zettels">
              <strong>[[Atomic notes (zettels)]]:</strong> Short, personal reflections or single ideas, often linked to wikis or other notes to spark new connections.
            </InteractiveFragment>
          </li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-semibold mt-8 mb-4 text-foreground">
          How Notes Grow
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="notes-grow">
            Notes in this garden grow organically. They start as “seedlings” (raw ideas), develop into “budding notes" (linked and refined), and eventually become “evergreen” (well-developed and stable).
          </InteractiveFragment>
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold mt-8 mb-4 text-foreground">
          Explore
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="explore-desc">
            Everything is organized with categories and tags for easy navigation. You can explore by topic, follow links between notes, or use the search to find what interests you.
          </InteractiveFragment>
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          <InteractiveFragment allNotes={allNotes} glossaryTerms={glossaryTerms} baseKeyPrefix="learn-more">
            If you want to learn more about [[my note-taking process]] or [[how to create your own digital garden]], check out my notes.
          </InteractiveFragment>
        </p>

        <p className="text-lg text-muted-foreground mt-8 mb-10">
          Happy exploring!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/content/zettels">
              Start Exploring Notes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
            <Link to="/about">
              Learn More About Braindump
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
