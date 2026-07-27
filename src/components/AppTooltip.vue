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
                 bg-neutral-800/80 text-neutral-400
                 outline outline-1 outline-[--vue-color-secondary]
                 pointer-events-none
                 opacity-0 invisible
                 transition-all duration-200 ease-in
                 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100"
          :class="direction === 'top'
            ? 'bottom-full mb-2 -translate-y-2 group-hover:translate-y-0'
            : 'top-full mt-2 translate-y-2 group-hover:translate-y-0'">
      {{ text }}
    </span>
  </div>
</template>
