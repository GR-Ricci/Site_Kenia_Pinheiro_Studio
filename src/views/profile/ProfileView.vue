<script setup>
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidGlwbyI6IkFETUlOIiwiZXhwIjoxNzkzODkxMjI3fQ.kHdW7TE1HGlHoxIL5JvG4w-fUQtd-nbRd90yN8di6nE')

//Imports para trazer dados do banco
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

//Imports para Store e StoreGuard
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const perfil = ref({
  nome: '',
  bio: '',
  imagem_url: '',
})

async function carregarPerfil() {
  try {
    const dados = await apiFetch('/profile')
    perfil.value = dados
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro.message)
  }
}

onMounted(() => {
  carregarPerfil()
})
</script>

<template>
  <main class="profile">
    <section class="profile__card">
      <div class="profile__photo-box">
        <img class="profile__photo" :src="perfil.imagem_url" alt="Foto da profissional" />
      </div>

      <div class="profile__info">
        <h1 class="profile__name">Meu perfil</h1>
        <p class="profile__person">{{ perfil.nome }}</p>
        <p class="profile__bio">{{ perfil.bio }}</p>
      </div>
    </section>

    <section class="profile__options">
      <button class="profile__button" type="button">Cadastrar serviços, subserviço e escolher categoria</button>
      <button class="profile__button" type="button">Cadastrar horários</button>
    </section>

    <!-- <section v-if="authStore.tipo === 'ADMIN'" class="profile__admin__options"> -->
    <section class="profile__admin__options">
      <button class="profile__button" type="button">Cadastrar Categoria - Se for admin</button>
      <button class="profile__button" type="button">Gerenciar galeria e colocar tags - Se for admin</button>
      <button class="profile__button" type="button">Historico de funcionarios - Se for adminn</button>
    </section>
  </main>
</template>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 8rem 2rem 6rem;
  background: var(--kp-bg);
}

.profile__card,
.profile__options,
.profile__admin__options {
  width: min(92rem, 100%);
  margin: 0 auto;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
}

.profile__card {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  padding: 2.8rem;
  background: var(--kp-vinho);
  box-shadow: 0 1.2rem 3rem rgba(61, 32, 16, 0.07);
}

.profile__photo-box {
  width: 18rem;
  height: 18rem;
  flex-shrink: 0;
  border: 1px solid var(--kp-gold);
  border-radius: 50%;
  overflow: hidden;
  background: var(--kp-gold);
}

.profile__photo {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.profile__name {
  color: var(--kp-creme);
  font-family: var(--font-display), sans-serif;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  font-weight: 500;
}

.profile__bio {
  max-width: 45rem;
  margin-top: 1rem;
  color: var(--kp-creme-low);
  font-size: 1.5rem;
}

.profile__person {
  margin-top: 0.6rem;
  color: var(--kp-gold);
  font-size: 1.5rem;
}

.profile__options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(245, 235, 221, 0.3);
  border-style: dashed;
}

.profile__admin__options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(245, 235, 221, 0.3);
  border-style: dashed;
}

.profile__button {
  border: 1px solid var(--kp-gold-border);
  border-radius: 99rem;
  padding: 0.9rem 2rem;
  color: var(--kp-vinho);
  background: var(--kp-card-bg);
  font-family: var(--font-body), sans-serif;
  font-size: 1.35rem;
}

.profile__button:hover {
  border-color: var(--kp-gold);
  background: var(--kp-creme);
}
</style>
