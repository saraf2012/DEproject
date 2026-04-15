<script setup lang="ts">
const selected = defineModel<string | null>({ default: null });

withDefaults(
  defineProps<{
    /** Unique tag labels to show as chips */
    tags?: string[];
  }>(),
  { tags: () => [] }
);
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" data-testid="tag-filter">
    <button
      type="button"
      class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
      :class="
        !selected
          ? 'bg-primary/15 text-primary'
          : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
      "
      data-testid="tag-filter-all"
      @click="selected = null"
    >
      All
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
      :class="
        selected === tag
          ? 'bg-primary/15 text-primary'
          : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
      "
      :data-testid="`tag-filter-${tag}`"
      @click="selected = tag"
    >
      {{ tag }}
    </button>
  </div>
</template>
