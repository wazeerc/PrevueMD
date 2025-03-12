<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import IconButton from './IconButton.vue';
import { useToast } from 'vue-toastification';

const deferredPrompt = ref<any>(null);
const isInstallable = ref(false);
const isPWAInstalled = ref(false);
const toast = useToast();

const checkIfPWAInstalled = () => {
  // Check if app is installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isPWAInstalled.value = true;
    return true;
  }
  return false;
};

const handleInstall = async () => {
  if (deferredPrompt.value) {
    // Show the install prompt
    deferredPrompt.value.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.value.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We no longer need the prompt. Clear it for garbage collection
    deferredPrompt.value = null;
    
    if (outcome === 'accepted') {
      toast.success('App installed successfully!');
      isInstallable.value = false;
      isPWAInstalled.value = true;
    } else {
      toast.info('App installation was declined');
    }
  } else {
    // If no deferred prompt is available, provide instructions
    toast.info('To install this app: click the menu button in your browser and select "Install PrevueMD"');
  }
};

const handleBeforeInstallPrompt = (e: Event) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt.value = e;
  // Update UI to notify the user they can install the PWA
  isInstallable.value = true;
  console.log('beforeinstallprompt event fired and captured');
};

const handleAppInstalled = () => {
  // Log app installed
  console.log('PWA was installed');
  // Clear the deferredPrompt
  deferredPrompt.value = null;
  isInstallable.value = false;
  isPWAInstalled.value = true;
  toast.success('App installed successfully!');
};

onMounted(() => {
  // Check if already installed
  isPWAInstalled.value = checkIfPWAInstalled();
  console.log('PWA installed status:', isPWAInstalled.value);
  
  // Add event listeners
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
  
  // Force isInstallable to true in development for testing
  if (import.meta.env.DEV) {
    isInstallable.value = true;
    console.log('Development mode: forcing isInstallable to true');
  }
});

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
});
</script>

<template>
  <IconButton 
    @click="handleInstall"
    icon="app"
    class="motion-preset-rebound-left motion-delay-150 bg-green-600 text-white hover:bg-green-700"
    variant="primary"
    tooltip="Install App"
    size="md"
    text="Install"
  />
</template> 