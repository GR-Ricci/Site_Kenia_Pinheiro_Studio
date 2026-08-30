<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ChevronLeft, ChevronRight } from '@lucide/vue'
import GoldRule from '@/components/ui/GoldRule.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { CAROUSEL_CATS } from '@/data/services'

const router = useRouter()
const index = ref(0)
const total = CAROUSEL_CATS.length

const prev = computed(() => CAROUSEL_CATS[(index.value - 1 + total) % total])
const current = computed(() => CAROUSEL_CATS[index.value])
const next = computed(() => CAROUSEL_CATS[(index.value + 1) % total])

const go = (step) => (index.value = (index.value + step + total) % total)

/** O card central leva à página Serviços com a aba de mesmo nome já filtrada. */
const openTab = (tab) => router.push({ name: 'ServicesView', query: { tab } })
</script>

<template>
  <section class="carousel-section px-4 py-20">
    <div class="mx-auto max-w-4xl">
      <div class="mb-12 text-center">
        <SectionEyebrow>O que oferecemos</SectionEyebrow>
        <h2 class="carousel-section__title">Nossos Serviços</h2>
        <div class="mx-auto mt-4 max-w-xs"><GoldRule /></div>
      </div>

      <div class="carousel">
        <!-- Espaçador invisível: define a altura do palco -->
        <div class="carousel__spacer" />

        <div class="carousel__stage">
          <div class="carousel__side carousel__side--prev">
            <div class="carousel__card">
              <img :src="prev.img" :alt="prev.label" />
              <div class="carousel__veil" />
              <p class="carousel__side-label">{{ prev.label }}</p>
            </div>
          </div>

          <button class="carousel__center group" @click="openTab(current.tab)">
            <div class="carousel__card">
              <img
                :src="current.img"
                :alt="current.label"
                class="transition-transform duration-700 group-hover:scale-105"
              />
              <div class="carousel__veil" />
              <div class="carousel__center-caption">
                <p class="carousel__center-label">{{ current.label }}</p>
                <span class="carousel__see">
                  Ver serviços
                  <ArrowRight :size="11" />
                </span>
              </div>
            </div>
          </button>

          <div class="carousel__side carousel__side--next">
            <div class="carousel__card">
              <img :src="next.img" :alt="next.label" />
              <div class="carousel__veil" />
              <p class="carousel__side-label">{{ next.label }}</p>
            </div>
          </div>
        </div>

        <button
          class="carousel__arrow carousel__arrow--left"
          aria-label="Anterior"
          @click="go(-1)"
        >
          <ChevronLeft :size="20" />
        </button>
        <button
          class="carousel__arrow carousel__arrow--right"
          aria-label="Próximo"
          @click="go(1)"
        >
          <ChevronRight :size="20" />
        </button>
      </div>

      <div class="mt-5 flex justify-center gap-2">
        <button
          v-for="(cat, i) in CAROUSEL_CATS"
          :key="cat.label"
          class="carousel__dot"
          :class="{ 'carousel__dot--active': i === index }"
          :aria-label="`Ir para ${cat.label}`"
          @click="index = i"
        />
      </div>

      <div class="mt-10 text-center">
        <button
          class="carousel__all inline-flex items-center gap-2"
          @click="openTab('Todos')"
        >
          Ver Todos os Serviços
          <ArrowRight :size="14" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-section {
  background: var(--kp-bg);
}

.carousel-section__title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 600;
  color: var(--kp-vinho);
}

.carousel {
  position: relative;
  overflow: hidden;
}

.carousel__spacer {
  width: 250px;
  margin: 0 auto;
  aspect-ratio: 3 / 4;
  visibility: hidden;
  pointer-events: none;
}

.carousel__stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel__card {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 12px;
}

.carousel__card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 4, 2, 0.88) 0%,
    rgba(10, 4, 2, 0.2) 55%,
    transparent 100%
  );
}

.carousel__side {
  position: absolute;
  left: 50%;
  width: 210px;
  filter: blur(3.5px);
  opacity: 0.35;
  pointer-events: none;
  transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel__side--prev {
  transform: translateX(calc(-50% - 228px)) scale(0.87);
}

.carousel__side--next {
  transform: translateX(calc(-50% + 228px)) scale(0.87);
}

.carousel__side-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--kp-creme);
}

.carousel__center {
  position: absolute;
  left: 50%;
  width: 250px;
  transform: translateX(-50%);
  z-index: 2;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel__center-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  text-align: left;
}

.carousel__center-label {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--kp-creme);
}

.carousel__see {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--kp-gold);
  opacity: 0;
  transition: opacity 0.3s;
}

.carousel__center:hover .carousel__see {
  opacity: 1;
}

.carousel__arrow {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(250, 247, 242, 0.92);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  color: var(--kp-mahogany);
}

.carousel__arrow--left {
  left: 8px;
}

.carousel__arrow--right {
  right: 8px;
}

.carousel__dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: var(--kp-gold-border);
  transition: all 0.3s;
}

.carousel__dot--active {
  width: 20px;
  background: var(--kp-vinho);
}

.carousel__all {
  padding: 0.75rem 2.5rem;
  border: 1px solid var(--kp-vinho);
  font-family: var(--font-body);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  color: var(--kp-vinho);
  transition: all 0.2s;
}

.carousel__all:hover {
  background: var(--kp-vinho);
  color: var(--kp-creme);
}
</style>
