import { ref, type Ref } from 'vue';

//? A composable that provides scroll synchronization functionality (e.g Editor and Preview).
export { useScrollSync, type ScrollSync };

type ScrollSync = {
  onScroll: (callback: (percentage: number) => void) => void;
  syncScroll: (percentage: number) => void;
};

type EditorOrPreview = HTMLTextAreaElement | HTMLDivElement;

/**
 * @param elementRef - A Vue ref containing either an editor or preview element reference
 * @returns An object containing scroll synchronization methods:
 *  - onScroll: Callback triggered when scrolling occurs
 *  - syncScroll: Method to synchronize scroll position
 *
 * @interface ScrollSync
 * @property {(callback: (percentage: number) => void) => void} onScroll - Registers a scroll event handler
 * @property {(percentage: number) => void} syncScroll - Sets the scroll position based on a percentage
 *
 * @example
 * ```typescript
 * const editorRef = ref<EditorElement>(null);
 * const { onScroll, syncScroll } = useScrollSync(editorRef);
 * ```
 */
function useScrollSync(elementRef: Ref<EditorOrPreview | null>): ScrollSync {
  const isScrolling = ref(false);

  const onScroll = (callback: (percentage: number) => void) => {
    if (isScrolling.value || !elementRef.value) return;

    const targetElement = elementRef.value;
    const percentage = targetElement.scrollTop / (targetElement.scrollHeight - targetElement.clientHeight);

    callback(percentage);
  };

  const syncScroll = (percentage: number) => {
    if (isScrolling.value || !elementRef.value) return;

    isScrolling.value = true;
    const targetElement = elementRef.value;
    targetElement.scrollTop = percentage * (targetElement.scrollHeight - targetElement.clientHeight);

    setTimeout(() => isScrolling.value = false);
  };

  return { onScroll, syncScroll };
}
