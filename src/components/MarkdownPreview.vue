<script setup lang="ts">
import cn from "../utils/lib";
</script>

<template>
  <div class="flex flex-col">
    <h3 class="sub-heading">Preview</h3>
    <div class="markdown-container">
      <code :class="cn('font-mono', 'text-neutral-200')">Some Markdown</code>
    </div>
  </div>
</template>
