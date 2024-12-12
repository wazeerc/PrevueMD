<script setup lang="ts">
import { cn } from "@/utils/lib";
import { ref } from "vue";

const rawMarkdown = ref<string>('');
const emit = defineEmits(['process-markdown']);

const handleInput = (event: Event) => {
  const markdownInput: string = (event.target as HTMLTextAreaElement).value;
  rawMarkdown.value = markdownInput;

  emit('process-markdown', markdownInput);
};
</script>

<template>
  <div class="flex flex-col">
    <h3 class="sub-heading">Editor</h3>
    <textarea autofocus
              placeholder="Write some Markdown"
              :class="cn('markdown-container', 'resize-none', 'font-mono')"
              :value="rawMarkdown"
              @input="handleInput">
    </textarea>
  </div>
</template>
