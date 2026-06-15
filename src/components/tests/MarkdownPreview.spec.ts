import { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import MarkdownPreview from "../MarkdownPreview.vue";
import { setupTest } from "./test-utils";

describe("MarkdownPreview component", () => {
  let wrapper: VueWrapper;
  const mockMarkup: string = "<h1>Hello</h1>";

  beforeEach(() => {
    const testStore = setupTest(MarkdownPreview,
      { markdown: '# Hello', markup: mockMarkup },
      { props: { scrollPercentage: 0 } }
    );
    wrapper = testStore.wrapper;
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should contain "Markdown Preview" text', () => {
    const markdownContainer = wrapper.find(".markdown-container");
    const markdownText = markdownContainer.find(".prose-markdown");

    expect(markdownContainer.exists()).toBe(true);
    expect(markdownText.exists()).toBe(true);
  });

  it('should render parsed mock markdown text', () => {
    const markdownText = wrapper.find(".prose-markdown");

    expect(markdownText.html()).toContain(mockMarkup);
    expect(markdownText.text()).toBe("Hello");
  });

  it('should show loader overlay when parsing', async () => {
    const testStore = setupTest(MarkdownPreview, { markdown: '# Hello', markup: mockMarkup }, { props: { scrollPercentage: 0 } });
    wrapper.unmount();
    wrapper = testStore.wrapper;
    testStore.store.$patch({ isParsing: true });
    await nextTick();

    const loader = wrapper.find('[role="status"]');
    expect(loader.exists()).toBe(true);
    expect(loader.attributes('aria-label')).toBe('Rendering preview');
    expect(wrapper.find('.markdown-container').attributes('aria-busy')).toBe('true');
  });

  it('should open and close maximized preview', async () => {
    await wrapper.find('button[aria-label="maximize Icon"]').trigger('click');
    await nextTick();

    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();

    const closeButton = document.body.querySelector('button[aria-label="Close fullscreen preview"]') as HTMLButtonElement;
    closeButton.click();
    await nextTick();

    expect(document.body.querySelector('[role="dialog"]')).toBeFalsy();
  });

  it('should close maximized preview with Escape', async () => {
    await wrapper.find('button[aria-label="maximize Icon"]').trigger('click');
    await nextTick();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(document.body.querySelector('[role="dialog"]')).toBeFalsy();
  });

  it('should trap focus inside maximized preview', async () => {
    await wrapper.find('button[aria-label="maximize Icon"]').trigger('click');
    await nextTick();

    const focusableElements = document.body.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const preventDefault = vi.fn();

    lastElement.focus();
    document.dispatchEvent(Object.assign(new KeyboardEvent('keydown', { key: 'Tab' }), { preventDefault }));

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstElement);
  });
});
