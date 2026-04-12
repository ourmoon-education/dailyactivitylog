<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePortalStore } from '../stores/portal';
import { toast } from 'vue-sonner';
import { BookOpen, ChevronLeft } from 'lucide-vue-next';
import { call } from '../services/frappe';

const route = useRoute();
const router = useRouter();
const store = usePortalStore();
const type = route.params.type as string;
const passage = ref('');
const reflection = ref('');
const saving = ref(false);

const isBiblical = type === 'biblical';
const title = isBiblical ? 'Biblical Comprehension' : 'General Comprehension';
const color = isBiblical ? '#8b5cf6' : '#10b981';
const passagePlaceholder = isBiblical ? 'e.g. Proverbs 3:5-6' : 'Book title and chapter';

async function submit() {
  if (!passage.value.trim() || !reflection.value.trim()) { toast.error('Fill in all fields'); return; }
  saving.value = true;
  try {
    await call('scholars_portal.daily.submit_comprehension', {
      log_name: store.todayLog?.name, type, passage: passage.value, reflection: reflection.value,
    });
    if (isBiblical) store.todayLog.biblical_submitted = 1;
    else store.todayLog.general_submitted = 1;
    toast.success('Submitted! 📚');
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
        <h1 class="text-xl font-black text-slate-900">{{ title }}</h1>
        <p class="text-xs text-slate-400">{{ store.todayDisplay }}</p>
      </div>
      <div class="ml-auto w-10 h-10 rounded-xl flex items-center justify-center" :style="{ background: color + '20' }">
        <BookOpen :size="18" :style="{ color }" />
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Passage / Source</label>
        <input v-model="passage" :placeholder="passagePlaceholder"
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reflection</label>
        <textarea v-model="reflection" rows="5" placeholder="What did you learn? How does it apply to your life?"
          class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none"></textarea>
      </div>
    </div>

    <button @click="submit" :disabled="saving"
      class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50" :style="{ background: color }">
      {{ saving ? 'Saving...' : 'Submit Reading 📚' }}
    </button>
  </div>
</template>
