import { copyToClipboard, downloadMarkdownFile, parseMarkdown } from "@/utils/lib";
import { defineStore } from "pinia";

interface StoreState {
  markdown: string | undefined;
  markup: string | undefined;
}

interface StoreActions {
  setMarkdown(markdownText: string): void;
  setMarkup(markupText: string): void;
  clearMarkdown(): void;
  handleParseMarkdown(rawMarkdown: string): void;
  handleCopyToClipboard(): void;
  handleDownloadMarkdownFile(): void;
}

interface StoreGetters extends Record<string, (state: StoreState) => any> {
  getMarkdown: (state: StoreState) => string | undefined;
  getMarkup: (state: StoreState) => string | undefined;
}

export const useStore = defineStore<
  'useStore',
  StoreState,
  StoreGetters,
  StoreActions
>('useStore', {
  state: () => ({
    markdown: '' as string | undefined,
    markup: '' as string | undefined,
  }),
  actions: {
    setMarkdown(markdownText: string) {
      this.markdown = markdownText;
    },
    setMarkup(markupText: string) {
      this.markup = markupText;
    },
    clearMarkdown() {
      this.markdown = '';
      this.markup = undefined;
    },
    async handleParseMarkdown(rawMarkdown: string) {
      this.setMarkup((await parseMarkdown(rawMarkdown)).toString());
    },
    handleCopyToClipboard() {
      copyToClipboard(this.markdown || '');
    },
    handleDownloadMarkdownFile() {
      downloadMarkdownFile(this.markdown || '');
    },
  },
  getters: {
    getMarkdown: (state) => state.markdown || '',
    getMarkup: (state) => state.markup || '',
  },
});
