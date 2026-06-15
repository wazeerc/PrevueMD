<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { cn } from "@/utils/lib";
import { onBeforeUnmount, ref, watch } from 'vue';
import IconButton from "./IconButton.vue";

const store = useStore();
const LARGE_INPUT_DELTA = 1000;
const TYPING_PARSE_DELAY = 250;
let parseTimeout: ReturnType<typeof setTimeout> | null = null;

function clearScheduledParse(): void {
  if (!parseTimeout) return;

  clearTimeout(parseTimeout);
  parseTimeout = null;
}

function isLargeInputChange(event: Event, previousMarkdown: string, nextMarkdown: string): boolean {
  if (typeof InputEvent !== 'undefined'
    && event instanceof InputEvent
    && ['insertFromPaste', 'insertFromDrop'].includes(event.inputType)
  ) return true;

  return Math.abs(nextMarkdown.length - previousMarkdown.length) >= LARGE_INPUT_DELTA;
}

function scheduleParseMarkdown(markdownInput: string, showLoaderImmediately: boolean): void {
  clearScheduledParse();

  if (showLoaderImmediately) {
    store.handleParseMarkdown(markdownInput, { showLoaderImmediately: true });
    return;
  }

  parseTimeout = setTimeout(() => {
    parseTimeout = null;
    store.handleParseMarkdown(markdownInput, { showLoaderImmediately: false });
  }, TYPING_PARSE_DELAY);
}

const handleInput = (event: Event): void => {
  const previousMarkdown = store.getMarkdown ?? '';
  const markdownInput: string = (event.target as HTMLTextAreaElement).value;
  if (markdownInput === store.getMarkdown) return;

  store.setMarkdown(markdownInput);
  scheduleParseMarkdown(markdownInput, isLargeInputChange(event, previousMarkdown, markdownInput));
};
const handleClearInput = (): void => {
  clearScheduledParse();
  store.clearMarkdown();
};

const editorRef = ref<HTMLTextAreaElement | null>(null);
const { onScroll, syncScroll } = useScrollSync(editorRef);

const emit = defineEmits<{ scroll: [percentage: number]; }>();
const props = defineProps<{ scrollPercentage: number; }>();

watch(() => props.scrollPercentage, syncScroll);
onBeforeUnmount(clearScheduledParse);
</script>

<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex justify-between items-center">
      <div class="flex items-baseline gap-1">
        <h3 class="sub-heading">Editor</h3>
        <span class="text-sm text-neutral-500 dark:text-neutral-400"
              aria-live="polite">
          ({{ store.getMarkdownStats.words }} words, {{ store.getMarkdownStats.characters }} characters)
        </span>
      </div>
      <IconButton :disabled="!store.getMarkdown"
                  @click="handleClearInput"
                  :state="!store.getMarkdown ? 'disabled' : 'default'"
                  icon="reset"
                  tooltip="Reset"
                  variant="secondary"
                  size="md" />
    </div>
    <textarea ref="editorRef"
              autofocus
              placeholder="✏️ Start typing to edit and preview your Markdown in real-time.

📝 You can also copy & paste existing content."
              :class="cn('markdown-container', 'resize-none', 'text-sm font-mono font-normal', 'flex-1', 'w-full')"
              :value="store.getMarkdown"
              @input="handleInput"
              @scroll="() => onScroll(p => emit('scroll', p))">
    </textarea>
  </div>
</template>
