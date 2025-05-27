
import { globSync } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { ContentItem, Frontmatter } from '../types/content';
import { parseContent } from './content-parser';
import { slugify } from './stringUtils';

const CONTENT_DIR = 'src/content_files';
let allFileContentItemsCache: ContentItem[] | null = null;

// Normalizes a path to use forward slashes, which is important for glob and consistency.
const normalizePath = (p: string): string => p.replace(/\\/g, '/');

// Function to extract metadata and content from a single Markdown file.
const loadFileContent = (filePath: string): ContentItem | null => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as Frontmatter;

    // Determine the relative path from the CONTENT_DIR
    const relativePath = normalizePath(path.relative(CONTENT_DIR, filePath));
    
    // Construct the path for the ContentItem, removing the .md extension
    const itemPath = relativePath.replace(/\.md$/, '');

    const id = frontmatter.id || slugify(frontmatter.title) || slugify(path.basename(itemPath));
    const title = frontmatter.title || path.basename(itemPath).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const typeMatch = itemPath.match(/^([a-zA-Z0-9_-]+)\//);
    const inferredType = typeMatch ? typeMatch[1].replace(/s$/, '') : 'page'; // e.g. zettels -> zettel

    // Default type if not specified in frontmatter or inferable
    let itemType = frontmatter.type || inferredType;
    if (itemType === 'content_files' || itemType === 'src') { // Fallback if path is at root of content_files
        itemType = 'page';
    }


    const stats = fs.statSync(filePath);
    const created = frontmatter.created || stats.birthtime.toISOString();
    const lastUpdated = frontmatter.lastUpdated || stats.mtime.toISOString();

    const item: ContentItem = {
      id,
      title,
      path: itemPath,
      type: itemType,
      tags: frontmatter.tags || [],
      content: content.trim(),
      frontmatter,
      created,
      lastUpdated,
      children: [], // Initialize children, will be populated by content-tree
    };
    // console.log(`Loaded item: ${item.title}, Path: ${item.path}, Type: ${item.type}`);
    return item;
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
    return null;
  }
};

// Retrieves all content items from Markdown files, using a cache.
// This function specifically loads items that are actual files.
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
  console.log(`[content-loader] Loaded ${allFileContentItemsCache.length} file content items.`);
  return allFileContentItemsCache;
};


// Parses the raw content of a ContentItem to extract elements like headings for TOC.
export const parseContentItem = (item: ContentItem) => {
  if (!item.content) return { ...item, toc: [] };
  const { headings } = parseContent(item.content); // Assuming parseContent returns { headings, ... }
  return {
    ...item,
    toc: headings, // Add TOC to the item
  };
};

// Function to find a content item by its path.
// This searches through the flat list of file items.
export const findFileContentByPath = (itemPath: string, forceRefresh: boolean = false): ContentItem | undefined => {
  const items = getAllFileContentItems(forceRefresh);
  const foundItem = items.find(item => item.path === itemPath);
  if (foundItem) {
    return parseContentItem(foundItem); // Parse content for TOC etc. when found
  }
  return undefined;
};

// Function to get all content items (parsed, with TOCs)
export const getAllParsedFileContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  const items = getAllFileContentItems(forceRefresh);
  return items.map(item => parseContentItem(item));
};

