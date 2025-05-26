
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
