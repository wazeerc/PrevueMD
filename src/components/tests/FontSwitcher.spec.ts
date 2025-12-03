import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FontSwitcher from '../FontSwitcher.vue';

describe('FontSwitcher component', () => {
  it('should render with default font prop', () => {
    const wrapper = mount(FontSwitcher, {
      props: { font: 'sans' }
    });

    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Font style"]').exists()).toBe(true);
  });

  it('should display both sans and serif buttons', () => {
    const wrapper = mount(FontSwitcher, {
      props: { font: 'sans' }
    });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe('Aa');
    expect(buttons[1].text()).toBe('Aa');
  });

  describe('Font switching', () => {
    it('should emit update:font when sans button is clicked', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'serif' }
      });

      const sansButton = wrapper.findAll('button')[0];
      await sansButton.trigger('click');

      expect(wrapper.emitted('update:font')).toBeTruthy();
      expect(wrapper.emitted('update:font')?.[0]).toEqual(['sans']);
    });

    it('should emit update:font when serif button is clicked', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const serifButton = wrapper.findAll('button')[1];
      await serifButton.trigger('click');

      expect(wrapper.emitted('update:font')).toBeTruthy();
      expect(wrapper.emitted('update:font')?.[0]).toEqual(['serif']);
    });

    it('should not emit when clicking the already selected font', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const sansButton = wrapper.findAll('button')[0];
      await sansButton.trigger('click');

      expect(wrapper.emitted('update:font')).toBeFalsy();
    });
  });

  describe('Keyboard navigation', () => {
    it('should switch to serif and focus serif button on ArrowRight', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const radioGroup = wrapper.find('[role="radiogroup"]');
      await radioGroup.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:font')).toBeTruthy();
      expect(wrapper.emitted('update:font')?.[0]).toEqual(['serif']);
    });

    it('should switch to sans and focus sans button on ArrowLeft', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'serif' }
      });

      const radioGroup = wrapper.find('[role="radiogroup"]');
      await radioGroup.trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:font')).toBeTruthy();
      expect(wrapper.emitted('update:font')?.[0]).toEqual(['sans']);
    });

    it('should prevent default behavior on ArrowRight', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const radioGroup = wrapper.find('[role="radiogroup"]');
      await radioGroup.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:font')).toBeTruthy();
    });

    it('should prevent default behavior on ArrowLeft', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'serif' }
      });

      const radioGroup = wrapper.find('[role="radiogroup"]');
      await radioGroup.trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:font')).toBeTruthy();
    });

    it('should ignore other keyboard keys', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const radioGroup = wrapper.find('[role="radiogroup"]');
      await radioGroup.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:font')).toBeFalsy();
    });
  });

  describe('Accessibility attributes', () => {
    it('should have correct role attributes', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
      const buttons = wrapper.findAll('[role="radio"]');
      expect(buttons).toHaveLength(2);
    });

    it('should set aria-checked correctly for selected font', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('aria-checked')).toBe('true');
      expect(buttons[1].attributes('aria-checked')).toBe('false');
    });

    it('should update aria-checked when font changes', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      let buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('aria-checked')).toBe('true');
      expect(buttons[1].attributes('aria-checked')).toBe('false');

      await wrapper.setProps({ font: 'serif' });

      buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('aria-checked')).toBe('false');
      expect(buttons[1].attributes('aria-checked')).toBe('true');
    });

    it('should set correct tabindex values', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('tabindex')).toBe('0');
      expect(buttons[1].attributes('tabindex')).toBe('-1');
    });

    it('should update tabindex when font changes', async () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      let buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('tabindex')).toBe('0');
      expect(buttons[1].attributes('tabindex')).toBe('-1');

      await wrapper.setProps({ font: 'serif' });

      buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('tabindex')).toBe('-1');
      expect(buttons[1].attributes('tabindex')).toBe('0');
    });

    it('should have proper aria-labels', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const buttons = wrapper.findAll('button');
      expect(buttons[0].attributes('aria-label')).toBe('Sans-serif font');
      expect(buttons[1].attributes('aria-label')).toBe('Serif font');
    });

    it('should have radiogroup aria-label', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      expect(wrapper.find('[role="radiogroup"]').attributes('aria-label')).toBe('Font style');
    });
  });

  describe('Styling', () => {
    it('should apply correct classes to selected sans font', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const sansButton = wrapper.findAll('button')[0];
      expect(sansButton.classes()).toContain('font-sans');
      expect(sansButton.classes()).toContain('bg-neutral-700');
    });

    it('should apply correct classes to selected serif font', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'serif' }
      });

      const serifButton = wrapper.findAll('button')[1];
      expect(serifButton.classes()).toContain('font-serif');
      expect(serifButton.classes()).toContain('bg-neutral-700');
    });

    it('should apply hover classes to unselected button', () => {
      const wrapper = mount(FontSwitcher, {
        props: { font: 'sans' }
      });

      const serifButton = wrapper.findAll('button')[1];
      expect(serifButton.classes()).toContain('hover:bg-neutral-300');
    });
  });
});
