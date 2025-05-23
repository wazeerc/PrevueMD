import { useStore } from "@/store";
import { VueWrapper } from "@vue/test-utils";
import { beforeAll, describe, expect, it } from "vitest";
import MarkdownEditor from "../MarkdownEditor.vue";
import { setupTest } from "./test-utils";

describe("MarkdownEditor component", () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;
  let textarea: ReturnType<typeof wrapper.find>;

  beforeAll(() => {
    const testStore = setupTest(MarkdownEditor, undefined, {
      props: {
        scrollPercentage: 0
      }
    });
    store = testStore.store;
    wrapper = testStore.wrapper;

    textarea = wrapper.find("textarea");
  });

  it("should contain text area element with placeholder value", () => {
    expect(textarea.exists()).toBe(true);

    const placeholder = textarea.attributes("placeholder");
    expect(placeholder).toContain("Start typing to edit and preview your Markdown in real-time");
    expect(placeholder).toContain("You can also copy & paste existing content");
  });

  it("should update store when input changes", async () => {
    const testInput = "# Hello World";

    await textarea.setValue(testInput);

    expect(store.getMarkdown).toBe(testInput);
  });

  it("should clear input when reset button is clicked", async () => {
    store.setMarkdown("# Test");
    const resetButton = wrapper.find("button");

    await resetButton.trigger("click");

    expect(store.getMarkdown).toBe("");
  });
});
