import { copyToClipboard, downloadMarkdownFile, warnBeforeUnload } from "@/utils/lib";
import { getCachedMarkdown, parseMarkdown } from "@/utils/markdown-parser";
import { defineStore } from "pinia";

interface StoreState {
  markdown: string | null;
  markup: string | null;
  unloadWarning: (() => void) | null;
  theme: 'light' | 'dark';
  isParsing: boolean;
  parseRequestId: number;
  lastParsedMarkdown: string | null;
}

interface StoreActions {
  setMarkdown(markdownText: string): void;
  setMarkup(markupText: string): void;
  clearMarkdown(): void;
  handleParseMarkdown(rawMarkdown: string): void;
  handleCopyToClipboard(): void;
  handleDownloadMarkdownFile(): void;
  toggleTheme(): void;
  initTheme(): void;
}

interface StoreGetters extends Record<string, (state: StoreState) => unknown> {
  getMarkdown: (state: StoreState) => string | null;
  getMarkup: (state: StoreState) => string | null;
  getTheme: (state: StoreState) => 'light' | 'dark';
  getIsParsing: (state: StoreState) => boolean;
}

export const initialState: Readonly<StoreState> = {
  markdown: null,
  markup: null,
  unloadWarning: null,
  theme: 'dark',
  isParsing: false,
  parseRequestId: 0,
  lastParsedMarkdown: null,
};

const LARGE_MARKDOWN_LENGTH = 5000;
const SLOW_PARSE_LOADER_DELAY = 150;
let parsingLoaderTimeout: ReturnType<typeof setTimeout> | null = null;

function clearParsingLoaderTimeout(): void {
  if (!parsingLoaderTimeout) return;

  clearTimeout(parsingLoaderTimeout);
  parsingLoaderTimeout = null;
}

function waitForPreviewPaint(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.requestAnimationFrame) {
      setTimeout(resolve, 0);
      return;
    }

    window.requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}

export const useStore = defineStore<
  'useStore',
  StoreState,
  StoreGetters,
  StoreActions
>('useStore', {
  state: () => ({ ...initialState }),
  actions: {
    setMarkdown(markdownText: string) {
      this.markdown = markdownText;

      this.unloadWarning?.();
      this.unloadWarning = markdownText.trim() ? warnBeforeUnload() : null;
    },
    setMarkup(markupText: string) {
      this.markup = markupText;
    },
    clearMarkdown() {
      this.markdown = null;
      this.markup = null;
      this.lastParsedMarkdown = null;
      clearParsingLoaderTimeout();
      this.isParsing = false;
      this.parseRequestId += 1;

      this.unloadWarning?.();
      this.unloadWarning = null;
    },
    async handleParseMarkdown(rawMarkdown: string) {
      if (rawMarkdown === this.lastParsedMarkdown && this.markup !== null) return;

      const cachedMarkup = getCachedMarkdown(rawMarkdown);
      if (cachedMarkup !== null) {
        clearParsingLoaderTimeout();
        this.parseRequestId += 1;
        this.isParsing = false;
        this.lastParsedMarkdown = rawMarkdown;
        this.setMarkup(cachedMarkup);
        return;
      }

      const requestId = this.parseRequestId + 1;
      const showLoaderImmediately = rawMarkdown.length >= LARGE_MARKDOWN_LENGTH;

      this.parseRequestId = requestId;
      clearParsingLoaderTimeout();

      if (showLoaderImmediately) {
        this.isParsing = true;
      } else {
        this.isParsing = false;
        parsingLoaderTimeout = setTimeout(() => {
          if (requestId === this.parseRequestId) this.isParsing = true;
        }, SLOW_PARSE_LOADER_DELAY);
      }

      if (showLoaderImmediately) await waitForPreviewPaint();

      try {
        const parsedMarkup = await parseMarkdown(rawMarkdown);

        if (requestId === this.parseRequestId) {
          this.lastParsedMarkdown = rawMarkdown;
          this.setMarkup(parsedMarkup);
        }
      } finally {
        if (requestId === this.parseRequestId) {
          clearParsingLoaderTimeout();
          this.isParsing = false;
        }
      }
    },
    handleCopyToClipboard() {
      copyToClipboard(this.markdown ?? '');
    },
    handleDownloadMarkdownFile() {
      downloadMarkdownFile(this.markdown ?? '');
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme');
      this.theme = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    },
  },
  getters: {
    getMarkdown: (state) => state.markdown ?? '',
    getMarkup: (state) => state.markup ?? '',
    getTheme: (state) => state.theme,
    getIsParsing: (state) => state.isParsing,
  },
});
