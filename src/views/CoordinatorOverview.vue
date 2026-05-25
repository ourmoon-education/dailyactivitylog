<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { portalApi } from '../services/frappe';
import { ChevronLeft, ChevronDown, ChevronUp, Users, CalendarDays } from 'lucide-vue-next';
import { format, parseISO } from 'date-fns';

const store = usePortalStore();
const router = useRouter();

const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'));
const loading = ref(false);
const rows = ref<any[]>([]);
const expandedRow = ref<string | null>(null);

const moodEmojis = ['', '😔', '😐', '🙂', '😊', '🔥'];

const summary = computed(() => ({
  started: rows.value.filter(r => r.day_starter_submitted).length,
  finished: rows.value.filter(r => r.day_finisher_submitted).length,
  total: rows.value.length,
}));

const dateDisplay = computed(() => {
  try {
    return format(parseISO(selectedDate.value), 'EEEE, d MMM yyyy');
  } catch {
    return selectedDate.value;
  }
});

async function load() {
  loading.value = true;
  expandedRow.value = null;
  try {
    rows.value = await portalApi.getCoordinatorOverview(selectedDate.value);
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

watch(selectedDate, load);
onMounted(load);

function toggleRow(name: string) {
  expandedRow.value = expandedRow.value === name ? null : name;
}

function badgeStyle(active: boolean) {
  return active
    ? 'background:#d1fae5;color:#065f46'
    : 'background:#f1f5f9;color:#94a3b8';
}

function activityPercent(r: any) {
  if (!r.activity_count) return 0;
  return Math.round((r.done_count / r.activity_count) * 100);
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
        <h1 class="text-xl font-black text-slate-900">Coordinator Overview</h1>
        <p class="text-xs text-slate-400">{{ dateDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 rounded-xl flex items-center justify-center"
        style="background:#e6edec">
        <Users :size="18" style="color:#496763" />
      </div>
    </div>

    <!-- Date picker -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
      <CalendarDays :size="16" style="color:#496763" class="shrink-0" />
      <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Date</label>
      <input v-model="selectedDate" type="date"
        class="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2"
        style="--tw-ring-color:#496763" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color:#496763;border-top-color:transparent"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="rows.length === 0" class="text-center py-12 text-slate-400">
      <p class="text-4xl mb-3">📋</p>
      <p class="font-bold text-sm">No logs found for this date</p>
      <p class="text-xs mt-1">Try selecting a different date</p>
    </div>

    <template v-else>
      <!-- Summary row -->
      <div class="rounded-2xl p-4 flex gap-4" style="background:#496763">
        <div class="flex-1 text-center">
          <p class="text-2xl font-black text-white">{{ summary.started }}/{{ summary.total }}</p>
          <p class="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Started</p>
        </div>
        <div class="w-px bg-white/20"></div>
        <div class="flex-1 text-center">
          <p class="text-2xl font-black text-white">{{ summary.finished }}/{{ summary.total }}</p>
          <p class="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Finished</p>
        </div>
        <div class="w-px bg-white/20"></div>
        <div class="flex-1 text-center">
          <p class="text-2xl font-black text-white">{{ summary.total }}</p>
          <p class="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Students</p>
        </div>
      </div>

      <!-- Student rows -->
      <div class="space-y-2.5">
        <div v-for="row in rows" :key="row.name"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <!-- Main row -->
          <button class="w-full text-left" @click="toggleRow(row.name)">
            <div class="flex items-center gap-3 px-4 py-3.5">
              <!-- Mood + name -->
              <div class="flex items-center gap-2.5 flex-1 min-w-0">
                <span v-if="row.morning_mood" class="text-xl shrink-0">
                  {{ moodEmojis[row.morning_mood] }}
                </span>
                <div v-else class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span class="text-xs font-black text-slate-400">{{ (row.student_name || '?')[0].toUpperCase() }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-black text-slate-900 truncate">
                    {{ row.preferred_name || row.student_name || row.name }}
                  </p>
                  <p v-if="row.activity_count" class="text-[11px] text-slate-400">
                    {{ row.done_count ?? 0 }}/{{ row.activity_count }} tasks
                  </p>
                </div>
              </div>

              <!-- Mini badges -->
              <div class="flex items-center gap-1 shrink-0">
                <span class="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  :style="badgeStyle(!!row.day_starter_submitted)" title="Day Started">S</span>
                <span class="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  :style="badgeStyle(!!row.day_finisher_submitted)" title="Day Finished">F</span>
                <span class="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  :style="badgeStyle(!!row.biblical_submitted)" title="Biblical">B</span>
                <span class="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  :style="badgeStyle(!!row.general_submitted)" title="General">G</span>
                <span class="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  :style="badgeStyle(!!row.fitness_submitted)" title="Fitness">🏃</span>
                <span class="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  :style="badgeStyle(!!row.agriculture_submitted)" title="Agriculture">🌱</span>
              </div>

              <ChevronDown v-if="expandedRow !== row.name" :size="16" class="text-slate-400 shrink-0 ml-1" />
              <ChevronUp v-else :size="16" class="text-slate-400 shrink-0 ml-1" />
            </div>

            <!-- Activity progress bar -->
            <div v-if="row.activity_count" class="px-4 pb-3">
              <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                  :style="{ background: '#496763', width: activityPercent(row) + '%' }"></div>
              </div>
            </div>
          </button>

          <!-- Expanded detail -->
          <div v-if="expandedRow === row.name" class="border-t border-slate-100 bg-slate-50/60 px-4 py-4 space-y-3">
            <!-- Badge legend -->
            <div class="grid grid-cols-3 gap-2">
              <div v-for="badge in [
                { label: 'Day Started', done: !!row.day_starter_submitted, color: '#f59e0b' },
                { label: 'Day Finished', done: !!row.day_finisher_submitted, color: '#6366f1' },
                { label: 'Biblical', done: !!row.biblical_submitted, color: '#8b5cf6' },
                { label: 'General', done: !!row.general_submitted, color: '#10b981' },
                { label: 'Fitness', done: !!row.fitness_submitted, color: '#f97316' },
                { label: 'Agriculture', done: !!row.agriculture_submitted, color: '#059669' },
              ]" :key="badge.label"
                class="rounded-xl px-2 py-2 text-center border"
                :style="badge.done
                  ? `border-color:${badge.color}30;background:${badge.color}10`
                  : 'border-color:#f1f5f9;background:#fafafa'">
                <p class="text-[10px] font-black"
                  :style="badge.done ? `color:${badge.color}` : 'color:#cbd5e1'">
                  {{ badge.done ? '✅' : '○' }}
                </p>
                <p class="text-[9px] font-bold text-slate-400 mt-0.5 leading-tight">{{ badge.label }}</p>
              </div>
            </div>

            <!-- Intention -->
            <div v-if="row.intention" class="bg-white rounded-xl px-3 py-2.5 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Intention</p>
              <p class="text-sm text-slate-700">{{ row.intention }}</p>
            </div>

            <!-- Reflection -->
            <div v-if="row.reflection" class="bg-white rounded-xl px-3 py-2.5 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reflection</p>
              <p class="text-sm text-slate-700">{{ row.reflection }}</p>
            </div>

            <!-- Link to full day -->
            <button
              @click.stop="router.push(`/day/${row.date || selectedDate}`)"
              class="w-full py-2.5 text-white text-xs font-black rounded-xl"
              style="background:#496763">
              View Full Day →
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
