
// Parser for frontmatter and content from raw markdown string
export function parseFrontmatterAndContent(rawContent: string): { frontmatter: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: rawContent };
  }

  const frontmatterBlock = match[1];
  const content = rawContent; // Keep the entire content including frontmatter
  
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');
  
  let currentKey: string | null = null;
  let isInList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line starts a list item
    if (line.startsWith('- ')) {
      if (currentKey) {
        // If we're not already in a list for this key, initialize it
        if (!isInList) {
          frontmatter[currentKey] = [];
          isInList = true;
        }
        // Add the list item (removing the dash and trimming)
        const value = line.substring(2).trim().replace(/^["']|["']$/g, '');
        frontmatter[currentKey].push(value);
      }
      continue;
    }
    
    // Check if this line defines a new key
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      currentKey = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Check if this is the start of a list
      if (!value && i + 1 < lines.length && lines[i+1].trim().startsWith('- ')) {
        isInList = true;
        frontmatter[currentKey] = [];
      } else {
        // This is a simple key-value pair
        isInList = false;
        // Remove surrounding quotes if present
        value = value.replace(/^["']|["']$/g, '');
        frontmatter[currentKey] = value;
      }
    }
  }

  return { frontmatter, content };
}
