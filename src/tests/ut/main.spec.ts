import { createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createApp } from 'vue';
import Toast, { POSITION } from 'vue-toastification';

vi.mock('vue');
vi.mock('pinia');
vi.mock('vue-toastification');
vi.mock('@/App.vue', () => ({
  default: {
    __vccOpts: { template: '<div></div>' }
  }
}));

describe('Main application setup', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    app = {
      use: vi.fn().mockReturnThis(),
      mount: vi.fn()
    } as unknown as ReturnType<typeof createApp>;
    (createApp as Mock).mockReturnValue(app);
  });

  it('should create Vue app with App component', async () => {
    await import('@/main');

    expect(createApp).toHaveBeenCalled();
  });

  it('should initialize Pinia store', async () => {
    const pinia = createPinia();

    await import('@/main');

    expect(createPinia).toHaveBeenCalled();
    expect(app.use).toHaveBeenNthCalledWith(1, pinia);
  });

  it('should initialize Toast with correct configuration', async () => {
    await import('@/main');

    expect(app.use).toHaveBeenNthCalledWith(2, Toast, {
      position: POSITION.BOTTOM_RIGHT,
      timeout: 2500,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      showCloseButtonOnHover: true,
      hideProgressBar: true,
      closeButton: "button",
      icon: true,
      rtl: false
    });
  });

  it('should mount the app to #app element', async () => {
    await import('@/main');

    expect(app.mount).toHaveBeenCalledWith('#app');
  });
});
