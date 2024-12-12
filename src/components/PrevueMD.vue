<script setup lang="ts">
import { ref } from "vue";

import { cn, parseMarkdown } from "@/utils/lib";
import Footer from "./AppFooter.vue";
import Header from "./AppHeader.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import MarkdownPreview from "./MarkdownPreview.vue";

const globalMarkdown = ref();

const processMarkdown = (markdownInput: string) =>
  globalMarkdown.value = parseMarkdown(markdownInput);
</script>

<template>
  <Header />

  <main :class="cn(
    'mx-4 my-4 flex flex-col gap-4 overflow-y-auto',
    'sm:mx-8 sm:my-6',
    'lg:mx-32 lg:my-10',
    'motion-preset-slide-up-sm motion-delay-300'
  )">
    <h2 :class="cn('text-neutral-400', 'pl-2', 'font-medium', 'text-sm', 'sm:text-base',
      'motion-preset-blur-right-md motion-delay-500')">
      A real-time Markdown editor for your READMEs.
    </h2>
    <section :class="cn(
      'w-full flex flex-col gap-4 overflow-y-auto rounded-md bg-neutral-800',
      'p-2 drop-shadow-xl',
      'md:flex-row md:gap-8 md:p-4',
      'lg:gap-8 lg:p-6',
    )">
      <MarkdownEditor :class="cn('w-full', 'md:w-1/2',)"
                      @process-markdown="processMarkdown" />
      <MarkdownPreview :class="cn('w-full', 'md:w-1/2')"
                       :processedMarkdown="globalMarkdown" />
    </section>
  </main>

  <Footer />
</template>
