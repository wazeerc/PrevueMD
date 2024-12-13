<script setup lang="ts">
import { cn } from "@/utils/lib";
</script>

<template>
  <header class="header-footer border-b-2">
    <h1 :class="cn('font-sans font-bold text-neutral-200', 'text-lg', 'sm:text-xl', 'md:text-2xl',
      'motion-preset-rebound-right motion-delay-75',
      'hover:motion-preset-confetti hover:cursor-default')">
      Prevue<span
            :class="cn('font-sans font-bold text-[--vue-color-primary]', 'text-lg', 'sm:text-xl', 'md:text-2xl')">MD</span>
    </h1>
    <button :disabled="true"
            :class="cn(
              'group flex items-center rounded-md bg-neutral-200 font-sans font-semibold text-neutral-800 drop-shadow-sm',
              'px-2 py-1 text-xs',
              'sm:px-3 sm:py-2 sm:text-sm',
              'md:px-4 md:py-3 md:text-xs',
              'motion-preset-rebound-left motion-delay-150',
              'hover:bg-neutral-300 hover:text-neutral-950 transition-colors ease duration-200',
              'disabled:opacity-20 disabled:cursor-not-allowed'
            )">
      Open from
      <img src="/github.svg"
           alt="GitHub Icon"
           :class="cn('ml-2 h-4 w-4', 'sm:h-5 sm:w-5', 'md:h-6 md:w-6',
            'group-hover:motion-preset-wiggle')" />
    </button>
  </header>
</template>
