<script setup>
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ editarContato: Boolean })
const emit = defineEmits(['fechar'])

const carregando = ref(false)
const salvando = ref(false)

const form = ref({
  telefone: '',
  whatsapp: '',
  email: '',
  rede_social: '',
  endereco: '',
})

async function carregar() {
  carregando.value = true
  try {
    const dados = await apiFetch('/contato')
    form.value = {
      telefone: dados.telefone || '',
      whatsapp: dados.whatsapp || '',
      email: dados.email || '',
      rede_social: dados.rede_social || '',
      endereco: dados.endereco || '',
    }
  } catch (e) {
    alert('Erro ao carregar: ' + e.message)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  if (props.editarContato) carregar()
})
watch(
  () => props.editarContato,
  (aberto) => {
    if (aberto) carregar()
  },
)

async function salvar() {
  salvando.value = true
  try {
    await apiFetch('/contato', {
      method: 'PUT',
      body: JSON.stringify(form.value),
    })
    alert('Contato atualizado!')
    emit('fechar')
  } catch (e) {
    alert('Erro ao salvar: ' + e.message)
  } finally {
    salvando.value = false
  }
}

function fechar() {
  emit('fechar')
}
</script>

<template>
  <div v-if="editarContato" class="modal-overlay">
    <div class="modal-conteudo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Editar Contato</h2>
          <p class="modal-subtitulo">Atualize as informações da página de contato.</p>
        </div>
        <button @click="fechar" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <p v-if="carregando" class="empty-text">Carregando...</p>

        <form v-else @submit.prevent="salvar" class="form-contato">
          <label class="campo">
            <span>Telefone</span>
            <input type="tel" v-model="form.telefone" placeholder="(16) 99999-9999" />
          </label>

          <label class="campo">
            <span>WhatsApp</span>
            <input type="tel" v-model="form.whatsapp" placeholder="(16) 99999-9999" />
          </label>

          <label class="campo">
            <span>E-mail</span>
            <input type="email" v-model="form.email" placeholder="contato@studio.com" />
          </label>

          <label class="campo">
            <span>Rede Social (Instagram)</span>
            <input type="text" v-model="form.rede_social" placeholder="@keniapinheirostudio" />
          </label>

          <label class="campo">
            <span>Endereço</span>
            <input
              type="text"
              v-model="form.endereco"
              placeholder="Rua ..., 123 — Bairro, Cidade UF"
            />
          </label>

          <div class="modal-acoes">
            <button type="button" @click="fechar" class="btn-cancelar">Cancelar</button>
            <button type="submit" class="btn-salvar" :disabled="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  width: min(55rem, 95%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
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
  font-size: 2.6rem;
  margin-bottom: 0.4rem;
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
  font-size: 2.2rem;
  cursor: pointer;
}

.modal-body {
  padding: 2.5rem 3rem;
  overflow-y: auto;
}

.form-contato {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.campo > span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.05em;
}

.campo input {
  width: 100%;
  padding: 1.1rem 1.3rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.4rem;
  outline: none;
}

.campo input:focus {
  border-color: var(--kp-gold);
}

.modal-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
  padding-top: 1.6rem;
  margin-top: 0.8rem;
}

.btn-cancelar,
.btn-salvar {
  padding: 1rem 2.4rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar {
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
}

.btn-cancelar:hover {
  background: rgba(245, 235, 221, 0.1);
}

.btn-salvar {
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: 1px solid var(--kp-gold);
}

.btn-salvar:hover:not(:disabled) {
  background: var(--kp-creme);
}

.btn-salvar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-text {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
  text-align: center;
  padding: 2rem 0;
  font-style: italic;
}
</style>
