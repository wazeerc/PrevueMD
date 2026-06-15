/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

describe('markdown-parser', () => {
  let mockProcess: Mock<(...args: any[]) => any>;
  let mockUse: Mock<(...args: any[]) => any>;
  let unifiedSpy: Mock<(...args: any[]) => any>;

  beforeEach(() => {
    mockProcess = vi.fn().mockResolvedValue({ value: '<h1>Test</h1>' });
    mockUse = vi.fn().mockReturnThis();

    unifiedSpy = vi.fn(() => ({
      use: mockUse,
      process: mockProcess
    }));

    vi.doMock('unified', () => ({
      unified: unifiedSpy
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should use a cached processor', async () => {
    const { parseMarkdown } = await import('@/utils/markdown-parser');

    const testMarkdown = '# Test';
    const expectedHtml = '<h1>Test</h1>';

    const result1 = await parseMarkdown(testMarkdown);
    expect(result1).toBe(expectedHtml);

    const result2 = await parseMarkdown(testMarkdown);
    expect(result2).toBe(expectedHtml);

    expect(unifiedSpy).not.toHaveBeenCalledTimes(2);
  });

  it('should return cached markup for repeated markdown', async () => {
    const { parseMarkdown } = await import('@/utils/markdown-parser');

    const result1 = await parseMarkdown('# Cached');
    const result2 = await parseMarkdown('# Cached');

    expect(result1).toBe('<h1>Test</h1>');
    expect(result2).toBe('<h1>Test</h1>');
    expect(mockProcess).toHaveBeenCalledTimes(1);
  });

  it('should not cache oversized markdown', async () => {
    const { parseMarkdown } = await import('@/utils/markdown-parser');
    const oversizedMarkdown = 'x'.repeat(250_001);

    await parseMarkdown(oversizedMarkdown);
    await parseMarkdown(oversizedMarkdown);

    expect(mockProcess).toHaveBeenCalledTimes(2);
  });

  it('should evict old cached markdown entries', async () => {
    const { parseMarkdown } = await import('@/utils/markdown-parser');

    for (let index = 0; index < 11; index += 1) {
      await parseMarkdown(`# Entry ${index}`);
    }

    await parseMarkdown('# Entry 0');

    expect(mockProcess).toHaveBeenCalledTimes(12);
  });

  it('should throw an error if the markdown parsing fails', async () => {
    mockProcess.mockRejectedValueOnce(new Error('Test error'));

    const { parseMarkdown } = await import('@/utils/markdown-parser');
    await expect(parseMarkdown('# Test')).rejects.toThrow('Failed to parse markdown: Test error');
  });

  it('should convert markdown to HTML', async () => {
    const { parseMarkdown } = await import('@/utils/markdown-parser');

    const testMarkdown = '# Test';
    const expectedHtml = '<h1>Test</h1>';

    const result = await parseMarkdown(testMarkdown);
    expect(result).toBe(expectedHtml);
  });
});
