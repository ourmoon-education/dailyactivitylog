import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { portalApi } from '../services/frappe';
import { format } from 'date-fns';

export const usePortalStore = defineStore('portal', () => {
  const session = ref<any>(null);
  const todayLog = ref<any>(null);
  const activities = ref<any[]>([]);
  const loading = ref(false);
  const todaySessions = ref<any[]>([]);

  const studentName = computed(() => session.value?.student?.name);
  const displayName = computed(() =>
    session.value?.student?.preferred_name ||
    session.value?.student?.first_name ||
    session.value?.full_name ||
    session.value?.user?.split('@')[0] || 'Scholar');

  const todayDate = computed(() => format(new Date(), 'yyyy-MM-dd'));
  const todayDisplay = computed(() => format(new Date(), 'EEEE, d MMMM yyyy'));
  const dayStarted = computed(() => !!todayLog.value?.day_starter_submitted);
  const dayFinished = computed(() => !!todayLog.value?.day_finisher_submitted);
  const completedCount = computed(() => activities.value.filter(a => a.done && !a.parent_activity).length);
  const totalCount = computed(() => activities.value.filter(a => !a.parent_activity).length);
  const isCoordinator = computed(() => {
    // Check full Frappe roles array (returned by updated API)
    const roles: string[] = session.value?.roles || [];
    if (roles.some((r) => ['System Manager', 'OME Admin', 'YLP Coordinator', 'Admin'].includes(r))) return true;
    // Fallback: check app-level role string for backwards compat
    return session.value?.role === 'Admin';
  });

  function setSession(s: any) { session.value = s; }

  async function loadToday() {
    if (!studentName.value) return;
    loading.value = true;
    try {
      todayLog.value = await portalApi.getTodayLog(studentName.value, todayDate.value);
      activities.value = await portalApi.getActivities(todayLog.value.name);
      try {
        todaySessions.value = await portalApi.getTodaySessions(todayLog.value.name);
      } catch {
        // sessions are optional — ignore errors
      }
    } catch (e) { console.error('loadToday:', e); }
    finally { loading.value = false; }
  }

  async function checkActivity(name: string, done: boolean) {
    await portalApi.checkActivity(name, done);
    const a = activities.value.find(x => x.name === name);
    if (a) a.done = done;
  }

  async function addActivity(title: string, category: string, parentActivity?: string) {
    await portalApi.addActivity(todayLog.value.name, title, category, parentActivity);
    activities.value = await portalApi.getActivities(todayLog.value.name);
  }

  async function moveActivity(name: string, toDate: string) {
    await portalApi.moveActivity(name, toDate);
    activities.value = activities.value.filter(a => a.name !== name);
  }

  return {
    session, todayLog, activities, loading, todaySessions,
    studentName, displayName, todayDate, todayDisplay,
    dayStarted, dayFinished, completedCount, totalCount, isCoordinator,
    setSession, loadToday, checkActivity, addActivity, moveActivity,
  };
});
