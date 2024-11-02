<script setup lang="ts">
import { cn } from "../utils"
</script>

<template>
  <div class="flex flex-col">
    <h2 class="sub-heading">Preview</h2>
    <div class="markdown-container">
      <code :class="cn('font-mono', 'text-neutral-200')">Some Markdown</code>
    </div>
  </div>
</template>
