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

interface MarkdownStats {
  characters: number;
  words: number;
}

interface ParseMarkdownOptions {
  showLoaderImmediately?: boolean;
}

interface StoreActions {
  setMarkdown(markdownText: string): void;
  setMarkup(markupText: string): void;
  clearMarkdown(): void;
  handleParseMarkdown(rawMarkdown: string, options?: ParseMarkdownOptions): void;
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
  getMarkdownStats: (state: StoreState) => MarkdownStats;
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

function isWhitespaceCode(code: number): boolean {
  return code <= 32
    || code === 160
    || code === 5760
    || (code >= 8192 && code <= 8202)
    || code === 8232
    || code === 8233
    || code === 8239
    || code === 8287
    || code === 12288;
}

function countWords(text: string): number {
  let wordCount = 0;
  let isInsideWord = false;

  for (let index = 0; index < text.length; index += 1) {
    if (isWhitespaceCode(text.charCodeAt(index))) {
      isInsideWord = false;
    } else if (!isInsideWord) {
      wordCount += 1;
      isInsideWord = true;
    }
  }

  return wordCount;
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
    async handleParseMarkdown(rawMarkdown: string, options: ParseMarkdownOptions = {}) {
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
      const showLoaderImmediately = options.showLoaderImmediately ?? rawMarkdown.length >= LARGE_MARKDOWN_LENGTH;

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
    getMarkdownStats: (state) => {
      const markdown = state.markdown ?? '';

      return {
        characters: markdown.length,
        words: countWords(markdown),
      };
    },
  },
});
