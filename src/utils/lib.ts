export { cn, copyToClipboard, debounce, downloadMarkdownFile, warnBeforeUnload };

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
import { useToast } from "vue-toastification";

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
    toast.error(`Failed to copy to clipboard: ${error}`);
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

/**
 * Creates a debounced version of the provided function that delays its execution
 * until after a specified time has elapsed since the last time it was called.
 *
 * @template T - The type of the function to debounce
 * @param {T} _function - The function to debounce
 * @param {number} [delay=250] - The delay in milliseconds before executing the function, defaults to 250ms
 * @returns {(...args: Parameters<T>) => void} A debounced version of the input function
 *
 * @example
 * ```typescript
 * const debouncedFn = debounce((text: string) => console.log(text), 1000);
 * debouncedFn("hello"); // Will only log after 1 second of no calls
 * ```
 */
function debounce<T extends (...args: unknown[]) => unknown>(
  _function: T,
  delay: number = 250
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeoutId as NodeJS.Timeout);

    timeoutId = setTimeout(() => {
      timeoutId = null;

      _function.apply(this, args);
    }, delay);
  };
}
//#endregion
