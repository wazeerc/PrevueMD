import { describe, it, expect } from "vitest"

import { mount } from "@vue/test-utils"
import MarkdownEditor from "../MarkdownEditor.vue"

describe("MarkdownEditor Component", () => {
  it("Contains a non-resizable text area", () => {
    const wrapper = mount(MarkdownEditor)
    const textArea = wrapper.find("textarea")

    expect(textArea.exists()).toBe(true)
    expect(textArea.classes()).toContain("resize-none")
  })
})
