<script setup lang="ts">
type TooltipDirection = 'bottom' | 'top';

defineProps<{
  text: string;
  direction?: TooltipDirection;
}>();
</script>

<template>
  <div class="group relative inline-flex">
    <slot />
    <span v-if="text"
          role="tooltip"
          class="hidden md:block absolute left-1/2 -translate-x-1/2 px-2 py-1
                 whitespace-nowrap font-sans text-xs rounded-md z-40
                 dark:bg-neutral-800 dark:text-neutral-200
                 bg-neutral-200 text-neutral-800
                 outline outline-2 outline-[--vue-color-secondary]
                 pointer-events-none
                 opacity-0 invisible
                 transition-all duration-200 ease-in
                 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100
                  group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100"
          :class="direction === 'top'
            ? 'bottom-full mb-2 -translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0'
            : 'top-full mt-2 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0'">
      {{ text }}
    </span>
  </div>
</template>
