import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import './index.css';
import { usePortalStore } from './stores/portal';
import { setCsrf } from './services/frappe';

function showApp() {
  document.getElementById('app-loading')!.style.display = 'none';
  document.getElementById('app')!.style.display = '';
}

(async () => {
  try {
    const res = await fetch('/api/method/scholars_portal.api.get_session_info', { credentials: 'include' });
    const data = await res.json();
    const session = data.message;

    if (!session || session.user === 'Guest') {
      window.location.href = '/login?redirect-to=/portal/';
      return;
    }

    if (session.csrf_token) setCsrf(session.csrf_token);

    const app = createApp(App);
    app.use(createPinia());
    app.use(router);

    const store = usePortalStore();
    store.setSession(session);
    if (session.student?.name) await store.loadToday();

    app.mount('#app');
    showApp();
  } catch (e) {
    console.error(e);
    const app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.mount('#app');
    showApp();
  }
})();
