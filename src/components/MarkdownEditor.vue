<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { cn } from "@/utils/lib";
import { computed, ref, watch } from 'vue';
import IconButton from "./IconButton.vue";

const store = useStore();

const handleInput = (event: Event): void => {
  const markdownInput: string = (event.target as HTMLTextAreaElement).value;
  if (markdownInput === store.getMarkdown) return;

  store.setMarkdown(markdownInput);
  store.handleParseMarkdown(markdownInput);
};
const handleClearInput = (): void => store.clearMarkdown();

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
        <span class="text-sm text-neutral-500 dark:text-neutral-400"
              aria-live="polite">
          ({{ editorStats.words }} words, {{ editorStats.characters }} characters)
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
