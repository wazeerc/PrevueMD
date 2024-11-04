<script setup lang="ts">
import cn from "../utils/lib"
</script>

<template>
  <footer class="header-footer border-t-2">
    <p :class="cn('font-sans font-normal text-neutral-500', 'text-xs', 'sm:text-sm', 'md:text-xs', 
      'motion-preset-rebound-right motion-delay-200')">
      Built with Vue
    </p>
    <a href="https://github.com/wazeerc/PrevueMD" target="_blank" :class="cn(
      'font-sans font-normal text-neutral-500',
      'text-xs',
      'sm:text-sm',
      'md:text-xs',
      'underline',
      'motion-preset-rebound-left motion-delay-200',
      'hover:text-neutral-400 transition-colors ease duration-200',
    )">Collaborate here!</a>
  </footer>
</template>