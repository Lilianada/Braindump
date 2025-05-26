
import { ContentItem } from '../types/content';
import { parseFrontmatterAndContent } from './content-parser';

let allContentCache: ContentItem[] | null = null;

// Fetches all .md files, parses them, and returns a flat list of ContentItems.
// These are items directly represented by a .md file.
export const getAllFileContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  if (allContentCache && !forceRefresh) {
    return allContentCache;
  }
  // console.log('[ContentLoader] Fetching all file content items. Force refresh:', forceRefresh);

  const modules = import.meta.glob('/src/content_files/**/*.md', { eager: true, as: 'raw' });
  const pagesModules = import.meta.glob('/src/pages_files/**/*.md', { eager: true, as: 'raw' });
  const flatItems: ContentItem[] = [];

  // Process content files
  for (const filePath in modules) {
    const rawContent = modules[filePath];
    const { frontmatter, content } = parseFrontmatterAndContent(rawContent);
    // console.log(`[ContentLoader] Parsed ${filePath}. Raw frontmatter.tags:`, frontmatter.tags);
    
    const contentPath = filePath.replace('/src/content_files/', '').replace(/\.md$/, '');

    const itemTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                     (typeof frontmatter.tags === 'string' && frontmatter.tags.trim() !== '' ? [frontmatter.tags] : []);
    // console.log(`[ContentLoader] Normalized tags for ${filePath}:`, itemTags);


    const item: ContentItem = {
      id: frontmatter.id || contentPath.split('/').pop() || filePath,
      title: frontmatter.title || contentPath.split('/').pop() || 'Untitled',
      path: frontmatter.path || contentPath,
      type: frontmatter.type || 'note',
      slug: frontmatter.slug || contentPath.split('/').pop(),
      created: frontmatter.created,
      lastUpdated: frontmatter.lastUpdated,
      tags: itemTags,
      content: content, 
      frontmatter: frontmatter,
      children: [] 
    };
    
    for (const key in frontmatter) {
      if (!(key in item) && key !== 'content' && key !== 'children') {
        (item as any)[key] = frontmatter[key];
      }
    }
    
    flatItems.push(item);
  }

  // Process page files (but don't include them in the content navigation)
  for (const filePath in pagesModules) {
    const rawContent = pagesModules[filePath];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { frontmatter, content } = parseFrontmatterAndContent(rawContent); // content var was unused
    // console.log(`[ContentLoader] Processed page file ${filePath} with frontmatter:`, frontmatter);
  }

  allContentCache = flatItems;
  // console.log('[ContentLoader] All file content items processed and cached.');
  return flatItems;
};

// Helper to get all content items (files only, not dynamic folders) for linking, glossary etc.
export const getAllContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  return getAllFileContentItems(forceRefresh);
};
