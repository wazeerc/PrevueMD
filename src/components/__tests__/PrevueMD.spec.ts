import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import PrevueMD from "../PrevueMD.vue";

describe("PrevueMD Component", () => {
  const WRAPPER = mount(PrevueMD);

  it("Should have an h1 tag with the text PrevueMD", () => {
    const h1 = WRAPPER.find("h1");

    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe("PrevueMD");
  });

  it("Should contain button that opens README from github", () => {
    const button = WRAPPER.find("button");
    const buttonText = button.text();

    expect(buttonText).toContain("Open from");
    expect(button.exists()).toBe(true);
  });

  it("Should have a link to the repo in the footer", () => {
    const footer = WRAPPER.find("footer");
    const repoLinkUrl = footer.find("a").attributes("href");

    expect(footer.exists()).toBe(true);
    expect(repoLinkUrl).toBe("https://github.com/wazeerc/PrevueMD");
  });

  it("Should contain edit and preview elements", () => {
    const editor = WRAPPER.find("textarea");
    const preview = WRAPPER.find("div");

    expect(editor.exists()).toBe(true);
    expect(preview.exists()).toBe(true);
  });
});
