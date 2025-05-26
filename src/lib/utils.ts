
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
  // Regex to match frontmatter (content between --- at the start of the string)
  // It looks for '---', followed by any characters (non-greedy), then '---'
  // and any trailing whitespace including newlines.
  const frontmatterRegex = /^---\s*[\s\S]*?---\s*/;
  const body = markdownContent.replace(frontmatterRegex, '');
  return body.trim(); // Trim any leading/trailing whitespace from the body
};

