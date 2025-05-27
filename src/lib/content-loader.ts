
import { globSync } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { ContentItem, Frontmatter } from '../types/content'; // Ensure Frontmatter is imported
import { parseContent } from './content-parser'; // Ensure parseContent is imported
import { generateSlug } from './stringUtils'; // Changed from slugify to generateSlug

const CONTENT_DIR = 'src/content_files';
let allFileContentItemsCache: ContentItem[] | null = null;

const normalizePath = (p: string): string => p.replace(/\\/g, '/');

const loadFileContent = (filePath: string): ContentItem | null => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as Frontmatter;

    const relativePath = normalizePath(path.relative(CONTENT_DIR, filePath));
    const itemPath = relativePath.replace(/\.md$/, '');

    // Use generateSlug instead of slugify
    const id = frontmatter.id || generateSlug(frontmatter.title || '') || generateSlug(path.basename(itemPath));
    const title = frontmatter.title || path.basename(itemPath).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const typeMatch = itemPath.match(/^([a-zA-Z0-9_-]+)\//);
    // Adjusted inferredType to handle 'zettel' or other types correctly
    const inferredType = typeMatch ? typeMatch[1].replace(/s$/, '') : 'page'; 

    let itemType = frontmatter.type || inferredType;
    // Fallback if path is at root of content_files or if type is ambiguous
    if (itemType === 'content_files' || itemType === 'src' || !itemType) { 
        itemType = 'page';
    }

    const stats = fs.statSync(filePath);
    const created = frontmatter.created || stats.birthtime.toISOString();
    const lastUpdated = frontmatter.lastUpdated || stats.mtime.toISOString();

    const item: ContentItem = {
      id,
      title,
      path: itemPath,
      type: itemType as ContentItem['type'], // Cast to ensure type safety
      tags: frontmatter.tags || [],
      content: content.trim(),
      frontmatter,
      created,
      lastUpdated,
      children: [],
    };
    return item;
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
    return null;
  }
};

export const getAllFileContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  if (allFileContentItemsCache && !forceRefresh) {
    return allFileContentItemsCache;
  }

  const files = globSync(normalizePath(path.join(CONTENT_DIR, '**/*.md')));
  const items: ContentItem[] = [];

  files.forEach(file => {
    const normalizedFile = normalizePath(file);
    const item = loadFileContent(normalizedFile);
    if (item) {
      items.push(item);
    }
  });
  
  allFileContentItemsCache = items.sort((a, b) => a.title.localeCompare(b.title));
  // console.log(`[content-loader] Loaded ${allFileContentItemsCache.length} file content items.`);
  return allFileContentItemsCache;
};

export const parseContentItem = (item: ContentItem) => {
  if (!item.content) return { ...item, toc: [] };
  // Ensure parseContent is called correctly
  const { headings } = parseContent(item.content); 
  return {
    ...item,
    toc: headings, 
  };
};

export const findFileContentByPath = (itemPath: string, forceRefresh: boolean = false): ContentItem | undefined => {
  const items = getAllFileContentItems(forceRefresh);
  const foundItem = items.find(item => item.path === itemPath);
  if (foundItem) {
    return parseContentItem(foundItem);
  }
  return undefined;
};

export const getAllParsedFileContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  const items = getAllFileContentItems(forceRefresh);
  return items.map(item => parseContentItem(item));
};

