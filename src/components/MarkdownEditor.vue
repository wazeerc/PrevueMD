<script setup lang="ts">
import cn from "../utils/lib"
</script>

<template>
  <div class="flex flex-col">
    <h3 class="sub-heading">Editor</h3>
    <textarea placeholder="Write some Markdown"
      :class="cn('markdown-container', 'resize-none', 'font-mono')"></textarea>
  </div>
</template>
