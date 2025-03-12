import "@/styles/main.css";
import "@/styles/tailwind.css";
import "@/styles/toast.css";

import App from "@/App.vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import Toast, { POSITION, useToast } from "vue-toastification";
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update every hour
const updateSW = registerSW({
  onNeedRefresh() {
    const toast = useToast();
    toast.info('New content available! Click to update.', {
      timeout: 0,
      closeOnClick: true,
      onClick: () => {
        updateSW();
      }
    });
  },
  onOfflineReady() {
    const toast = useToast();
    toast.success('App ready for offline use!');
  },
  immediate: true
});

const app = createApp(App);
const store = createPinia();

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
