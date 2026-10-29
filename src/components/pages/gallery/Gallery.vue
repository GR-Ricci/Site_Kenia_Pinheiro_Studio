<script setup>
import { ref, computed, watch } from 'vue'
import { useGalleryStore } from '@/stores/galleryAdm.js'

// Nome multi-palavra exigido pela regra do ESLint (vue/multi-word-component-names).
defineOptions({
  name: 'GallerySection',
})

// Lê da mesma store que a versão Adm usa.
const galleryStore = useGalleryStore()

// Categoria ativa no filtro.
const activeCategory = ref(galleryStore.categories[0] ?? '')

// Se a categoria ativa sumir (removida), cai para a primeira da lista.
watch(
  () => galleryStore.categories,
  (cats) => {
    if (!cats.includes(activeCategory.value)) {
      activeCategory.value = cats[0] ?? ''
    }
  },
  { deep: true },
)

// Itens visíveis — filtrados pela categoria ativa.
const filteredItems = computed(() => galleryStore.allImages.filter((item) => item.category === activeCategory.value))
</script>

<template>
  <section class="-section-gallery">
    <div class="-container">
      <header class="-header">
        <span class="-subtitle">NOSSO TRABALHOS</span>
        <h2 class="-title">Galeria</h2>
      </header>

      <div class="-filters">
        <button v-for="category in galleryStore.categories" :key="category" class="-filters__btn" :class="{ '-filters__btn--active': activeCategory === category }" @click="activeCategory = category">
          {{ category }}
        </button>
      </div>

      <div class="-grid">
        <div v-for="item in filteredItems" :key="item.id" class="-card">
          <img :src="item.image" :alt="item.category" class="-card__image" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* (mantém o CSS que você já tem — sem o bloco de admin) */
.-section-gallery {
  background-color: var(--kp-bg, #fcfaf5);
  padding: 80px 0;
}
.-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.-header {
  text-align: center;
  margin-bottom: 40px;
}
.-subtitle {
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1rem;
  letter-spacing: 2px;
  color: var(--kp-gold, #c4a484);
  text-transform: uppercase;
  display: block;
  margin-bottom: 10px;
}
.-title {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2.5rem;
  color: var(--kp-vinho, #4a2c2a);
  margin: 0;
}
.-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 50px;
}
.-filters__btn {
  background-color: transparent;
  border: 1px solid var(--kp-gold-border, #c4a484);
  color: var(--kp-text, #4a2c2a);
  padding: 8px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: var(--font-body, 'Lato', sans-serif);
  transition: all 0.3s ease;
}
.-filters__btn--active {
  background-color: var(--kp-vinho, #6b1d2c);
  color: var(--kp-bg, #fcfaf5);
  border-color: var(--kp-vinho, #6b1d2c);
}
.-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  aspect-ratio: 4 / 3;
}
.-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
