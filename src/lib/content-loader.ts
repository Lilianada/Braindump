
import { ContentItem, Frontmatter } from '../types/content';
import { parseFrontmatterAndContent } from './markdown';

let allFileContentItemsCache: ContentItem[] | null = null;

const normalizePath = (p: string): string => p.split('/').filter(Boolean).join('/');

const extractPathInfo = (filePath: string) => {
  const normalizedPath = normalizePath(filePath);
  const parts = normalizedPath.split('/');
  const fileName = parts.pop() || '';
  const baseName = fileName.replace(/\.md$/, '');
  return { parts, fileName, baseName };
};

const createContentItem = (filePath: string, content: string): ContentItem | null => {
  try {
    const { frontmatter, content: markdownContent } = parseFrontmatterAndContent(content);
    const { parts, baseName } = extractPathInfo(filePath);

    // Generate ID from title or filename
    const id = frontmatter.id || 
              (frontmatter.title ? frontmatter.title.toLowerCase().replace(/\s+/g, '-') : 
              baseName.toLowerCase().replace(/\s+/g, '-'));
    
    // Generate title from frontmatter or filename
    const title = frontmatter.title || 
                 baseName.split('-').map(word => 
                   word.charAt(0).toUpperCase() + word.slice(1)
                 ).join(' ');

    // Determine content type
    const typeMatch = parts[0];
    const inferredType = typeMatch ? typeMatch.replace(/s$/, '') : 'page';
    const itemType = frontmatter.type || inferredType;

    // Create the content item
    const item: ContentItem = {
      id,
      title,
      path: parts.join('/'),
      type: itemType as ContentItem['type'],
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
           (frontmatter.tags ? [frontmatter.tags] : []),
      content: markdownContent.trim(),
      frontmatter,
      created: frontmatter.created || new Date().toISOString(),
      lastUpdated: frontmatter.lastUpdated || new Date().toISOString(),
      children: [],
    };
    return item;
  } catch (error) {
    console.error(`Error processing content item ${filePath}:`, error);
    return null;
  }
};

// Load all markdown files using Vite's import.meta.glob
export const getAllFileContentItems = async (forceRefresh: boolean = false): Promise<ContentItem[]> => {
  if (allFileContentItemsCache && !forceRefresh) {
    return allFileContentItemsCache;
  }

  try {
    // Import all markdown files from content_files and pages_files
    const contentModules = import.meta.glob('/src/content_files/**/*.md', { as: 'raw', eager: true });
    const pagesModules = import.meta.glob('/src/pages_files/**/*.md', { as: 'raw', eager: true });
    
    // Process content files
    const contentItems = Object.entries(contentModules)
      .map(([path, content]) => createContentItem(path, content as string))
      .filter((item): item is ContentItem => item !== null);
    
    // Process pages files
    const pagesItems = Object.entries(pagesModules)
      .map(([path, content]) => createContentItem(path, content as string))
      .filter((item): item is ContentItem => item !== null);
    
    // Combine and dedupe items by path
    const itemsMap = new Map<string, ContentItem>();
    [...contentItems, ...pagesItems].forEach(item => {
      itemsMap.set(item.path, item);
    });
    
    const items = Array.from(itemsMap.values());
    allFileContentItemsCache = items;
    return items;
  } catch (error) {
    console.error('Error loading content files:', error);
    return [];
  }
};

export const parseContentItem = (item: ContentItem): ContentItem => {
  // Since we're already parsing the content in createContentItem,
  // we can just return the item as is
  return item;
};

export const findFileContentByPath = async (itemPath: string, forceRefresh: boolean = false): Promise<ContentItem | undefined> => {
  const items = await getAllFileContentItems(forceRefresh);
  return items.find(item => item.path === itemPath);
};

export const getAllParsedFileContentItems = async (forceRefresh: boolean = false): Promise<ContentItem[]> => {
  const items = await getAllFileContentItems(forceRefresh);
  return items.map(item => parseContentItem(item));
};
