<script setup lang="ts">
import { computed } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { Sun, Moon, BookOpen, Heart, Dumbbell, CheckSquare, CheckCircle2, ArrowRight, History } from 'lucide-vue-next';

const store = usePortalStore();
const router = useRouter();

const cards = computed(() => [
  { id: 'day-starter', icon: Sun, label: 'Day Starter', sub: 'Set your intentions', done: store.dayStarted, href: '/day-starter', color: '#fef3c7', iconColor: '#d97706', btn: '#f59e0b' },
  { id: 'checklist', icon: CheckSquare, label: 'Activity Checklist', sub: `${store.completedCount}/${store.totalCount} done`, done: false, always: true, href: '/checklist', color: '#dbeafe', iconColor: '#2563eb', btn: '#3b82f6' },
  { id: 'biblical', icon: BookOpen, label: 'Biblical Comprehension', sub: 'Reading reflection', done: !!store.todayLog?.biblical_submitted, href: '/comprehension/biblical', color: '#ede9fe', iconColor: '#7c3aed', btn: '#8b5cf6' },
  { id: 'general', icon: Heart, label: 'General Comprehension', sub: 'General reflection', done: !!store.todayLog?.general_submitted, href: '/comprehension/general', color: '#d1fae5', iconColor: '#059669', btn: '#10b981' },
  { id: 'fitness', icon: Dumbbell, label: 'Physical Fitness', sub: 'Log your activity', done: !!store.todayLog?.fitness_submitted, href: '/fitness', color: '#ffedd5', iconColor: '#c2410c', btn: '#f97316' },
  { id: 'day-finisher', icon: Moon, label: 'Day Finisher', sub: 'Review and close your day', done: store.dayFinished, href: '/day-finisher', color: '#e0e7ff', iconColor: '#4338ca', btn: '#6366f1' },
]);
</script>

<template>
  <div class="space-y-5">
    <div>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Young Leaders Programme</p>
      <h1 class="text-2xl font-black text-slate-900">{{ store.displayName }}'s Portal</h1>
      <p class="text-sm text-slate-500 mt-0.5">{{ store.todayDisplay }}</p>
    </div>

    <div v-if="store.totalCount > 0" class="bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Today's Progress</span>
        <span class="text-xs font-bold" style="color:#496763">{{ store.completedCount }}/{{ store.totalCount }}</span>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" style="background:#496763"
          :style="{ width: store.totalCount ? `${(store.completedCount / store.totalCount) * 100}%` : '0%' }"></div>
      </div>
    </div>

    <div v-if="store.loading" class="flex justify-center py-10">
      <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style="border-color:#496763; border-top-color:transparent"></div>
    </div>

    <div v-else class="space-y-2.5">
      <div v-for="card in cards" :key="card.id"
        class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3.5"
        :style="card.done && !card.always ? 'opacity:0.6' : ''">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" :style="{ background: card.color }">
          <component :is="card.icon" :size="20" :style="{ color: card.iconColor }" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-black text-slate-900 text-sm leading-tight">{{ card.label }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ card.done && !card.always ? '✅ Done' : card.sub }}</p>
        </div>
        <button v-if="!card.done || card.always"
          @click="$router.push(card.href)"
          class="flex items-center gap-1 px-3 py-2 rounded-xl text-white text-xs font-bold shrink-0"
          :style="{ background: card.btn }">
          {{ card.done && card.always ? 'View' : 'Go' }}
          <ArrowRight :size="13" />
        </button>
        <CheckCircle2 v-else :size="20" style="color:#10b981" class="shrink-0" />
      </div>
    </div>

    <button @click="$router.push('/history')" class="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">
      <History :size="14" /> View History
    </button>
  </div>
</template>
