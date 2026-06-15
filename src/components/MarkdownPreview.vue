<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { debounce } from "@/utils/lib";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import FontSwitcher from './FontSwitcher.vue';
import IconButton from "./IconButton.vue";

const store = useStore();
const debouncedCopyToClipboard = debounce(store.handleCopyToClipboard);

const previewRef = ref<HTMLDivElement | null>(null);
const { onScroll, syncScroll } = useScrollSync(previewRef);

const modalRef = ref<HTMLDivElement | null>(null);
const closeModalRef = ref<HTMLButtonElement | null>(null);
const isMaximized = ref(false);
let previousActiveElement: HTMLElement | null = null;

const maximizePreview = async () => {
  previousActiveElement = document.activeElement as HTMLElement;
  isMaximized.value = true;

  await nextTick();
  (modalRef.value?.querySelector('button[aria-label="Close fullscreen preview"]') as HTMLElement)?.focus();
};

const closeModal = () => {
  isMaximized.value = false;
  nextTick(() => previousActiveElement?.focus());
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!isMaximized.value) return;

  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusableElements = modalRef.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown));

const emit = defineEmits<{ scroll: [percentage: number]; }>();
const props = defineProps<{ scrollPercentage: number; }>();

watch(() => props.scrollPercentage, syncScroll);

const previewFont = ref<'sans' | 'serif'>('sans');
</script>

<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex justify-between items-center">
      <h3 class="sub-heading">Preview</h3>
      <div class="relative z-20 flex space-x-2">
        <IconButton :disabled="!store.getMarkdown"
                    @click="maximizePreview"
                    icon="maximize"
                    tooltip="Maximize"
                    variant="secondary"
                    size="md" />
        <IconButton :disabled="!store.getMarkdown"
                    @click="debouncedCopyToClipboard"
                    icon="clipboard"
                    tooltip="Copy"
                    variant="secondary"
                    size="md" />
      </div>
    </div>
    <div ref="previewRef"
         class="markdown-container flex-1 relative"
         :aria-busy="store.getIsParsing"
         @scroll="() => !isMaximized && onScroll(p => emit('scroll', p))">
      <div v-if="store.getIsParsing"
           class="absolute inset-x-4 top-4 z-10 flex items-center gap-2 rounded-md border border-neutral-300/80 bg-neutral-50/90 px-3 py-2 text-sm text-neutral-700 shadow-sm backdrop-blur dark:border-neutral-700/80 dark:bg-neutral-900/90 dark:text-neutral-200"
           role="status"
           aria-live="polite">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-[--vue-color-secondary] dark:border-neutral-700 dark:border-t-[--vue-color-primary]"
              aria-hidden="true"></span>
        Rendering preview...
      </div>
      <div class="w-full break-words prose-markdown"
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
            <h3 id="modal-title"
                class="text-xl font-semibold text-neutral-800 dark:text-neutral-200 hidden md:block">
              Preview</h3>
            <FontSwitcher v-model:font="previewFont" />
            <div class="relative z-20 flex space-x-4">
              <IconButton :disabled="!store.getMarkdown"
                          @click="debouncedCopyToClipboard"
                          class="mb-0"
                          icon="clipboard"
                          tooltip="Copy"
                          variant="secondary"
                          size="lg"
                          aria-label="Copy markdown to clipboard" />
              <IconButton ref="closeModalRef"
                          class="mb-0"
                          @click="closeModal"
                          icon="minimize"
                          tooltip="Close"
                          variant="secondary"
                          size="lg"
                          aria-label="Close fullscreen preview" />
            </div>
          </div>
          <div class="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 border-4 border-neutral-400/40 dark:border-neutral-600/10 rounded-lg p-8"
               :aria-busy="store.getIsParsing"
               role="document">
            <div :class="['w-full break-words prose-markdown',
              previewFont === 'serif' ? 'font-serif' : 'font-sans']"
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
