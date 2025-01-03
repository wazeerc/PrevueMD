import type { VueWrapper } from "@vue/test-utils";
import { beforeAll, describe, expect, it } from 'vitest';
import Footer from '../AppFooter.vue';
import Header from '../AppHeader.vue';
import MarkdownEditor from '../MarkdownEditor.vue';
import MarkdownPreview from '../MarkdownPreview.vue';
import PrevueMD from '../PrevueMD.vue';
import { setupTest } from './test-utils';

describe('PrevueMD', () => {
  let wrapper: VueWrapper;

  beforeAll(() => wrapper = setupTest(PrevueMD).wrapper);

  it('should render the component structure correctly', () => {

    expect(wrapper.findComponent(Header).exists()).toBe(true);
    expect(wrapper.findComponent(Footer).exists()).toBe(true);
    expect(wrapper.findComponent(MarkdownEditor).exists()).toBe(true);
    expect(wrapper.findComponent(MarkdownPreview).exists()).toBe(true);
  });

  it('should apply responsive classes correctly', () => {
    const main = wrapper.find('main');
    const section = wrapper.find('section');

    expect(main.classes()).toContain('mx-4');
    expect(main.classes()).toContain('flex-col');
    expect(section.classes()).toContain('w-full');
    expect(section.classes()).toContain('flex-col');
  });
});
