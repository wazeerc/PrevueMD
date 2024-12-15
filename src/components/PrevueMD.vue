<script setup lang="ts">
import { ref } from "vue";

import { cn, copyToClipboard, downloadMarkdownFile, parseMarkdown } from "@/utils/lib";
import type { VFile } from "node_modules/rehype-raw/lib";

import Footer from "./AppFooter.vue";
import Header from "./AppHeader.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import MarkdownPreview from "./MarkdownPreview.vue";

const rawMarkdown = ref<string>('');
const globalMarkdown = ref<VFile>();

const processMarkdown = async (markdownInput: string): Promise<void> => {
  rawMarkdown.value = markdownInput;

  globalMarkdown.value = markdownInput ? await parseMarkdown(markdownInput) : undefined;
};
</script>

<template>
  <Header :processedMarkdown="globalMarkdown"
          @handle-downloadMarkdown="() => downloadMarkdownFile(rawMarkdown)" />

  <main :class="cn(
    'mx-4 my-4 flex flex-col gap-4 overflow-y-auto',
    'sm:mx-8 sm:my-6',
    'lg:mx-32 lg:my-10',
    'motion-preset-slide-up-sm motion-delay-300'
  )">
    <section :class="cn(
      'w-full flex flex-col gap-4 overflow-y-auto rounded-md bg-neutral-800',
      'p-2 drop-shadow-xl',
      'md:flex-row md:gap-8 md:p-4',
      'lg:gap-8 lg:p-6',
    )">
      <MarkdownEditor :class="cn('w-full', 'md:w-1/2',)"
                      @process-markdown="processMarkdown" />
      <MarkdownPreview :class="cn('w-full', 'md:w-1/2')"
                       :processedMarkdown="globalMarkdown"
                       @handle-copyToClipboard="() => copyToClipboard(rawMarkdown)" />
    </section>
  </main>

  <Footer />
</template>
