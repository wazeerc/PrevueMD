/* eslint-disable */
//? Disabling linting because this is a test file and several functions are mocked
import { cn, copyToClipboard, downloadMarkdownFile, parseMarkdown, warnBeforeUnload } from '@/utils/lib';
import { unified } from "unified";
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the toastification library
vi.mock('vue-toastification', () => ({
  useToast: vi.fn(() => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }))
}));

import { useToast } from 'vue-toastification';

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
  vi.mock('unified', () => ({
    unified: vi.fn()
  }));

  const mockProcess = vi.fn();
  const mockUse = vi.fn();

  beforeEach(() => {
    mockProcess.mockRejectedValue(new Error('Mock parsing error'));
    mockUse.mockReturnThis();
    vi.mocked(unified).mockReturnValue({
      use: mockUse,
      process: mockProcess
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should convert markdown to HTML', async () => {
    mockProcess.mockResolvedValue({ value: '<h1>Hello</h1>\n<p>This is <strong>bold</strong></p>' });

    const markdown = '# Hello\n\nThis is **bold**';
    const result = await parseMarkdown(markdown);

    expect(result).toContain('<h1>Hello</h1>');
    expect(result).toContain('<strong>bold</strong>');
  });

  it('should throw an error if markdown parsing fails', async () => {
    await expect(parseMarkdown('# test'))
      .rejects
      .toThrow('Failed to parse markdown: Error: Mock parsing error');
  });
});

describe('copyToClipboard function', () => {
  let mockToast: { success: any; error: any; };

  beforeEach(() => {
    mockToast = {
      success: vi.fn(),
      error: vi.fn()
    };
    (useToast as any).mockReturnValue(mockToast);
  });

  it('should copy text to clipboard', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn() },
      writable: true
    });

    await copyToClipboard('Test');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test');
    expect(mockToast.success).toHaveBeenCalledWith('Copied to clipboard!');
  });

  it('should show error toast when copying fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')) },
      writable: true
    });

    await copyToClipboard('Test');
    expect(mockToast.error).toHaveBeenCalledWith('Failed to copy to clipboard: Error: Clipboard error');
  });
});

describe('downloadMarkdownFile function', () => {
  let mockToast: { info: any; error: any; warning: any; };

  beforeEach(() => {
    mockToast = {
      info: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    };
    (useToast as any).mockReturnValue(mockToast);
  });

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
    expect(mockToast.info).toHaveBeenCalledWith('Markdown file queued for download!');

    vi.restoreAllMocks();
  });

  it('should display a warning if markdown is empty', () => {
    downloadMarkdownFile('');
    expect(mockToast.warning).toHaveBeenCalledWith('Did you forget to write something?');
  });

  it('should display a warning if markdown is only whitespace', () => {
    downloadMarkdownFile('   ');
    expect(mockToast.warning).toHaveBeenCalledWith('Did you forget to write something?');
  });

  it('should show error toast when download fails', () => {
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
      throw new Error('Download error');
    });

    downloadMarkdownFile('# Test');
    expect(mockToast.error).toHaveBeenCalledWith('Failed to download markdown file: Error: Download error.');
  });
});

describe('warnBeforeUnload function', () => {
  it('should add beforeunload event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    warnBeforeUnload();

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should throw an error if the event listener fails to attach', () => {
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {
      throw new Error('Mock error');
    });

    expect(() => warnBeforeUnload()).toThrow('Failed to set up warning before unload: Error: Mock error');
  });
});
