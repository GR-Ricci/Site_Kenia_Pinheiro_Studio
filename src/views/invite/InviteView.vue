<script setup>
import ModalShare from '@/components/pages/invite/ModalShare.vue'
import { apiFetch } from '@/client.js'
import { ref, onMounted } from 'vue'

// Flag Modularização
const modalAberto = ref(false)
const carregando = ref(false)

// Controle de Acesso
const isSuperAdmin = ref(false)
const acessoNegado = ref(false)
const verificando = ref(true)

// -> Criar Convite
const convite = ref({
  token: '',
  link: '',
  expira_em: '',
})

// -> VERIFICA DIRETO NO BACK-END
async function verificarAcesso() {
  try {
    // Puxa os dados reais de quem está logado no banco
    const me = await apiFetch('/staff/me')

    // Se for ADMIN e o banco disser que é superadmin, libera
    if (me.tipo === 'ADMIN' && me.superadmin) {
      isSuperAdmin.value = true
    } else {
      acessoNegado.value = true
    }
  } catch (erro) {
    console.error('Erro ao verificar acesso:', erro)
    acessoNegado.value = true
  } finally {
    verificando.value = false
  }
}

onMounted(verificarAcesso)

async function gerarConvite(tipo) {
  carregando.value = true
  try {
    const dados = await apiFetch('/invites', {
      method: 'POST',
      body: JSON.stringify({ tipo: tipo }),
    })
    convite.value = dados
    modalAberto.value = true
  } catch (erro) {
    console.error('Erro ao gerar convite', erro.message)
    alert('Erro ao gerar convite: ' + erro.message)
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <main class="invite">
    <!-- CARREGANDO PERMISSÃO -->
    <section v-if="verificando" class="invite__card" style="text-align: center">
      <p style="color: var(--kp-creme)">Verificando permissões...</p>
    </section>

    <!-- ACESSO NEGADO -->
    <section v-else-if="acessoNegado" class="invite__card" style="text-align: center">
      <i class="fa-solid fa-lock" style="font-size: 4rem; color: var(--kp-gold); margin-bottom: 2rem"></i>
      <h1 class="invite__title">Acesso Restrito</h1>
      <p class="invite__description">Apenas administradores com nível Super Admin podem gerar convites.</p>
      <button @click="$router.push('/')" class="invite__option" style="margin-top: 2rem; text-align: center; justify-content: center">Voltar para a Home</button>
    </section>

    <!-- ÁREA LIBERADA -->
    <section v-else class="invite__card">
      <p class="invite__eyebrow">Área administrativa</p>
      <h1 class="invite__title">Gerar convite</h1>
      <p class="invite__description">Escolha o tipo de profissional que deseja cadastrar.</p>

      <div class="invite__options">
        <button class="invite__option" type="button" :disabled="carregando" @click="gerarConvite('PROFISSIONAL')">
          <span class="invite__option-title">Profissional - Comum</span>
          <span class="invite__option-description"> Acesso apenas às funções relacionadas ao próprio perfil. </span>
        </button>

        <button class="invite__option" type="button" :disabled="carregando" @click="gerarConvite('ADMIN')">
          <span class="invite__option-title">Profissional - Administrador</span>
          <span class="invite__option-description"> Acesso às configurações e ao gerenciamento do espaço. </span>
        </button>
      </div>

      <p v-if="carregando" style="color: var(--kp-gold); margin-top: 2rem">Gerando convite...</p>
    </section>

    <ModalShare :modal-aberto="modalAberto" :convite="convite.link" @close="modalAberto = false" />
  </main>
</template>

<style scoped>
.invite {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 8rem 2rem 6rem;
  background: var(--kp-vinho);
}

.invite__card {
  width: min(64rem, 100%);
  height: fit-content;
  padding: 3.2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  background: var(--kp-mahogany);
  box-shadow: 0 1.2rem 3rem rgba(61, 32, 16, 0.07);
  text-align: center;
}

.invite__eyebrow {
  color: var(--kp-gold);
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.invite__title {
  margin-top: 0.8rem;
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5vw, 4.4rem);
  font-weight: 500;
}

.invite__description {
  margin-top: 0.8rem;
  color: var(--kp-creme-low);
  font-size: 1.45rem;
}

.invite__options {
  display: grid;
  gap: 1.2rem;
  margin-top: 3rem;
}

.invite__option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  width: 100%;
  padding: 1.8rem 2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
  color: var(--kp-creme);
  background: rgba(245, 235, 221, 0.08);
  text-align: left;
  transition:
    border-color 180ms ease,
    background 180ms ease;
  cursor: pointer;
}

.invite__option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invite__option:hover:not(:disabled) {
  border-color: var(--kp-gold);
  background: rgba(245, 235, 221, 0.16);
}

.invite__option-title {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.6rem;
}

.invite__option-description {
  color: var(--kp-creme-low);
  font-size: 1.3rem;
}

@media (max-width: 600px) {
  .invite {
    padding: 6rem 1.6rem 4rem;
  }

  .invite__card {
    padding: 2.4rem 1.8rem;
  }
}
</style>
