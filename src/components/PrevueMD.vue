<script setup lang="ts">
import cn from "../utils/lib";
import Header from "./AppHeader.vue";
import Footer from "./AppFooter.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import MarkdownPreview from "./MarkdownPreview.vue";
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
    <!-- TODO: Remove this after 10s or as soon as user starts writing -->
    <!-- <span :class="cn('motion-preset-flomoji-👉')"></span> -->
    <section :class="cn(
      'w-full flex flex-col gap-4 overflow-y-auto rounded-md bg-neutral-800',
      'p-2 drop-shadow-xl',
      'md:flex-row md:gap-8 md:p-4',
      'lg:gap-8 lg:p-6',
    )">
      <MarkdownEditor :class="cn('w-full', 'md:w-1/2',)" />
      <MarkdownPreview :class="cn('w-full', 'md:w-1/2')" />
    </section>
  </main>

  <Footer />
</template>
