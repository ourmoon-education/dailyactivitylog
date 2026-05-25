<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePortalStore } from '../stores/portal';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Dumbbell, ChevronLeft, Plus, Trash2 } from 'lucide-vue-next';
import { portalApi } from '../services/frappe';

const store = usePortalStore();
const router = useRouter();

const workoutTitle = ref('');
const primaryCategory = ref('');
const totalDurationMinutes = ref(30);
const energyLevel = ref(0);
const exercises = ref<{ exercise_name: string; sets: string; reps_or_duration: string; notes: string }[]>([]);
const overallReflection = ref('');
const nextSessionPlan = ref('');
const notes = ref('');
const saving = ref(false);
const loadingPrefill = ref(false);

const categories = ['Endurance', 'Strength', 'Balance', 'Mixed'];
const energyEmojis = ['😴', '😐', '🙂', '💪', '🔥'];

function addExercise() {
  exercises.value.push({ exercise_name: '', sets: '', reps_or_duration: '', notes: '' });
}

function removeExercise(idx: number) {
  exercises.value.splice(idx, 1);
}

onMounted(async () => {
  if (!store.todayLog?.name) return;
  loadingPrefill.value = true;
  try {
    const data = await portalApi.getFitnessLog(store.todayLog.name);
    if (data) {
      workoutTitle.value = data.workout_title || '';
      primaryCategory.value = data.primary_category || '';
      totalDurationMinutes.value = data.total_duration_minutes || 30;
      energyLevel.value = data.energy_level || 0;
      overallReflection.value = data.overall_reflection || '';
      nextSessionPlan.value = data.next_session_plan || '';
      notes.value = data.notes || '';
      if (data.exercises && Array.isArray(data.exercises)) {
        exercises.value = data.exercises;
      }
    }
  } catch {
    // No existing log — start fresh
  } finally {
    loadingPrefill.value = false;
  }
});

async function submit() {
  if (!primaryCategory.value) { toast.error('Select a workout category'); return; }
  if (!workoutTitle.value.trim()) { toast.error('Enter a workout title'); return; }
  saving.value = true;
  try {
    await portalApi.submitFitness({
      log_name: store.todayLog?.name,
      workout_title: workoutTitle.value,
      primary_category: primaryCategory.value,
      total_duration_minutes: totalDurationMinutes.value,
      energy_level: energyLevel.value,
      exercises: JSON.stringify(exercises.value),
      overall_reflection: overallReflection.value,
      next_session_plan: nextSessionPlan.value,
      notes: notes.value,
    });
    store.todayLog.fitness_submitted = 1;
    toast.success('Fitness logged! 💪');
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

    <div v-if="loadingPrefill" class="flex justify-center py-6">
      <div class="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style="border-color:#f97316;border-top-color:transparent"></div>
    </div>

    <template v-else>
      <!-- Workout Title -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Workout Title</label>
          <input v-model="workoutTitle" type="text" placeholder="e.g. Morning Run, Leg Day"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-300" />
        </div>

        <!-- Primary Category -->
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Category</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="cat in categories" :key="cat" @click="primaryCategory = cat"
              class="py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all"
              :class="primaryCategory === cat ? '' : 'border-slate-100 text-slate-600'"
              :style="primaryCategory === cat ? 'border-color:#f97316;background:#fff7ed;color:#ea580c' : ''">
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Duration -->
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Duration: {{ totalDurationMinutes }} min
          </label>
          <input v-model="totalDurationMinutes" type="range" min="5" max="180" step="5" class="w-full" style="accent-color:#f97316" />
          <div class="flex justify-between text-[10px] text-slate-400 mt-1"><span>5 min</span><span>180 min</span></div>
        </div>

        <!-- Energy Level -->
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Energy Level</p>
          <div class="flex gap-2">
            <button v-for="(emoji, idx) in energyEmojis" :key="idx"
              @click="energyLevel = idx + 1"
              class="flex-1 py-2.5 rounded-xl border-2 text-lg transition-all"
              :style="energyLevel === idx + 1 ? 'border-color:#f97316;background:#fff7ed' : 'border-color:#f1f5f9'">
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Exercises -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Exercises</p>
          <button @click="addExercise"
            class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-bold"
            style="background:#f97316">
            <Plus :size="13" /> Add
          </button>
        </div>

        <div v-if="exercises.length === 0" class="text-center py-4 text-slate-300 text-xs font-bold">
          No exercises yet — tap Add to log one
        </div>

        <div v-for="(ex, idx) in exercises" :key="idx"
          class="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-500">Exercise {{ idx + 1 }}</span>
            <button @click="removeExercise(idx)" class="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
              <Trash2 :size="14" />
            </button>
          </div>
          <input v-model="ex.exercise_name" type="text" placeholder="Exercise name"
            class="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-300 bg-white" />
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sets</label>
              <input v-model="ex.sets" type="number" min="1" placeholder="3"
                class="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-300 bg-white" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reps / Duration</label>
              <input v-model="ex.reps_or_duration" type="text" placeholder="10 reps / 30 sec"
                class="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-300 bg-white" />
            </div>
          </div>
          <input v-model="ex.notes" type="text" placeholder="Notes (optional)"
            class="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-300 bg-white" />
        </div>
      </div>

      <!-- Reflections -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Reflection</label>
          <textarea v-model="overallReflection" rows="3" placeholder="How did the workout go? What did you feel?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-orange-300"></textarea>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Session Plan <span class="normal-case font-normal text-slate-300">(optional)</span></label>
          <textarea v-model="nextSessionPlan" rows="2" placeholder="What will you do next time?"
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-orange-300"></textarea>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">General Notes <span class="normal-case font-normal text-slate-300">(optional)</span></label>
          <textarea v-model="notes" rows="2" placeholder="Any other notes..."
            class="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-orange-300"></textarea>
        </div>
      </div>

      <button @click="submit" :disabled="saving"
        class="w-full py-4 text-white font-black rounded-2xl text-sm disabled:opacity-50" style="background:#f97316">
        {{ saving ? 'Saving...' : 'Log Workout 💪' }}
      </button>
    </template>
  </div>
</template>
