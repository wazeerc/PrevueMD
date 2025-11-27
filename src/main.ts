import "@/styles/main.css";
import "@/styles/tailwind.css";
import "@/styles/toast.css";

import App from "@/App.vue";
import { useStore } from "@/store";
import { createPinia } from "pinia";
import { registerSW } from 'virtual:pwa-register';
import { createApp } from "vue";
import Toast, { POSITION, useToast } from "vue-toastification";

const app = createApp(App);
const store = createPinia();

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available');
    updateSW();
  },
  onOfflineReady() {
    console.log('App ready for offline use');
  },
  immediate: true
});

app.use(store);
app.use(Toast, {
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
app.mount("#app");

// Initialize theme after app is mounted
try {
  const appStore = useStore();
  appStore.initTheme();
} catch {
  // In test environment, store might not be available
  console.debug('Theme initialization skipped in test environment');
}

const isMobileDevice = () => {
  const mobileWidth = window.innerWidth < 768;
  const mobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return mobileWidth || mobileAgent;
};

if (isMobileDevice()) {
  setTimeout(() => {
    const toast = useToast();
    toast.warning("Note: PrevueMD works best on desktop.", {
      timeout: 2000,
      position: POSITION.BOTTOM_CENTER,
      closeOnClick: true,
    });
  }, 750);
}
