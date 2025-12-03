<script setup lang="ts">
import { ref } from 'vue';

type Fonts = 'sans' | 'serif';

const props = defineProps<{ font: Fonts; }>();
const emit = defineEmits<{
  (e: 'update:font', font: Fonts): void;
}>();

const sansButtonRef = ref<HTMLButtonElement | null>(null);
const serifButtonRef = ref<HTMLButtonElement | null>(null);

const setFont = (font: Fonts) => {
  if (props.font === font) return;
  emit('update:font', font);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    setFont('serif');
    serifButtonRef.value?.focus();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    setFont('sans');
    sansButtonRef.value?.focus();
  }
};
</script>

<template>
  <div class="flex flex-row space-x-1 px-2 py-1 rounded-full
        bg-zinc-200 dark:bg-zinc-800 shadow-sm"
       role="radiogroup"
       aria-label="Font style"
       @keydown="handleKeydown">
    <button ref="sansButtonRef"
            class="font-sans font-bold px-2 rounded-full
                   transition-all duration-200 ease-in-out
                   hover:opacity-80 cursor-pointer"
            :class="{
              'bg-neutral-700 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800'
                : props.font === 'sans',
              'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                : props.font !== 'sans'
            }"
            type="button"
            role="radio"
            :tabindex="props.font === 'sans' ? 0 : -1"
            :aria-checked="props.font === 'sans'"
            aria-label="Sans-serif font"
            @click="setFont('sans')">
      T
    </button>
    <button ref="serifButtonRef"
            class="font-serif font-bold px-2 rounded-full
                   transition-all duration-200 ease-in-out
                   hover:opacity-80 cursor-pointer"
            :class="{
              'bg-neutral-700 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800'
                : props.font === 'serif',
              'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                : props.font !== 'serif'
            }"
            type="button"
            role="radio"
            :tabindex="props.font === 'serif' ? 0 : -1"
            :aria-checked="props.font === 'serif'"
            aria-label="Serif font"
            @click="setFont('serif')">
      T
    </button>
  </div>
</template>