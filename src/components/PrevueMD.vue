<script setup lang="ts">
import { cn } from "../utils"
import MarkdownEditor from "./MarkdownEditor.vue"
import MarkdownPreview from "./MarkdownPreview.vue"
</script>

<template>
  <header class="header-footer border-b-2">
    <h1 :class="cn('font-sans font-bold text-neutral-200', 'text-lg', 'sm:text-xl', 'md:text-2xl',
      'hover:motion-preset-confetti hover:cursor-default')">
      PrevueMD
    </h1>
    <button :class="cn(
      'group flex items-center rounded-md bg-neutral-200 font-sans font-semibold text-neutral-800 drop-shadow-sm',
      'px-2 py-1 text-xs',
      'sm:px-3 sm:py-2 sm:text-sm',
      'md:px-4 md:py-3 md:text-xs',
      'hover:bg-neutral-300 hover:text-neutral-950 transition-colors ease duration-200',
    )">
      Open from
      <img src="/github.svg" alt="GitHub Icon" :class="cn('ml-2 h-6 w-6', 'group-hover:motion-preset-wiggle')" />
    </button>
  </header>

  <main :class="cn(
    'mx-4 my-4 flex flex-col gap-4 overflow-y-auto',
    'sm:mx-8 sm:my-6',
    'lg:mx-32 lg:my-10',
  )">
    <div :class="cn('w-full')">
      <h2 :class="cn('text-neutral-400' ,'pl-2', 'font-medium', 'text-sm', 'sm:text-base')">
        A real-time Markdown editor for your READMEs.
      </h2>
      <!-- TODO: Remove this after 10s or as soon as user starts writing -->
      <!-- <span :class="cn('motion-preset-flomoji-👉')"></span> -->
    </div>
    <div :class="cn(
      'w-full flex flex-col gap-4 overflow-y-auto rounded-md bg-neutral-800' ,
      'p-2 drop-shadow-xl',
      'md:flex-row md:gap-8 md:p-4',
      'lg:gap-8 lg:p-6',
    )">
      <MarkdownEditor :class="cn('w-full', 'md:w-1/2',)" />
      <MarkdownPreview :class="cn('w-full', 'md:w-1/2')" />
    </div>
  </main>

  <footer class="header-footer border-t-2">
    <span :class="cn('font-sans font-normal text-neutral-500', 'text-xs', 'sm:text-sm', 'md:text-xs', 
      'motion-preset-rebound-right')">
      Built with Vue
    </span>
    <a href="https://github.com/wazeerc/PrevueMD" target="_blank" :class="cn(
      'font-sans font-normal text-neutral-500',
      'text-xs',
      'sm:text-sm',
      'md:text-xs',
      'underline',
      'motion-preset-rebound-left',
      'hover:text-neutral-400',
    )">Collaborate here!</a>
  </footer>
</template>
