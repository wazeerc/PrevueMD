<script setup lang="ts">
import { cn } from "../utils"
</script>

<template>
  <div class="flex flex-col">
    <h2 class="sub-heading">Editor</h2>
    <textarea placeholder="Write some Markdown"
      :class="cn('markdown-container', 'resize-none', 'font-mono')"></textarea>
  </div>
</template>
