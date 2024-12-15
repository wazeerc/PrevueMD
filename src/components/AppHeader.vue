<script setup lang="ts">
import { cn } from "@/utils/lib";
import IconButton from "./IconButton.vue";

defineProps({
  processedMarkdown: {
    type: [Object, String],
    required: true,
    default: ''
  }
});

const downloadMarkdown = () => { };
</script>

<template>
  <header class="header-footer border-b-2">
    <h1 :class="cn('font-sans font-bold text-neutral-200', 'text-lg', 'sm:text-xl', 'md:text-2xl',
      'motion-preset-rebound-right motion-delay-75',
      'hover:motion-preset-confetti hover:cursor-default')">
      Prevue<span
            :class="cn('font-sans font-bold text-[--vue-color-primary]', 'text-lg', 'sm:text-xl', 'md:text-2xl')">MD</span>
    </h1>
    <h2 :class="cn('text-neutral-400', 'pl-2', 'mt-4', 'font-medium', 'text-sm', 'sm:text-base',
      'motion-preset-blur-up-md motion-delay-500')">
      A real-time Markdown editor.
    </h2>
    <IconButton @click="downloadMarkdown"
                :disabled="!processedMarkdown"
                icon="download"
                class="motion-preset-rebound-left motion-delay-150"
                variant="primary"
                size="md" />
  </header>
</template>
