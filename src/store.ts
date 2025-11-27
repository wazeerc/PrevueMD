import { copyToClipboard, downloadMarkdownFile, warnBeforeUnload } from "@/utils/lib";
import { parseMarkdown } from "@/utils/markdown-parser";
import { defineStore } from "pinia";

interface StoreState {
  markdown: string | null;
  markup: string | null;
  unloadWarning: (() => void) | null;
  theme: 'light' | 'dark';
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

interface StoreGetters extends Record<string, (state: StoreState) => string | null> {
  getMarkdown: (state: StoreState) => string | null;
  getMarkup: (state: StoreState) => string | null;
  getTheme: (state: StoreState) => 'light' | 'dark';
}

export const initialState: Readonly<StoreState> = {
  markdown: null,
  markup: null,
  unloadWarning: null,
  theme: 'dark'
};

export const useStore = defineStore<
  'useStore',
  StoreState,
  StoreGetters,
  StoreActions
>('useStore', {
  state: () => (initialState),
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

      this.unloadWarning?.();
      this.unloadWarning = null;
    },
    async handleParseMarkdown(rawMarkdown: string) {
      this.setMarkup(await parseMarkdown(rawMarkdown));
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
  },
});
