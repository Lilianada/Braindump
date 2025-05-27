export interface Frontmatter {
  [key: string]: any;
  id?: string;
  title?: string;
  path?: string;
  type?: string;
  slug?: string;
  created?: string;
  lastUpdated?: string;
  tags?: string[] | string;
}

export const parseFrontmatterAndContent = (rawContent: string): { frontmatter: Frontmatter; content: string } => {
  const frontmatter: Frontmatter = {};
  let content = rawContent;

  // Check for frontmatter (starts and ends with ---)
  const frontmatterMatch = rawContent.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)/);
  
  if (frontmatterMatch) {
    const frontmatterRaw = frontmatterMatch[1];
    content = frontmatterMatch[2] || '';
    
    // Parse frontmatter lines
    const lines = frontmatterRaw.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^([\w-]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value: any = match[2].trim();
        
        // Try to parse as JSON if it looks like an array or object
        if ((value.startsWith('[') && value.endsWith(']')) || 
            (value.startsWith('{') && value.endsWith('}')) ||
            value === 'true' || value === 'false' ||
            !isNaN(Number(value))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // If JSON parsing fails, keep as string
          }
        }
        
        // Handle tags that might be in different formats
        if (key === 'tags') {
          if (Array.isArray(value)) {
            frontmatter.tags = value;
          } else if (typeof value === 'string') {
            // Handle comma-separated tags
            frontmatter.tags = value.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          }
        } else {
          frontmatter[key] = value;
        }
      }
    }
  }

  return { frontmatter, content };
};
