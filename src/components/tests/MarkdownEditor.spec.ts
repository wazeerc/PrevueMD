import { useStore } from "@/store";
import { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import MarkdownEditor from "../MarkdownEditor.vue";
import { setupTest } from "./test-utils";

describe("MarkdownEditor component", () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;
  let textarea: ReturnType<typeof wrapper.find>;

  beforeEach(() => {
    const testStore = setupTest(MarkdownEditor, undefined, {
      props: {
        scrollPercentage: 0
      }
    });
    store = testStore.store;
    wrapper = testStore.wrapper;

    textarea = wrapper.find("textarea");
  });

  afterEach(() => wrapper.unmount());

  it("should contain text area element with placeholder value", () => {
    expect(textarea.exists()).toBe(true);

    const placeholder = textarea.attributes("placeholder");
    expect(placeholder).toContain("Start typing to edit and preview your Markdown in real-time");
    expect(placeholder).toContain("import a .md file");
  });

  it("should update store when input changes", async () => {
    const testInput = "# Hello World";

    await textarea.setValue(testInput);

    expect(store.getMarkdown).toBe(testInput);
  });

  it("should display word and character counts", async () => {
    await textarea.setValue("# Hello World");

    expect(wrapper.text()).toContain("(3 words, 13 characters)");
  });

  it("should clear input when reset button is clicked", async () => {
    store.setMarkdown("# Test");
    await nextTick();
    const resetButton = wrapper.find('button[aria-label="reset Icon"]');

    await resetButton.trigger("click");

    expect(store.getMarkdown).toBe("");
  });

  it("should have an import button that triggers file input", async () => {
    const importButton = wrapper.find('button[aria-label="upload Icon"]');
    expect(importButton.exists()).toBe(true);

    const fileInput = wrapper.find('input[type="file"]');
    expect(fileInput.exists()).toBe(true);
    expect(fileInput.attributes("accept")).toBe(".md");
  });

  it("should populate editor with file content on import", async () => {
    const fileInput = wrapper.find('input[type="file"]');

    const content = "# Imported Content";
    const file = new File([content], "test.md", { type: "text/markdown" });

    Object.defineProperty(fileInput.element, "files", {
      value: [file],
      writable: false,
    });

    await fileInput.trigger("change");

    await vi.waitFor(() => {
      expect(store.getMarkdown).toBe(content);
    });
  });
});
