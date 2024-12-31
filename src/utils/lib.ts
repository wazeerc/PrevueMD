export { cn, copyToClipboard, downloadMarkdownFile, parseMarkdown, warnBeforeUnload };

//#region: Tailwind Utils
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes as necessary.
 *
 * @param {...ClassValue[]} inputs - An array of class values to be combined.
 * @returns {string} The combined class names as a single string.
 */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
//#endregion

//#region: Markdown utils
import type { VFile } from "node_modules/rehype-raw/lib";
import rehypeFormat from "rehype-format";
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from "remark-gfm";
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { useToast } from "vue-toastification";

/**
 * Processes and converts markdown text into HTML using unified processor with various plugins.
 *
 * @param markdownTextToParseIntoMarkup - The markdown text string to be processed
 * @throws {Error} If the markdown parsing process fails
 * @returns Promise resolving to the processed markdown value
 *
 * @remarks
 * This function uses the following remark and rehype plugins:
 * - remarkParse: Parses markdown into mdast syntax tree
 * - remarkGfm: Adds support for GitHub Flavored Markdown
 * - remarkRehype: Converts mdast to hast
 * - rehypeRaw: Allows raw HTML in markdown
 * - rehypeFormat: Formats HTML
 * - rehypeStringify: Converts hast to HTML string
 *
 * The function allows dangerous HTML through the remarkRehype configuration.
 */
async function parseMarkdown(markdownTextToParseIntoMarkup: string): Promise<VFile["value"]> {
  try {
    const markdownProcessor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeFormat)
      .use(rehypeStringify);

    return (await markdownProcessor.process(markdownTextToParseIntoMarkup)).value;
  }
  catch (error) {
    throw new Error(`Failed to parse markdown: ${error}`);
  }
};

/**
 * Copies the provided text to the system clipboard asynchronously.
 *
 * @param textToCopyToClipboard - The text string to be copied to the clipboard
 * @throws {Error} If the clipboard API is not available or permission is denied
 * @returns A Promise that resolves when the text has been copied successfully
 *
 * @example
 * ```typescript
 * await copyToClipboard("Hello World!");
 * // Shows toast "Copied to clipboard!"
 * ```
 */
async function copyToClipboard(textToCopyToClipboard: string): Promise<void> {
  const toast = useToast();
  try {
    await navigator.clipboard.writeText(textToCopyToClipboard);
    toast.success('Copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy to clipboard!');
  }
}

/**
 * Downloads a Markdown file with the provided content.
 * Creates a Blob object with the markdown content and initiates a download
 * through a temporary anchor element. The file is saved as 'prevued.md'.
 *
 * @param markdownContentToDownload - The markdown content to be downloaded as a file
 * @throws Will display a toast if the download process fails
 * @remarks
 * The function creates a temporary URL object which is automatically revoked
 * after the download is initiated.
 *
 * @example
 * ```typescript
 * downloadMarkdownFile('# Hello World\nThis is a markdown file');
 * ```
 */
function downloadMarkdownFile(markdownContentToDownload: string): void {
  const toast = useToast();
  try {
    if (markdownContentToDownload.trim() === '') {
      toast.warning('Did you forget to write something?');
      return;
    }
    const markdown = markdownContentToDownload;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'prevued.md';
    a.click();
    URL.revokeObjectURL(url);

    toast.info('Markdown file queued for download!');
  } catch (error) {
    toast.error(`Failed to download markdown file: ${error}.`);
  }
}
//#endregion

//#region: Others
/**
 * Sets up a warning dialog when attempting to leave/reload the page.
 * This function adds a beforeunload event listener to the window that triggers
 * a browser-specific warning dialog.
 *
 * @returns A cleanup function that removes the event listener when called.
 * The returned function should be used to clean up the event listener
 * when it's no longer needed.
 * @throws {Error} If the event listener cannot be set up
 *
 * @example
 * onMounted(() => {
 *   const cleanup = warnBeforeUnload();
 *   onUnmounted(cleanup);
 * });
 */
function warnBeforeUnload(): () => void {
  try {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  } catch (error) {
    throw new Error(`Failed to set up warning before unload: ${error}`);
  }
}
//#endregion
