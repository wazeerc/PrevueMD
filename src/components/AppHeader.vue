<script setup lang="ts">
import { useStore } from "@/store";
import { cn, debounce } from "@/utils/lib";
import IconButton from "./IconButton.vue";

const store = useStore();
const debouncedDownload = debounce(store.handleDownloadMarkdownFile);
</script>

<template>
  <header class="header-footer border-b-2">
    <h1 :class="cn('font-sans font-bold text-neutral-700 dark:text-neutral-200', 'text-lg', 'sm:text-xl', 'md:text-2xl',
      'motion-preset-rebound-right motion-delay-75',
      'hover:motion-preset-confetti hover:cursor-default')">
      Prevue<span
            :class="cn('font-sans font-bold text-[--vue-color-primary]', 'text-lg', 'sm:text-xl', 'md:text-2xl')">MD</span>
    </h1>
    <h2 :class="cn('text-neutral-500 dark:text-neutral-400', 'pl-2', 'mt-4', 'font-medium', 'text-sm', 'sm:text-base',
      'motion-preset-blur-up-md motion-delay-500', 'hidden lg:block')">
      A real-time
      <a :class="cn(
        'underline cursor-help',
        'hover:text-neutral-600 dark:hover:text-neutral-500 transition-colors ease duration-200'
      )"
         href="https://commonmark.org/help/"
         target="_blank"
         rel="noopener noreferrer">
        Markdown</a> editor
    </h2>
    <div class="flex gap-2">
      <IconButton @click="store.toggleTheme"
                  :icon="store.getTheme === 'dark' ? 'sun' : 'moon'"
                  class="motion-preset-rebound-left motion-delay-100"
                  variant="primary"
                  :tooltip="store.getTheme === 'dark' ? 'Light Mode' : 'Dark Mode'"
                  size="md" />
      <IconButton @click="debouncedDownload"
                  :disabled="!store.getMarkdown"
                  icon="download"
                  class="motion-preset-rebound-left motion-delay-150"
                  variant="primary"
                  tooltip="Download Markdown"
                  size="md" />
    </div>
  </header>
</template>
