
export interface ContentItem {
  id: string;
  title: string;
  path: string; // e.g., "zettels/note-a" or "wikis/programming/javascript"
  type: 'folder' | 'note' | 'topic' | 'glossary_term' | 'dictionary_entry' | 'log' | 'page' | 'zettel'; // Added 'page' and 'zettel' based on content-loader usage
  content?: string; // Markdown or plain text content
  frontmatter?: Frontmatter; // For parsed frontmatter from MD files
  children?: ContentItem[]; // For folder structures derived from file system
  tags?: string[];
  slug?: string;
  created?: string;
  lastUpdated?: string;
  // Allow additional properties from frontmatter to be directly on the item
  [key: string]: any; 
}

// Added Frontmatter type definition
export type Frontmatter = Record<string, any>;

