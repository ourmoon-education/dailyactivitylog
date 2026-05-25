<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { usePortalStore } from '../stores/portal';

const router = useRouter();
const store = usePortalStore();

const isAdmin = computed(() => {
  const roles: string[] = store.session?.roles || [];
  return roles.some((r: string) => ['OME Admin', 'System Manager'].includes(r))
    || store.session?.role === 'Admin';
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
        <ChevronLeft :size="20" />
      </button>
      <div>
        <h1 class="text-xl font-black text-slate-900">Platform Guide</h1>
        <p class="text-xs text-slate-400">Our Moon Education — Last updated May 2026</p>
      </div>
    </div>

    <!-- TOC -->
    <nav class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contents</p>
      <ol class="space-y-1.5 text-sm">
        <li><a href="#overview" class="text-teal-700 font-semibold hover:underline">1. Platform Overview</a></li>
        <li><a href="#roles" class="text-teal-700 font-semibold hover:underline">2. Roles &amp; Permissions</a></li>
        <li><a href="#careerpath" class="text-teal-700 font-semibold hover:underline">3. CareerPath App</a>
          <ol class="ml-4 mt-1 space-y-1 text-slate-500 font-normal list-[lower-alpha]">
            <li><a href="#cp-students" class="hover:underline">For Students</a></li>
            <li><a href="#cp-reviewers" class="hover:underline">For Reviewers</a></li>
            <li><a href="#cp-admins" class="hover:underline">For Admins</a></li>
          </ol>
        </li>
        <li><a href="#daily" class="text-teal-700 font-semibold hover:underline">4. Daily Activity Portal</a>
          <ol class="ml-4 mt-1 space-y-1 text-slate-500 font-normal list-[lower-alpha]">
            <li><a href="#daily-students" class="hover:underline">For Students</a></li>
            <li><a href="#daily-admins" class="hover:underline">For Admins &amp; Coordinators</a></li>
          </ol>
        </li>
        <li><a href="#directory" class="text-teal-700 font-semibold hover:underline">5. Scholar Directory</a></li>
        <li><a href="#setup" class="text-teal-700 font-semibold hover:underline">6. Getting Started — Setup Checklist</a></li>
        <li><a href="#faq" class="text-teal-700 font-semibold hover:underline">7. Frequently Asked Questions</a></li>
        <li v-if="isAdmin"><a href="#test-accounts" class="text-teal-700 font-semibold hover:underline">8. Test Accounts</a> <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full ml-1">Admin only</span></li>
      </ol>
    </nav>

    <!-- 1. Platform Overview -->
    <section id="overview" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
      <h2 class="text-base font-black text-slate-900">1. Platform Overview</h2>
      <p class="text-sm text-slate-600">Our Moon Education runs three linked web applications on top of <strong>Frappe</strong>:</p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50">
              <th class="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200 rounded-tl-lg">App</th>
              <th class="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200">URL</th>
              <th class="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200 rounded-tr-lg">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-3 py-2 border border-slate-200 font-semibold text-teal-700">CareerPath</td>
              <td class="px-3 py-2 border border-slate-200 font-mono text-xs text-slate-500">/careerpath/</td>
              <td class="px-3 py-2 border border-slate-200 text-slate-600">Career planning, essay writing, mock interviews, AI coaching</td>
            </tr>
            <tr class="bg-slate-50/50">
              <td class="px-3 py-2 border border-slate-200 font-semibold text-teal-700">Daily Portal</td>
              <td class="px-3 py-2 border border-slate-200 font-mono text-xs text-slate-500">/portal/</td>
              <td class="px-3 py-2 border border-slate-200 text-slate-600">Daily activity logging and progress tracking</td>
            </tr>
            <tr>
              <td class="px-3 py-2 border border-slate-200 font-semibold text-teal-700">Scholar Directory</td>
              <td class="px-3 py-2 border border-slate-200 font-mono text-xs text-slate-500">/directory/</td>
              <td class="px-3 py-2 border border-slate-200 text-slate-600">Searchable directory of OME scholars and cohorts</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-sm text-slate-600">All three apps share the same <strong>Frappe login</strong> — one set of credentials for everything. Each app adapts its interface based on your role.</p>
    </section>

    <!-- 2. Roles -->
    <section id="roles" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
      <h2 class="text-base font-black text-slate-900">2. Roles &amp; Permissions</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50">
              <th class="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200">Role</th>
              <th class="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200">Who has it</th>
              <th class="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200">What they can do</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in [
              ['Student', 'All enrolled scholars', 'Access their own data in all three apps'],
              ['Essay Reviewer', 'Academic staff, mentors', 'Review and comment on student essays in CareerPath'],
              ['Directory Reviewer', 'Staff with directory access', 'Can see full profiles in Scholar Directory'],
              ['Admin', 'Programme coordinators', 'Full access: all students, admin panel, Frappe Desk links'],
              ['System Manager', 'IT / Frappe administrators', 'Full system access including settings'],
            ]" :key="i" :class="i % 2 === 1 ? 'bg-slate-50/50' : ''">
              <td class="px-3 py-2 border border-slate-200 font-semibold text-slate-800">{{ row[0] }}</td>
              <td class="px-3 py-2 border border-slate-200 text-slate-600">{{ row[1] }}</td>
              <td class="px-3 py-2 border border-slate-200 text-slate-600">{{ row[2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        <strong>Note:</strong> A staff member can have <em>multiple</em> roles. For example, an Academic Director might be both Admin <em>and</em> Essay Reviewer. If an Admin also has a linked Student record, they can additionally use student-facing features.
      </div>
      <h3 class="text-sm font-bold text-slate-800 pt-1">How Roles Are Assigned</h3>
      <p class="text-sm text-slate-600">Roles are managed in <strong>Frappe Desk</strong> (<code class="bg-slate-100 px-1 rounded text-xs">/app/user</code>). To assign a role:</p>
      <ol class="list-decimal list-inside text-sm text-slate-600 space-y-1 ml-1">
        <li>Go to <code class="bg-slate-100 px-1 rounded text-xs">/app/user</code> in Frappe Desk</li>
        <li>Open the user's record</li>
        <li>Scroll to the <strong>Roles</strong> table</li>
        <li>Add <code class="bg-slate-100 px-1 rounded text-xs">Essay Reviewer</code>, <code class="bg-slate-100 px-1 rounded text-xs">Directory Reviewer</code>, <code class="bg-slate-100 px-1 rounded text-xs">Admin</code>, etc.</li>
        <li>Save</li>
      </ol>
      <p class="text-sm text-slate-600">To make a user a Student in the portal, they additionally need a <strong>Student</strong> doctype record (<code class="bg-slate-100 px-1 rounded text-xs">/app/student</code>) with their <strong>Linked User</strong> field set to their Frappe email.</p>
    </section>

    <!-- 3. CareerPath -->
    <section id="careerpath" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <h2 class="text-base font-black text-slate-900">3. CareerPath App</h2>
      <p class="text-sm text-slate-500 font-mono">URL: /careerpath/</p>
      <p class="text-sm text-slate-600">CareerPath is the main scholar support app. It has three distinct interfaces depending on your role.</p>

      <div id="cp-students" class="space-y-2">
        <h3 class="text-sm font-black text-teal-700 border-l-4 border-teal-400 pl-3">3.1 For Students</h3>
        <p class="text-sm text-slate-600">Students see a personal dashboard with <strong>Tasks</strong>, <strong>Essays</strong>, and <strong>AI tools</strong> (career matching, essay review, mock interviews).</p>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-3">Tasks</h4>
        <p class="text-sm text-slate-600">Tasks have a title, description, deadline, and category. Tick the checkbox to mark complete. Saved as ToDo records linked to your Student record.</p>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-3">Essay Editor</h4>
        <p class="text-sm text-slate-600">Full WYSIWYG editor with real-time word count. Submit for review (changes status to "Submitted"). Reviewer comments appear below the editor.</p>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-3">Career Explorer</h4>
        <div class="space-y-1 text-sm text-slate-600">
          <p><strong>AI Matches</strong> — Enter skills/interests, generate AI career path recommendations. Save a career as a Task.</p>
          <p><strong>Universities</strong> — Browse OME partner universities. Filter by country. Click <em>View Details</em> for linked opportunities.</p>
          <p><strong>Opportunities</strong> — Browse scholarships, internships, placements, jobs. Filter by type and country. Click <em>Details</em> or <em>Apply</em>.</p>
        </div>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-3">Mock Interview</h4>
        <p class="text-sm text-slate-600">Choose interview type, subject, and target institution. The AI asks one question at a time, gives brief feedback, then a full summary after 5–6 questions.</p>
      </div>

      <div id="cp-reviewers" class="space-y-2 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-black text-teal-700 border-l-4 border-teal-400 pl-3">3.2 For Reviewers (Essay Reviewer role)</h3>
        <p class="text-sm text-slate-600">Essay Reviewers see all <strong>submitted</strong> essays across all students. Draft essays are not visible.</p>
        <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
          <li><strong>Review Queue</strong> — all essays with status "Submitted"</li>
          <li>Leave comments in the <strong>Comments</strong> panel below the essay</li>
          <li>Click <strong>AI Review</strong> to generate automated scores (Clarity, Structure, Impact) and written feedback</li>
          <li>Change essay status to "Reviewed" or "Needs Revision"</li>
        </ul>
        <div class="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sm text-sky-800">
          Reviewers cannot edit essay content — only the student can write. Reviewers can only add comments and change the status.
        </div>
      </div>

      <div id="cp-admins" class="space-y-2 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-black text-teal-700 border-l-4 border-teal-400 pl-3">3.3 For Admins (Admin role)</h3>
        <p class="text-sm text-slate-600">Admins have everything students see, plus an <strong>Admin Panel</strong> in the sidebar.</p>
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">Admin Panel — Students tab</h4>
        <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
          <li>Lists all students pulled live from Frappe</li>
          <li>Default filter: <strong>Enrolled</strong> (change to All / Graduated / Alumni / Other)</li>
          <li>Search by name, email, or OME ID</li>
          <li>Click <strong>Open</strong> to jump to the student's Frappe Desk record</li>
        </ul>
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-2">Admin Panel — Essay Reviewers tab</h4>
        <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
          <li>Lists all users with Essay Reviewer or Directory Reviewer role</li>
          <li>Shows roles as colour-coded badges and account enabled status</li>
          <li><strong>Add Reviewer</strong> opens Frappe Desk user list filtered to Essay Reviewers</li>
        </ul>
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-2">App Settings</h4>
        <p class="text-sm text-slate-600">Go to <code class="bg-slate-100 px-1 rounded text-xs">/app/ome-app-settings</code> to configure AI provider, API keys, logo, organisation name, and primary colour.</p>
      </div>
    </section>

    <!-- 4. Daily Portal -->
    <section id="daily" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <h2 class="text-base font-black text-slate-900">4. Daily Activity Portal</h2>
      <p class="text-sm text-slate-500 font-mono">URL: /portal/</p>
      <p class="text-sm text-slate-600">Where scholars log daily activities — a structured journalling app aligned to the YLP programme schedule.</p>

      <div id="daily-students" class="space-y-3">
        <h3 class="text-sm font-black text-teal-700 border-l-4 border-teal-400 pl-3">4.1 For Students</h3>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">Dashboard — Today's Cards</h4>
        <p class="text-sm text-slate-600">When you open the portal you see today's activity cards. Each card turns greyed-out with a ✅ once submitted:</p>
        <div class="grid grid-cols-1 gap-2">
          <div v-for="card in [
            { icon: '☀️', label: 'Day Starter', desc: 'Set your morning intentions, mood, and focus for the day.' },
            { icon: '☑️', label: 'Activity Checklist', desc: 'Tick off timetabled and personal tasks throughout the day.' },
            { icon: '📖', label: 'Biblical Comprehension', desc: 'Reading passage and reflection questions.' },
            { icon: '💚', label: 'General Comprehension', desc: 'General reading reflection.' },
            { icon: '🏋️', label: 'Physical Fitness', desc: 'Log workout: category, duration, exercises, energy level, and reflections.' },
            { icon: '🌱', label: 'Agriculture Log', desc: 'Record farm work: activity type, weather, crops/animals, time spent, tasks performed, observations.' },
            { icon: '🌙', label: 'Day Finisher', desc: 'Close the day: highlight, challenge, mood, and evening reflection.' },
          ]" :key="card.label" class="flex gap-3 items-start">
            <span class="text-lg leading-none mt-0.5">{{ card.icon }}</span>
            <div>
              <p class="text-sm font-bold text-slate-800">{{ card.label }}</p>
              <p class="text-xs text-slate-500">{{ card.desc }}</p>
            </div>
          </div>
        </div>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-2">Today's Sessions</h4>
        <p class="text-sm text-slate-600">If your timetable has scheduled sessions today, a <strong>Today's Sessions</strong> panel appears on the dashboard. Each session shows its time and label. Click <strong>Log</strong> to submit feedback:</p>
        <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
          <li>Mark attendance (present / absent)</li>
          <li>Rate engagement (1–5 stars)</li>
          <li>What you learned and any challenges</li>
          <li>Agriculture sessions add: area, tasks, observations</li>
          <li>Management sessions add: reading done, quiz score, presentation notes</li>
        </ul>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-2">Weekly Reflection <span class="normal-case font-normal text-slate-400">(weekends only)</span></h4>
        <p class="text-sm text-slate-600">A <strong>Weekly Reflection</strong> button appears on Saturday and Sunday. Fill in five prompts covering your week's highlight, challenge, lesson, gratitude, and intention for next week. One reflection is stored per calendar week.</p>

        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide mt-2">History</h4>
        <p class="text-sm text-slate-600">Click <strong>View History</strong> to browse the last 14 days. Each day card shows activity badges (🌱 Agri, 🏋️ Fitness, etc.). Click any day card to open a full read-only detail view of everything logged that day.</p>
      </div>

      <div id="daily-admins" class="space-y-2 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-black text-teal-700 border-l-4 border-teal-400 pl-3">4.2 For Admins &amp; Coordinators</h3>
        <p class="text-sm text-slate-600">Users with the <strong>Admin</strong>, <strong>YLP Coordinator</strong>, <strong>OME Admin</strong>, or <strong>System Manager</strong> role see a <strong>Coordinator View</strong> button at the bottom of the dashboard.</p>
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">Coordinator Overview</h4>
        <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
          <li>Pick any date with the date picker (defaults to today)</li>
          <li>Summary strip shows how many students started / finished the day (X / Y)</li>
          <li>Per-student rows showing: mood emoji, overall progress bar, and 6 badge circles (Day Starter, Activities, Biblical, General, Fitness, Agriculture, Day Finisher)</li>
          <li>Expand any student row to see the detail of their log for that day</li>
        </ul>
        <p class="text-sm text-slate-600">Detailed logs are also available in <strong>Frappe Desk</strong> under the <em>YLP Daily Log</em> doctype.</p>
      </div>
    </section>

    <!-- 5. Scholar Directory -->
    <section id="directory" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
      <h2 class="text-base font-black text-slate-900">5. Scholar Directory</h2>
      <p class="text-sm text-slate-500 font-mono">URL: /directory/</p>
      <p class="text-sm text-slate-600">A searchable, filterable list of all OME scholars. Useful for connecting scholars with each other, staff lookups, and cohort-level views.</p>

      <h3 class="text-sm font-bold text-slate-800">For Anyone with Access</h3>
      <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
        <li>Search by name or location</li>
        <li>Filter by cohort (programme year) or status (Enrolled / Graduated / Alumni)</li>
        <li>Click any scholar card to open their profile (name, cohort, programme, contact info, status)</li>
      </ul>

      <h3 class="text-sm font-bold text-slate-800">For Admins &amp; Directory Reviewers</h3>
      <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
        <li>Full contact details on all profiles</li>
        <li>Linked User (Frappe login email)</li>
        <li>Link to the student record in Frappe Desk</li>
      </ul>
    </section>

    <!-- 6. Setup Checklist -->
    <section id="setup" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <h2 class="text-base font-black text-slate-900">6. Getting Started — Setup Checklist</h2>

      <div class="space-y-2">
        <h3 class="text-sm font-bold text-slate-800">For a New Student</h3>
        <ol class="text-sm text-slate-600 space-y-1">
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Create a Frappe user account (<code class="bg-slate-100 px-1 rounded text-xs">/app/user</code>) with their email</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Create a Student record (<code class="bg-slate-100 px-1 rounded text-xs">/app/student</code>) and set <strong>Linked User</strong> to their email</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Assign the <strong>Student</strong> role to their user account</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Share the login URL and credentials</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Student logs in at <code class="bg-slate-100 px-1 rounded text-xs">/careerpath/</code>, <code class="bg-slate-100 px-1 rounded text-xs">/portal/</code>, or <code class="bg-slate-100 px-1 rounded text-xs">/directory/</code></li>
        </ol>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-bold text-slate-800">For a New Reviewer</h3>
        <ol class="text-sm text-slate-600 space-y-1">
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Create or locate their Frappe user account</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Assign the <strong>Essay Reviewer</strong> role (and/or <strong>Directory Reviewer</strong>)</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> They appear in the Admin Panel's Reviewers tab automatically</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> They access CareerPath at <code class="bg-slate-100 px-1 rounded text-xs">/careerpath/</code> — sidebar shows Review Queue</li>
        </ol>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-bold text-slate-800">For a New Admin</h3>
        <ol class="text-sm text-slate-600 space-y-1">
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Create their Frappe user account</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Assign the <strong>Admin</strong> role</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> Optionally create a Student record and link it, so they can also use student features</li>
          <li class="flex gap-2"><span class="text-emerald-500 font-bold shrink-0">✅</span> They access the Admin Panel via the sidebar in CareerPath</li>
        </ol>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-bold text-slate-800">To Change a User's Login</h3>
        <p class="text-sm text-slate-600">The simplest approach:</p>
        <ul class="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
          <li>Go to <code class="bg-slate-100 px-1 rounded text-xs">/app/user</code> in Frappe Desk</li>
          <li>Update the email address and password on the user account</li>
          <li>The Student record's Linked User field stays pointing to the same student record</li>
          <li>Alternatively, create a new Frappe user, update <strong>Linked User</strong> on the Student record, and assign the Student role to the new user</li>
        </ul>
      </div>
    </section>

    <!-- 7. FAQ -->
    <section id="faq" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <h2 class="text-base font-black text-slate-900">7. Frequently Asked Questions</h2>

      <div v-for="(item, i) in faqs" :key="i" class="pt-3 border-t border-slate-100 first:border-0 first:pt-0">
        <p class="text-sm font-bold text-slate-800">{{ item.q }}</p>
        <p class="text-sm text-slate-600 mt-1" v-html="item.a"></p>
      </div>
    </section>

    <!-- 8. Test Accounts (admin only) -->
    <section v-if="isAdmin" id="test-accounts" class="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h2 class="text-base font-black text-slate-900">8. Test Accounts</h2>
        <span class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">OME Admin only</span>
      </div>
      <p class="text-sm text-slate-600">
        A set of dummy accounts exists for testing every role type across all three apps. They are pre-created and ready to use.
      </p>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        ⚠️ For internal testing only. Do not use these accounts for real programme data.
      </div>
      <div class="grid grid-cols-1 gap-2 text-sm">
        <div v-for="u in testAccounts" :key="u.email"
          class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
            :style="{ background: u.color + '33', color: u.color }">
            {{ u.initials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-slate-800 text-xs">{{ u.name }}</p>
            <p class="font-mono text-[11px] text-teal-700">{{ u.email }}</p>
            <p class="text-[11px] text-slate-500 mt-0.5">{{ u.note }}</p>
          </div>
        </div>
      </div>
      <a href="/sample-users" target="_blank"
        class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold"
        style="background:#496763">
        🔐 View Full Test Accounts Page
      </a>
    </section>

    <p class="text-center text-xs text-slate-400 pb-4">Guide maintained by the OME technical team. For issues, contact your system administrator.</p>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      faqs: [
        {
          q: "A student says they can't see the Tasks or Essays nav items.",
          a: "Their Frappe user must have the <strong>Student</strong> role AND a <strong>Student</strong> record in Frappe with <strong>Linked User</strong> set to their email. Check both at <code class=\"bg-slate-100 px-1 rounded text-xs\">/app/user</code> and <code class=\"bg-slate-100 px-1 rounded text-xs\">/app/student</code>."
        },
        {
          q: "An admin can't see student-specific pages (Tasks, Essays, etc.).",
          a: "Admins only see student nav items if they have a linked Student record. Create a Student record for them and set Linked User to their email."
        },
        {
          q: "The AI features show an error.",
          a: "Go to <strong>OME App Settings</strong> (<code class=\"bg-slate-100 px-1 rounded text-xs\">/app/ome-app-settings</code>). Check that the correct provider is selected, the API key is entered and saved, and the provider's package is installed on the server (<code class=\"bg-slate-100 px-1 rounded text-xs\">pip install anthropic</code> / <code class=\"bg-slate-100 px-1 rounded text-xs\">pip install openai</code> / <code class=\"bg-slate-100 px-1 rounded text-xs\">pip install google-generativeai</code>)."
        },
        {
          q: "\"Anthropic API key is invalid\" even though the key is saved.",
          a: "This was a known bug (fixed in recent builds) where the encrypted key wasn't being read correctly. After updating, re-enter and save the key in OME App Settings."
        },
        {
          q: "The favicon shows the Frappe logo / is broken.",
          a: "Each frontend needs to be rebuilt after updates (<code class=\"bg-slate-100 px-1 rounded text-xs\">cd frontend/careerpath && npm run build</code>, etc.). After the latest build, all three apps use the OME \"M\" favicon."
        },
        {
          q: "How do I add a new university or opportunity to the Career Explorer?",
          a: "In Frappe Desk, go to the <strong>University</strong> or <strong>Opportunity</strong> doctype and create a new record. Changes appear in the Career Explorer immediately (no rebuild needed)."
        },
        {
          q: "Can a student see other students' essays?",
          a: "No. Students only see their own essays. Reviewers see all submitted essays. Admins can link to essays via Frappe Desk."
        },
        {
          q: "How do I give someone access to both review essays AND see the admin panel?",
          a: "Assign both the <strong>Essay Reviewer</strong> role AND the <strong>Admin</strong> role to their Frappe user."
        },
        {
          q: "The Coordinator View button isn't showing for a coordinator.",
          a: "The user's Frappe account must have the <strong>Admin</strong>, <strong>YLP Coordinator</strong>, <strong>OME Admin</strong>, or <strong>System Manager</strong> role assigned. Check at <code class=\"bg-slate-100 px-1 rounded text-xs\">/app/user</code>. They do not need a Student record for this feature."
        },
        {
          q: "The Weekly Reflection button isn't showing.",
          a: "This button only appears on <strong>Saturday and Sunday</strong>. It is intentionally hidden Monday–Friday."
        },
        {
          q: "Today's Sessions panel isn't showing on the dashboard.",
          a: "Timetable sessions must be seeded in the database. Run <code class=\"bg-slate-100 px-1 rounded text-xs\">bench --site [yoursite] migrate</code> on the server to trigger the default timetable setup. If sessions exist but still don't show, check that the YLP Daily Log for today exists and that the <code class=\"bg-slate-100 px-1 rounded text-xs\">get_todays_sessions</code> API is returning data."
        },
      ],
      testAccounts: [
        { initials: 'AM', name: 'Alice Mwangi', email: 'test.student@ourmoon.org.uk',      color: '#2563eb', note: 'Student — full portal (Daily, CareerPath, Directory)' },
        { initials: 'JO', name: 'James Okonkwo', email: 'test.reviewer@ourmoon.org.uk',    color: '#7c3aed', note: 'Essay Reviewer — Review Queue, AI Review, comments' },
        { initials: 'GA', name: 'Grace Achebe',  email: 'test.dirreviewer@ourmoon.org.uk', color: '#059669', note: 'Directory Reviewer — full profiles & Frappe links' },
        { initials: 'MT', name: 'Michael Tunde', email: 'test.admin@ourmoon.org.uk',       color: '#dc2626', note: 'OME Admin (no student record) — Admin Panel only' },
        { initials: 'PN', name: 'Priya Naidoo',  email: 'test.adminplus@ourmoon.org.uk',   color: '#9d174d', note: 'OME Admin + Student record — dual experience' },
        { initials: 'SK', name: 'Sarah Kamau',   email: 'test.coordinator@ourmoon.org.uk', color: '#d97706', note: 'YLP Coordinator + Student — Coordinator View' },
        { initials: 'DB', name: 'David Banda',   email: 'test.bothreviewer@ourmoon.org.uk',color: '#0369a1', note: 'Essay Reviewer + Directory Reviewer combined' },
      ],
    };
  }
};
</script>
