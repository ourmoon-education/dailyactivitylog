import { ref } from 'vue';

export interface AppSettings {
  org_name: string;
  org_tagline: string;
  logo: string | null;
  primary_color: string;
  accent_color: string;
  portal_greeting: string;
  portal_title: string;
}

export const appSettings = ref<AppSettings>({
  org_name: 'Our Moon Education',
  org_tagline: 'Young Leaders Programme',
  logo: null,
  primary_color: '#496763',
  accent_color: '#f4a427',
  portal_greeting: 'Young Leaders Programme',
  portal_title: 'Your Daily Portal',
});

export async function loadAppSettings() {
  try {
    const res = await fetch('/api/method/scholars_portal.api.get_app_settings', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.message) appSettings.value = { ...appSettings.value, ...data.message };
    }
  } catch { /* keep defaults */ }
}
