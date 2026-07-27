<script setup lang="ts">
import { IconLibrary, type Icons, type IconSize, type IconState, type IconVariant } from '@/utils/icons';
import { cn } from '@/utils/lib';
import AppTooltip from './AppTooltip.vue';

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
  tooltipDirection?: 'bottom' | 'top';
};

const props = withDefaults(defineProps<IconButtonProps>(), {
  disabled: false,
  state: 'default',
  variant: 'primary',
  size: 'md',
  tooltip: '',
  tooltipDirection: 'bottom',
});

</script>

<template>
  <AppTooltip :text="!disabled ? tooltip : ''" :direction="tooltipDirection">
    <button :disabled="disabled"
            :aria-disabled="disabled"
            :aria-label="`${icon} Icon`"
            @click="onClick"
            :class="cn('inline-flex items-center drop-shadow-sm disabled:cursor-not-allowed relative transition-all duration-200',
              variant === 'primary' && [
                'px-2 py-1.5 sm:px-3 sm:py-2',
                'text-xs sm:text-sm',
                'gap-2 sm:gap-3',
                'rounded-md',
                'font-sans font-semibold',
                'bg-neutral-700 text-neutral-100',
                'hover:bg-neutral-600',
                'disabled:opacity-70',
                'dark:bg-neutral-200 dark:text-neutral-800',
                'dark:hover:bg-neutral-300',
              ],
              variant === 'secondary' && [
                'mb-2 mr-1',
                'drop-shadow-md',
                'text-neutral-800 dark:text-neutral-200',
                'disabled:opacity-40'
              ],
              (icon === 'sun' || icon === 'moon') && [
                'px-2 py-1.5 sm:px-3 sm:py-2',
                'text-xs sm:text-sm',
                'gap-2 sm:gap-3',
                'rounded-md',
                'font-sans font-semibold',
                'border-2 border-neutral-300 dark:border-neutral-400',
                'text-neutral-800 dark:text-neutral-200',
                'bg-transparent dark:bg-transparent',
                'hover:bg-neutral-200 dark:hover:bg-neutral-800',
              ],
              props.class)">
      <slot>{{ text }}</slot>
      <div v-html="IconLibrary(icon, size, variant, disabled ? 'disabled' : 'default')"
           :alt="`${icon} Icon`"
           :class="cn(
             variant === 'primary' && !disabled && 'group-hover:motion-preset-seesaw-lg',
             (icon === 'sun' || icon === 'moon') && 'group-hover:motion-preset-spin',
             variant === 'secondary' && !disabled && 'group-hover:motion-preset-shake motion-duration-1000'
           )" />
    </button>
  </AppTooltip>
</template>
