<script setup>
import { Clock } from '@lucide/vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { HOURS } from '@/data/studio'
</script>

<template>
  <section class="hours px-4 py-16">
    <div class="mx-auto max-w-lg">
      <div class="mb-8 text-center">
        <SectionEyebrow>Planeje sua visita</SectionEyebrow>
        <h2 class="hours__title">Horários de Atendimento</h2>
        <div
          class="mx-auto mt-3 flex max-w-xs items-center justify-center gap-3"
        >
          <span class="hours__divider" />
          <Clock :size="14" class="hours__clock" />
          <span class="hours__divider" />
        </div>
      </div>

      <div class="hours__table">
        <div
          v-for="(h, i) in HOURS"
          :key="h.day"
          class="hours__row"
          :class="{
            'hours__row--alt': i % 2 === 0,
            'hours__row--last': i === HOURS.length - 1,
          }"
        >
          <span
            class="hours__day"
            :class="{ 'hours__day--closed': h.closed }"
            >{{ h.day }}</span
          >
          <span
            class="hours__time"
            :class="{ 'hours__time--closed': h.closed }"
            >{{ h.time }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hours {
  background: var(--kp-vinho);
  border-top: 1px solid rgba(201, 166, 107, 0.25);
}

.hours__title {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  color: var(--kp-creme);
}

.hours__divider {
  flex: 1;
  height: 1px;
  background: rgba(201, 166, 107, 0.3);
}

.hours__clock {
  color: var(--kp-gold);
}

.hours__table {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(201, 166, 107, 0.22);
}

.hours__row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(201, 166, 107, 0.12);
}

.hours__row--alt {
  background: rgba(255, 255, 255, 0.07);
}

.hours__row--last {
  border-bottom: none;
}

.hours__day,
.hours__time {
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.hours__day {
  color: rgba(245, 235, 221, 0.75);
}

.hours__day--closed {
  color: rgba(245, 235, 221, 0.35);
}

.hours__time {
  font-weight: 500;
  color: rgba(245, 235, 221, 0.95);
}

.hours__time--closed {
  color: var(--kp-gold);
}
</style>
