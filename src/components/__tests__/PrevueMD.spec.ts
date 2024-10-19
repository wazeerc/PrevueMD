import { describe, it, expect } from "vitest"

import { mount } from "@vue/test-utils"
import PrevueMD from "../PrevueMD.vue"

describe("Header contains correct Title", () => {
  it("renders properly", () => {
    const wrapper = mount(PrevueMD)
    expect(wrapper.html()).toContain("PrevueMD")
  })
})
