<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Moon, ChevronLeft, ArrowRight } from 'lucide-vue-next';
import { call } from '../services/frappe';

const store = usePortalStore();
const router = useRouter();
const reflection = ref('');
const highlight = ref('');
const tomorrow = ref('');
const saving = ref(false);

const unfinished = computed(() => store.activities.filter(a => !a.done && !a.parent_activity));

async function moveAll() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  const date = d.toISOString().split('T')[0];
  for (const a of unfinished.value) await store.moveActivity(a.name, date);
  toast.info(`${unfinished.value.length} tasks moved to tomorrow`);
}

async function submit() {
  if (!reflection.value.trim()) { toast.error('Add your reflection'); return; }
  saving.value = true;
  try {
    await call('scholars_portal.daily.submit_day_finisher', {
      log_name: store.todayLog?.name, reflection: reflection.value,
      highlight: highlight.value, tomorrow_plan: tomorrow.value,
    });
    store.todayLog.day_finisher_submitted = 1;
    toast.success('Great day! 🌙');
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
        <h1 class="text-xl font-black text-slate-900">Day Finisher</h1>
        <p class="text-xs text-slate-400">{{ store.todayDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
        <Moon :size="18" class="text-indigo-500" />
      </div>
    </div>

    <div v-if="unfinished.length > 0" class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <p class="text-xs font-bold text-amber-700 mb-2">{{ unfinished.length }} unfinished {{ unfinished.length === 1 ? 'task' : 'tasks' }}</p>
      <div class="space-y-1 mb-3">
        <p v-for="a in unfinished" :key="a.name" class="text-sm text-amber-800">• {{ a.title }}</p>
      </div>
      <button @click="moveAll" class="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold" style="background:#f59e0b">
        <ArrowRight :size="13" /> Move all to tomorrow
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Today's Reflection ★</label>
        <textarea v-model="reflection" rows="3" placeholder="What happened? What did you learn?"
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Day Highlight</label>
        <input v-model="highlight" placeholder="The best thing that happened was..."
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Plan for Tomorrow</label>
        <textarea v-model="tomorrow" rows="2" placeholder="Tomorrow I will..."
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
      </div>
    </div>

    <button @click="submit" :disabled="saving"
      class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50" style="background:#6366f1">
      {{ saving ? 'Saving...' : '🌙 Close Out My Day' }}
    </button>
  </div>
</template>
