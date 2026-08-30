<script setup>
import { TABS } from '@/data/services'

defineProps({
  active: { type: String, required: true },
})

defineEmits(['change'])
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="tab in TABS"
      :key="tab.label"
      class="tab"
      :class="{ 'tab--active': active === tab.label }"
      @click="$emit('change', tab.label)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 0.75rem;
  background: var(--kp-card-bg);
  color: var(--kp-text-mid);
  border: 1px solid rgba(28, 16, 9, 0.1);
  transition: all 0.2s;
}

.tab--active {
  background: var(--kp-vinho);
  color: var(--kp-creme);
  border-color: var(--kp-vinho);
}
</style>
