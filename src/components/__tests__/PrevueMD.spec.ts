import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import PrevueMD from "../PrevueMD.vue";

describe("PrevueMD Component", () => {
  it("Contains an correct h1 tag", () => {
    const wrapper = mount(PrevueMD);
    const h1 = wrapper.find("h1");

    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe("PrevueMD");
  });
});
