<script setup>
import { HOURS } from '@/data/studio.js'
</script>

<template>
  <section class="-section-hours">
    <div class="-container">
      <header class="-hours__header">
        <span class="-hours__eyebrow">Planeje sua visita</span>
        <h2 class="-hours__title">Horários de Atendimento</h2>
        <div class="-hours__divider">
          <i class="far fa-clock -hours__icon"></i>
        </div>
      </header>

      <div class="-hours__card">
        <div
          v-for="(h, i) in HOURS"
          :key="h.day"
          class="-hours__row"
          :class="{
            '-hours__row--closed': h.closed,
            '-hours__row--alt': i % 2 === 1 && !h.closed,
          }"
        >
          <span class="-hours__day">{{ h.day }}</span>
          <span class="-hours__time">{{ h.time }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.-section-hours {
  background: var(--kp-vinho);
  padding: 10rem 0;
}

.-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 3rem;
}

.-hours__header {
  text-align: center;
  margin-bottom: 5rem;
}

.-hours__eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--kp-gold);
  margin-bottom: 1.5rem;
}

.-hours__title {
  font-family: var(--font-display);
  font-size: 4.4rem;
  font-weight: 400;
  color: var(--kp-creme);
  margin: 0;
}

.-hours__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.-hours__divider::before,
.-hours__divider::after {
  content: '';
  width: 8rem;
  height: 1px;
  background: var(--kp-gold-low);
}

.-hours__icon {
  color: var(--kp-gold);
  font-size: 1.6rem;
}

.-hours__card {
  background: rgba(0, 0, 0, 0.18);
  border-radius: 12px;
  overflow: hidden;
}

.-hours__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 3rem;
  font-family: var(--font-body);
  font-size: 1.5rem;
  color: var(--kp-creme);
}

.-hours__row--alt {
  background: rgba(255, 255, 255, 0.03);
}

.-hours__row--closed {
  opacity: 0.55;
}

.-hours__row--closed .-hours__time {
  color: var(--kp-gold);
}

.-hours__time {
  letter-spacing: 0.05em;
}
</style>