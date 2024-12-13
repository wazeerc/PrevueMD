<script setup lang="ts">
defineProps({
  processedMarkdown: {
    type: [Object, String],
    required: true,
    default: ''
  }
});
</script>

<template>
  <div class="flex flex-col">
    <h3 class="sub-heading">Preview</h3>
    <div class="markdown-container">
      <div class="prose prose-invert"
           v-html="processedMarkdown">
      </div>
    </div>
  </div>
</template>
