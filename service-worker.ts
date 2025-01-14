importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const workbox: any;

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.NetworkFirst()
);
