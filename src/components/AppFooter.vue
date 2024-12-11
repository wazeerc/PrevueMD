<script setup lang="ts">
import cn from "@/utils/lib";
</script>

<template>
  <footer class="header-footer border-t-2">
    <p :class="cn('flex items-center gap-2 font-sans font-normal text-neutral-500', 'text-xs',
      'sm:text-sm', 'md:text-xs',
      'motion-preset-fade-lg motion-delay-200',
    )">
      Built with Vue
      <a href="https://vuejs.org"
         target="_blank">
        <img src="/vue.svg"
             alt="Vue Icon"
             :class="cn('h-4 w-4', 'sm:h-5 sm:w-5', 'md:h-6 md:w-6', 'hover:motion-preset-wiggle')" />
      </a>
    </p>
    <a href="https://github.com/wazeerc/PrevueMD"
       target="_blank"
       :class="cn(
        'font-sans font-normal text-neutral-500',
        'text-xs',
        'sm:text-sm',
        'md:text-xs',
        'motion-preset-fade-lg motion-delay-200',
        'hover:underline hover:text-neutral-400 transition-colors ease duration-200',
      )">
      Collaborate here!
    </a>
  </footer>
</template>
