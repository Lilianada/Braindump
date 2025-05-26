
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-primary">About Braindump</h1>
      <div className="prose dark:prose-invert max-w-none text-foreground space-y-4">
        <p>
          Braindump is your personal digital garden, a space to cultivate and connect your thoughts, learnings, and ideas over time. 
          Unlike a traditional blog or a fleeting note-taking app, a digital garden is a living collection of interconnected notes that evolve as you do.
        </p>
        <h2 className="text-2xl font-semibold text-primary/90">Key Concepts</h2>
        <ul>
          <li><strong>Atomic Notes:</strong> Small, self-contained units of information focused on a single idea or concept.</li>
          <li><strong>Linking:</strong> Creating connections between notes to build a web of knowledge, inspired by the Zettelkasten method.</li>
          <li><strong>Continuous Growth:</strong> Notes are not static; they are meant to be revisited, updated, and expanded.</li>
          <li><strong>Personal Knowledge Management (PKM):</strong> A system for capturing, organizing, and retrieving your personal knowledge.</li>
        </ul>
        <p>
          This application aims to provide a simple yet powerful interface for you to manage your digital garden. 
          Think of it as a personal wiki, a commonplace book, and a journal, all rolled into one, where you can freely explore your intellectual landscape.
        </p>
        <h2 className="text-2xl font-semibold text-primary/90">How It (Will) Work</h2>
        <p>
          Content is (conceptually) stored in simple text files (like Markdown with frontmatter for metadata), allowing for easy editing and portability. The application then renders this content, providing features like:
        </p>
        <ul>
          <li>A clear navigational structure through sidebars.</li>
          <li>(Planned) Table of Contents for longer notes.</li>
          <li>(Planned) Backlinks to see which other notes refer to the current one.</li>
          <li>(Planned) Tagging and search functionalities to easily find information.</li>
        </ul>
        <p>
          Welcome to your Braindump. Start planting your thoughts!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
