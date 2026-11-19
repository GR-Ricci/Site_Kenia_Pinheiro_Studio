<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

defineOptions({
  name: 'GallerySection',
})

// ─── Estado vindo da API ───────────────────────────────────────────────────
const tags = ref([])
const fotos = ref([])
const loading = ref(true)

// null = "Geral" (todas as fotos). Qualquer outro valor = id de uma tag.
const activeCategoryId = ref(null)

// ─── Carrega tags + fotos em paralelo ──────────────────────────────────────
async function carregarDados() {
  loading.value = true
  try {
    const [tagsData, fotosData] = await Promise.all([apiFetch('/tags'), apiFetch('/galeria')])
    tags.value = tagsData
    fotos.value = fotosData
  } catch (e) {
    console.error('Erro ao carregar galeria:', e)
  } finally {
    loading.value = false
  }
}

onMounted(carregarDados)

// Se a tag ativa for removida em outra aba, cai pra "Geral".
watch(
  tags,
  (cats) => {
    if (activeCategoryId.value !== null && !cats.find((t) => t.id === activeCategoryId.value)) {
      activeCategoryId.value = null
    }
  },
  { deep: true },
)

// null = mostra tudo. Caso contrário, filtra por tag.
const filteredItems = computed(() => {
  if (activeCategoryId.value === null) return fotos.value
  return fotos.value.filter((foto) => foto.tags.some((tag) => tag.id === activeCategoryId.value))
})

function urlCompleta(imagem_url) {
  return `${import.meta.env.VITE_API_URL}/upload/galeria/${imagem_url}`
}
</script>

<template>
  <section class="-section-gallery">
    <div class="-container">
      <header class="-header">
        <span class="-subtitle">NOSSOS TRABALHOS</span>
        <h2 class="-title">Galeria</h2>
      </header>

      <!-- Filtros: "Geral" + tags da API -->
      <div class="-filters">
        <button class="-filters__btn" :class="{ '-filters__btn--active': activeCategoryId === null }" @click="activeCategoryId = null">Geral</button>

        <button v-for="tag in tags" :key="tag.id" class="-filters__btn" :class="{ '-filters__btn--active': activeCategoryId === tag.id }" @click="activeCategoryId = tag.id">
          {{ tag.nome }}
        </button>
      </div>

      <!-- Bloco vinho em volta da grade -->
      <div class="-grid-wrap">
        <div class="-grid" v-if="filteredItems.length">
          <div v-for="item in filteredItems" :key="item.id" class="-card">
            <img :src="urlCompleta(item.imagem_url)" :alt="item.tags.map((t) => t.nome).join(', ')" class="-card__image" />
          </div>
        </div>

        <p v-else-if="!loading" class="-empty">
          {{ activeCategoryId === null ? 'Nenhuma foto cadastrada.' : 'Nenhuma foto nesta categoria.' }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Seção Principal ────────────────────────────────────────────────────── */
.-section-gallery {
  background-color: var(--kp-bg, #fcfaf5);
  padding: 80px 0;
}

.-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ─── Cabeçalho ──────────────────────────────────────────────────────────── */
.-header {
  text-align: center;
  margin-bottom: 40px;
}

.-subtitle {
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1.1rem;
  letter-spacing: 3px;
  color: #a67c3d;
  text-transform: uppercase;
  font-weight: 600;
  display: block;
  margin-bottom: 12px;
}

.-title {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 3.5rem;
  color: var(--kp-vinho, #4a2c2a);
  margin: 0;
  line-height: 1.1;
}

/* ─── Filtros ────────────────────────────────────────────────────────────── */
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

.-filters__btn:hover:not(.-filters__btn--active) {
  background-color: rgba(107, 29, 44, 0.08);
}

/* ─── Wrapper vinho em volta da grade ───────────────────────────────────── */
.-grid-wrap {
  background-color: var(--kp-vinho, #6b1d2c);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid var(--kp-gold-border, #c4a484);
  box-shadow: 0 12px 40px rgba(107, 29, 44, 0.25);
}

/* ─── Grade de imagens ──────────────────────────────────────────────────── */
.-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Card = moldura dourada fina em volta da foto */
.-card {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--kp-gold, #c9a66b);
  padding: 4px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}

/* ─── Estado vazio (dentro do bloco vinho) ─────────────────────────────── */
.-empty {
  text-align: center;
  font-family: var(--font-body, 'Lato', sans-serif);
  color: var(--kp-creme, #fcfaf5);
  opacity: 0.75;
  font-style: italic;
  font-size: 1.1rem;
  padding: 60px 20px;
  margin: 0;
}

/* ─── Responsivo ────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .-title {
    font-size: 2.8rem;
  }
  .-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .-grid-wrap {
    padding: 24px;
  }
}

@media (max-width: 600px) {
  .-title {
    font-size: 2.2rem;
  }
  .-grid {
    grid-template-columns: 1fr;
  }
  .-grid-wrap {
    padding: 16px;
  }
  .-card {
    padding: 3px;
  }
}
</style>
