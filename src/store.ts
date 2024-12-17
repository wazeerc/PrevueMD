import { copyToClipboard, downloadMarkdownFile, parseMarkdown } from "@/utils/lib";
import type { VFile } from "node_modules/rehype-raw/lib";
import { defineStore } from "pinia";

interface StoreState {
  markdown: string | undefined;
  markup: VFile | undefined;
}

interface StoreActions {
  setMarkdown(markdownText: string): void;
  setMarkup(VFile: VFile): void;
  clearMarkdown(): void;
  handleParseMarkdown(rawMarkdown: string): void;
  handleCopyToClipboard(): void;
  handleDownloadMarkdownFile(): void;
}

interface StoreGetters extends Record<string, (state: StoreState) => any> {
  getMarkdown: (state: StoreState) => string | undefined;
  getMarkup: (state: StoreState) => VFile | undefined;
}

export const useStore = defineStore<
  'useStore',
  StoreState,
  StoreGetters,
  StoreActions
>('useStore', {
  state: () => ({
    markdown: '' as string | undefined,
    markup: undefined as VFile | undefined,
  }),
  actions: {
    setMarkdown(markdownText: string) {
      this.markdown = markdownText;
    },
    setMarkup(VFile: VFile) {
      this.markup = VFile;
    },
    clearMarkdown() {
      this.markdown = '';
      this.markup = undefined;
    },
    async handleParseMarkdown(rawMarkdown: string) {
      this.setMarkup(await parseMarkdown(rawMarkdown));
    },
    handleCopyToClipboard() {
      copyToClipboard(this.markdown || '');
    },
    handleDownloadMarkdownFile() {
      downloadMarkdownFile(this.markdown || '');
    },
  },
  getters: {
    getMarkdown: (state) => state.markdown,
    getMarkup: (state) => state.markup,
  },
});
