<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { debounce } from "@/utils/lib";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
</script>

<template>
  <div class="flex flex-col h-full p-1">
    <div class="flex justify-between items-center">
      <h3 class="sub-heading">Preview</h3>
      <div class="flex space-x-2">
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
         class="markdown-container flex-1"
         @scroll="() => !isMaximized && onScroll(p => emit('scroll', p))">
      <div class="prose w-full break-words dark:prose-invert"
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
          <div class="flex justify-between items-center mb-4">
            <h3 id="modal-title"
                class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Preview</h3>
            <div class="flex space-x-4">
              <IconButton :disabled="!store.getMarkdown"
                          @click="debouncedCopyToClipboard"
                          icon="clipboard"
                          tooltip="Copy"
                          variant="secondary"
                          size="lg"
                          aria-label="Copy markdown to clipboard" />
              <IconButton ref="closeModalRef"
                          @click="closeModal"
                          icon="minimize"
                          tooltip="Close"
                          variant="secondary"
                          size="lg"
                          aria-label="Close fullscreen preview" />
            </div>
          </div>
          <div class="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 border-4 border-neutral-400/40 dark:border-neutral-600/10 rounded-lg p-8"
               role="document">
            <div class="prose max-w-none w-full break-words dark:prose-invert"
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
