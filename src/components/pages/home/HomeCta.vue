<script setup>
import { RouterLink } from 'vue-router'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
</script>

<template>
  <div class="cta px-4 py-16 text-center">
    <SectionEyebrow>Pronta para uma nova versão de si mesma?</SectionEyebrow>
    <h3 class="cta__title">Reserve seu horário hoje</h3>
    <RouterLink
      :to="{ name: 'ServicesView' }"
      class="cta__btn mt-8 inline-block"
    >
      Agendar Agora
    </RouterLink>
  </div>
</template>

<style scoped>
.cta {
  background: var(--kp-bg);
  border-top: 1px solid rgba(201, 166, 107, 0.2);
}

.cta__title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  color: var(--kp-vinho);
}

.cta__btn {
  padding: 0.875rem 2.5rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: opacity 0.2s;
}

.cta__btn:hover {
  opacity: 0.85;
}
</style>
