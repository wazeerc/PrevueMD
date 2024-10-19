import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import PrevueMD from '../PrevueMD.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(PrevueMD)
    expect(wrapper.html()).toContain('PrevueMD')
  })
})
