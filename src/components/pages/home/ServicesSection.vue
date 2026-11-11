<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { apiFetch } from '@/client.js'

const router = useRouter()

const carrosselCats = ref([])
const activeIndex = ref(0)
const total = ref(0)

onMounted(async () => {
  try {
    const data = await apiFetch('/carrossel')
    carrosselCats.value = data
    total.value = data.length
  } catch (e) {
    console.error('Erro ao carregar carrossel:', e)
  }
})

function urlImagem(imagem_url) {
  if (!imagem_url) return null
  if (imagem_url.startsWith('http')) return imagem_url
  return `${import.meta.env.VITE_API_URL}/upload/carrossel/${imagem_url}`
}

function next() {
  if (total.value === 0) return
  activeIndex.value = (activeIndex.value + 1) % total.value
}

function prev() {
  if (total.value === 0) return
  activeIndex.value = (activeIndex.value - 1 + total.value) % total.value
}

function goTo(index) {
  activeIndex.value = index
}

function positionOf(index) {
  const diff = (index - activeIndex.value + total.value) % total.value
  if (diff === 0) return 'active'
  if (diff === 1) return 'next'
  if (diff === total.value - 1) return 'prev'
  return 'hidden'
}

function handleCardClick(index) {
  if (positionOf(index) === 'active') {
    const cat = carrosselCats.value[index]
    router.push({ path: '/services', query: { categoria: cat.id_categoria } })
  } else {
    goTo(index)
  }
}
</script>

<template>
  <section id="services" class="-section-services">
    <div class="-container">
      <header class="-services__header">
        <span class="-services__eyebrow">O que oferecemos</span>
        <h2 class="-services__title">Nossos Serviços</h2>
        <div class="-services__divider">
          <span class="-services__diamond"></span>
        </div>
      </header>

      <p v-if="total === 0" class="empty-text">Nenhuma categoria cadastrada ainda.</p>

      <template v-else>
        <div class="-carousel">
          <button class="-carousel__arrow -carousel__arrow--prev" type="button" aria-label="Anterior" @click="prev">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="-carousel__stage">
            <div v-for="(v, i) in carrosselCats" :key="v.id" class="-carousel__card" :class="`-carousel__card--${positionOf(i)}`" @click="handleCardClick(i)">
              <img :src="urlImagem(v.imagem_url)" :alt="v.nome_categoria" class="-carousel__image" />
              <span class="-carousel__label">{{ v.nome_categoria }}</span>
            </div>
          </div>

          <button class="-carousel__arrow -carousel__arrow--next" type="button" aria-label="Próximo" @click="next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="-services__dots">
          <button v-for="(v, i) in carrosselCats" :key="v.id" class="-services__dot" :class="{ '-services__dot--active': i === activeIndex }" type="button" :aria-label="`Ir para ${v.nome_categoria}`" @click="goTo(i)"></button>
        </div>
      </template>

      <div class="-services__cta">
        <RouterLink to="/services" class="-services__btn">
          Ver Todos os Serviços
          <i class="fas fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.-section-services {
  background: var(--kp-bg);
  padding: 10rem 0;
}

.-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
}

.-services__header {
  text-align: center;
  margin-bottom: 6rem;
}

.-services__eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 1.2rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--kp-gold);
  margin-bottom: 1.5rem;
}

.-services__title {
  font-family: var(--font-display);
  font-size: 4.8rem;
  font-weight: 400;
  color: var(--kp-vinho);
  margin: 0;
}

.-services__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.-services__divider::before,
.-services__divider::after {
  content: '';
  width: 8rem;
  height: 1px;
  background: var(--kp-gold-low);
}

.-services__diamond {
  width: 8px;
  height: 8px;
  background: var(--kp-gold);
  transform: rotate(45deg);
}

/* --- Carrossel --- */
.-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}

.-carousel__stage {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 480px;
  flex-shrink: 0;
}

.-carousel__card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  filter: blur(6px);
  transform: translate(-50%, -50%) scale(0.6);
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.-carousel__card--active {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  filter: blur(0);
  z-index: 3;
  cursor: pointer;
  pointer-events: auto;
}

.-carousel__card--prev {
  transform: translate(calc(-50% - 240px), -50%) scale(0.82);
  opacity: 0.55;
  z-index: 2;
  pointer-events: auto;
}

.-carousel__card--next {
  transform: translate(calc(-50% + 240px), -50%) scale(0.82);
  opacity: 0.55;
  z-index: 2;
  pointer-events: auto;
}

.-carousel__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.-carousel__label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6rem 2rem 2.4rem;
  font-family: var(--font-display);
  font-size: 2.4rem;
  color: var(--kp-creme);
  text-align: center;
  background: linear-gradient(to top, rgba(30, 18, 10, 0.9), transparent);
}

.-carousel__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--kp-gold-border);
  color: var(--kp-vinho);
  font-size: 1.6rem;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0 2rem;
  z-index: 4;
  box-shadow: 0 4px 12px rgba(30, 18, 10, 0.08);
  transition: all 250ms ease;
}

.-carousel__arrow:hover {
  background: var(--kp-vinho);
  color: var(--kp-creme);
  border-color: var(--kp-vinho);
}

/* --- Dots --- */
.-services__dots {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
}

.-services__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kp-gold-low);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 250ms ease;
}

.-services__dot--active {
  background: var(--kp-vinho);
  transform: scale(1.4);
}

/* --- CTA --- */
.-services__cta {
  display: flex;
  justify-content: center;
}

.-services__btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.4rem 3rem;
  border: 1px solid var(--kp-vinho);
  color: var(--kp-vinho);
  background: transparent;
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 250ms ease;
}

.-services__btn:hover {
  background: var(--kp-vinho);
  color: var(--kp-creme);
}

/* --- Vazio --- */
.empty-text {
  text-align: center;
  color: var(--kp-text-soft);
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-style: italic;
  padding: 4rem 0;
  margin-bottom: 4rem;
}
</style>
