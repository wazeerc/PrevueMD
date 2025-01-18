<script setup lang="ts">
import { ref, watch } from 'vue';
import { useScrollSync } from '@/composables/useScrollSync';
import { cn } from "@/utils/lib";
import { useStore } from "@/store";
import IconButton from "./IconButton.vue";

const store = useStore();

const handleInput = (event: Event): void => {
  const markdownInput: string = (event.target as HTMLTextAreaElement).value;
  store.setMarkdown(markdownInput);
  store.handleParseMarkdown(markdownInput);
};
const handleClearInput = (): void => store.clearMarkdown();

const editorRef = ref<HTMLTextAreaElement | null>(null);
const { onScroll, syncScroll } = useScrollSync(editorRef);

const emit = defineEmits<{ scroll: [percentage: number]; }>();
const props = defineProps<{ scrollPercentage: number; }>();

watch(() => props.scrollPercentage, syncScroll);
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center">
      <h3 class="sub-heading">Editor</h3>
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
              placeholder="Write some Markdown"
              :class="cn('markdown-container', 'resize-none', 'text-sm font-mono font-normal')"
              :value="store.getMarkdown"
              @input="handleInput"
              @scroll="() => onScroll(p => emit('scroll', p))">
    </textarea>
  </div>
</template>
