<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

defineOptions({
  name: 'AboutSection',
})

const profissionais = ref([])
const loading = ref(true)

function urlFotoPerfil(imagem_url) {
  if (!imagem_url) return null
  if (imagem_url.startsWith('http')) return imagem_url
  return `${import.meta.env.VITE_API_URL}/upload/perfil/${imagem_url}`
}

function inicial(nome) {
  return (nome || '?').charAt(0).toUpperCase()
}

async function carregarEquipe() {
  loading.value = true
  try {
    const staff = await apiFetch('/staff')

    const apenasProfissionais = staff.filter((s) => s.id_profissional !== null && s.id_profissional !== undefined)

    profissionais.value = apenasProfissionais.sort((a, b) => {
      if (a.superadmin && !b.superadmin) return -1
      if (!a.superadmin && b.superadmin) return 1
      return 0
    })
  } catch (e) {
    console.error('Erro ao carregar equipe:', e)
  } finally {
    loading.value = false
  }
}

onMounted(carregarEquipe)
</script>

<template>
  <section class="-section-about">
    <div class="-container">
      <div class="-intro-box">
        <h2 class="-intro-title">SOBRE NÓS</h2>

        <div class="-intro-divider">
          <span class="-line"></span>
          <span class="-diamond"></span>
          <span class="-line"></span>
        </div>

        <p class="-intro-quote">"Nossos valores são beleza, cuidado e autenticidade."</p>
      </div>

      <header class="-header">
        <span class="-subtitle">Nossa Equipe</span>
      </header>

      <div class="-list">
        <p v-if="loading" class="-status">Carregando equipe...</p>
        <p v-else-if="profissionais.length === 0" class="-status">Nenhuma profissional cadastrada.</p>

        <div v-else v-for="prof in profissionais" :key="prof.id_profissional" class="-card">
          <div class="-card-image">
            <img v-if="prof.imagem_url" :src="urlFotoPerfil(prof.imagem_url)" :alt="prof.nome" />
            <div v-else class="-avatar-fallback">{{ inicial(prof.nome) }}</div>
          </div>

          <div class="-card-info">
            <div class="-card-title-row">
              <h3 class="-card-name">{{ prof.nome }}</h3>
            </div>

            <p v-if="prof.bio" class="-card-bio">
              {{ prof.bio }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.-section-about {
  background-color: var(--kp-bg, #fcfaf5);
  padding: 5rem 0;
  min-height: 50vh;
}

.-container {
  max-width: 100rem;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ─── Bloco de Introdução ─── */
.-intro-box {
  background-color: #faf7f2;
  border: 1px solid #c9a66b;
  border-radius: 1.2rem;
  max-width: 70rem;
  margin: 0 auto 3rem auto;
  padding: 3rem 2.5rem;
  text-align: center;
  box-shadow: 0 0.4rem 1.5rem rgba(0, 0, 0, 0.02);
}

.-intro-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  color: #6b1d2c;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.15rem;
  text-transform: uppercase;
  font-weight: 600;
}

.-intro-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.-line {
  height: 0.1rem;
  width: 8rem;
  background-color: #d4bca3;
}

.-diamond {
  width: 0.8rem;
  height: 0.8rem;
  background-color: #c9a66b;
  transform: rotate(45deg);
}

.-intro-quote {
  font-family: 'Lato', sans-serif;
  font-size: 1.7rem;
  font-style: italic;
  color: #4a3a30;
  margin: 0;
  line-height: 1.5;
}

/* ─── Cabeçalho da Lista ─── */
.-header {
  margin-bottom: 2.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.-header::before {
  content: '';
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: #c9a66b;
}

.-subtitle {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2.4rem;
  color: #3d2010;
  margin: 0;
}

.-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.-status {
  text-align: center;
  font-family: var(--font-body, 'Lato', sans-serif);
  color: #3d2010aa;
  font-style: italic;
  font-size: 1.4rem;
  padding: 4rem 0;
}

/* ─── Card da Profissional ─── */
.-card {
  display: flex;
  flex-direction: row;
  background-color: var(--kp-vinho, #6b1d2c);
  border-radius: 1.2rem;
  overflow: hidden;
  border: 1px solid var(--kp-gold-border, #c9a66b);
  box-shadow: 0 0.6rem 1.8rem rgba(107, 29, 44, 0.12);
  min-height: 24rem; /* AUMENTADO: de 22rem para 24rem */
}

/* ─── Imagem ─── */
.-card-image {
  width: 38%; /* AUMENTADO: de 35% para 38% */
  position: relative;
  flex-shrink: 0;
}

.-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  inset: 0;
}

.-avatar-fallback {
  width: 100%;
  height: 100%;
  background-color: #4a0d1a;
  color: var(--kp-gold, #c9a66b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 5rem;
  font-weight: bold;
  position: absolute;
  inset: 0;
}

/* ─── Informações de Texto ─── */
.-card-info {
  width: 62%; /* DIMINUÍDO: de 65% para 62% */
  padding: 3.2rem 3rem 3.8rem 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  min-width: 0;
}

.-card-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

/* Nome DOURADO */
.-card-name {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  color: var(--kp-gold, #c9a66b);
  margin: 0;
  line-height: 1.2;
  font-weight: 600;
}

/* Bio */
.-card-bio {
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 1.5rem;
  color: var(--kp-creme-low, #e6d5c3);
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── Responsivo (Mobile) ─── */
@media (max-width: 800px) {
  .-intro-box {
    padding: 2.5rem 1.5rem;
    margin-bottom: 2.5rem;
  }
  .-intro-title {
    font-size: 2rem;
  }
  .-intro-quote {
    font-size: 1.4rem;
  }
  .-line {
    width: 5rem;
  }

  .-card {
    flex-direction: column;
    min-height: auto;
  }

  .-card-image {
    width: 100%;
    height: 25rem;
  }

  .-card-info {
    width: 100%;
    padding: 2.5rem 2rem;
  }

  .-card-name {
    font-size: 2.4rem;
  }

  .-card-bio {
    font-size: 1.4rem;
  }
}
</style>
