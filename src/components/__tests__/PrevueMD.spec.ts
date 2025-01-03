import { useStore } from "@/store";
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from 'vitest';
import Footer from '../AppFooter.vue';
import Header from '../AppHeader.vue';
import MarkdownEditor from '../MarkdownEditor.vue';
import MarkdownPreview from '../MarkdownPreview.vue';
import PrevueMD from '../PrevueMD.vue';

describe('PrevueMD', () => {
  let store: ReturnType<typeof useStore>;
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useStore();

    wrapper = mount(MarkdownPreview, {
      global: {
        plugins: [createPinia()]
      }
    });
  });

  it('should render the component structure correctly', () => {
    const wrapper = mount(PrevueMD);

    expect(wrapper.findComponent(Header).exists()).toBe(true);
    expect(wrapper.findComponent(Footer).exists()).toBe(true);
    expect(wrapper.findComponent(MarkdownEditor).exists()).toBe(true);
    expect(wrapper.findComponent(MarkdownPreview).exists()).toBe(true);
  });

  it('should apply responsive classes correctly', () => {
    const wrapper = mount(PrevueMD);
    const main = wrapper.find('main');
    const section = wrapper.find('section');

    expect(main.classes()).toContain('mx-4');
    expect(main.classes()).toContain('flex-col');
    expect(section.classes()).toContain('w-full');
    expect(section.classes()).toContain('flex-col');
  });
});
