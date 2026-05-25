<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { Sprout, ChevronLeft } from 'lucide-vue-next';
import { portalApi } from '../services/frappe';

const store = usePortalStore();
const router = useRouter();
const route = useRoute();
const saving = ref(false);
const loading = ref(false);

const activityType = ref('');
const cropAnimalDetails = ref('');
const plotLocation = ref('');
const timeSpentHours = ref<number | ''>('');
const weatherConditions = ref('');
const tasksPerformed = ref('');
const observations = ref('');
const challengesFaced = ref('');
const learningOutcomes = ref('');
const supervisorName = ref('');

const activityTypes = [
  'Crop Farming', 'Livestock Rearing', 'Aquaculture', 'Horticulture',
  'Agro-processing', 'Irrigation', 'Composting', 'Pest Management',
  'Land Preparation', 'Harvesting', 'Other',
];

const weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Hot', 'Cool', 'Mixed'];

onMounted(async () => {
  const logName = store.todayLog?.name;
  if (!logName) return;
  loading.value = true;
  try {
    const existing = await portalApi.getAgricultureLog(logName);
    if (existing) {
      activityType.value = existing.activity_type ?? '';
      cropAnimalDetails.value = existing.crop_animal_details ?? '';
      plotLocation.value = existing.plot_location ?? '';
      timeSpentHours.value = existing.time_spent_hours ?? '';
      weatherConditions.value = existing.weather_conditions ?? '';
      tasksPerformed.value = existing.tasks_performed ?? '';
      observations.value = existing.observations ?? '';
      challengesFaced.value = existing.challenges_faced ?? '';
      learningOutcomes.value = existing.learning_outcomes ?? '';
      supervisorName.value = existing.supervisor_name ?? '';
    }
  } catch {
    // no existing record — that's fine
  } finally {
    loading.value = false;
  }
});

async function submit() {
  if (!tasksPerformed.value.trim()) {
    toast.error('Please describe the tasks you performed');
    return;
  }
  saving.value = true;
  try {
    await portalApi.submitAgriculture({
      log_name: store.todayLog?.name,
      activity_type: activityType.value,
      crop_animal_details: cropAnimalDetails.value,
      plot_location: plotLocation.value,
      time_spent_hours: timeSpentHours.value === '' ? null : timeSpentHours.value,
      weather_conditions: weatherConditions.value,
      tasks_performed: tasksPerformed.value,
      observations: observations.value,
      challenges_faced: challengesFaced.value,
      learning_outcomes: learningOutcomes.value,
      supervisor_name: supervisorName.value,
    });
    store.todayLog.agriculture_submitted = 1;
    toast.success('Agriculture log saved! 🌱');
    router.push('/');
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
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Agriculture Log</h1>
        <p class="text-xs text-slate-400">{{ store.todayDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
        <Sprout :size="18" class="text-emerald-600" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color:#059669;border-top-color:transparent"></div>
    </div>

    <template v-else>
      <!-- Activity Type -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Activity Type</p>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="t in activityTypes" :key="t" @click="activityType = t"
            class="py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition-all text-left"
            :class="activityType === t ? '' : 'border-slate-100 text-slate-600'"
            :style="activityType === t ? 'border-color:#059669;background:#f0fdf4;color:#065f46' : ''">
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Details Fields -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What crops/animals?
          </label>
          <input v-model="cropAnimalDetails" placeholder="e.g. Maize, Tomatoes, Goats..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Plot / Location
          </label>
          <input v-model="plotLocation" placeholder="e.g. Back field, Greenhouse B..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Time Spent (hours)
          </label>
          <input v-model.number="timeSpentHours" type="number" min="0" max="12" step="0.5"
            placeholder="e.g. 2.5"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>

        <!-- Weather -->
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Weather Conditions</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="w in weatherOptions" :key="w" @click="weatherConditions = weatherConditions === w ? '' : w"
              class="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
              :style="weatherConditions === w
                ? 'border-color:#059669;background:#f0fdf4;color:#065f46'
                : 'border-color:#e2e8f0;background:#f8fafc;color:#64748b'">
              {{ w }}
            </button>
          </div>
        </div>
      </div>

      <!-- Textareas -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What did you do? <span class="text-emerald-600">★</span>
          </label>
          <textarea v-model="tasksPerformed" rows="4"
            placeholder="Describe the tasks you carried out today..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What did you observe?
          </label>
          <textarea v-model="observations" rows="2"
            placeholder="Any notable observations (growth, health, soil, weather)..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Any challenges?
          </label>
          <textarea v-model="challengesFaced" rows="2"
            placeholder="What difficulties did you encounter?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            What did you learn?
          </label>
          <textarea v-model="learningOutcomes" rows="2"
            placeholder="Key lessons or takeaways..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Supervisor Name
          </label>
          <input v-model="supervisorName" placeholder="Who supervised this session?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none" />
        </div>
      </div>

      <button @click="submit" :disabled="saving"
        class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50"
        style="background:#059669">
        {{ saving ? 'Saving...' : '🌱 Save Agriculture Log' }}
      </button>
    </template>
  </div>
</template>
