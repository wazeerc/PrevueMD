import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import MarkdownPreview from "../MarkdownPreview.vue";

describe("MarkdownPreview Component", () => {
  it("Contains a code element", () => {
    const wrapper = mount(MarkdownPreview);
    const code = wrapper.find("code");

    expect(code.exists()).toBe(true);
  });
});
