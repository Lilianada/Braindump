export interface ContentItem {
  id: string;
  title: string;
  path: string; // e.g., "zettels/note-a" or "wikis/programming/javascript"
  type: 'folder' | 'note' | 'topic' | 'glossary_term' | 'dictionary_entry' | 'log' | 'zettel'; // Added 'zettel'
  content?: string; // Markdown or plain text content
  frontmatter?: Record<string, any>; // For parsed frontmatter from MD files
  children?: ContentItem[]; // For folder structures derived from file system
  tags?: string[];
  slug?: string;
  created?: string;
  lastUpdated?: string;
  // Allow additional properties from frontmatter to be directly on the item
  [key: string]: any; 
}
