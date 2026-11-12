<script setup>
import UpdateModal from '@/components/pages/profile/UpdateModal.vue'
import ButtonProfissional from '@/components/pages/profile/ButtonProfissional.vue'
import ButtonAdmin from '@/components/pages/profile/ButtonAdmin.vue'
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

const modalEdicao = ref(false)

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

const perfilEditado = ref({
  nome: '',
  bio: '',
  imagem_url: '',
})

function abrirEdicao() {
  perfilEditado.value = {
    nome: perfil.value.nome || '',
    bio: perfil.value.bio || '',
    imagem_url: perfil.value.imagem_url || null,
  }
  modalEdicao.value = true
}

// Função para tratar o salvamento e fechar o modal
function onPerfilSalvo(dadosAtualizados) {
  perfil.value = dadosAtualizados
  modalEdicao.value = false
}
</script>

<template>
  <main class="profile">
    <section class="profile__card">
      <div class="profile__photo-box">
        <img v-if="perfil.imagem_url" class="profile__photo" :src="`http://localhost:8000/upload/perfil/${perfil.imagem_url}?t=${Date.now()}`" alt="Foto da profissional" />
      </div>

      <div class="profile__info">
        <h1 class="profile__name">Meu perfil</h1>
        <p class="profile__person">{{ perfil.nome }}</p>
        <p class="profile__bio">{{ perfil.bio }}</p>
      </div>

      <button @click="abrirEdicao" class="btn-editar">Editar</button>

      <UpdateModal :modal-edicao="modalEdicao" :perfil-editado="perfilEditado" @saved="onPerfilSalvo" @close="modalEdicao = false" />
    </section>

    <ButtonProfissional />
    <ButtonAdmin />
  </main>
</template>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 8rem 2rem 6rem;
  background: var(--kp-bg);
}

.profile__card {
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
  font-size: clamp(2.8rem, 5vw, 3.8rem);
}

.profile__bio {
  max-width: 45rem;
  margin-top: 1rem;
  color: var(--kp-creme-low);
  font-size: 1.5rem;
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;
}

.profile__person {
  margin-top: 0.6rem;
  color: var(--kp-gold);
  font-size: 2rem;
}

.profile__card {
  position: relative;
}

.btn-editar {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.8rem 1.6rem;
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: none;
  border-radius: 99rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-editar:hover {
  opacity: 0.8;
}
</style>
