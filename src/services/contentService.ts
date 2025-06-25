
import { ContentItem } from '@/types/content';
import matter from 'gray-matter';

// This would typically be populated by a build-time process
// For now, we'll simulate the content structure
const CONTENT_STRUCTURE = {
  'README.md': {
    path: 'Content/README.md',
    lastModified: '2025-01-20'
  },
  'zettels/atomic-thinking.md': {
    path: 'Content/zettels/atomic-thinking.md',
    lastModified: '2025-01-20'
  },
  'zettels/zettelkasten-method.md': {
    path: 'Content/zettels/zettelkasten-method.md',
    lastModified: '2025-01-20'
  },
  'wikis/programming/javascript-fundamentals.md': {
    path: 'Content/wikis/programming/javascript-fundamentals.md',
    lastModified: '2025-01-20'
  },
  'wikis/knowledge-management/digital-gardens.md': {
    path: 'Content/wikis/knowledge-management/digital-gardens.md',
    lastModified: '2025-01-20'
  },
  'topics/personal-knowledge-management.md': {
    path: 'Content/topics/personal-knowledge-management.md',
    lastModified: '2025-01-20'
  }
};

// Import all markdown files
const contentModules = import.meta.glob('/Content/**/*.md', { 
  query: '?raw',
  eager: true 
});

export const fetchAllContentItems = async (): Promise<ContentItem[]> => {
  const items: ContentItem[] = [];
  
  for (const [filePath, module] of Object.entries(contentModules)) {
    try {
      const content = (module as { default: string }).default;
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      // Extract path relative to Content directory
      const relativePath = filePath.replace('/Content/', '').replace('.md', '');
      
      const item: ContentItem = {
        id: frontmatter.id || relativePath,
        title: frontmatter.title || 'Untitled',
        path: frontmatter.path || relativePath,
        type: frontmatter.type || 'note',
        content: markdownContent,
        tags: frontmatter.tags || [],
        created: frontmatter.created,
        lastUpdated: frontmatter.lastUpdated,
        slug: frontmatter.slug || relativePath.split('/').pop(),
        frontmatter
      };
      
      items.push(item);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }
  
  return items;
};

export const fetchContentItemByPath = async (path: string): Promise<ContentItem | null> => {
  try {
    // Try different path variations
    const possiblePaths = [
      `/Content/${path}.md`,
      `/Content/${path}/index.md`,
      `/Content/${path}`
    ];
    
    for (const tryPath of possiblePaths) {
      if (contentModules[tryPath]) {
        const module = contentModules[tryPath];
        const content = (module as { default: string }).default;
        const { data: frontmatter, content: markdownContent } = matter(content);
        
        const relativePath = tryPath.replace('/Content/', '').replace('.md', '');
        
        return {
          id: frontmatter.id || relativePath,
          title: frontmatter.title || 'Untitled',
          path: frontmatter.path || relativePath,
          type: frontmatter.type || 'note',
          content: markdownContent,
          tags: frontmatter.tags || [],
          created: frontmatter.created,
          lastUpdated: frontmatter.lastUpdated,
          slug: frontmatter.slug || relativePath.split('/').pop(),
          frontmatter
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching content for path ${path}:`, error);
    return null;
  }
};

// Create folder structure from flat file list
export const createFolderStructure = (items: ContentItem[]): ContentItem[] => {
  const folderMap = new Map<string, ContentItem>();
  const rootItems: ContentItem[] = [];
  
  // Create folders based on file paths
  items.forEach(item => {
    const pathParts = item.path.split('/');
    
    // Create folder hierarchy
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderPath = pathParts.slice(0, i + 1).join('/');
      const folderName = pathParts[i];
      
      if (!folderMap.has(folderPath)) {
        const folder: ContentItem = {
          id: `folder-${folderPath}`,
          title: folderName.charAt(0).toUpperCase() + folderName.slice(1),
          path: folderPath,
          type: 'folder',
          content: '',
          children: [],
          tags: []
        };
        folderMap.set(folderPath, folder);
      }
    }
  });
  
  // Add children to folders
  const folders = Array.from(folderMap.values());
  
  // Add files to their parent folders
  items.forEach(item => {
    const pathParts = item.path.split('/');
    if (pathParts.length > 1) {
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentFolder = folderMap.get(parentPath);
      if (parentFolder && parentFolder.children) {
        parentFolder.children.push(item);
      }
    } else {
      // Root level file
      rootItems.push(item);
    }
  });
  
  // Add subfolders to parent folders
  folders.forEach(folder => {
    const pathParts = folder.path.split('/');
    if (pathParts.length > 1) {
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentFolder = folderMap.get(parentPath);
      if (parentFolder && parentFolder.children) {
        if (!parentFolder.children.find(child => child.id === folder.id)) {
          parentFolder.children.push(folder);
        }
      }
    } else {
      // Root level folder
      rootItems.push(folder);
    }
  });
  
  // Sort children within each folder
  folders.forEach(folder => {
    if (folder.children) {
      folder.children.sort((a, b) => a.title.localeCompare(b.title));
    }
  });
  
  // Sort root items
  rootItems.sort((a, b) => a.title.localeCompare(b.title));
  
  return rootItems;
};
