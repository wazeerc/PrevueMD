<script setup lang="ts">
import { cn } from "@/utils/lib";
</script>

<template>
  <footer class="header-footer border-t-2">
    <p :class="cn('flex items-center gap-2 font-sans font-normal text-neutral-400 dark:text-neutral-400', 'text-xs',
      'sm:text-sm', 'md:text-xs',
      'motion-preset-fade-lg motion-delay-200',
    )">
      Built with Vue
      <a href="https://vuejs.org"
         target="_blank">
        <img src="/vue.svg"
             alt="Vue Icon"
             :class="cn('h-4 w-4', 'md:h-5 md:w-5', 'hover:motion-preset-wiggle', 'grayscale hover:grayscale-0 transition-all duration-200')" />
      </a>
    </p>
    <a href="https://github.com/wazeerc/PrevueMD"
       target="_blank"
       :class="cn(
        'font-sans font-normal text-neutral-400 dark:text-neutral-400',
        'text-xs',
        'sm:text-sm',
        'md:text-xs',
        'motion-preset-fade-lg motion-delay-200',
        'hover:underline hover:text-neutral-500 dark:hover:text-neutral-500 transition-colors ease duration-200',
      )">
      Contribute here!
    </a>
  </footer>
</template>
