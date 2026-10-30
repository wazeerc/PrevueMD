import { useStore } from "@/store";
import { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import MarkdownEditor from "../MarkdownEditor.vue";
import { setupTest } from "./test-utils";

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }));

vi.mock("vue-toastification", () => ({
  useToast: () => ({ error: toastError })
}));

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
    expect(fileInput.attributes("accept")).toBe(".md,text/markdown");
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

  it("should reject non-Markdown files on import", async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(["image-bytes"], "photo.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput.element, "files", {
      value: [file],
      writable: false,
    });

    await fileInput.trigger("change");
    await nextTick();

    expect(store.getMarkdown).toBe("");
    expect(toastError).toHaveBeenCalledWith("Only Markdown (.md) files can be imported.");
  });

  it("regression: should not import an image picked from the mobile photo library", async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    const file = new File([pngBytes], "IMG_0042.PNG", { type: "image/png" });

    Object.defineProperty(fileInput.element, "files", {
      value: [file],
      writable: false,
    });

    await fileInput.trigger("change");
    await nextTick();

    expect(store.getMarkdown).toBe("");
    expect(store.getMarkup).toBe("");
    expect(toastError).toHaveBeenCalledWith("Only Markdown (.md) files can be imported.");
  });

  it("should reject binary content disguised as a Markdown file", async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(["PNG\u0000\u0001\u0002binary"], "photo.md", { type: "text/markdown" });

    Object.defineProperty(fileInput.element, "files", {
      value: [file],
      writable: false,
    });

    await fileInput.trigger("change");

    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("Only Markdown (.md) files can be imported.");
    });
    expect(store.getMarkdown).toBe("");
  });

  it("should reject malformed UTF-8 content without replacing the draft", async () => {
    store.setMarkdown("# Existing draft");
    await nextTick();

    const fileInput = wrapper.find('input[type="file"]');
    const file = new File([new Uint8Array([0xff, 0xfe, 0xfd])], "corrupt.md", { type: "text/markdown" });

    Object.defineProperty(fileInput.element, "files", {
      value: [file],
      writable: false,
    });

    await fileInput.trigger("change");

    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("Only Markdown (.md) files can be imported.");
    });
    expect(store.getMarkdown).toBe("# Existing draft");
  });
});
