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

/**
 * Loads and configures the markdown processor before the first parse request.
 */
export function preloadMarkdownParser(): Promise<MarkdownProcessor> {
  if (!markdownProcessorPromise) markdownProcessorPromise = createProcessor();
  return markdownProcessorPromise;
}

export async function parseMarkdown(markdownTextToParse: string): Promise<string> {
  try {
    const markdownProcessor = await preloadMarkdownParser();

    const parsedMarkdown = await markdownProcessor.process(markdownTextToParse);
    return String(parsedMarkdown.value);
  }
  catch (error) {
    throw new Error(`Failed to parse markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
}
