//#region: Tailwind Utils
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes as necessary.
 *
 * @param {...ClassValue[]} inputs - An array of class values to be combined.
 * @returns {string} The combined class names as a single string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
//#endregion

//#region: Markdown parsing utils
export function parseMarkdown(textToParseIntoMarkdown: string): string {
  return textToParseIntoMarkdown;
};
//#endregion
