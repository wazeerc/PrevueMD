import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from 'vitest';
import IconButton from '../IconButton.vue';

describe('IconButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'clipboard',
        onClick: () => { }
      }
    });

    const btn = wrapper.find('button');

    expect(wrapper.exists()).toBe(true);
    expect(btn.attributes('disabled')).toBeFalsy();
    expect(btn.attributes('aria-disabled')).toBe('false');
  });

  it('renders with custom props', () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'download',
        onClick: () => { },
        disabled: true,
        text: 'Edit',
        variant: 'secondary',
        size: 'lg',
        tooltip: 'Edit item'
      }
    });

    const btn = wrapper.find('button');

    expect(btn.attributes('disabled')).toBe('');
    expect(btn.attributes('aria-disabled')).toBe('true');
    expect(wrapper.text()).toContain('Edit');
  });

  it('emits click event when clicked', async () => {
    const onClick = vi.fn();
    const wrapper = mount(IconButton, {
      props: {
        icon: 'download',
        onClick
      }
    });

    await wrapper.find('button').trigger('click');

    expect(onClick).toHaveBeenCalled();
  });

  it('does not emit click when disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(IconButton, {
      props: {
        icon: 'download',
        onClick,
        disabled: true
      }
    });

    await wrapper.find('button').trigger('click');

    expect(onClick).not.toHaveBeenCalled();
  });
});
