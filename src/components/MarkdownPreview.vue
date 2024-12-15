<script setup lang="ts">
import IconButton from "./IconButton.vue";

const props = defineProps({
  processedMarkdown: {
    type: [Object, String],
    required: true,
    default: ''
  },
});

const emit = defineEmits(['handle-copyToClipboard']);
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center">
      <h3 class="sub-heading">Preview</h3>
      <div class="flex space-x-2">
        <IconButton :disabled="!props.processedMarkdown"
                    @click="() => emit('handle-copyToClipboard')"
                    icon="clipboard"
                    variant="secondary"
                    size="md" />
      </div>
    </div>
    <div class="markdown-container">
      <div class="prose prose-invert"
           v-html="processedMarkdown">
      </div>
    </div>
  </div>
</template>
