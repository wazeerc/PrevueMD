<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { cn, createFocusTrap } from "@/utils/lib";
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import FontSwitcher from './FontSwitcher.vue';
import IconButton from "./IconButton.vue";

const store = useStore();

const previewRef = ref<HTMLDivElement | null>(null);
const { onScroll, syncScroll } = useScrollSync(previewRef);

const modalRef = ref<HTMLDivElement | null>(null);
const isMaximized = ref(false);
let previousActiveElement: HTMLElement | null = null;
let activeTrap: ReturnType<typeof createFocusTrap> | null = null;

const maximizePreview = async () => {
  previousActiveElement = document.activeElement as HTMLElement;
  isMaximized.value = true;

  await nextTick();
  document.getElementById('app')?.setAttribute('inert', '');
  document.body.style.overflow = 'hidden';

  activeTrap = createFocusTrap(modalRef.value!, {
    onEscape: closeModal,
    initialFocus: modalRef.value!.querySelector('button[aria-label="minimize Icon"]') as HTMLElement,
  });
  activeTrap.activate();
};

const closeModal = () => {
  activeTrap?.deactivate();
  activeTrap = null;
  isMaximized.value = false;
  document.body.style.overflow = '';
  nextTick(() => {
    document.getElementById('app')?.removeAttribute('inert');
    previousActiveElement?.focus();
  });
};

onBeforeUnmount(() => {
  if (isMaximized.value) {
    activeTrap?.deactivate();
    activeTrap = null;
    document.body.style.overflow = '';
    document.getElementById('app')?.removeAttribute('inert');
  }
});

const handleCopy = (): void => {
  store.handleCopyToClipboard();
};

const emit = defineEmits<{ scroll: [percentage: number]; }>();
const props = defineProps<{ scrollPercentage: number; }>();

watch(() => props.scrollPercentage, syncScroll);

const previewFont = ref<'sans' | 'serif'>('sans');

const handleAnchorClick = (e: MouseEvent) => {
  const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
  if (!anchor) return;

  const id = anchor.getAttribute('href')?.slice(1);
  if (!id) return;

  const container = isMaximized.value ? modalRef.value : previewRef.value;
  const target = container?.querySelector(`[id="${id}"]`);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'instant', block: 'start' });
};
</script>

<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <h3 class="sub-heading">Preview</h3>
        <span v-if="store.getIsParsing"
              class="inline-block h-4 w-4 mb-2 animate-spin rounded-full border-2 border-neutral-400/50 border-t-[--vue-color-primary]"
              role="status"
              aria-label="Rendering preview"></span>
      </div>
      <div class="relative z-20 flex space-x-2">
        <IconButton :disabled="!store.getMarkdown"
                    @click="handleCopy"
                    icon="clipboard"
                    tooltip="Copy"
                    variant="secondary"
                    size="md" />
        <IconButton :disabled="!store.getMarkdown"
                    @click="maximizePreview"
                    icon="maximize"
                    tooltip="Maximize"
                    variant="secondary"
                    size="md" />
      </div>
    </div>
    <div ref="previewRef"
         class="markdown-container flex-1 relative"
         :class="{ 'cursor-progress': store.getIsParsing }"
         :aria-busy="store.getIsParsing"
         @scroll="() => !isMaximized && onScroll(p => emit('scroll', p))"
         @click="handleAnchorClick">
      <div class="w-full break-words prose-markdown"
           role="status"
           :aria-label="store.getIsParsing ? 'Rendering preview' : undefined"
           v-html="store.getMarkup">
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isMaximized"
           ref="modalRef"
           role="dialog"
           aria-modal="true"
           aria-labelledby="modal-title"
           tabindex="-1"
           class="prevuemd-modal fixed inset-0 z-50 flex items-center justify-center bg-neutral-500/40 dark:bg-neutral-950/50 backdrop-blur-md
           motion-preset-focus motion-duration-500"
           @click.self="closeModal">
        <div
             class="relative w-full h-full max-w-8xl mx-auto p-12 flex flex-col motion-preset-expand">
          <div
               class="flex justify-between items-center mb-4 motion-preset-slide-up-lg motion-delay-500">
            <div class="flex items-center gap-2">
              <h3 id="modal-title"
                  class="text-xl font-semibold hidden md:block text-neutral-800 dark:text-neutral-200">
                Preview</h3>
              <span v-if="store.getIsParsing"
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-400/50 border-t-[--vue-color-primary] md:inline-block"
                    role="status"
                    aria-label="Rendering preview"></span>
            </div>
            <FontSwitcher v-model:font="previewFont" />
            <div class="relative z-20 flex space-x-4">
              <IconButton class="mb-0"
                          @click="closeModal"
                          icon="minimize"
                          tooltip="Close"
                          tooltip-direction="top"
                          variant="secondary"
                          size="lg"
                          aria-label="Close fullscreen preview" />
            </div>
          </div>
          <div :class="cn('relative flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 border-4 border-neutral-400/40 dark:border-neutral-600/10 rounded-lg p-8',
            store.getIsParsing && 'cursor-progress')"
               :aria-busy="store.getIsParsing"
               role="document"
               @click="handleAnchorClick">
            <div :class="cn('w-full break-words prose-markdown',
              previewFont === 'serif' ? 'font-serif' : 'font-sans')"
                 role="status"
                 :aria-label="store.getIsParsing ? 'Rendering preview' : undefined"
                 v-html="store.getMarkup">
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-leave-to {
  opacity: 0;
}
</style>
