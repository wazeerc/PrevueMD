<script setup lang="ts">
import { useStore } from "../store";
import IconButton from "./IconButton.vue";

const store = useStore();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center">
      <h3 class="sub-heading">Preview</h3>
      <div class="flex space-x-2">
        <IconButton :disabled="!store.getMarkdown"
                    @click="store.handleCopyToClipboard"
                    icon="clipboard"
                    variant="secondary"
                    size="md" />
      </div>
    </div>
    <div class="markdown-container">
      <div class="prose prose-invert"
           v-html="store.getMarkup?.value ?? ''">
      </div>
    </div>
  </div>
</template>
