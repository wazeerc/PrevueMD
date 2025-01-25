import { useStore } from "@/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { type Component } from 'vue';

type MockData = {
  markdown?: string;
  markup?: string;
};

type TestSetup = {
  store: ReturnType<typeof useStore>;
  wrapper: VueWrapper;
};

type TestOptions = {
  props?: Record<string, unknown>;
};

/**
 * Sets up a test environment for Vue components with Pinia store integration
 *
 * @param component - The Vue component to be tested
 * @param mockData - Optional mock data to initialize the store
 * @param mockData.markdown - Optional markdown content for the store
 * @param mockData.markup - Optional markup content for the store
 * @param options - Optional test options such as component props
 * @returns {TestSetup} Object containing the mounted component wrapper and store instance
 * @returns {Store} returns.store - The Pinia store instance
 * @returns {VueWrapper} returns.wrapper - The mounted component wrapper
 */
export function setupTest(
  component: Component,
  mockData?: MockData,
  options?: TestOptions
): TestSetup {
  setActivePinia(createPinia());
  const store = useStore();

  if (mockData) {
    store.$patch({
      markdown: mockData.markdown || '',
      markup: mockData.markup || ''
    });
  }

  const wrapper = mount(component, {
    global: {
      plugins: [createPinia()]
    },
    ...options
  });

  return { store, wrapper };
}
