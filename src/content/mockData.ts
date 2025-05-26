export interface ContentItem {
  id: string;
  title: string;
  path: string; // e.g., "zettels/note-a" or "wikis/programming/javascript"
  type: 'folder' | 'note' | 'topic' | 'glossary_term' | 'dictionary_entry' | 'log';
  content?: string; // Markdown or plain text content
  frontmatter?: Record<string, any>; // For parsed frontmatter from MD files
  children?: ContentItem[]; // For folder structures derived from file system
  tags?: string[];
  // New fields that will come from frontmatter
  slug?: string;
  created?: string;
  lastUpdated?: string;
}

// mockContentData array is removed as content is now in .md files.

// Helper function to find content by path
// This function needs to be rewritten to read from .md files or a manifest.
export const findContentByPath = (path: string): ContentItem | undefined => {
  console.warn(
    `findContentByPath (path: "${path}") is using a placeholder. Implement file-based data fetching.`
  );
  // Placeholder: In a real app, this would parse .md files or use a pre-built manifest.
  return undefined;
};

// Helper to get all content items flat
// This function needs to be rewritten to read from .md files or a manifest.
export const getAllContentItems = (
  items?: ContentItem[] /* items arg is no longer directly used from a static array */
): ContentItem[] => {
  console.warn(
    "getAllContentItems is using a placeholder. Implement file-based data fetching."
  );
  if (items) {
    // This condition is to temporarily handle calls from ContentPage until it's updated.
    // However, the 'items' argument would be 'mockContentData' which is now removed.
    // So this branch will likely not be hit as intended.
    console.warn("getAllContentItems was called with an 'items' argument, which is deprecated after moving to file-based content.");
  }
  // Placeholder: In a real app, this would parse all .md files or use a pre-built manifest.
  return [];
};
