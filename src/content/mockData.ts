
export interface ContentItem {
  id: string;
  title: string;
  path: string; // e.g., "zettels/note-a" or "wikis/programming/javascript"
  type: 'folder' | 'note' | 'topic' | 'glossary_term' | 'dictionary_entry' | 'log';
  content?: string; // Markdown or plain text content
  frontmatter?: Record<string, any>;
  children?: ContentItem[];
  tags?: string[];
}

export const mockContentData: ContentItem[] = [
  {
    id: 'zettels',
    title: 'Zettels',
    path: 'zettels',
    type: 'folder',
    children: [
      { id: 'note-a', title: 'Note A', path: 'zettels/note-a', type: 'note', content: '# Note A\n\nThis is the first Zettel note. It talks about interesting things.', tags: ['concept', 'idea'] },
      { 
        id: 'note-b', title: 'Note B', path: 'zettels/note-b', type: 'folder', // Note B is a folder
        children: [
          { id: 'note-b-a', title: 'Sub Note A', path: 'zettels/note-b/sub-note-a', type: 'note', content: '### Sub Note A under Note B \nContent here.' },
          { id: 'note-b-b', title: 'Sub Note B', path: 'zettels/note-b/sub-note-b', type: 'note', content: '### Sub Note B under Note B \nMore content.' },
        ]
      },
    ],
  },
  {
    id: 'wikis',
    title: 'Wikis',
    path: 'wikis',
    type: 'folder',
    children: [
      {
        id: 'programming', title: 'Programming', path: 'wikis/programming', type: 'folder',
        children: [
          { 
            id: 'javascript', title: 'JavaScript', path: 'wikis/programming/javascript', type: 'folder',
            children: [
              { id: 'cond-render', title: 'Conditional Rendering', path: 'wikis/programming/javascript/conditional-rendering', type: 'topic', content: '## Conditional Rendering in JS\n...' },
              { id: 'ternary', title: 'Ternary Operators', path: 'wikis/programming/javascript/ternary-operators', type: 'topic', content: '## Ternary Operators\n...' },
            ]
          },
          { 
            id: 'react', title: 'React', path: 'wikis/programming/react', type: 'folder',
            children: [
              { id: 'state-mgmt', title: 'State Management', path: 'wikis/programming/react/state-management', type: 'topic', content: '## State Management in React\n...' },
            ]
          },
        ],
      },
      {
        id: 'language', title: 'Language', path: 'wikis/language', type: 'folder',
        children: [
          {
            id: 'igbo', title: 'Igbo', path: 'wikis/language/igbo', type: 'folder',
            children: [
              { id: 'alphabets', title: 'Alphabets', path: 'wikis/language/igbo/alphabets', type: 'topic', content: 'Igbo alphabets are...' }
            ]
          }
        ]
      }
    ],
  },
  {
    id: 'glossary', title: 'Glossary', path: 'glossary', type: 'folder',
    children: [
      { id: 'term-x', title: 'Term X', path: 'glossary/term-x', type: 'glossary_term', content: '**Term X**: Definition of term X.' },
    ],
  },
  {
    id: 'dictionary', title: 'Dictionary', path: 'dictionary', type: 'folder',
    children: [
      { id: 'brave', title: 'Brave', path: 'dictionary/brave', type: 'dictionary_entry', content: '**Brave**: Ready to face and endure danger or pain; showing courage.' },
    ],
  },
  {
    id: 'daily-logs', title: 'Daily Logs', path: 'daily-logs', type: 'folder',
    children: [
      { id: 'log-001', title: 'Log 001', path: 'daily-logs/001', type: 'log', content: '### Daily Log 001 - 2025-05-26\n\nToday was a productive day...' },
    ],
  },
];

// Helper function to find content by path
export const findContentByPath = (path: string): ContentItem | undefined => {
  const pathSegments = path.split('/');
  let currentLevel = mockContentData;
  let foundItem: ContentItem | undefined = undefined;

  for (const segment of pathSegments) {
    foundItem = currentLevel.find(item => item.id === segment || item.title.toLowerCase().replace(/\s+/g, '-') === segment);
    if (foundItem && foundItem.children) {
      currentLevel = foundItem.children;
    } else if (!foundItem) {
      return undefined; // Path segment not found
    }
  }
  return foundItem;
};

// Helper to get all content items flat for easy lookup if needed, or for specific components
export const getAllContentItems = (items: ContentItem[]): ContentItem[] => {
  let allItems: ContentItem[] = [];
  const dive = (currentItems: ContentItem[]) => {
    for (const item of currentItems) {
      allItems.push(item);
      if (item.children) {
        dive(item.children);
      }
    }
  };
  dive(items);
  return allItems;
};
