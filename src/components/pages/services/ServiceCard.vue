<script setup>
import { ArrowRight } from '@lucide/vue'

defineProps({
  category: { type: Object, required: true },
})

defineEmits(['select'])
</script>

<template>
  <button class="card group" @click="$emit('select', category)">
    <div class="card__media">
      <img
        :src="category.img"
        :alt="category.name"
        loading="lazy"
        class="transition-transform duration-500 group-hover:scale-105"
      />
      <div class="card__veil" />
      <p class="card__name">{{ category.name }}</p>
    </div>

    <div class="card__foot">
      <div>
        <p class="card__price">{{ category.price }}</p>
        <p class="card__desc">{{ category.description }}</p>
      </div>
      <ArrowRight
        :size="15"
        class="card__arrow transition-transform group-hover:translate-x-0.5"
      />
    </div>
  </button>
</template>

<style scoped>
.card {
  width: 100%;
  text-align: left;
  overflow: hidden;
  border-radius: 0.75rem;
  background: var(--kp-card-bg);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}

.card:hover {
  border-color: var(--kp-gold);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 4, 2, 0.65) 0%, transparent 60%);
}

.card__name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 1rem 0.75rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--kp-creme);
}

.card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--kp-gold-border);
}

.card__price {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--kp-gold);
}

.card__desc {
  margin-top: 0.125rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--kp-text-soft);
}

.card__arrow {
  flex-shrink: 0;
  margin-left: 0.5rem;
  color: var(--kp-gold);
}
</style>
