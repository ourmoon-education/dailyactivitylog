<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePortalStore } from '../stores/portal';
import { toast } from 'vue-sonner';
import { ChevronLeft, Target, Calendar } from 'lucide-vue-next';
import { portalApi } from '../services/frappe';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const store = usePortalStore();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const docName = ref<string | null>(null);

// All fields preserved so saving goals doesn't wipe the weekly reflection
const highlights = ref('');
const challenges = ref('');
const gratitudeList = ref('');
const smartGoals = ref('');
const nextWeekFocus = ref('');

const weekStart = computed(() => format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));

const weekRangeDisplay = computed(() => {
  const mon = startOfWeek(new Date(), { weekStartsOn: 1 });
  const sun = endOfWeek(new Date(), { weekStartsOn: 1 });
  return `${format(mon, 'EEE d')} – ${format(sun, 'EEE d MMM')}`;
});

const isWeekend = computed(() => [0, 6].includes(new Date().getDay()));

onMounted(async () => {
  if (!store.studentName) { loading.value = false; return; }
  try {
    const doc = await portalApi.getOrCreateWeeklyReflection(store.studentName, weekStart.value);
    if (doc) {
      docName.value = doc.name ?? null;
      highlights.value = doc.highlights ?? '';
      challenges.value = doc.challenges ?? '';
      gratitudeList.value = doc.gratitude_list ?? '';
      smartGoals.value = doc.smart_goals ?? '';
      nextWeekFocus.value = doc.next_week_focus ?? '';
    }
  } catch { /* blank state is fine */ }
  finally { loading.value = false; }
});

async function save() {
  saving.value = true;
  try {
    await portalApi.submitWeeklyReflection({
      doc_name: docName.value,
      student_name: store.studentName,
      week_start: weekStart.value,
      highlights: highlights.value,
      challenges: challenges.value,
      gratitude_list: gratitudeList.value,
      smart_goals: smartGoals.value,
      next_week_focus: nextWeekFocus.value,
    });
    toast.success('Goals saved ✅');
  } catch (e: any) {
    toast.error(e.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">My SMART Goals</h1>
        <p class="text-xs text-slate-400">{{ weekRangeDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
        <Target :size="18" class="text-sky-600" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color:#0284c7;border-top-color:transparent"></div>
    </div>

    <template v-else>
      <!-- SMART Goals -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-2">
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          SMART Goals this week
        </label>
        <p class="text-[11px] text-slate-400">Specific · Measurable · Achievable · Relevant · Time-bound</p>
        <textarea v-model="smartGoals" rows="6"
          placeholder="e.g. Complete 3 chapters of my textbook by Friday&#10;Attend every agriculture session this week&#10;Submit my essay draft by Thursday..."
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-sky-200 mt-1"></textarea>
      </div>

      <!-- Weekly Focus -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-2">
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          This week's focus
        </label>
        <textarea v-model="nextWeekFocus" rows="3"
          placeholder="Your main priority or theme for the week..."
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-sky-200"></textarea>
      </div>

      <!-- Save -->
      <button @click="save" :disabled="saving"
        class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50 transition-opacity"
        style="background:#0284c7">
        {{ saving ? 'Saving...' : '🎯 Save Goals' }}
      </button>

      <!-- Link to full weekly review on weekends -->
      <button v-if="isWeekend" @click="router.push('/weekly')"
        class="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-400 hover:text-purple-600">
        <Calendar :size="13" /> Full Weekly Review & Reflection
      </button>
    </template>
  </div>
</template>
