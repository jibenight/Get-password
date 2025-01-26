const GA4_ID = import.meta.env.VITE_GA4_ID;

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', GA4_ID);
