<script setup lang="ts">
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownPreview from './MarkdownPreview.vue'
</script>

<template>
    <main class="flex flex-col md:flex-row gap-4 md:gap-12 p-4 md:p-8 m-10 w-[70rem] bg-gray-800 rounded-md">
        <MarkdownEditor class="w-full md:w-1/2" />
        <MarkdownPreview class="w-full md:w-1/2" />
    </main>
</template>