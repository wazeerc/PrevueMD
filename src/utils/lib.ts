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
import rehypeFormat from "rehype-format";
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from "remark-gfm";
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * Processes and converts markdown text into HTML using unified processor with various plugins.
 *
 * @param textToParseIntoMarkdown - The markdown text string to be processed
 * @returns Promise resolving to the processed markdown value
 *
 * @remarks
 * This function uses the following remark and rehype plugins:
 * - remarkParse: Parses markdown into mdast syntax tree
 * - remarkGfm: Adds support for GitHub Flavored Markdown
 * - remarkRehype: Converts mdast to hast
 * - rehypeFormat: Formats HTML
 * - rehypeStringify: Converts hast to HTML string
 *
 * The function allows dangerous HTML through the remarkRehype configuration.
 */
export async function parseMarkdown(textToParseIntoMarkdown: string): Promise<unknown> {
  const markdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeFormat)
    .use(rehypeStringify);

  return await markdownProcessor.process(textToParseIntoMarkdown);
};
//#endregion
