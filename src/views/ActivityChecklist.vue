<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePortalStore } from '../stores/portal';
import { toast } from 'vue-sonner';
import { Plus, CheckCircle2, Circle, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const store = usePortalStore();
const newTitle = ref('');
const newCategory = ref('General');
const expandedActivity = ref<string | null>(null);
const newSubtask = ref('');

const categories = ['General', 'Academic', 'Career', 'Fitness', 'Community', 'Spiritual'];
const topLevel = computed(() => store.activities.filter(a => !a.parent_activity));
const subtasksOf = (name: string) => store.activities.filter(a => a.parent_activity === name);

async function addTask() {
  if (!newTitle.value.trim()) return;
  try { await store.addActivity(newTitle.value, newCategory.value); newTitle.value = ''; toast.success('Added'); }
  catch (e: any) { toast.error(e.message); }
}

async function addSubtask(parent: string) {
  if (!newSubtask.value.trim()) return;
  try { await store.addActivity(newSubtask.value, 'General', parent); newSubtask.value = ''; }
  catch (e: any) { toast.error(e.message); }
}

async function moveToTomorrow(name: string) {
  const d = new Date(); d.setDate(d.getDate() + 1);
  await store.moveActivity(name, d.toISOString().split('T')[0]);
  toast.info('Moved to tomorrow');
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Activity Checklist</h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ store.completedCount }}/{{ store.totalCount }} tasks completed</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div class="flex gap-2 mb-3">
        <input v-model="newTitle" placeholder="Add activity..." @keydown.enter="addTask"
          class="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none" />
        <button @click="addTask" class="px-4 py-2.5 text-white rounded-xl" style="background:#496763">
          <Plus :size="18" />
        </button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button v-for="cat in categories" :key="cat" @click="newCategory = cat"
          class="px-3 py-1 rounded-full text-[11px] font-bold border transition-all"
          :style="newCategory === cat ? 'background:#496763;color:white;border-color:#496763' : 'background:#f8fafc;color:#64748b;border-color:#e2e8f0'">
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <div v-if="topLevel.length === 0" class="text-center py-10 text-slate-400">
        <p class="font-bold text-sm">No activities yet</p>
        <p class="text-xs">Add your first activity above</p>
      </div>

      <div v-for="a in topLevel" :key="a.name" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-3 p-4">
          <button @click="store.checkActivity(a.name, !a.done)">
            <CheckCircle2 v-if="a.done" :size="22" style="color:#10b981" />
            <Circle v-else :size="22" class="text-slate-300 hover:text-teal-600" />
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-900" :class="a.done ? 'line-through opacity-40' : ''">{{ a.title }}</p>
            <span class="text-[10px] font-bold text-slate-400 uppercase">{{ a.category }}</span>
          </div>
          <button @click="expandedActivity = expandedActivity === a.name ? null : a.name"
            class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <ChevronRight :size="16" :class="expandedActivity === a.name ? 'rotate-90' : ''" class="transition-transform" />
          </button>
          <button @click="moveToTomorrow(a.name)" class="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg" title="Move to tomorrow">
            <ArrowRight :size="16" />
          </button>
        </div>

        <div v-if="expandedActivity === a.name" class="border-t border-slate-50 bg-slate-50/60">
          <div v-for="sub in subtasksOf(a.name)" :key="sub.name"
            class="flex items-center gap-3 px-6 py-3 border-b border-slate-100 last:border-0">
            <button @click="store.checkActivity(sub.name, !sub.done)">
              <CheckCircle2 v-if="sub.done" :size="16" style="color:#10b981" />
              <Circle v-else :size="16" class="text-slate-300" />
            </button>
            <span class="text-sm text-slate-700" :class="sub.done ? 'line-through opacity-40' : ''">{{ sub.title }}</span>
          </div>
          <div class="flex gap-2 px-4 py-3">
            <input v-model="newSubtask" placeholder="Add subtask..." @keydown.enter="addSubtask(a.name)"
              class="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none" />
            <button @click="addSubtask(a.name)" class="px-3 py-2 text-white rounded-lg text-xs" style="background:#496763">
              <Plus :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
