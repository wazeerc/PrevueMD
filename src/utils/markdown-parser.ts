async function createProcessor() {
  const [unified, remarkParse, remarkGfm, remarkRehype, rehypeRaw, rehypeFormat, rehypeStringify] =
    await Promise.all([
      import('unified').then(m => m.unified),
      import('remark-parse').then(m => m.default),
      import('remark-gfm').then(m => m.default),
      import('remark-rehype').then(m => m.default),
      import('rehype-raw').then(m => m.default),
      import('rehype-format').then(m => m.default),
      import('rehype-stringify').then(m => m.default),
    ]);

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeRaw)
    .use(rehypeFormat)
    .use(rehypeStringify);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let markdownProcessor: any = null;
export async function parseMarkdown(markdownTextToParse: string): Promise<string> {
  try {
    if (!markdownProcessor) markdownProcessor = await createProcessor();

    const parsedMarkdown = await markdownProcessor.process(markdownTextToParse);
    return String(parsedMarkdown.value);
  }
  catch (error) {
    throw new Error(`Failed to parse markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
}
