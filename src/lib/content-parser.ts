// Parser for frontmatter and content from raw markdown string
export function parseFrontmatterAndContent(rawContent: string): { frontmatter: Record<string, any>; content: string } {
  // console.log('[Parser] Starting frontmatter parsing...');
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    // console.log('[Parser] No frontmatter block found.');
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
    // console.log(`[Parser] Processing line: "${line}", currentKey: ${currentKey}, isInList: ${isInList}`);
    
    if (!line) continue;
    
    if (line.startsWith('- ')) {
      if (currentKey) {
        if (!Array.isArray(frontmatter[currentKey])) {
          // This can happen if a key was previously defined as a scalar or not at all,
          // and then list items appear. Standard YAML might expect the key to pre-declare the list.
          // For robustness, ensure it's an array.
          // console.log(`[Parser] Initializing list for key "${currentKey}" upon finding list item.`);
          frontmatter[currentKey] = [];
          isInList = true; // Ensure isInList is true if we are starting a list here
        }
        const value = line.substring(2).trim().replace(/^["']|["']$/g, '');
        frontmatter[currentKey].push(value);
        // console.log(`[Parser] Added item "${value}" to list for key "${currentKey}". Current list:`, frontmatter[currentKey]);
      } else {
        // console.log('[Parser] Warning: Found list item but no currentKey is set.');
      }
      continue;
    }
    
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const newKey = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      currentKey = newKey; // Set currentKey to the new key
      // console.log(`[Parser] New key detected: "${currentKey}"`);
      
      if (!value && (i + 1 < lines.length) && lines[i+1].trim().startsWith('- ')) {
        // console.log(`[Parser] Key "${currentKey}" is a list (starts on next line).`);
        isInList = true;
        frontmatter[currentKey] = [];
      } else {
        // console.log(`[Parser] Key "${currentKey}" is a scalar value: "${value}".`);
        isInList = false;
        value = value.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
        frontmatter[currentKey] = value;
      }
    } else if (currentKey && isInList && frontmatter[currentKey] && line.trim() !== '') {
      // This case is unlikely with standard YAML frontmatter but could handle malformed continuations.
      // Generally, non-indented, non-key-value lines after a list has started would be part of the content block.
      // For frontmatter, this branch might not be strictly necessary if YAML is well-formed.
      // console.log(`[Parser] Warning: Line "${line}" is not a key or standard list item, currentKey: ${currentKey}, isInList: ${isInList}`);
    }
  }

  // console.log('[Parser] Parsing complete. Final frontmatter:', JSON.stringify(frontmatter, null, 2));
  return { frontmatter, content };
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function parseContent(markdownContent: string): { headings: Heading[] } {
  // Placeholder implementation.
  // In a real scenario, you'd parse the markdown to find headings.
  // For now, return an empty array to fix the build.
  // console.log("Placeholder parseContent called for:", markdownContent?.substring(0,50));
  return { headings: [] };
}
