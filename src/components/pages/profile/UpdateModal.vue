<script setup>
import { ref, computed, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({
  modalEdicao: Boolean,
  perfilEditado: Object,
})
const emit = defineEmits(['close', 'saved'])

// -> Estado da foto
const versaoFoto = ref(Date.now())
const fotoNoPreview = ref(false) // true quando o usuário escolhe uma nova foto ainda não salva
const inputArquivo = ref(null)

// Mostra a imagem salva (perfil/) por padrão;
// se já escolheu nova foto, mostra o preview (perfilpreview/).
const urlFoto = computed(() => {
  if (!props.perfilEditado?.imagem_url) return null
  const pasta = fotoNoPreview.value ? 'perfilpreview' : 'perfil'
  return `${import.meta.env.VITE_API_URL}/upload/${pasta}/${props.perfilEditado.imagem_url}?v=${versaoFoto.value}`
})

// Reseta flags ao abrir o modal
watch(
  () => props.modalEdicao,
  (aberto) => {
    if (aberto) {
      fotoNoPreview.value = false
      versaoFoto.value = Date.now()
    }
  },
)

async function enviarFoto(evento) {
  const file = evento.target.files[0]
  if (!file) return

  const form = new FormData()
  form.append('arquivo', file)

  try {
    const dados = await apiFetch('/upload/perfil', { method: 'POST', body: form })
    props.perfilEditado.imagem_url = dados.imagem_url
    fotoNoPreview.value = true
    versaoFoto.value = Date.now()
  } catch (erro) {
    console.error('Erro no upload:', erro.message)
  }
}

// -> Perfil
async function salvarPerfil() {
  try {
    const dados = await apiFetch('/profile', {
      method: 'PATCH',
      body: JSON.stringify(props.perfilEditado),
    })
    emit('saved', dados)
    emit('close')
  } catch (erro) {
    console.error('Erro ao salvar perfil:', erro.message)
    alert('Erro ao salvar: ' + erro.message)
  }
}

async function cancelarEdicao() {
  // Só apaga do perfilpreview se o usuário tiver subido uma foto nova
  if (fotoNoPreview.value && props.perfilEditado.imagem_url) {
    try {
      await apiFetch(`/upload/perfil/${props.perfilEditado.imagem_url}`, { method: 'DELETE' })
    } catch (erro) {
      console.error('Erro ao deletar preview', erro.message)
    }
  }
  emit('close')
}
</script>

<template>
  <div v-if="modalEdicao" class="modal-overlay">
    <div class="modal-conteudo">
      <h2 class="modal-titulo">Editar Perfil</h2>

      <form @submit.prevent="salvarPerfil" class="modal-form">
        <label class="modal-campo">
          <span>Nome</span>
          <input type="text" v-model="perfilEditado.nome" placeholder="Seu nome" />
        </label>

        <label class="modal-campo">
          <span>Bio</span>
          <input type="text" v-model="perfilEditado.bio" placeholder="Sua bio" />
        </label>

        <label class="modal-campo">
          <span><i class="fa-solid fa-camera"></i></span>

          <input ref="inputArquivo" type="file" accept="image/jpeg,image/png,image/webp" class="input-escondido" @change="enviarFoto" />

          <button type="button" class="btn-escolher-foto" @click="inputArquivo.click()">Escolher foto</button>
        </label>

        <div class="modal-acoes">
          <button type="button" @click="cancelarEdicao" class="btn-cancelar">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar</button>
        </div>

        <img v-if="urlFoto" :src="urlFoto" class="preview-foto" />
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Modal editar perfil */

/* botao editar para ativar modal */

/* modal */

/* Fundo escuro do modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.85); /* Um pouco mais escuro para dar foco */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px); /* Desfoca o fundo (dá um efeito muito bonito) */
}

/* Caixa do modal */
.modal-conteudo {
  background: var(--kp-mahogany);
  padding: 3.5rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(50rem, 90%);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5); /* Sombra para dar profundidade */
}

.modal-titulo {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem; /* Espaço entre os campos */
}

/* O campo (Label + Input) */
.modal-campo {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal-campo i {
  display: block;
  text-align: center;
  margin-top: 1rem;
}

/* Texto do Label */
.modal-campo span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.05em;
}

/* O Input em si */
.modal-campo input {
  width: 100%;
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.4rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

/* Efeito de foco (quando o usuário clica no input) */
.modal-campo input:focus {
  border-color: var(--kp-gold);
  box-shadow: 0 0 0 0.3rem rgba(201, 166, 107, 0.15);
}

/* Botões */
.modal-acoes {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1rem;
}

.btn-salvar,
.btn-cancelar {
  padding: 1.1rem 2.8rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Botão Salvar (Destaque) */
.btn-salvar {
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: 1px solid var(--kp-gold);
}

.btn-salvar:hover {
  background: var(--kp-creme);
}

/* Botão Cancelar (Secundário) */
.btn-cancelar {
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
}

.btn-cancelar:hover {
  background: rgba(245, 235, 221, 0.1);
}

.btn-escolher-foto {
  width: 90%;
  align-self: center;
  padding: 1rem 1.4rem;
  border: 1px solid var(--kp-gold);
  border-radius: 99rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition:
    background 0.2s,
    transform 0.1s;
}

.btn-escolher-foto:hover {
  background: #7a2632;
}

.btn-escolher-foto:active {
  transform: scale(0.98);
}

.input-escondido {
  display: none;
}

.preview-foto {
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  object-fit: cover;
  align-self: center;
  border: 1px solid var(--kp-gold);
  margin-top: 0.5rem;
}
</style>
