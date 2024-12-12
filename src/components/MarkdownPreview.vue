<script setup lang="ts">
import { cn } from "@/utils/lib";

defineProps({
  processedMarkdown: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div class="flex flex-col">
    <h3 class="sub-heading">Preview</h3>
    <div class="markdown-container">
      <code :class="cn('font-mono', 'text-neutral-200',)">{{ processedMarkdown }}</code>
    </div>
  </div>
</template>
