<script setup lang="ts">
import { ref } from "vue";

import { cn } from "@/utils/lib";
import IconButton from "./IconButton.vue";

const EMPTY_STRING = '' as const;

const rawMarkdown = ref<string>(EMPTY_STRING);
const emit = defineEmits(['process-markdown']);

const handleInput = (event: Event): void => {
  const markdownInput: string = (event.target as HTMLTextAreaElement).value;
  rawMarkdown.value = markdownInput;

  emit('process-markdown', markdownInput);
};

const handleClearInput = (): void => {
  rawMarkdown.value = EMPTY_STRING;

  emit('process-markdown', EMPTY_STRING);
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center">
      <h3 class="sub-heading">Editor</h3>
      <IconButton :disabled="!rawMarkdown"
                  @click="handleClearInput"
                  :state="!rawMarkdown ? 'disabled' : 'default'"
                  icon="reset"
                  variant="secondary"
                  size="md" />
    </div>
    <textarea autofocus
              placeholder="Write some Markdown"
              :class="cn('markdown-container', 'resize-none', 'text-sm font-mono',)"
              :value="rawMarkdown"
              @input="handleInput">
    </textarea>
  </div>
</template>
