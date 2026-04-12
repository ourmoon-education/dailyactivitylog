<script setup lang="ts">
import { ref } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Dumbbell, ChevronLeft } from 'lucide-vue-next';
import { call } from '../services/frappe';

const store = usePortalStore();
const router = useRouter();
const activity = ref('');
const duration = ref(30);
const notes = ref('');
const saving = ref(false);

const types = ['Running', 'Walking', 'Cycling', 'Swimming', 'Gym/Weights', 'Sport', 'Yoga', 'Other'];

async function submit() {
  if (!activity.value) { toast.error('Select activity type'); return; }
  saving.value = true;
  try {
    await call('scholars_portal.daily.submit_fitness', {
      log_name: store.todayLog?.name, activity: activity.value, duration: duration.value, notes: notes.value,
    });
    store.todayLog.fitness_submitted = 1;
    toast.success(`${activity.value} logged! 🏃`);
    router.push('/');
  } catch (e: any) { toast.error(e.message); }
  finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><ChevronLeft :size="20" /></button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Fitness Log</h1>
        <p class="text-xs text-slate-400">{{ store.todayDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
        <Dumbbell :size="18" class="text-orange-500" />
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
      <div>
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Activity Type</p>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="t in types" :key="t" @click="activity = t"
            class="py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all"
            :class="activity === t ? '' : 'border-slate-100 text-slate-600'"
            :style="activity === t ? 'border-color:#f97316;background:#fff7ed;color:#ea580c' : ''">
            {{ t }}
          </button>
        </div>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Duration: {{ duration }} min</label>
        <input v-model="duration" type="range" min="5" max="120" step="5" class="w-full" style="accent-color:#f97316" />
        <div class="flex justify-between text-[10px] text-slate-400 mt-1"><span>5 min</span><span>120 min</span></div>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes (optional)</label>
        <textarea v-model="notes" rows="2" placeholder="How did it go?" class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
      </div>
    </div>

    <button @click="submit" :disabled="saving"
      class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50" style="background:#f97316">
      {{ saving ? 'Saving...' : 'Log Activity 🏃' }}
    </button>
  </div>
</template>
