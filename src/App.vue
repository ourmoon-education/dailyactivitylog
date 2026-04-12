<script setup lang="ts">
import { usePortalStore } from './stores/portal';
import { appSettings } from './stores/appSettings';
import { GraduationCap, LogOut } from 'lucide-vue-next';
import { Toaster } from 'vue-sonner';

const store = usePortalStore();
function logout() {
  fetch('/api/method/logout', { method: 'POST', credentials: 'include' })
    .finally(() => { window.location.href = '/login'; });
}
</script>

<template>
  <div class="min-h-screen" style="background:#f8fafc">
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2.5">
        <!-- Logo -->
        <div v-if="appSettings.logo"
          class="w-8 h-8 rounded-lg overflow-hidden border border-slate-100">
          <img :src="appSettings.logo" alt="logo" class="h-full w-full object-contain" />
        </div>
        <div v-else
          class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
          :style="{ background: appSettings.primary_color }">
          <GraduationCap :size="16" />
        </div>
        <div class="leading-none">
          <p class="text-sm font-black uppercase tracking-tight" :style="{ color: appSettings.primary_color }">
            {{ appSettings.org_name }}
          </p>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Portal</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-slate-600 hidden sm:block">{{ store.displayName }}</span>
        <a href="/careerpath/" class="text-xs font-bold text-slate-400 hover:text-slate-700 hidden sm:block">CareerPath</a>
        <a href="/directory/" class="text-xs font-bold text-slate-400 hover:text-slate-700 hidden sm:block">Directory</a>
        <button @click="logout" class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
          <LogOut :size="15" />
        </button>
      </div>
    </header>
    <main class="max-w-xl mx-auto px-4 py-6 pb-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Toaster position="top-center" richColors />
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
