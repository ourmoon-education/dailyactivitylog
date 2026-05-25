<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { portalApi } from '../services/frappe';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const store = usePortalStore();
const history = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  if (store.studentName) history.value = await portalApi.getLogHistory(store.studentName, 14);
  loading.value = false;
});
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><ChevronLeft :size="20" /></button>
      <h1 class="text-xl font-black text-slate-900">Activity History</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style="border-color:#496763;border-top-color:transparent"></div>
    </div>

    <div v-else-if="history.length === 0" class="text-center py-10 text-slate-400">
      <p class="font-bold text-sm">No history yet</p>
    </div>

    <div v-else class="space-y-2.5">
      <div v-for="log in history" :key="log.name"
        class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
        @click="$router.push('/history/' + log.date)">
        <div class="flex items-center justify-between mb-2">
          <div>
            <p class="font-black text-slate-900 text-sm">{{ format(new Date(log.date + 'T12:00:00'), 'EEEE, d MMM') }}</p>
            <p class="text-[11px] text-slate-400">{{ log.date }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full"
              :style="log.day_finisher_submitted ? 'background:#d1fae5;color:#065f46' : log.day_starter_submitted ? 'background:#fef3c7;color:#92400e' : 'background:#f1f5f9;color:#64748b'">
              {{ log.day_finisher_submitted ? '✅ Complete' : log.day_starter_submitted ? '🌅 In Progress' : '⏳ Incomplete' }}
            </span>
            <ChevronRight :size="16" class="text-slate-300 shrink-0" />
          </div>
        </div>
        <div class="flex gap-3 text-[11px] font-bold flex-wrap">
          <span :style="log.biblical_submitted ? 'color:#7c3aed' : 'color:#cbd5e1'">⚑ Biblical</span>
          <span :style="log.general_submitted ? 'color:#059669' : 'color:#cbd5e1'">📚 General</span>
          <span :style="log.fitness_submitted ? 'color:#ea580c' : 'color:#cbd5e1'">🏃 Fitness</span>
          <span :style="log.agriculture_submitted ? 'color:#16a34a' : 'color:#cbd5e1'">🌱 Agri</span>
          <span v-if="log.morning_mood" class="ml-auto text-slate-400">Mood: {{ ['', '😔', '😐', '🙂', '😊', '🔥'][log.morning_mood] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
