
import React from 'react';

const DocsPage = () => {
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-primary">Documentation</h1>
      <div className="prose dark:prose-invert max-w-none text-foreground space-y-4">
        <p>
          This documentation page will guide you on how to use Braindump effectively. As the application evolves, this section will be updated with more detailed information.
        </p>
        <h2 className="text-2xl font-semibold text-primary/90">Getting Started</h2>
        <ul>
          <li><strong>Navigation:</strong> Use the left sidebar to browse through different sections of your digital garden: Pages, Content Sections (like Zettels, Wikis), and Tags.</li>
          <li><strong>Content Viewing:</strong> Click on a note or topic in the sidebar to view its content in the main area.</li>
          <li><strong>Theming:</strong> Use the theme toggle (sun/moon icon) in the navbar to switch between light and dark modes.</li>
          <li><strong>Fonts:</strong> Use the font selector in the navbar to change the application's display font.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-primary/90">Content Structure (Simulated)</h2>
        <p>
          Currently, the content is simulated using mock data within the application. The structure mirrors a file system:
        </p>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
          <code>
{`src/
└── content/
    └── mockData.ts (defines the structure and content)

Example structure within mockData:
- Zettels/
  - Note A
  - Note B/
    - Sub Note A
- Wikis/
  - Programming/
    - JavaScript/
      - Conditional Rendering
...and so on.`}
          </code>
        </pre>
        
        <h2 className="text-2xl font-semibold text-primary/90">Future Features (Planned)</h2>
        <ul>
          <li>Actual MDX file processing.</li>
          <li>Full-text search.</li>
          <li>Dynamic Table of Contents generation.</li>
          <li>Backlink display.</li>
          <li>Editable notes directly within the app.</li>
          <li>More robust tagging system.</li>
        </ul>
        <p>
          Thank you for using Braindump! We hope it becomes a valuable tool for your personal knowledge management.
        </p>
      </div>
    </div>
  );
};

export default DocsPage;
