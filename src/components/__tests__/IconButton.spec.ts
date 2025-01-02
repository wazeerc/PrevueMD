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

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes('disabled')).toBeFalsy();
    expect(wrapper.attributes('aria-disabled')).toBe('false');
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

    expect(wrapper.attributes('disabled')).toBe('');
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.text()).toContain('Edit');
    expect(wrapper.attributes('data-tooltip')).toBe('Edit item');
  });

  it('emits click event when clicked', async () => {
    const onClick = vi.fn();
    const wrapper = mount(IconButton, {
      props: {
        icon: 'download',
        onClick
      }
    });

    await wrapper.trigger('click');

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

    await wrapper.trigger('click');

    expect(onClick).not.toHaveBeenCalled();
  });
});
