import { VueWrapper } from "@vue/test-utils";
import { beforeAll, describe, expect, it } from "vitest";
import { useStore } from "../../store";
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
    const downloadButton = wrapper.get("button");

    await downloadButton.trigger('click');

    expect(downloadButton.attributes("class")).toContain('motion-preset-rebound-left');
    expect(downloadButton.attributes("disabled")).toBeFalsy();
  });

  it('should disable download btn when markdown is empty', async () => {
    const downloadButton = wrapper.get("button");

    await store.$patch({ markdown: '' });

    expect(downloadButton.attributes("disabled")).toBe("");
  });
});
