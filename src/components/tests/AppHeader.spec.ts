import { useStore } from "@/store";
import { VueWrapper } from "@vue/test-utils";
import { beforeAll, describe, expect, it } from "vitest";
import AppHeader from "../AppHeader.vue";
import { setupTest } from "./test-utils";

describe('AppHeader component', () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;

  beforeAll(() => {
    const testStore = setupTest(AppHeader, {
      markdown: '# Test Markdown\nFor testing purposes ⚠️'
    });
    store = testStore.store;
    wrapper = testStore.wrapper;
  });

  it('should download markdown content on download btn click', async () => {
    const downloadButton = wrapper.findAll("button")[1]; // Second button is download

    await downloadButton.trigger('click');

    expect(downloadButton.attributes("class")).toContain('motion-preset-rebound-left');
    expect(downloadButton.attributes("disabled")).toBeFalsy();
  });

  it('should disable download btn when markdown is empty', async () => {
    const downloadButton = wrapper.findAll("button")[1]; // Second button is download

    await store.$patch({ markdown: '' });

    expect(downloadButton.attributes("disabled")).toBe("");
  });

  it('should display sun icon when theme is dark', () => {
    store.$patch({ theme: 'dark' });
    
    const themeButton = wrapper.findAll("button")[0]; // First button is theme toggle
    expect(themeButton.html()).toContain('sun');
  });

  it('should display moon icon when theme is light', async () => {
    await store.$patch({ theme: 'light' });
    await wrapper.vm.$nextTick();
    
    const themeButton = wrapper.findAll("button")[0]; // First button is theme toggle
    expect(themeButton.html()).toContain('moon');
  });

  it('should call toggleTheme when theme button is clicked', async () => {
    // Mock localStorage and document for toggleTheme
    const setItemMock = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: setItemMock,
      },
      writable: true
    });

    const classListMock = {
      toggle: vi.fn()
    };
    Object.defineProperty(document.documentElement, 'classList', {
      value: classListMock,
      writable: true
    });

    const themeButton = wrapper.findAll("button")[0]; // First button is theme toggle
    const initialTheme = store.theme;

    await themeButton.trigger('click');
    await wrapper.vm.$nextTick();

    const newTheme = store.theme;
    expect(newTheme).not.toBe(initialTheme); // Theme should have toggled
    expect(setItemMock).toHaveBeenCalledWith('theme', newTheme);
  });
});
