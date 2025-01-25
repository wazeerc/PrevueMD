import { VueWrapper } from "@vue/test-utils";
import { beforeAll, describe, expect, it } from "vitest";
import MarkdownPreview from "../MarkdownPreview.vue";
import { setupTest } from "./test-utils";

describe("MarkdownPreview component", () => {
  let wrapper: VueWrapper;
  const mockMarkup: string = "<h1>Hello</h1>";

  beforeAll(() => {
    const testStore = setupTest(MarkdownPreview,
      { markup: mockMarkup },
      { props: { scrollPercentage: 0 } }
    );
    wrapper = testStore.wrapper;
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
