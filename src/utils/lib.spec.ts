import { describe, expect, it, vi } from 'vitest';
import { cn, copyToClipboard, downloadMarkdownFile, parseMarkdown, warnBeforeUnload } from './lib';

describe('cn utility function', () => {
  it('should handle conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included');
  });

  it('should merge tailwind classes properly', () => {
    expect(cn('p-4 bg-red-500', 'p-8')).toBe('bg-red-500 p-8');
  });

  it('should handle null and undefined values', () => {
    expect(cn('valid', null, undefined, 'also-valid')).toBe('valid also-valid');
  });
});

describe('parseMarkdown function', () => {
  it('should convert markdown to HTML', async () => {
    const markdown = '# Hello\n\nThis is **bold**';
    const result = await parseMarkdown(markdown);
    expect(result).toContain('<h1>Hello</h1>');
    expect(result).toContain('<strong>bold</strong>');
  });
});

describe('copyToClipboard function', () => {
  it('should copy text to clipboard', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn() },
      writable: true
    });

    await copyToClipboard('Test');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test');
  });
});

describe('downloadMarkdownFile function', () => {
  it('should prepare the markdown file for download', () => {
    const originalURL = global.URL;
    global.URL = {
      ...originalURL,
      createObjectURL: vi.fn().mockReturnValue('blob:test-url'),
      revokeObjectURL: vi.fn()
    } as unknown as typeof global.URL;

    const markdown = '# Hello\n\nThis is a markdown file';
    const anchor = document.createElement('a');

    vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    vi.spyOn(anchor, 'click').mockImplementation(() => { });

    downloadMarkdownFile(markdown);

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(anchor.download).toBe('prevued.md');
    expect(anchor.href).toBe('blob:test-url');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');

    vi.restoreAllMocks();
  });
});

describe('warnBeforeUnload function', () => {
  it('should add beforeunload event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    warnBeforeUnload();
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
});
