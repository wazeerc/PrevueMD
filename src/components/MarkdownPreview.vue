<script setup lang="ts">
import { useScrollSync } from '@/composables/useScrollSync';
import { useStore } from "@/store";
import { debounce } from "@/utils/lib";
import { ref, watch } from 'vue';
import IconButton from "./IconButton.vue";

const store = useStore();
const debouncedCopyToClipboard = debounce(store.handleCopyToClipboard);

const previewRef = ref<HTMLDivElement | null>(null);
const { onScroll, syncScroll } = useScrollSync(previewRef);

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
                    @click="debouncedCopyToClipboard"
                    icon="clipboard"
                    tooltip="Copy"
                    variant="secondary"
                    size="md" />
      </div>
    </div>
    <div ref="previewRef"
         class="markdown-container flex-1"
         @scroll="() => onScroll(p => emit('scroll', p))">
      <div class="prose prose-invert w-full break-words"
           v-html="store.getMarkup">
      </div>
    </div>
  </div>
</template>
