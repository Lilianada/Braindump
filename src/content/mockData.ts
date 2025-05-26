export interface ContentItem {
  id: string;
  title: string;
  path: string; // e.g., "zettels/note-a" or "wikis/programming/javascript"
  type: 'folder' | 'note' | 'topic' | 'glossary_term' | 'dictionary_entry' | 'log';
  content?: string; // Markdown or plain text content
  frontmatter?: Record<string, any>; // For parsed frontmatter from MD files
  children?: ContentItem[]; // For folder structures derived from file system
  tags?: string[];
  slug?: string;
  created?: string;
  lastUpdated?: string;
}

// Parser for frontmatter and content from raw markdown string
function parseFrontmatterAndContent(rawContent: string): { frontmatter: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: rawContent };
  }

  const frontmatterBlock = match[1].trim();
  const content = rawContent.substring(match[0].length).trim();
  
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');
  let currentListKey: string | null = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- ')) { // Handling list items, e.g. for tags
      if (currentListKey && Array.isArray(frontmatter[currentListKey])) {
        // Assumes list items are indented, e.g. `  - item` or `- item` if key line was `tags:`
        // Adjust substring index based on actual indentation of list items.
        // If `  - value`, then `line.substring(line.indexOf('- ') + 2)`
        // If `- value` (directly under key), then `trimmedLine.substring(2)`
        // For current files like `  - "concept"`, `line.substring(4)` works.
         frontmatter[currentListKey].push(line.substring(line.indexOf('-') + 1).trim().replace(/^["']|["']$/g, ''));
      }
    } else {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        if (value === '' && (line.endsWith(':'))) { // Potential start of a list (e.g., tags:)
          frontmatter[key] = [];
          currentListKey = key;
        } else {
          frontmatter[key] = value.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
          if(key === currentListKey) currentListKey = null; 
        }
      }
    }
  });
  // Ensure tags are always an array, even if defined as a single string in frontmatter (though current format is list)
  if (frontmatter.tags && typeof frontmatter.tags === 'string') {
    frontmatter.tags = [frontmatter.tags];
  } else if (!frontmatter.tags) {
    frontmatter.tags = [];
  }


  return { frontmatter, content };
}

let allContentCache: ContentItem[] | null = null;
let allContentTreeCache: ContentItem[] | null = null;

// Fetches all .md files, parses them, and returns a flat list of ContentItems.
// These are items directly represented by a .md file.
export const getAllFileContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  if (allContentCache && !forceRefresh) {
    return allContentCache;
  }

  const modules = import.meta.glob('/src/content_files/**/*.md', { eager: true, as: 'raw' });
  const flatItems: ContentItem[] = [];

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
      tags: frontmatter.tags || [],
      content: content,
      frontmatter: frontmatter,
      children: [] 
    };
    flatItems.push(item);
  }
  allContentCache = flatItems;
  return flatItems;
};

// Builds a hierarchical tree from the flat list of file content items.
// This includes creating "virtual" folder items based on path structure.
export const getContentTree = (forceRefresh: boolean = false): ContentItem[] => {
  if (allContentTreeCache && !forceRefresh) {
    return allContentTreeCache;
  }

  const fileItems = getAllFileContentItems(forceRefresh);
  const allItemsMap: Map<string, ContentItem> = new Map();
  const rootItems: ContentItem[] = [];

  // Add all file items to the map first
  fileItems.forEach(item => {
    allItemsMap.set(item.path, { ...item, children: item.children || [] });
  });

  // Create and add folder items, then structure the tree
  fileItems.forEach(item => {
    const pathSegments = item.path.split('/');
    let currentCumulativePath = '';
    
    // Iterate through path segments to ensure parent folders exist
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];
      const parentCumulativePath = currentCumulativePath;
      currentCumulativePath = currentCumulativePath ? `${currentCumulativePath}/${segment}` : segment;

      if (!allItemsMap.has(currentCumulativePath)) {
        const folderTitle = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        const folderItem: ContentItem = {
          id: currentCumulativePath,
          title: folderTitle,
          path: currentCumulativePath,
          type: 'folder',
          children: [],
          // Other fields like slug, created can be omitted or set to default for folders
        };
        allItemsMap.set(currentCumulativePath, folderItem);

        if (parentCumulativePath === '') {
          // This is a top-level folder
          if (!rootItems.find(root => root.path === currentCumulativePath)) {
             rootItems.push(folderItem);
          }
        } else {
          const parentFolder = allItemsMap.get(parentCumulativePath);
          if (parentFolder && parentFolder.type === 'folder' && !parentFolder.children?.find(child => child.path === currentCumulativePath)) {
            parentFolder.children?.push(folderItem);
          }
        }
      }
    }

    // Link the actual file item to its direct parent folder
    if (pathSegments.length > 1) {
      const parentPath = pathSegments.slice(0, -1).join('/');
      const parentFolder = allItemsMap.get(parentPath);
      const currentFileItemFromMap = allItemsMap.get(item.path)!; // Item must be in map
      if (parentFolder && parentFolder.type === 'folder' && !parentFolder.children?.find(child => child.path === item.path)) {
        parentFolder.children?.push(currentFileItemFromMap);
      }
    } else {
      // This is a top-level file item
      const currentFileItemFromMap = allItemsMap.get(item.path)!;
       if (!rootItems.find(root => root.path === item.path)) {
          rootItems.push(currentFileItemFromMap);
       }
    }
  });
  
  // Sort children alphabetically by title for consistent display
  const sortChildrenRecursive = (items: ContentItem[]) => {
    items.sort((a, b) => a.title.localeCompare(b.title)); // Sort current level
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortChildrenRecursive(item.children); // Recursively sort children
      }
    });
  };
  sortChildrenRecursive(rootItems);
  
  allContentTreeCache = rootItems;
  return rootItems;
}

// Finds any content item (file or folder) by its full path.
export const findContentByPath = (path: string): ContentItem | undefined => {
  // Ensure tree is built, as it contains all items (files and dynamic folders)
  getContentTree(); // This populates allItemsMap indirectly via getAllFileContentItems and its own logic
  
  // For findContentByPath, we need a map that was populated by getContentTree, 
  // as it contains the dynamically created folders.
  // Let's create a temporary flat list from the tree if needed, or rely on a comprehensive map.
  // The current allItemsMap is built within getContentTree and not exposed.
  // A simple traversal:
  const searchInTree = (itemsToSearch: ContentItem[], targetPath: string): ContentItem | undefined => {
      for (const item of itemsToSearch) {
          if (item.path === targetPath) return item;
          if (item.children) {
              const foundInChildren = searchInTree(item.children, targetPath);
              if (foundInChildren) return foundInChildren;
          }
      }
      return undefined;
  };
  
  return searchInTree(allContentTreeCache || [], path);
};

// Helper to get all content items (files only, not dynamic folders) for linking, glossary etc.
// This is what ContentPage will use for `allNotes` and `glossaryTerms`.
export const getAllContentItems = (forceRefresh: boolean = false): ContentItem[] => {
  return getAllFileContentItems(forceRefresh);
};
