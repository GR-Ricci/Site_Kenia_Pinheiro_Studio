<script setup>
import { computed, ref } from 'vue'
import GoldRule from '@/components/ui/GoldRule.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { GALLERY, GALLERY_CATS } from '@/data/gallery'

const active = ref(GALLERY_CATS[0])
const photos = computed(() => GALLERY[active.value] ?? [])
</script>

<template>
  <div class="gallery px-4 py-12">
    <div class="mx-auto max-w-4xl">
      <div class="mb-10 text-center">
        <SectionEyebrow>Nossos trabalhos</SectionEyebrow>
        <h1 class="gallery__title">Galeria</h1>
        <div class="mx-auto mt-4 max-w-xs"><GoldRule /></div>
      </div>

      <div class="mb-6 flex items-center gap-2 overflow-x-auto pb-4">
        <button
          v-for="cat in GALLERY_CATS"
          :key="cat"
          class="chip"
          :class="{ 'chip--active': active === cat }"
          @click="active = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div v-for="(url, i) in photos" :key="url + i" class="tile">
          <img
            :src="url"
            :alt="`${active} ${i + 1}`"
            loading="lazy"
            class="transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  min-height: 100vh;
  background: var(--kp-bg);
}

.gallery__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 600;
  color: var(--kp-vinho);
}

.chip {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 0.75rem;
  background: var(--kp-card-bg);
  color: var(--kp-text-mid);
  border: 1px solid var(--kp-gold-border);
  transition: all 0.2s;
}

.chip--active {
  background: var(--kp-vinho);
  color: var(--kp-creme);
  border-color: var(--kp-vinho);
}

.tile {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid var(--kp-gold-border);
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
