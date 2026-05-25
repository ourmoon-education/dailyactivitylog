<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { MessageSquare, ChevronLeft, Star } from 'lucide-vue-next';
import { portalApi } from '../services/frappe';

const store = usePortalStore();
const router = useRouter();
const route = useRoute();

const sessionId = route.params.session_id as string;
const logName = computed(() => store.todayLog?.name ?? '');

const loading = ref(false);
const saving = ref(false);
const session = ref<any>(null);

// Common fields
const attended = ref(true);
const engagementRating = ref(0);
const whatILearned = ref('');
const challenges = ref('');

// Agriculture conditional fields
const agriArea = ref('');
const agriTasks = ref('');
const agriObservations = ref('');

// Management conditional fields
const mgmtReadingDone = ref(false);
const mgmtReadingNotes = ref('');
const mgmtQuizScore = ref<number | ''>('');
const mgmtPresentationNotes = ref('');

const feedbackForm = computed(() => session.value?.feedback_form ?? 'none');

const showAgri = computed(() => feedbackForm.value === 'agriculture');
const showMgmt = computed(() => feedbackForm.value === 'management');

function formatTime(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour % 12 || 12;
  return `${display}:${m}${suffix}`;
}

const sessionTimeRange = computed(() => {
  if (!session.value) return '';
  const start = formatTime(session.value.time_start ?? '');
  const end = formatTime(session.value.time_end ?? '');
  return start && end ? `${start} – ${end}` : start || end;
});

onMounted(async () => {
  if (!logName.value) return;

  // Redirect weekly feedback forms
  if (route.query.feedback_form === 'weekly') {
    router.replace('/weekly-reflection');
    return;
  }

  loading.value = true;
  try {
    // Get today's sessions to find this session's details
    const sessions: any[] = await portalApi.getTodaySessions(logName.value);
    session.value = sessions.find((s: any) => s.name === sessionId || String(s.idx) === String(sessionId)) ?? null;

    // Redirect weekly sessions
    if (session.value?.feedback_form === 'weekly') {
      router.replace('/weekly-reflection');
      return;
    }

    // Pre-fill existing feedback if present
    const existing = await portalApi.getSessionFeedback(logName.value, sessionId);
    if (existing) {
      attended.value = existing.attended !== false && existing.attended !== 0;
      engagementRating.value = existing.engagement_rating ?? 0;
      whatILearned.value = existing.what_i_learned ?? '';
      challenges.value = existing.challenges ?? '';
      agriArea.value = existing.agri_area ?? '';
      agriTasks.value = existing.agri_tasks ?? '';
      agriObservations.value = existing.agri_observations ?? '';
      mgmtReadingDone.value = !!existing.mgmt_reading_done;
      mgmtReadingNotes.value = existing.mgmt_reading_notes ?? '';
      mgmtQuizScore.value = existing.mgmt_quiz_score ?? '';
      mgmtPresentationNotes.value = existing.mgmt_presentation_notes ?? '';
    }
  } catch {
    // no existing feedback — continue
  } finally {
    loading.value = false;
  }
});

async function submit() {
  if (showAgri.value && !agriTasks.value.trim()) {
    toast.error('Please describe the agriculture tasks');
    return;
  }
  saving.value = true;
  try {
    await portalApi.submitSessionFeedback({
      log_name: logName.value,
      session_id: sessionId,
      attended: attended.value,
      engagement_rating: engagementRating.value,
      what_i_learned: whatILearned.value,
      challenges: challenges.value,
      ...(showAgri.value ? {
        agri_area: agriArea.value,
        agri_tasks: agriTasks.value,
        agri_observations: agriObservations.value,
      } : {}),
      ...(showMgmt.value ? {
        mgmt_reading_done: mgmtReadingDone.value,
        mgmt_reading_notes: mgmtReadingNotes.value,
        mgmt_quiz_score: mgmtQuizScore.value === '' ? null : mgmtQuizScore.value,
        mgmt_presentation_notes: mgmtPresentationNotes.value,
      } : {}),
    });
    toast.success('Feedback saved! 💬');
    router.back();
  } catch (e: any) {
    toast.error(e.message || 'Failed to save feedback');
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
        <h1 class="text-xl font-black text-slate-900">Session Feedback</h1>
        <p class="text-xs text-slate-400">{{ store.todayDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <MessageSquare :size="18" class="text-blue-500" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color:#3b82f6;border-top-color:transparent"></div>
    </div>

    <template v-else>
      <!-- Session info banner -->
      <div v-if="session" class="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <p class="text-xs font-bold text-blue-700">{{ session.label ?? session.title ?? 'Session' }}</p>
        <p v-if="session.category" class="text-[11px] text-blue-500 mt-0.5 uppercase tracking-wider">
          {{ session.category }}
          <span v-if="sessionTimeRange"> · {{ sessionTimeRange }}</span>
        </p>
      </div>

      <!-- Attendance toggle -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Did you attend?</p>
        <div class="flex gap-3">
          <button @click="attended = true"
            class="flex-1 py-3 rounded-xl border-2 text-sm font-black transition-all"
            :style="attended ? 'border-color:#3b82f6;background:#eff6ff;color:#1d4ed8' : 'border-color:#e2e8f0;color:#64748b'">
            ✅ Yes, I attended
          </button>
          <button @click="attended = false"
            class="flex-1 py-3 rounded-xl border-2 text-sm font-black transition-all"
            :style="!attended ? 'border-color:#ef4444;background:#fef2f2;color:#b91c1c' : 'border-color:#e2e8f0;color:#64748b'">
            ❌ I missed it
          </button>
        </div>
      </div>

      <!-- Engagement rating -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Engagement Rating
        </p>
        <div class="flex gap-2">
          <button v-for="n in 5" :key="n" @click="engagementRating = n"
            class="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all"
            :style="engagementRating >= n
              ? 'border-color:#3b82f6;background:#eff6ff'
              : 'border-color:#e2e8f0'">
            <Star :size="20"
              :style="engagementRating >= n ? 'color:#3b82f6;fill:#3b82f6' : 'color:#cbd5e1'" />
            <span class="text-[10px] font-bold text-slate-400">{{ n }}</span>
          </button>
        </div>
      </div>

      <!-- Core reflection fields -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What I Learned
          </label>
          <textarea v-model="whatILearned" rows="3"
            placeholder="What were the key takeaways from this session?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"></textarea>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Challenges
          </label>
          <textarea v-model="challenges" rows="2"
            placeholder="Any difficulties or things that were unclear?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>
      </div>

      <!-- Agriculture extra fields -->
      <div v-if="showAgri" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Agriculture Session Details</p>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Area / Crop</label>
          <input v-model="agriArea" placeholder="Which area or crop did this session cover?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Tasks Performed <span class="text-emerald-600">★</span>
          </label>
          <textarea v-model="agriTasks" rows="3"
            placeholder="What tasks were carried out during the session?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200"></textarea>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Observations</label>
          <textarea v-model="agriObservations" rows="2"
            placeholder="What did you notice or observe?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>
      </div>

      <!-- Management extra fields -->
      <div v-if="showMgmt" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Management Session Details</p>

        <label class="flex items-center gap-3 cursor-pointer">
          <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0"
            :style="mgmtReadingDone ? 'border-color:#3b82f6;background:#3b82f6' : 'border-color:#cbd5e1'"
            @click="mgmtReadingDone = !mgmtReadingDone">
            <svg v-if="mgmtReadingDone" width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M1 4L4 7L10 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="text-sm font-bold text-slate-700">Reading completed</span>
        </label>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reading Notes</label>
          <textarea v-model="mgmtReadingNotes" rows="2"
            placeholder="Notes from the reading material..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Quiz Score (0–100)
          </label>
          <input v-model.number="mgmtQuizScore" type="number" min="0" max="100" placeholder="e.g. 85"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Presentation Notes
          </label>
          <textarea v-model="mgmtPresentationNotes" rows="2"
            placeholder="Notes from any presentations or discussions..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>
      </div>

      <button @click="submit" :disabled="saving"
        class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50"
        style="background:#3b82f6">
        {{ saving ? 'Saving...' : '💬 Submit Feedback' }}
      </button>
    </template>
  </div>
</template>
