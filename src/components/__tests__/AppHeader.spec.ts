import { mount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "../../store";
import AppHeader from "../AppHeader.vue";

describe('AppHeader component', () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useStore();

    store.handleDownloadMarkdownFile = vi.fn();

    // Add mock data to store
    store.$patch({
      markdown: '# Test Markdown\nFor testing purposes ⚠️'
    });

    wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia]
      }
    });
  });

  it('should download markdown content on download btn click', async () => {
    const downloadButton = wrapper.get("button");

    await downloadButton.trigger('click');

    expect(downloadButton.attributes("class")).toContain('motion-preset-rebound-left');
    expect(downloadButton.attributes("disabled")).toBeFalsy();
    expect(store.handleDownloadMarkdownFile).toHaveBeenCalledTimes(1);
  });

  it('should disable download btn when markdown is empty', async () => {
    const downloadButton = wrapper.get("button");

    await store.$patch({ markdown: '' });

    expect(downloadButton.attributes("disabled")).toBe("");
  });
});
