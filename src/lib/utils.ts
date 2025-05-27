
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNormalizedTags = (tagsInput: string[] | string | undefined): string[] => {
  if (!tagsInput) {
    return [];
  }
  if (Array.isArray(tagsInput)) {
    return tagsInput.map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  // If not an array and not undefined, it must be a string.
  return tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
};

/**
 * Extracts the main body of a Markdown string by removing the YAML frontmatter.
 * Frontmatter is expected to be at the beginning of the string, enclosed by '---'.
 * @param markdownContent The raw Markdown content, possibly with frontmatter.
 * @returns The Markdown content without frontmatter, or an empty string if input is null/undefined.
 */
export const extractMarkdownBody = (markdownContent: string | undefined | null): string => {
  if (!markdownContent) {
    return '';
  }
  
  // Check if markdownContent starts with --- which indicates frontmatter
  if (markdownContent.trim().startsWith('---')) {
    const secondDashIndex = markdownContent.indexOf('---', 3);
    if (secondDashIndex !== -1) {
      // Return all content after the second ---
      return markdownContent.substring(secondDashIndex + 3).trim();
    }
  }
  
  // If we didn't find frontmatter pattern or it's malformed, return the original content
  return markdownContent.trim();
};

