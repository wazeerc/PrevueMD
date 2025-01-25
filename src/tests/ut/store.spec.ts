import { initialState, useStore } from '@/store';
import { copyToClipboard, downloadMarkdownFile, warnBeforeUnload } from "@/utils/lib";
import { parseMarkdown } from "@/utils/markdown-parser";
import { createPinia, setActivePinia } from 'pinia';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock("@/utils/lib", () => ({
  copyToClipboard: vi.fn(),
  downloadMarkdownFile: vi.fn(),
  warnBeforeUnload: vi.fn(() => () => { })
}));

vi.mock("@/utils/markdown-parser", () => ({
  parseMarkdown: vi.fn(),
}));

describe('Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const store = useStore();

    expect(store).toMatchObject(initialState);
  });

  describe('actions', () => {
    let store: ReturnType<typeof useStore>;

    beforeAll(() => store = useStore());

    it('should update markdown and set unload warning', () => {
      store.setMarkdown('test markdown');

      expect(store.markdown).toBe('test markdown');
      expect(warnBeforeUnload).toHaveBeenCalled();
    });

    it('should update markup', () => {
      store.setMarkup('test markup');

      expect(store.markup).toBe('test markup');
    });

    it('should reset state', () => {
      store.setMarkdown('test');
      store.setMarkup('test');
      store.clearMarkdown();

      expect(store.markdown).toBeNull();
      expect(store.markup).toBeNull();
      expect(store.unloadWarning).toBeNull();
    });

    it('should call parseMarkdown and update markup', async () => {
      vi.mocked(parseMarkdown).mockResolvedValue('parsed markdown');

      await store.handleParseMarkdown('raw markdown');

      expect(parseMarkdown).toHaveBeenCalledWith('raw markdown');
      expect(store.markup).toBe('parsed markdown');
    });

    it('should call copyToClipboard with current markdown', () => {
      store.setMarkdown('test markdown');
      store.handleCopyToClipboard();

      expect(copyToClipboard).toHaveBeenCalledWith('test markdown');
    });

    it('should call downloadMarkdownFile with current markdown', () => {
      store.setMarkdown('test markdown');
      store.handleDownloadMarkdownFile();

      expect(downloadMarkdownFile).toHaveBeenCalledWith('test markdown');
    });
  });

  describe('getters', () => {
    let store: ReturnType<typeof useStore>;

    beforeAll(() => {
      store = useStore();
      store.clearMarkdown();
    });

    it('should return empty string when markdown is null', () => {
      expect(store.getMarkdown).toBe('');
    });

    it('should return empty string when markup is null', () => {
      expect(store.getMarkup).toBe('');
    });

    it('should return markdown when set', () => {
      store.setMarkdown('test');
      expect(store.getMarkdown).toBe('test');
    });

    it('should return markup when set', () => {
      store.setMarkup('test');
      expect(store.getMarkup).toBe('test');
    });
  });
});
