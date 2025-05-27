
import { ContentItem } from '../types/content';
import { getAllFileContentItems } from './content-loader';

let allContentTreeCache: ContentItem[] | null = null;

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
        };
        allItemsMap.set(currentCumulativePath, folderItem);

        if (parentCumulativePath === '') {
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
      const currentFileItemFromMap = allItemsMap.get(item.path)!; 
      if (parentFolder && parentFolder.type === 'folder' && !parentFolder.children?.find(child => child.path === item.path)) {
        parentFolder.children?.push(currentFileItemFromMap);
      }
    } else {
      const currentFileItemFromMap = allItemsMap.get(item.path)!;
       if (!rootItems.find(root => root.path === item.path)) {
          rootItems.push(currentFileItemFromMap);
       }
    }
  });
  
  const sortChildrenRecursive = (items: ContentItem[]) => {
    items.sort((a, b) => a.title.localeCompare(b.title)); 
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortChildrenRecursive(item.children); 
      }
    });
  };
  sortChildrenRecursive(rootItems);
  
  allContentTreeCache = rootItems;
  return rootItems;
};

// Finds any content item (file or folder) by its full path.
export const findContentByPath = (path: string): ContentItem | undefined => {
  getContentTree(); // Ensures tree and allItemsMap (implicitly via tree construction) are populated
  
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
