<script setup lang="ts">
import { ref } from 'vue';
import { cn } from "@/utils/lib";
import Footer from "./AppFooter.vue";
import Header from "./AppHeader.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import MarkdownPreview from "./MarkdownPreview.vue";

const scrollPercentage = ref(0);
const handleScroll = (percentage: number) => scrollPercentage.value = percentage;
</script>

<template>
  <Header />
  <main :class="cn(
    'mx-4 my-4 flex flex-col gap-4 overflow-y-auto',
    'sm:mx-8 sm:my-6',
    'lg:mx-32 lg:my-10',
    'motion-preset-slide-up-sm motion-delay-300'
  )">
    <section :class="cn(
      'w-full flex flex-col gap-4 overflow-y-auto rounded-md bg-neutral-800 border-2 border-neutral-500/10',
      'p-2 drop-shadow-xl',
      'md:flex-row md:gap-8 md:p-4',
      'lg:gap-8 lg:p-6',
    )">
      <MarkdownEditor :class="cn('w-full', 'md:w-1/2')"
                      :scroll-percentage="scrollPercentage"
                      @scroll="handleScroll" />
      <MarkdownPreview :class="cn('w-full', 'md:w-1/2')"
                       :scroll-percentage="scrollPercentage"
                       @scroll="handleScroll" />
    </section>
  </main>
  <Footer />
</template>
