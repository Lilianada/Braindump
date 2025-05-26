
import { ContentItem } from '../types/content';
import { parseFrontmatterAndContent } from './content-parser';

let allContentCache: ContentItem[] | null = null;

// Fetches all .md files, parses them, and returns a flat list of ContentItems.
// These are items directly represented by a .md file.
export const getAllFileContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  if (allContentCache && !forceRefresh) {
    return allContentCache;
  }

  const modules = import.meta.glob('/src/content_files/**/*.md', { eager: true, as: 'raw' });
  const pagesModules = import.meta.glob('/src/pages_files/**/*.md', { eager: true, as: 'raw' });
  const flatItems: ContentItem[] = [];

  // Process content files
  for (const filePath in modules) {
    const rawContent = modules[filePath];
    const { frontmatter, content } = parseFrontmatterAndContent(rawContent);
    
    const contentPath = filePath.replace('/src/content_files/', '').replace(/\.md$/, '');

    const item: ContentItem = {
      id: frontmatter.id || contentPath.split('/').pop() || filePath,
      title: frontmatter.title || contentPath.split('/').pop() || 'Untitled',
      path: frontmatter.path || contentPath,
      type: frontmatter.type || 'note',
      slug: frontmatter.slug || contentPath.split('/').pop(),
      created: frontmatter.created,
      lastUpdated: frontmatter.lastUpdated,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
            (typeof frontmatter.tags === 'string' ? [frontmatter.tags] : []),
      content: content, // Store raw content with frontmatter
      frontmatter: frontmatter,
      children: [] 
    };
    
    // Add any additional frontmatter fields to the item directly
    for (const key in frontmatter) {
      if (!(key in item) && key !== 'content' && key !== 'children') {
        // Ensure the type matches ContentItem's index signature if you're adding arbitrary keys.
        // Or, ensure ContentItem has all possible frontmatter keys defined or an index signature.
        (item as any)[key] = frontmatter[key];
      }
    }
    
    flatItems.push(item);
  }

  // Process page files (but don't include them in the content navigation)
  for (const filePath in pagesModules) {
    const rawContent = pagesModules[filePath];
    const { frontmatter } = parseFrontmatterAndContent(rawContent);
    
    console.log(`Processed page file ${filePath} with frontmatter:`, frontmatter);
  }

  allContentCache = flatItems;
  return flatItems;
};

// Helper to get all content items (files only, not dynamic folders) for linking, glossary etc.
export const getAllContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  return getAllFileContentItems(forceRefresh);
};
