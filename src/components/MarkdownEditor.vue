<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { cn, debounce } from "@/utils/lib";
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import IconButton from "./IconButton.vue";

const store = useStore();
const toast = useToast();

const MARKDOWN_FILE_EXTENSION = /\.md$/i;

function isMarkdownFile(file: File): boolean {
  return MARKDOWN_FILE_EXTENSION.test(file.name);
}

function isBinaryContent(content: string): boolean {
  return content.includes('\u0000');
}

const debouncedParse = debounce((markdown: unknown) => {
  store.handleParseMarkdown(markdown as string);
}, 300);

const fileInputRef = ref<HTMLInputElement | null>(null);

const handleImport = (): void => {
  fileInputRef.value?.click();
};

const handleFileSelected = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  target.value = '';
  if (!file) return;

  if (!isMarkdownFile(file)) {
    toast.error('Only Markdown (.md) files can be imported.');
    return;
  }

  debouncedParse.cancel();

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const content = e.target?.result;

    if (typeof content !== 'string' || isBinaryContent(content)) {
      toast.error('Only Markdown (.md) files can be imported.');
      return;
    }

    store.setMarkdown(content);
    store.handleParseMarkdown(content);
  };
  reader.onerror = () => toast.error('Failed to read the selected file.');
  reader.readAsText(file);
};

const handleInput = (event: Event): void => {
  const markdownInput: string = (event.target as HTMLTextAreaElement).value;
  if (markdownInput === store.getMarkdown) return;

  store.setMarkdown(markdownInput);
  debouncedParse(markdownInput);
};
const handleClearInput = (): void => {
  debouncedParse.cancel();
  store.clearMarkdown();
};

function countWords(text: string): number {
  let wordCount = 0;
  let isInsideWord = false;

  for (let index = 0; index < text.length; index += 1) {
    const isWhitespace = text.charCodeAt(index) <= 32;

    if (isWhitespace) {
      isInsideWord = false;
    } else if (!isInsideWord) {
      wordCount += 1;
      isInsideWord = true;
    }
  }

  return wordCount;
}

const editorStats = computed(() => {
  const markdown = store.getMarkdown;
  return {
    characters: (markdown ?? '').length,
    words: countWords(markdown ?? ""),
  };
});

const editorRef = ref<HTMLTextAreaElement | null>(null);
const { onScroll, syncScroll } = useScrollSync(editorRef);

const emit = defineEmits<{ scroll: [percentage: number]; }>();
const props = defineProps<{ scrollPercentage: number; }>();

watch(() => props.scrollPercentage, syncScroll);
</script>

<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex justify-between items-center">
      <div class="flex items-baseline gap-1">
        <h3 class="sub-heading">Editor</h3>
        <span class="text-sm text-neutral-500"
              aria-live="polite">
          ({{ editorStats.words }} words, {{ editorStats.characters }} characters)
        </span>
      </div>
      <div class="flex gap-2">
        <IconButton icon="upload"
                    @click="handleImport"
                    tooltip="Import"
                    variant="secondary"
                    size="md" />
        <IconButton :disabled="!store.getMarkdown"
                    @click="handleClearInput"
                    :state="!store.getMarkdown ? 'disabled' : 'default'"
                    icon="reset"
                    tooltip="Reset"
                    variant="secondary"
                    size="md" />
      </div>
    </div>
    <textarea ref="editorRef"
              autofocus
              placeholder="✏️ Start typing to edit and preview your Markdown in real-time.

📝 You can also paste existing content or import a .md file."
              :class="cn('markdown-container', 'resize-none', 'text-sm font-mono font-normal', 'flex-1', 'w-full')"
              :value="store.getMarkdown"
              @input="handleInput"
              @scroll="() => onScroll(p => emit('scroll', p))">
    </textarea>
    <input ref="fileInputRef"
           type="file"
           accept=".md,text/markdown"
           class="hidden"
           @change="handleFileSelected">
  </div>
</template>
