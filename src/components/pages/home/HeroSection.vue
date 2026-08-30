<script setup>
import { RouterLink } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import heroImg from '@/assets/images/hero.png'
</script>

<template>
  <section class="hero">
    <div class="hero__photo" :style="{ backgroundImage: `url(${heroImg})` }" />
    <!-- Esmaece o rodapé da foto -->
    <div class="hero__fade" />
    <!-- Scrim lateral: escurece só onde o texto fica, preservando a foto à direita -->
    <div class="hero__scrim" />

    <div class="hero__content">
      <div class="mb-5 flex items-center gap-3">
        <span class="hero__accent" />
        <span class="hero__location">Sertãozinho · SP</span>
      </div>

      <p class="hero__mark">Kp</p>
      <p class="hero__studio">•STUDIO•</p>

      <p class="hero__tagline">
        Especialistas em realçar a beleza natural dos seus cachos
      </p>

      <div class="mt-8 flex flex-wrap gap-3">
        <RouterLink
          :to="{ name: 'ServicesView' }"
          class="hero__btn hero__btn--primary"
        >
          Agendar Horário
        </RouterLink>
        <RouterLink
          :to="{ name: 'ServicesView' }"
          class="hero__btn hero__btn--ghost"
        >
          Nossos Serviços
        </RouterLink>
      </div>
    </div>

    <div class="hero__scroll">
      <span class="hero__scroll-line" />
      <ChevronDown :size="13" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  height: calc(100dvh - var(--kp-nav-height));
  min-height: 500px;
}

.hero__photo,
.hero__fade,
.hero__scrim {
  position: absolute;
  inset: 0;
}

.hero__photo {
  background-size: cover;
  background-position: center 15%;
}

.hero__fade {
  background: linear-gradient(
    to bottom,
    rgba(10, 4, 2, 0.1) 0%,
    rgba(10, 4, 2, 0) 30%,
    rgba(10, 4, 2, 0.5) 72%,
    rgba(10, 4, 2, 0.8) 100%
  );
}

.hero__scrim {
  background: linear-gradient(
    to right,
    rgba(10, 4, 2, 0.72) 0%,
    rgba(10, 4, 2, 0.45) 38%,
    rgba(10, 4, 2, 0.1) 62%,
    transparent 80%
  );
}

.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: clamp(1.8rem, 8vw, 7rem);
  padding-top: 2rem;
}

.hero__accent {
  width: 2rem;
  height: 1px;
  background: var(--kp-gold);
}

.hero__location {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--kp-gold);
}

.hero__mark {
  font-family: var(--font-script);
  font-size: clamp(5.5rem, 14vw, 10.5rem);
  line-height: 0.92;
  color: var(--kp-creme);
  text-shadow:
    0 4px 28px rgba(0, 0, 0, 0.75),
    0 0 60px rgba(0, 0, 0, 0.35);
}

.hero__studio {
  margin-top: 4px;
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(0.65rem, 1.3vw, 0.82rem);
  letter-spacing: 0.58em;
  color: rgba(245, 235, 221, 0.9);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
}

.hero__tagline {
  margin-top: 1.5rem;
  max-width: 340px;
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(0.9rem, 2.2vw, 1.15rem);
  line-height: 1.5;
  color: rgba(245, 235, 221, 0.95);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
}

.hero__btn {
  padding: 0.75rem 1.75rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition:
    opacity 0.2s,
    border-color 0.2s;
}

/*
  Fidelidade ao protótipo: creme sobre dourado.
  Contraste ~1,9:1, abaixo do mínimo WCAG AA (4,5:1) — ver PR.
*/
.hero__btn--primary {
  background: var(--kp-gold);
  color: var(--kp-creme);
}

.hero__btn--primary:hover {
  opacity: 0.85;
}

.hero__btn--ghost {
  border: 1px solid rgba(201, 166, 107, 0.5);
  color: var(--kp-creme);
  background: transparent;
}

.hero__btn--ghost:hover {
  border-color: var(--kp-gold);
}

.hero__scroll {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.5;
  color: var(--kp-gold);
}

.hero__scroll-line {
  width: 1px;
  height: 2rem;
  background: var(--kp-gold);
}
</style>
