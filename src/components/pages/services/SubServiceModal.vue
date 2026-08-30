<script setup>
import { ArrowRight, X } from '@lucide/vue'

defineProps({
  category: { type: Object, required: true },
})

defineEmits(['select', 'close'])
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click="$emit('close')">
      <div class="sheet" @click.stop>
        <!-- Cabeçalho com a foto da categoria -->
        <div class="sheet__head">
          <img :src="category.img" :alt="category.name" />
          <div class="sheet__veil" />
          <div class="sheet__head-row">
            <div>
              <p class="sheet__kicker">Serviço</p>
              <h3 class="sheet__title">{{ category.name }}</h3>
            </div>
            <button
              class="sheet__close"
              aria-label="Fechar"
              @click="$emit('close')"
            >
              <X :size="20" />
            </button>
          </div>
        </div>

        <div class="p-5">
          <p class="sheet__lead">Escolha a modalidade:</p>
          <div class="space-y-3">
            <button
              v-for="sub in category.subServices"
              :key="sub.id"
              class="sub group"
              @click="$emit('select', sub)"
            >
              <!--
                Fidelidade ao protótipo: a miniatura repete a foto da categoria,
                porque os sub-serviços não têm imagem própria nos dados.
              -->
              <span class="sub__thumb">
                <img
                  :src="category.img"
                  :alt="sub.name"
                  class="transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span class="sub__body">
                <span class="sub__name">{{ sub.name }}</span>
                <span class="sub__desc">{{ sub.description }}</span>
              </span>
              <span class="sub__side">
                <span class="sub__price">{{ sub.price }}</span>
                <ArrowRight :size="13" class="sub__arrow" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.sheet {
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  border-radius: 1rem 1rem 0 0;
  background: var(--kp-bg);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@media (min-width: 640px) {
  .overlay {
    align-items: center;
    padding: 1rem;
  }

  .sheet {
    max-width: 32rem;
    border-radius: 0.75rem;
  }
}

.sheet__head {
  position: relative;
  height: 9rem;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
}

.sheet__head img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sheet__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 4, 2, 0.88) 0%,
    rgba(10, 4, 2, 0.3) 100%
  );
}

.sheet__head-row {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem 1.25rem;
}

.sheet__kicker {
  margin-bottom: 0.125rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(201, 166, 107, 0.8);
}

.sheet__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--kp-creme);
}

.sheet__close {
  color: rgba(245, 235, 221, 0.5);
}

.sheet__lead {
  margin-bottom: 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--kp-text-mid);
}

.sub {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  text-align: left;
  border-radius: 0.5rem;
  background: #ffffff;
  border: 1px solid var(--kp-gold-border);
  transition: all 0.2s;
}

.sub:hover {
  border-color: var(--kp-gold);
  box-shadow: 0 2px 12px rgba(201, 166, 107, 0.18);
}

.sub__thumb {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: 0.25rem;
  overflow: hidden;
}

.sub__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sub__body {
  flex: 1;
  min-width: 0;
}

.sub__name {
  display: block;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--kp-text);
}

.sub__desc {
  display: block;
  margin-top: 0.125rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--kp-text-soft);
}

.sub__side {
  flex-shrink: 0;
  margin-left: 0.5rem;
  text-align: right;
}

.sub__price {
  display: block;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--kp-gold);
}

.sub__arrow {
  margin-left: auto;
  margin-top: 0.375rem;
  color: var(--kp-gold);
}
</style>
