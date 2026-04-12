let _csrf = '';
export function setCsrf(t: string) { _csrf = t; }

async function get<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
  const res = await fetch(`/api/method/${method}${qs ? '?' + qs : ''}`, { method: 'GET', credentials: 'include' });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `HTTP ${res.status}`); }
  return (await res.json()).message as T;
}

export async function call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`/api/method/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': _csrf },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `HTTP ${res.status}`); }
  return (await res.json()).message as T;
}

export const portalApi = {
  getSessionInfo: () => get<any>('scholars_portal.api.get_session_info'),
  getTodayLog: (s: string, d: string) => get<any>('scholars_portal.daily.get_or_create_daily_log', { student_name: s, date: d }),
  submitDayStarter: (p: Record<string, unknown>) => call<any>('scholars_portal.daily.submit_day_starter', p),
  submitDayFinisher: (p: Record<string, unknown>) => call<any>('scholars_portal.daily.submit_day_finisher', p),
  getActivities: (logName: string) => get<any[]>('scholars_portal.daily.get_activities', { log_name: logName }),
  addActivity: (logName: string, title: string, category: string, parentActivity?: string) =>
    call<any>('scholars_portal.daily.add_activity', { log_name: logName, title, category, ...(parentActivity ? { parent_activity: parentActivity } : {}) }),
  checkActivity: (name: string, done: boolean) => call<any>('scholars_portal.daily.check_activity', { activity_name: name, done }),
  moveActivity: (name: string, toDate: string) => call<any>('scholars_portal.daily.move_activity', { activity_name: name, to_date: toDate }),
  submitComprehension: (p: Record<string, unknown>) => call<any>('scholars_portal.daily.submit_comprehension', p),
  submitFitness: (p: Record<string, unknown>) => call<any>('scholars_portal.daily.submit_fitness', p),
  getLogHistory: (s: string, limit = 14) => get<any[]>('scholars_portal.daily.get_log_history', { student_name: s, limit }),
};
