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
};

const props = withDefaults(defineProps<IconButtonProps>(), {
  disabled: false,
  state: 'default',
  variant: 'primary',
  size: 'md',
});
</script>

<template>
  <button :disabled="disabled"
          :aria-disabled="disabled"
          :aria-label="`${icon} Icon`"
          @click="onClick"
          :class="cn('group inline-flex items-center drop-shadow-sm disabled:cursor-not-allowed',
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
