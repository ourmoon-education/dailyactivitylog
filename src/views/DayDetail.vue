<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRoute } from 'vue-router';
import { ChevronLeft, CheckCircle2, Circle, BookOpen, Dumbbell, Sprout, Sun, Moon } from 'lucide-vue-next';
import { portalApi } from '../services/frappe';
import { format, parseISO } from 'date-fns';

const store = usePortalStore();
const route = useRoute();

const date = route.params.date as string;
const loading = ref(true);
const log = ref<any>(null);
const activities = ref<any[]>([]);

const moodEmojis = ['', '😔', '😐', '🙂', '😊', '🔥'];
const moodLabels = ['', 'Tough', 'Okay', 'Good', 'Great', 'Excellent'];

const dateDisplay = computed(() => {
  try {
    return format(parseISO(date), 'EEEE, d MMMM yyyy');
  } catch {
    return date;
  }
});

const topLevelActivities = computed(() => activities.value.filter(a => !a.parent_activity));
const subtasksOf = (name: string) => activities.value.filter(a => a.parent_activity === name);

function statusStyle(done: boolean) {
  return done
    ? 'background:#d1fae5;color:#065f46'
    : 'background:#f1f5f9;color:#94a3b8';
}

onMounted(async () => {
  loading.value = true;
  try {
    log.value = await portalApi.getTodayLog(store.studentName, date);
    if (log.value?.name) {
      activities.value = await portalApi.getActivities(log.value.name);
    }
  } catch (e) {
    log.value = null;
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Day Summary</h1>
        <p class="text-xs text-slate-400">{{ dateDisplay }}</p>
      </div>
      <div class="ml-auto">
        <span v-if="log?.day_finisher_submitted"
          class="text-xs font-bold px-3 py-1.5 rounded-full" style="background:#d1fae5;color:#065f46">
          ✅ Complete
        </span>
        <span v-else-if="log?.day_starter_submitted"
          class="text-xs font-bold px-3 py-1.5 rounded-full" style="background:#fef3c7;color:#92400e">
          🌅 In Progress
        </span>
        <span v-else
          class="text-xs font-bold px-3 py-1.5 rounded-full" style="background:#f1f5f9;color:#64748b">
          ⏳ Incomplete
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style="border-color:#496763;border-top-color:transparent"></div>
    </div>

    <!-- No log found -->
    <div v-else-if="!log" class="text-center py-12 text-slate-400">
      <p class="text-4xl mb-3">📭</p>
      <p class="font-bold text-sm">No log found for this day</p>
    </div>

    <template v-else>
      <!-- Morning section -->
      <div v-if="log.day_starter_submitted" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
            <Sun :size="14" class="text-amber-500" />
          </div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Morning</p>
        </div>

        <div v-if="log.morning_mood" class="flex items-center gap-3 mb-4">
          <span class="text-3xl">{{ moodEmojis[log.morning_mood] }}</span>
          <div>
            <p class="text-xs text-slate-400">Mood</p>
            <p class="text-sm font-bold text-slate-700">{{ moodLabels[log.morning_mood] }}</p>
          </div>
        </div>

        <div v-if="log.intention" class="mb-3">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Intention</p>
          <p class="text-sm text-slate-700 leading-relaxed">{{ log.intention }}</p>
        </div>

        <div v-if="log.gratitude">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gratitude</p>
          <p class="text-sm text-slate-700 leading-relaxed">{{ log.gratitude }}</p>
        </div>
      </div>

      <!-- Activities section -->
      <div v-if="topLevelActivities.length > 0" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="px-5 pt-4 pb-3 border-b border-slate-50">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Activities</p>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ topLevelActivities.filter(a => a.done).length }}/{{ topLevelActivities.length }} completed
          </p>
        </div>

        <div class="divide-y divide-slate-50">
          <div v-for="a in topLevelActivities" :key="a.name">
            <div class="flex items-center gap-3 px-5 py-3.5">
              <CheckCircle2 v-if="a.done" :size="18" style="color:#10b981" class="shrink-0" />
              <Circle v-else :size="18" class="text-slate-300 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-800" :class="a.done ? 'line-through opacity-40' : ''">
                  {{ a.title }}
                </p>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{{ a.category }}</p>
              </div>
            </div>
            <!-- Subtasks -->
            <div v-if="subtasksOf(a.name).length > 0" class="bg-slate-50/70">
              <div v-for="sub in subtasksOf(a.name)" :key="sub.name"
                class="flex items-center gap-3 pl-10 pr-5 py-2.5 border-t border-slate-100">
                <CheckCircle2 v-if="sub.done" :size="14" style="color:#10b981" class="shrink-0" />
                <Circle v-else :size="14" class="text-slate-300 shrink-0" />
                <span class="text-xs text-slate-600" :class="sub.done ? 'line-through opacity-40' : ''">
                  {{ sub.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submission badges -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Submissions</p>
        <div class="grid grid-cols-2 gap-2">
          <!-- Biblical -->
          <div class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border"
            :style="log.biblical_submitted ? 'border-color:#ddd6fe;background:#f5f3ff' : 'border-color:#f1f5f9;background:#fafafa'">
            <BookOpen :size="14" :style="log.biblical_submitted ? 'color:#7c3aed' : 'color:#cbd5e1'" />
            <div>
              <p class="text-[11px] font-bold" :style="log.biblical_submitted ? 'color:#5b21b6' : 'color:#94a3b8'">Biblical</p>
              <p class="text-[10px]" :style="log.biblical_submitted ? 'color:#7c3aed' : 'color:#cbd5e1'">
                {{ log.biblical_submitted ? 'Submitted' : 'Not done' }}
              </p>
            </div>
          </div>

          <!-- General -->
          <div class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border"
            :style="log.general_submitted ? 'border-color:#a7f3d0;background:#f0fdf4' : 'border-color:#f1f5f9;background:#fafafa'">
            <BookOpen :size="14" :style="log.general_submitted ? 'color:#059669' : 'color:#cbd5e1'" />
            <div>
              <p class="text-[11px] font-bold" :style="log.general_submitted ? 'color:#065f46' : 'color:#94a3b8'">General</p>
              <p class="text-[10px]" :style="log.general_submitted ? 'color:#059669' : 'color:#cbd5e1'">
                {{ log.general_submitted ? 'Submitted' : 'Not done' }}
              </p>
            </div>
          </div>

          <!-- Fitness -->
          <div class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border"
            :style="log.fitness_submitted ? 'border-color:#fed7aa;background:#fff7ed' : 'border-color:#f1f5f9;background:#fafafa'">
            <Dumbbell :size="14" :style="log.fitness_submitted ? 'color:#ea580c' : 'color:#cbd5e1'" />
            <div>
              <p class="text-[11px] font-bold" :style="log.fitness_submitted ? 'color:#c2410c' : 'color:#94a3b8'">Fitness</p>
              <p class="text-[10px]" :style="log.fitness_submitted ? 'color:#ea580c' : 'color:#cbd5e1'">
                {{ log.fitness_submitted ? 'Submitted' : 'Not done' }}
              </p>
            </div>
          </div>

          <!-- Agriculture -->
          <div class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border"
            :style="log.agriculture_submitted ? 'border-color:#a7f3d0;background:#f0fdf4' : 'border-color:#f1f5f9;background:#fafafa'">
            <Sprout :size="14" :style="log.agriculture_submitted ? 'color:#059669' : 'color:#cbd5e1'" />
            <div>
              <p class="text-[11px] font-bold" :style="log.agriculture_submitted ? 'color:#065f46' : 'color:#94a3b8'">Agriculture</p>
              <p class="text-[10px]" :style="log.agriculture_submitted ? 'color:#059669' : 'color:#cbd5e1'">
                {{ log.agriculture_submitted ? 'Submitted' : 'Not done' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Evening section -->
      <div v-if="log.day_finisher_submitted" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Moon :size="14" class="text-indigo-500" />
          </div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Evening</p>
        </div>

        <div v-if="log.reflection" class="mb-3">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reflection</p>
          <p class="text-sm text-slate-700 leading-relaxed">{{ log.reflection }}</p>
        </div>

        <div v-if="log.highlight" class="mb-3">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Day Highlight</p>
          <p class="text-sm text-slate-700 leading-relaxed">{{ log.highlight }}</p>
        </div>

        <div v-if="log.tomorrow_plan">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan for Tomorrow</p>
          <p class="text-sm text-slate-700 leading-relaxed">{{ log.tomorrow_plan }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
