<script setup lang="ts">
import { cn } from "@/utils/lib";
import { ref } from 'vue';
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
    'justify-center m-4 flex flex-col gap-4 overflow-auto',
    'sm:mx-8 sm:my-6',
    'lg:mx-32 lg:my-10',
    'motion-preset-slide-up-sm motion-delay-300'
  )">
    <section :class="cn(
      'w-full flex flex-col h-full rounded-md bg-neutral-800 border-2 border-neutral-500/10',
      'p-2 drop-shadow-xl',
      'md:flex-row md:gap-8 md:p-4',
      'lg:gap-8 lg:p-6',
      'xs:gap-2'
    )">
      <div class="h-[calc(50%-0.5rem)] md:h-full w-full md:w-1/2">
        <MarkdownEditor class="h-full"
                        :scroll-percentage="scrollPercentage"
                        @scroll="handleScroll" />
      </div>
      <div class="h-[calc(50%-0.5rem)] md:h-full w-full md:w-1/2"
           tabindex="-1">
        <MarkdownPreview class="h-full"
                         :scroll-percentage="scrollPercentage"
                         @scroll="handleScroll" />
      </div>
    </section>
  </main>
  <Footer />
</template>
