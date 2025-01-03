import { useStore } from "@/store";
import { mount, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import MarkdownEditor from "../MarkdownEditor.vue";

describe("MarkdownEditor component", () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;
  let textarea: ReturnType<typeof wrapper.find>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useStore();
    wrapper = mount(MarkdownEditor, {
      global: {
        plugins: [createPinia()]
      }
    });

    textarea = wrapper.find("textarea");
  });

  it("should contain text area element with placeholder value", () => {
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes("placeholder")).toBe("Write some Markdown");
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
