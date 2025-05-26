
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the markdown body from raw file content that might include frontmatter.
 * @param rawContent The raw content string, potentially with frontmatter.
 * @returns The markdown body string.
 */
export function extractMarkdownBody(rawContent: string | undefined | null): string {
  if (!rawContent) {
    return "";
  }

  const content = rawContent.trim();
  
  if (content.startsWith('---')) {
    // Find the end of the frontmatter block, which is the second '---'
    // Ensure we look for '---' on a new line or at least after the first one.
    const endFrontmatterIndex = content.indexOf('\n---', 3);
    
    if (endFrontmatterIndex !== -1) {
      // The actual markdown content starts after the closing '---' and a newline
      let markdownStartIndex = endFrontmatterIndex + 4; // Length of '\n---'
      
      // Handle cases where there might be an extra newline or just spaces before actual content
      while (markdownStartIndex < content.length && (content[markdownStartIndex] === '\n' || content[markdownStartIndex] === '\r' || content[markdownStartIndex] === ' ')) {
        markdownStartIndex++;
      }
      
      return content.substring(markdownStartIndex);
    }
  }
  
  // If no valid frontmatter block is found, return the original content (trimmed)
  return content;
}

