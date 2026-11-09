import { initialState, useStore } from '@/store';
import {
  cancelDraftSave,
  clearDraft,
  flushDraft,
  isDraftCacheable,
  loadDraft,
  scheduleSaveDraft,
} from '@/utils/draft-storage';
import { copyToClipboard, downloadMarkdownFile, warnBeforeUnload } from "@/utils/lib";
import { getCachedMarkdown, parseMarkdown } from "@/utils/markdown-parser";
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock("@/utils/draft-storage", () => ({
  cancelDraftSave: vi.fn(),
  clearDraft: vi.fn(),
  flushDraft: vi.fn(),
  isDraftCacheable: vi.fn(() => true),
  loadDraft: vi.fn(() => null),
  scheduleSaveDraft: vi.fn(),
}));

vi.mock("@/utils/lib", () => ({
  copyToClipboard: vi.fn(),
  downloadMarkdownFile: vi.fn(),
  warnBeforeUnload: vi.fn(() => () => { })
}));

vi.mock("@/utils/markdown-parser", () => ({
  getCachedMarkdown: vi.fn(() => null),
  parseMarkdown: vi.fn(),
}));

describe('Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(getCachedMarkdown).mockReturnValue(null);
    vi.mocked(loadDraft).mockReturnValue(null);
    vi.mocked(isDraftCacheable).mockReturnValue(true);
    vi.mocked(scheduleSaveDraft).mockImplementation((_markdown, onSaved) => onSaved?.(true));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const store = useStore();

    expect(store).toMatchObject(initialState);
  });

  it('should initialize theme from localStorage', () => {
    // Mock localStorage
    const getItemMock = vi.fn(() => 'light');
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: getItemMock,
        setItem: vi.fn(),
      },
      writable: true
    });

    // Mock document.documentElement
    const classListMock = {
      toggle: vi.fn()
    };
    Object.defineProperty(document.documentElement, 'classList', {
      value: classListMock,
      writable: true
    });

    const store = useStore();
    store.initTheme();

    expect(getItemMock).toHaveBeenCalledWith('theme');
    expect(store.theme).toBe('light');
    expect(classListMock.toggle).toHaveBeenCalledWith('dark', false);
  });

  describe('actions', () => {
    let store: ReturnType<typeof useStore>;

    beforeEach(() => store = useStore());

    it('should update markdown, warn while saving, and clear the warning after a save', () => {
      store.setMarkdown('test markdown');

      expect(store.markdown).toBe('test markdown');
      expect(scheduleSaveDraft).toHaveBeenCalledWith('test markdown', expect.any(Function));
      expect(store.getIsDraftRestored).toBe(false);
      expect(warnBeforeUnload).toHaveBeenCalledTimes(1);
      expect(store.unloadWarning).toBeNull();
    });

    it('should keep a warning while a draft write is pending', () => {
      const cleanup = vi.fn();
      let pendingSave: ((saved: boolean) => void) | undefined;

      vi.mocked(warnBeforeUnload).mockReturnValue(cleanup);
      vi.mocked(scheduleSaveDraft).mockImplementationOnce((_markdown, onSaved) => {
        pendingSave = onSaved;
      });

      store.setMarkdown('pending');

      expect(warnBeforeUnload).toHaveBeenCalledTimes(1);
      expect(store.unloadWarning).not.toBeNull();

      pendingSave?.(true);

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect(store.unloadWarning).toBeNull();
    });

    it('should clear the restored draft and warning when markdown is emptied', () => {
      store.setMarkdown('test markdown');
      vi.mocked(warnBeforeUnload).mockClear();

      store.setMarkdown('');

      expect(cancelDraftSave).toHaveBeenCalled();
      expect(clearDraft).toHaveBeenCalled();
      expect(store.getIsDraftRestored).toBe(false);
      expect(warnBeforeUnload).not.toHaveBeenCalled();
      expect(store.unloadWarning).toBeNull();
    });

    it('should fall back to a generic warning when the draft cannot be cached', () => {
      vi.mocked(scheduleSaveDraft).mockImplementationOnce((_markdown, onSaved) => onSaved?.(false));

      store.setMarkdown('test markdown');

      expect(store.getIsDraftRestored).toBe(false);
      expect(warnBeforeUnload).toHaveBeenCalledWith();
    });

    it('should warn immediately when the draft is too large to cache', () => {
      vi.mocked(isDraftCacheable).mockReturnValueOnce(false);

      store.setMarkdown('x'.repeat(10));

      expect(scheduleSaveDraft).not.toHaveBeenCalled();
      expect(cancelDraftSave).toHaveBeenCalled();
      expect(clearDraft).toHaveBeenCalled();
      expect(warnBeforeUnload).toHaveBeenCalledWith();
    });

    it('should keep the warning until a save succeeds', () => {
      const cleanup = vi.fn();
      vi.mocked(warnBeforeUnload).mockReturnValue(cleanup);
      vi.mocked(scheduleSaveDraft).mockImplementationOnce((_markdown, onSaved) => onSaved?.(false));
      store.setMarkdown('first');

      vi.mocked(scheduleSaveDraft).mockImplementationOnce((_markdown, onSaved) => onSaved?.(true));
      store.setMarkdown('second');

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect(store.unloadWarning).toBeNull();
    });

    it('should flush a pending draft save', () => {
      store.flushDraft();

      expect(flushDraft).toHaveBeenCalled();
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
      expect(store.restoredDraft).toBeNull();
    });

    it('should clear the cached draft when markdown is reset', () => {
      store.setMarkdown('test');

      store.clearMarkdown();

      expect(cancelDraftSave).toHaveBeenCalled();
      expect(clearDraft).toHaveBeenCalled();
    });

    it('should restore a cached draft on init and parse it', () => {
      vi.mocked(loadDraft).mockReturnValue('# Restored');
      vi.mocked(parseMarkdown).mockResolvedValue('<h1 id="restored">Restored</h1>');

      store.initMarkdown();

      expect(store.markdown).toBe('# Restored');
      expect(store.restoredDraft).toBe('# Restored');
      expect(store.getIsDraftRestored).toBe(true);
      expect(scheduleSaveDraft).not.toHaveBeenCalled();
      expect(warnBeforeUnload).not.toHaveBeenCalled();
      expect(parseMarkdown).toHaveBeenCalledWith('# Restored');
    });

    it('should hide the restored draft indicator once the content changes', () => {
      vi.mocked(loadDraft).mockReturnValue('# Restored');
      vi.mocked(parseMarkdown).mockResolvedValue('<h1>Restored</h1>');
      store.initMarkdown();

      store.setMarkdown('# Edited');

      expect(store.getIsDraftRestored).toBe(false);
    });

    it('should keep the restored draft indicator while the content is unchanged', () => {
      vi.mocked(loadDraft).mockReturnValue('# Restored');
      vi.mocked(parseMarkdown).mockResolvedValue('<h1>Restored</h1>');
      store.initMarkdown();

      store.setMarkdown('# Restored');

      expect(store.getIsDraftRestored).toBe(true);
    });

    it('should do nothing when there is no cached draft to restore', () => {
      store.initMarkdown();

      expect(store.markdown).toBeNull();
      expect(store.getIsDraftRestored).toBe(false);
      expect(parseMarkdown).not.toHaveBeenCalled();
      expect(warnBeforeUnload).not.toHaveBeenCalled();
    });

    it('should call parseMarkdown and update markup', async () => {
      vi.mocked(parseMarkdown).mockResolvedValue('parsed markdown');

      await store.handleParseMarkdown('raw markdown');

      expect(parseMarkdown).toHaveBeenCalledWith('raw markdown');
      expect(store.markup).toBe('parsed markdown');
    });

    it('should use cached markup without parsing or showing loader', async () => {
      vi.mocked(getCachedMarkdown).mockReturnValue('cached markup');

      await store.handleParseMarkdown('raw markdown');

      expect(parseMarkdown).not.toHaveBeenCalled();
      expect(store.markup).toBe('cached markup');
      expect(store.isParsing).toBe(false);
    });

    it('should skip parsing when markdown is already current', async () => {
      vi.mocked(parseMarkdown).mockResolvedValue('parsed markdown');

      await store.handleParseMarkdown('raw markdown');
      await store.handleParseMarkdown('raw markdown');

      expect(parseMarkdown).toHaveBeenCalledTimes(1);
      expect(store.markup).toBe('parsed markdown');
      expect(store.isParsing).toBe(false);
    });

    it('should ignore stale parse results when a more recent call completes first', async () => {
      vi.useFakeTimers();

      vi.mocked(parseMarkdown).mockResolvedValue('parsed markdown');
      await store.handleParseMarkdown('abc');
      expect(store.lastParsedMarkdown).toBe('abc');

      let resolveSlowParse: (value: string) => void = () => {};
      vi.mocked(parseMarkdown).mockReturnValue(new Promise((resolve) => {
        resolveSlowParse = resolve;
      }));

      const slowParse = store.handleParseMarkdown('def');

      await store.handleParseMarkdown('abc');

      resolveSlowParse('stale result');
      await slowParse;

      expect(store.markup).toBe('parsed markdown');
      expect(store.isParsing).toBe(false);

      vi.useRealTimers();
    });

    it('should avoid showing loader for fast small parses', async () => {
      vi.mocked(parseMarkdown).mockResolvedValue('parsed markdown');

      await store.handleParseMarkdown('raw markdown');

      expect(store.isParsing).toBe(false);
    });

    it('should show loader for slow small parses', async () => {
      vi.useFakeTimers();

      let resolveParse: (value: string) => void = () => { };
      vi.mocked(parseMarkdown).mockReturnValue(new Promise((resolve) => {
        resolveParse = resolve;
      }));

      const parsePromise = store.handleParseMarkdown('raw markdown');

      expect(store.isParsing).toBe(false);
      vi.advanceTimersByTime(149);
      expect(store.isParsing).toBe(false);

      vi.advanceTimersByTime(1);
      expect(store.isParsing).toBe(true);

      resolveParse('parsed markdown');
      await parsePromise;

      expect(store.isParsing).toBe(false);
      vi.useRealTimers();
    });

    it('should show loader immediately for large parses', async () => {
      vi.useFakeTimers();
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(() => callback(0), 0);
        return 1;
      });

      let resolveParse: (value: string) => void = () => { };
      vi.mocked(parseMarkdown).mockReturnValue(new Promise((resolve) => {
        resolveParse = resolve;
      }));

      const parsePromise = store.handleParseMarkdown('x'.repeat(5000));

      expect(store.isParsing).toBe(true);
      vi.runOnlyPendingTimers();
      vi.runOnlyPendingTimers();
      await Promise.resolve();

      resolveParse('parsed markdown');
      await parsePromise;

      expect(store.isParsing).toBe(false);
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

    it('should toggle theme from dark to light', () => {
      // Mock localStorage
      const setItemMock = vi.fn();
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: vi.fn(),
          setItem: setItemMock,
        },
        writable: true
      });

      // Mock document.documentElement
      const classListMock = {
        toggle: vi.fn()
      };
      Object.defineProperty(document.documentElement, 'classList', {
        value: classListMock,
        writable: true
      });

      store.theme = 'dark';
      store.toggleTheme();

      expect(store.theme).toBe('light');
      expect(setItemMock).toHaveBeenCalledWith('theme', 'light');
      expect(classListMock.toggle).toHaveBeenCalledWith('dark', false);
    });

    it('should toggle theme from light to dark', () => {
      // Mock localStorage
      const setItemMock = vi.fn();
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: vi.fn(),
          setItem: setItemMock,
        },
        writable: true
      });

      // Mock document.documentElement
      const classListMock = {
        toggle: vi.fn()
      };
      Object.defineProperty(document.documentElement, 'classList', {
        value: classListMock,
        writable: true
      });

      store.theme = 'light';
      store.toggleTheme();

      expect(store.theme).toBe('dark');
      expect(setItemMock).toHaveBeenCalledWith('theme', 'dark');
      expect(classListMock.toggle).toHaveBeenCalledWith('dark', true);
    });
  });

  describe('getters', () => {
    let store: ReturnType<typeof useStore>;

    beforeEach(() => {
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

    it('should return whether a draft was restored', () => {
      expect(store.getIsDraftRestored).toBe(false);

      store.markdown = '# Restored';
      store.restoredDraft = '# Restored';

      expect(store.getIsDraftRestored).toBe(true);

      store.markdown = '# Edited';

      expect(store.getIsDraftRestored).toBe(false);
    });

    it('should return current theme', () => {
      store.theme = 'dark';
      expect(store.getTheme).toBe('dark');

      store.theme = 'light';
      expect(store.getTheme).toBe('light');
    });
  });
});
