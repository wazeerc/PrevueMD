import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppFooter from "../AppFooter.vue";

describe("AppFooter Component", () => {
  const WRAPPER = mount(AppFooter);
  const footer = WRAPPER.find("footer");
  const links = footer.findAll("a");

  it('should contain two links', () => {
    expect(links.length).toBe(2);
  });

  it('should have a link redirecting to Vue\'s website', () => {
    const correctVueLink = 'https://vuejs.org';
    const vueLink: string | undefined = links[0].attributes("href");

    expect(vueLink).toBe(correctVueLink);
  });

  it('should have a link redirecting to GitHub repo', () => {
    const correctRepoLink = 'https://github.com/wazeerc/PrevueMD';
    const repoLink: string | undefined = links[1].attributes("href");

    expect(repoLink).toBe(correctRepoLink);
  });
});
