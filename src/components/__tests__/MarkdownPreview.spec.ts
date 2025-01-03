import { useStore } from "@/store";
import { VueWrapper, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import MarkdownPreview from "../MarkdownPreview.vue";

describe("MarkdownPreview component", () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;
  const mockMarkup: string = "<h1>Hello</h1>";

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useStore();

    // Add mock data to store
    store.$patch({
      markup: mockMarkup
    });

    wrapper = mount(MarkdownPreview, {
      global: {
        plugins: [createPinia()]
      }
    });
  });

  it('should contain "Markdown Preview" text', () => {
    const markdownContainer = wrapper.find(".markdown-container");
    const markdownText = markdownContainer.find(".prose");

    expect(markdownContainer.exists()).toBe(true);
    expect(markdownText.exists()).toBe(true);
  });

  it('should render parsed mock markdown text', () => {
    const markdownText = wrapper.find(".prose");

    expect(markdownText.html()).toContain(mockMarkup);
    expect(markdownText.text()).toBe("Hello");
  });
});
