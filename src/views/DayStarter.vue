<script setup lang="ts">
import { ref } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Sun, ChevronLeft } from 'lucide-vue-next';

const store = usePortalStore();
const router = useRouter();
const intention = ref('');
const mood = ref(3);
const gratitude = ref('');
const saving = ref(false);

const moods = [
  { val: 1, emoji: '😔', label: 'Tough' },
  { val: 2, emoji: '😐', label: 'Okay' },
  { val: 3, emoji: '🙂', label: 'Good' },
  { val: 4, emoji: '😊', label: 'Great' },
  { val: 5, emoji: '🔥', label: 'Excellent' },
];

async function submit() {
  if (!intention.value.trim()) { toast.error('Add your intention for the day'); return; }
  saving.value = true;
  try {
    const { call } = await import('../services/frappe');
    await call('scholars_portal.daily.submit_day_starter', {
      log_name: store.todayLog.name,
      intention: intention.value,
      mood: mood.value,
      gratitude: gratitude.value,
    });
    store.todayLog.day_starter_submitted = 1;
    toast.success('Day started! 🌟');
    router.push('/');
  } catch (e: any) { toast.error(e.message || 'Failed'); }
  finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Day Starter</h1>
        <p class="text-xs text-slate-400">{{ store.todayDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
        <Sun :size="18" class="text-amber-500" />
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">How are you feeling?</p>
      <div class="flex gap-2">
        <button v-for="m in moods" :key="m.val" @click="mood = m.val"
          class="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all"
          :class="mood === m.val ? 'border-current bg-amber-50' : 'border-slate-100'"
          :style="mood === m.val ? 'border-color:#f59e0b' : ''">
          <span class="text-xl">{{ m.emoji }}</span>
          <span class="text-[10px] font-bold text-slate-400">{{ m.label }}</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Today I will focus on ★</label>
        <textarea v-model="intention" rows="3" placeholder="Today I will focus on..."
          class="w-full text-sm border border-slate-100 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2" style="--tw-ring-color:#496763"></textarea>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">I am grateful for</label>
        <textarea v-model="gratitude" rows="2" placeholder="I'm thankful for..."
          class="w-full text-sm border border-slate-100 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
      </div>
    </div>

    <button @click="submit" :disabled="saving"
      class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50" style="background:#f59e0b">
      {{ saving ? 'Saving...' : '🌅 Start My Day' }}
    </button>
  </div>
</template>
