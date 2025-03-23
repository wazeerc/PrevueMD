import "@/styles/main.css";
import "@/styles/tailwind.css";
import "@/styles/toast.css";

import App from "@/App.vue";
import { createPinia } from "pinia";
import { registerSW } from 'virtual:pwa-register';
import { createApp } from "vue";
import Toast, { POSITION } from "vue-toastification";

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
