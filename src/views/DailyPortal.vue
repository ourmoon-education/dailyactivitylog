<script setup lang="ts">
import { computed } from 'vue';
import { usePortalStore } from '../stores/portal';
import { appSettings } from '../stores/appSettings';
import { Sun, Moon, BookOpen, Heart, Dumbbell, CheckSquare, CheckCircle2, ArrowRight, History, Sprout, Calendar, BookMarked } from 'lucide-vue-next';

const store = usePortalStore();

const cards = computed(() => [
  { id: 'day-starter', icon: Sun, label: 'Day Starter', sub: 'Set your intentions', done: store.dayStarted, href: '/day-starter', color: '#fef3c7', iconColor: '#d97706', btn: '#f59e0b' },
  { id: 'checklist', icon: CheckSquare, label: 'Activity Checklist', sub: `${store.completedCount}/${store.totalCount} done`, done: false, always: true, href: '/checklist', color: '#dbeafe', iconColor: '#2563eb', btn: '#3b82f6' },
  { id: 'biblical', icon: BookOpen, label: 'Biblical Comprehension', sub: 'Reading reflection', done: !!store.todayLog?.biblical_submitted, href: '/comprehension/biblical', color: '#ede9fe', iconColor: '#7c3aed', btn: '#8b5cf6' },
  { id: 'general', icon: Heart, label: 'General Comprehension', sub: 'General reflection', done: !!store.todayLog?.general_submitted, href: '/comprehension/general', color: '#d1fae5', iconColor: '#059669', btn: '#10b981' },
  { id: 'fitness', icon: Dumbbell, label: 'Physical Fitness', sub: 'Log your activity', done: !!store.todayLog?.fitness_submitted, href: '/fitness', color: '#ffedd5', iconColor: '#c2410c', btn: '#f97316' },
  { id: 'agriculture', icon: Sprout, label: 'Agriculture Log', sub: 'Log farm work', done: !!store.todayLog?.agriculture_submitted, href: '/agriculture', color: '#dcfce7', iconColor: '#16a34a', btn: '#22c55e' },
  { id: 'day-finisher', icon: Moon, label: 'Day Finisher', sub: 'Review and close your day', done: store.dayFinished, href: '/day-finisher', color: '#e0e7ff', iconColor: '#4338ca', btn: '#6366f1' },
]);

const isWeekend = computed(() => {
  const day = new Date().getDay();
  return day === 0 || day === 6;
});
</script>

<template>
  <div class="space-y-5">
    <div>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
        {{ appSettings.portal_greeting }}
      </p>
      <h1 class="text-2xl font-black text-slate-900">{{ store.displayName }}'s Portal</h1>
      <p class="text-sm text-slate-500 mt-0.5">{{ store.todayDisplay }}</p>
    </div>

    <div v-if="store.totalCount > 0" class="bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Today's Progress</span>
        <span class="text-xs font-bold" :style="{ color: appSettings.primary_color }">{{ store.completedCount }}/{{ store.totalCount }}</span>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" :style="{ background: appSettings.primary_color, width: store.totalCount ? `${(store.completedCount / store.totalCount) * 100}%` : '0%' }"></div>
      </div>
    </div>

    <div v-if="store.loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" :style="{ borderColor: appSettings.primary_color, borderTopColor: 'transparent' }"></div>
    </div>

    <div v-else class="space-y-2.5">
      <div v-for="card in cards" :key="card.id"
        class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3.5"
        :style="(card.done as boolean) && !(card as any).always ? 'opacity:0.6' : ''">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" :style="{ background: card.color }">
          <component :is="card.icon" :size="20" :style="{ color: card.iconColor }" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-black text-slate-900 text-sm leading-tight">{{ card.label }}</p>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ (card.done as boolean) && !(card as any).always ? '✅ Done' : card.sub }}
          </p>
        </div>
        <button v-if="!(card.done as boolean) || (card as any).always"
          @click="$router.push(card.href)"
          class="flex items-center gap-1 px-3 py-2 rounded-xl text-white text-xs font-bold shrink-0"
          :style="{ background: card.btn }">
          {{ (card.done as boolean) && (card as any).always ? 'View' : 'Go' }}
          <ArrowRight :size="13" />
        </button>
        <CheckCircle2 v-else :size="20" style="color:#10b981" class="shrink-0" />
      </div>
    </div>

    <!-- Today's Sessions -->
    <div v-if="store.todaySessions.length > 0" class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Today's Sessions</p>
      <div v-for="session in store.todaySessions" :key="session.name"
        class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-slate-700">{{ session.time_start }}</span>
            <span class="text-xs font-semibold text-slate-900 truncate">{{ session.label }}</span>
            <span v-if="session.category"
              class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {{ session.category }}
            </span>
          </div>
        </div>
        <span v-if="session.feedback_submitted"
          class="text-[11px] font-bold text-emerald-600 shrink-0">
          Done ✅
        </span>
        <button v-else
          @click="$router.push(`/sessions?session_id=${session.name}`)"
          class="text-[11px] font-bold px-2.5 py-1.5 rounded-lg text-white shrink-0"
          style="background:#496763">
          Log
        </button>
      </div>
    </div>

    <button @click="$router.push('/history')" class="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">
      <History :size="14" /> View History
    </button>

    <!-- Weekly Reflection (weekends only) -->
    <button v-if="isWeekend"
      @click="$router.push('/weekly')"
      class="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">
      <Calendar :size="14" /> Weekly Reflection
    </button>

    <!-- Coordinator View -->
    <button v-if="store.isCoordinator"
      @click="$router.push('/coordinator')"
      class="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
      Coordinator View
    </button>

    <!-- Platform Guide -->
    <button @click="$router.push('/portal-guide')"
      class="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600">
      <BookMarked :size="13" /> Platform Guide
    </button>
  </div>
</template>
