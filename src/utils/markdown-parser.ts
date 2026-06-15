async function createProcessor() {
  const [unified, remarkParse, remarkGfm, remarkRehype, rehypeStringify] =
    await Promise.all([
      import('unified').then(m => m.unified),
      import('remark-parse').then(m => m.default),
      import('remark-gfm').then(m => m.default),
      import('remark-rehype').then(m => m.default),
      import('rehype-stringify').then(m => m.default),
    ]);

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify);
}

type MarkdownProcessor = Awaited<ReturnType<typeof createProcessor>>;

let markdownProcessorPromise: Promise<MarkdownProcessor> | null = null;
const MAX_CACHE_ENTRIES = 10;
const MAX_CACHEABLE_MARKDOWN_LENGTH = 250_000;
const MAX_TOTAL_CACHE_CHARS = 750_000;
const parsedMarkdownCache = new Map<string, string>();
let totalCacheChars = 0;

function getCacheEntrySize(markdownText: string, markupText: string): number {
  return markdownText.length + markupText.length;
}

function refreshCachedMarkdown(markdownText: string, markupText: string): void {
  parsedMarkdownCache.delete(markdownText);
  parsedMarkdownCache.set(markdownText, markupText);
}

function trimMarkdownCache(): void {
  while (parsedMarkdownCache.size > MAX_CACHE_ENTRIES || totalCacheChars > MAX_TOTAL_CACHE_CHARS) {
    const oldestEntry = parsedMarkdownCache.entries().next().value;
    if (!oldestEntry) return;

    const [markdownText, markupText] = oldestEntry;
    parsedMarkdownCache.delete(markdownText);
    totalCacheChars -= getCacheEntrySize(markdownText, markupText);
  }
}

function cacheParsedMarkdown(markdownText: string, markupText: string): void {
  if (markdownText.length > MAX_CACHEABLE_MARKDOWN_LENGTH) return;

  const existingMarkup = parsedMarkdownCache.get(markdownText);
  if (parsedMarkdownCache.has(markdownText)) totalCacheChars -= getCacheEntrySize(markdownText, existingMarkup ?? '');

  refreshCachedMarkdown(markdownText, markupText);
  totalCacheChars += getCacheEntrySize(markdownText, markupText);
  trimMarkdownCache();
}

/**
 * Returns cached markup for previously parsed markdown and refreshes cache recency.
 */
export function getCachedMarkdown(markdownText: string): string | null {
  if (!parsedMarkdownCache.has(markdownText)) return null;

  const cachedMarkup = parsedMarkdownCache.get(markdownText);
  if (cachedMarkup === undefined) return null;

  refreshCachedMarkdown(markdownText, cachedMarkup);
  return cachedMarkup;
}

/**
 * Clears cached markdown parse results.
 */
export function clearMarkdownParseCache(): void {
  parsedMarkdownCache.clear();
  totalCacheChars = 0;
}

/**
 * Loads and configures the markdown processor before the first parse request.
 */
export function preloadMarkdownParser(): Promise<MarkdownProcessor> {
  if (!markdownProcessorPromise) markdownProcessorPromise = createProcessor();
  return markdownProcessorPromise;
}

export async function parseMarkdown(markdownTextToParse: string): Promise<string> {
  try {
    const cachedMarkup = getCachedMarkdown(markdownTextToParse);
    if (cachedMarkup) return cachedMarkup;

    const markdownProcessor = await preloadMarkdownParser();

    const parsedMarkdown = await markdownProcessor.process(markdownTextToParse);
    const markupText = String(parsedMarkdown.value);

    cacheParsedMarkdown(markdownTextToParse, markupText);
    return markupText;
  }
  catch (error) {
    throw new Error(`Failed to parse markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
}
