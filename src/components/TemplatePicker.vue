<script setup lang="ts">
import { NOTE_TEMPLATES } from "@/data/templates";

const emit = defineEmits<{ select: [id: string] }>();

function onChange(e: Event) {
  const el = e.target as HTMLSelectElement;
  const id = el.value;
  el.value = "";
  if (id) emit("select", id);
}
</script>

<template>
  <label class="inline-flex items-center gap-2 font-label text-xs text-on-surface-variant">
    <span class="material-symbols-outlined text-[18px]">dashboard_customize</span>
    <span>Template</span>
    <select
      class="rounded-lg border border-outline-variant/20 bg-surface-container-highest px-2 py-1 text-sm text-on-surface"
      data-testid="template-picker"
      @change="onChange"
    >
      <option value="">Choose…</option>
      <option v-for="t in NOTE_TEMPLATES" :key="t.id" :value="t.id">
        {{ t.label }}
      </option>
    </select>
  </label>
</template>
