import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useScrollSync } from './useScrollSync';

describe('useScrollSync composable', () => {
  let mockElement: HTMLDivElement;

  beforeEach(() => {
    mockElement = {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500
    } as unknown as HTMLDivElement;
    vi.useFakeTimers();
  });

  it('should synchronize scroll position', () => {
    const elementRef = ref(mockElement);
    const { syncScroll } = useScrollSync(elementRef);

    syncScroll(0.5);

    expect(mockElement.scrollTop).toBe(250);
    vi.runAllTimers();
  });

  it('should trigger callback with correct scroll percentage', () => {
    const elementRef = ref(mockElement);
    const { onScroll } = useScrollSync(elementRef);
    const mockCallback = vi.fn();

    mockElement.scrollTop = 250;
    onScroll(mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(0.5);
  });

  it('should not trigger scroll sync when element is null', () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const { syncScroll } = useScrollSync(elementRef);
    const mockCallback = vi.fn();

    syncScroll(0.5);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should prevent recursive scrolling', () => {
    const elementRef = ref(mockElement);
    const { syncScroll } = useScrollSync(elementRef);

    syncScroll(0.5);
    syncScroll(0.7); // Should not update immediately

    expect(mockElement.scrollTop).toBe(250);
    vi.runAllTimers();
  });
});
