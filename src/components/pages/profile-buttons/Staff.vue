<script setup>
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ abrirFuncionarios: Boolean })
const emit = defineEmits(['fechar'])

const funcionarios = ref([])

async function carregarDados() {
  try {
    funcionarios.value = await apiFetch('/staff')
  } catch (e) {
    console.error('Erro ao carregar funcionários:', e)
  }
}
onMounted(carregarDados)
watch(
  () => props.abrirFuncionarios,
  (aberto) => {
    if (aberto) carregarDados()
  },
)

function urlFoto(imagem_url) {
  if (!imagem_url) return null
  if (imagem_url.startsWith('http')) return imagem_url
  return `${import.meta.env.VITE_API_URL}/upload/perfil/${imagem_url}`
}

async function alternarStatus(func) {
  const novoStatus = !func.ativo
  try {
    await apiFetch(`/staff/${func.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo: novoStatus }),
    })
    func.ativo = novoStatus
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

async function excluirFuncionario(func) {
  const confirmacao = confirm(`Tem certeza que deseja APAGAR ${func.nome}?\n\n` + `O acesso será bloqueado e o perfil removido. ` + `Serviços vinculados a ela serão excluídos.`)
  if (!confirmacao) return

  try {
    await apiFetch(`/staff/${func.id}`, { method: 'DELETE' })
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

function cancelar() {
  emit('fechar')
}
</script>

<template>
  <div v-if="abrirFuncionarios" class="modal-overlay">
    <div class="modal-conteudo modal-largo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Histórico de Funcionários</h2>
          <p class="modal-subtitulo">Gerencie o acesso e o status da equipe.</p>
        </div>
        <button @click="cancelar" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <div v-for="func in funcionarios" :key="func.id" class="employee-card" :class="{ 'card-inativo': !func.ativo }">
          <div class="emp-foto-container">
            <img v-if="func.imagem_url" :src="urlFoto(func.imagem_url)" alt="Foto" class="emp-avatar" />
            <div v-else class="emp-avatar avatar-vazio">
              <i class="fa-solid fa-user"></i>
            </div>
          </div>

          <div class="emp-info">
            <h3 class="emp-nome">
              {{ func.nome }}
              <span class="emp-tipo">{{ func.tipo }}</span>
            </h3>
            <p class="emp-email">{{ func.email }}</p>
          </div>

          <div class="emp-status">
            <span class="badge" :class="func.ativo ? 'badge-ativo' : 'badge-inativo'">
              <i class="fa-solid" :class="func.ativo ? 'fa-check' : 'fa-ban'"></i>
              {{ func.ativo ? 'Ativo' : 'Desativado' }}
            </span>
          </div>

          <div class="emp-acoes">
            <button @click="alternarStatus(func)" class="btn-status" :title="func.ativo ? 'Desativar acesso' : 'Ativar acesso'">
              <i class="fa-solid" :class="func.ativo ? 'fa-user-slash' : 'fa-user-check'"></i>
            </button>

            <button @click="excluirFuncionario(func)" class="btn-deletar" title="Apagar usuário do sistema">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div v-if="funcionarios.length === 0" class="empty-state">Nenhum funcionário cadastrado.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================= ESTRUTURA DO MODAL ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-conteudo {
  background: var(--kp-mahogany);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(75rem, 95%);
  height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2.5rem 3rem;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
}

.modal-titulo {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
}

.modal-subtitulo {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
}

.btn-fechar {
  background: transparent;
  border: none;
  color: var(--kp-gold);
  font-size: 2rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-fechar:hover {
  opacity: 0.7;
}

.modal-body {
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ================= CARDS ================= */
.employee-card {
  display: flex;
  align-items: center;
  background: rgba(245, 235, 221, 0.05);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  transition: all 0.2s ease;
  gap: 2rem;
}

.employee-card:hover {
  background: rgba(245, 235, 221, 0.08);
}

.card-inativo {
  opacity: 0.5;
  border-style: dashed;
}

.emp-foto-container {
  flex-shrink: 0;
}

.emp-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--kp-gold);
}

.avatar-vazio {
  background: var(--kp-vinho);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kp-creme-low);
  font-size: 2rem;
}

.emp-info {
  flex: 1;
}

.emp-nome {
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.emp-tipo {
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--kp-gold);
  color: var(--kp-mahogany);
  padding: 0.2rem 0.8rem;
  border-radius: 99rem;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.emp-email {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
  margin-top: 0.4rem;
}

.emp-status {
  margin: 0 1.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
}

.badge-ativo {
  background: rgba(37, 211, 102, 0.15);
  color: #25d366;
  border: 1px solid #25d366;
}

.badge-inativo {
  background: rgba(255, 77, 77, 0.15);
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
}

.emp-acoes {
  display: flex;
  gap: 1rem;
}

.btn-status,
.btn-deletar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--kp-gold-border);
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s;
  background: transparent;
}

.btn-status {
  color: var(--kp-gold);
}
.btn-status:hover {
  background: var(--kp-gold);
  color: var(--kp-mahogany);
}

.btn-deletar {
  color: #ff4d4d;
  border-color: rgba(255, 77, 77, 0.3);
}
.btn-deletar:hover {
  background: #ff4d4d;
  color: #fff;
  border-color: #ff4d4d;
}

.empty-state {
  text-align: center;
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.4rem;
  margin-top: 2rem;
}
</style>
