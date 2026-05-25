<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Star, ChevronLeft } from 'lucide-vue-next';
import { portalApi } from '../services/frappe';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const store = usePortalStore();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const submitted = ref(false);
const docName = ref<string | null>(null);

const highlights = ref('');
const challenges = ref('');
const gratitudeList = ref('');
const smartGoals = ref('');
const nextWeekFocus = ref('');

// Compute the Monday of the current week
const weekStart = computed(() => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
});

const weekEnd = computed(() => {
  const sunday = endOfWeek(new Date(), { weekStartsOn: 1 });
  return sunday;
});

const weekRangeDisplay = computed(() => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const sunday = endOfWeek(new Date(), { weekStartsOn: 1 });
  const monStr = format(monday, 'EEE d');
  const sunStr = format(sunday, 'EEE d MMM yyyy');
  return `Week of ${monStr} – ${sunStr}`;
});

onMounted(async () => {
  if (!store.studentName) return;
  loading.value = true;
  try {
    const doc = await portalApi.getOrCreateWeeklyReflection(store.studentName, weekStart.value);
    if (doc) {
      docName.value = doc.name ?? null;
      highlights.value = doc.highlights ?? '';
      challenges.value = doc.challenges ?? '';
      gratitudeList.value = doc.gratitude_list ?? '';
      smartGoals.value = doc.smart_goals ?? '';
      nextWeekFocus.value = doc.next_week_focus ?? '';
      submitted.value = !!doc.submitted;
    }
  } catch (e) {
    // doc may not exist yet — that's fine
  } finally {
    loading.value = false;
  }
});

async function submit() {
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
    submitted.value = true;
    toast.success('Weekly reflection submitted! ⭐');
    router.push('/');
  } catch (e: any) {
    toast.error(e.message || 'Failed to save reflection');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Weekly Reflection</h1>
        <p class="text-xs text-slate-400">{{ weekRangeDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
        <Star :size="18" class="text-purple-500" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color:#8b5cf6;border-top-color:transparent"></div>
    </div>

    <template v-else>
      <!-- Already submitted banner -->
      <div v-if="submitted"
        class="bg-purple-50 border border-purple-200 rounded-2xl px-5 py-4 flex items-center gap-3">
        <span class="text-2xl">✅</span>
        <div>
          <p class="text-sm font-black text-purple-800">Already submitted</p>
          <p class="text-xs text-purple-500 mt-0.5">You can update your reflection below</p>
        </div>
      </div>

      <!-- Reflection fields -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What went well this week?
          </label>
          <textarea v-model="highlights" rows="3"
            placeholder="Celebrate your wins, big and small..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What was difficult?
          </label>
          <textarea v-model="challenges" rows="3"
            placeholder="What challenges did you face or are still facing?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What are you grateful for?
          </label>
          <textarea v-model="gratitudeList" rows="3"
            placeholder="List 3–5 things you're thankful for this week..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200"></textarea>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            SMART Goals for Next Week
          </label>
          <p class="text-[11px] text-slate-400 mb-2">Specific · Measurable · Achievable · Relevant · Time-bound</p>
          <textarea v-model="smartGoals" rows="4"
            placeholder="e.g. Complete 3 chapters of my textbook by Friday..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What will you focus on?
          </label>
          <textarea v-model="nextWeekFocus" rows="2"
            placeholder="Your main priority or theme for next week..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"></textarea>
        </div>
      </div>

      <button @click="submit" :disabled="saving"
        class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50"
        style="background:#8b5cf6">
        {{ saving ? 'Saving...' : submitted ? '✏️ Update Reflection' : '⭐ Submit Weekly Reflection' }}
      </button>
    </template>
  </div>
</template>
