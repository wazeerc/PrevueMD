<script setup lang="ts">
import { cn } from '@/utils/lib';
import { IconLibrary, type Icons, type IconSize, type IconState, type IconVariant } from './assets/icons';

type IconButtonProps = {
  icon: Icons;
  onClick: () => unknown | void;
  state?: IconState;
  text?: string;
  disabled?: boolean;
  class?: string;
  variant?: IconVariant;
  size?: IconSize;
  tooltip?: string;
};

const props = withDefaults(defineProps<IconButtonProps>(), {
  disabled: false,
  state: 'default',
  variant: 'primary',
  size: 'md',
  tooltip: '',
});
</script>

<template>
  <button :disabled="disabled"
          :aria-disabled="disabled"
          :aria-label="`${icon} Icon`"
          :data-tooltip="tooltip"
          @click="onClick"
          :class="cn('group inline-flex items-center drop-shadow-sm disabled:cursor-not-allowed relative',
            tooltip && !disabled && [
              'after:content-[attr(data-tooltip)] after:absolute',
              'after:left-1/2 after:-translate-x-1/2 after:px-2 after:py-1',
              'after:bg-neutral-800/80 after:text-neutral-400 after:outline after:outline-1 after:outline-[--vue-color-secondary]', 'after:font-sans after:text-xs after:rounded-md',
              'after:whitespace-nowrap after:z-10',
              'after:top-[100%] after:mt-2',
              'after:opacity-0 after:translate-y-2',
              'after:transition-all after:duration-200 after:ease-in',
              'after:invisible after:pointer-events-none',
              'hover:after:visible hover:after:pointer-events-auto hover:after:opacity-100 hover:after:translate-y-0'
            ],
            tooltip && !disabled && 'hover:after:opacity-100',
            variant === 'primary' && [
              'px-2 py-1.5 sm:px-3 sm:py-2',
              'text-xs sm:text-sm',
              'gap-2 sm:gap-3',
              'rounded-md',
              'font-sans font-semibold',
              'bg-neutral-200 text-neutral-800',
              'hover:bg-neutral-300',
              'disabled:opacity-20',
            ],
            variant === 'secondary' && [
              'mb-2 mr-1',
              'drop-shadow-md',
            ],
            props.class)">
    <slot>{{ text }}</slot>
    <div v-html="IconLibrary(icon, size, variant, disabled ? 'disabled' : 'default')"
         :alt="`${icon} Icon`"
         :class="cn(variant === 'primary' && !disabled && 'group-hover:motion-preset-seesaw-lg',
          variant === 'secondary' && !disabled && 'group-hover:motion-preset-shake',
        )" />
  </button>
</template>
