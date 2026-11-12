<script setup>
import { ref, computed, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({
  modalEdicao: Boolean,
  perfilEditado: Object,
})
const emit = defineEmits(['close', 'saved'])

// Estado local (garante que os dados não se percam)
const form = ref({
  nome: '',
  bio: '',
  imagem_url: null,
})

const versaoFoto = ref(Date.now())
const fotoNoPreview = ref(false)
const modalBioAberto = ref(false)
const bioRascunho = ref('')
const limiteBio = 300

const urlFoto = computed(() => {
  if (!form.value?.imagem_url) return null
  const pasta = fotoNoPreview.value ? 'perfilpreview' : 'perfil'
  return `${import.meta.env.VITE_API_URL}/upload/${pasta}/${form.value.imagem_url}?v=${versaoFoto.value}`
})

// Sempre que abrir o modal, preenche os dados do rascunho
watch(
  () => props.modalEdicao,
  (aberto) => {
    if (aberto) {
      form.value = {
        nome: props.perfilEditado?.nome || '',
        bio: props.perfilEditado?.bio || '',
        imagem_url: props.perfilEditado?.imagem_url || null,
      }
      fotoNoPreview.value = false
      versaoFoto.value = Date.now()
      modalBioAberto.value = false
    }
  },
  { immediate: true },
)

async function enviarFoto(evento) {
  const file = evento.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('arquivo', file)

  try {
    const dados = await apiFetch('/upload/perfil', { method: 'POST', body: formData })
    form.value.imagem_url = dados.imagem_url
    fotoNoPreview.value = true
    versaoFoto.value = Date.now()
  } catch (erro) {
    console.error('Erro no upload:', erro.message)
  } finally {
    evento.target.value = ''
  }
}

function abrirModalBio() {
  bioRascunho.value = form.value.bio || ''
  modalBioAberto.value = true
}

function salvarBio() {
  form.value.bio = bioRascunho.value.trim()
  modalBioAberto.value = false
}

function cancelarBio() {
  modalBioAberto.value = false
}

async function salvarPerfil() {
  try {
    const payload = {
      nome: form.value.nome,
      bio: form.value.bio,
      imagem_url: form.value.imagem_url,
    }

    console.log('DADOS ENVIADOS:', payload)

    const dados = await apiFetch('/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    emit('saved', dados)
    emit('close')
  } catch (erro) {
    console.error('Erro ao salvar perfil:', erro.message)
    alert('Erro ao salvar: ' + erro.message)
  }
}

async function cancelarEdicao() {
  if (fotoNoPreview.value && form.value.imagem_url) {
    try {
      await apiFetch(`/upload/perfil/${form.value.imagem_url}`, { method: 'DELETE' })
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
          <input type="text" v-model="form.nome" placeholder="Seu nome" />
        </label>

        <div class="modal-campo">
          <div class="campo-header">
            <span>Bio</span>
            <span class="contador-texto">{{ form.bio?.length || 0 }}/{{ limiteBio }}</span>
          </div>
          <input type="text" :value="form.bio" placeholder="Clique aqui para escrever uma biografia..." class="input-clicavel" readonly @click="abrirModalBio" />
        </div>

        <div class="modal-campo">
          <span><i class="fa-solid fa-camera"></i></span>
          <label class="btn-escolher-foto">
            Escolher foto
            <input type="file" accept="image/jpeg,image/png,image/webp" class="input-escondido" @change="enviarFoto" />
          </label>
        </div>

        <div class="modal-acoes">
          <button type="button" @click="cancelarEdicao" class="btn-cancelar">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar</button>
        </div>

        <img v-if="urlFoto" :src="urlFoto" class="preview-foto" />
      </form>
    </div>
  </div>

  <div v-if="modalBioAberto" class="modal-overlay-bio" @click.self="cancelarBio">
    <div class="modal-bio-conteudo">
      <h3 class="modal-bio-titulo">Sua Biografia</h3>
      <p class="modal-bio-subtitulo">Escreva um pouco sobre você, sua experiência e especialidades.</p>

      <div class="textarea-wrapper">
        <textarea v-model="bioRascunho" :maxlength="limiteBio" placeholder="Escreva aqui..." class="textarea-bio" rows="8" autofocus></textarea>
        <span class="contador-bio">{{ bioRascunho.length }} / {{ limiteBio }}</span>
      </div>

      <div class="modal-acoes-bio">
        <button type="button" @click="cancelarBio" class="btn-cancelar">Cancelar</button>
        <button type="button" @click="salvarBio" class="btn-salvar">Confirmar</button>
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
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal-conteudo {
  background: var(--kp-mahogany);
  padding: 3.5rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(50rem, 90%);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
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
  gap: 1.8rem;
}

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

.modal-campo span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.05em;
}

.campo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contador-texto {
  font-size: 1.1rem !important;
  opacity: 0.6;
}

.modal-campo input[type='text'] {
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

.modal-campo input[type='text']:focus {
  border-color: var(--kp-gold);
  box-shadow: 0 0 0 0.3rem rgba(201, 166, 107, 0.15);
}

.input-clicavel {
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.input-clicavel:hover {
  background: #fdfaf6;
  border-color: var(--kp-gold);
}

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

.btn-salvar {
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: 1px solid var(--kp-gold);
}

.btn-salvar:hover {
  background: var(--kp-creme);
}

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
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-escolher-foto:hover {
  background: #7a2632;
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

.modal-overlay-bio {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  backdrop-filter: blur(6px);
}

.modal-bio-conteudo {
  background: var(--kp-creme, #f5ebdd);
  padding: 3rem;
  border: 1px solid var(--kp-gold);
  border-radius: 1.4rem;
  width: min(65rem, 90%);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.6);
}

.modal-bio-titulo {
  color: var(--kp-vinho, #6b1d2c);
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
}

.modal-bio-subtitulo {
  color: var(--kp-text, #4a2c2a);
  font-family: var(--font-body);
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.7;
}

.textarea-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.textarea-bio {
  width: 100%;
  padding: 1.5rem;
  border: 1px solid var(--kp-gold-border, #c9a66b);
  border-radius: 0.8rem;
  background: #ffffff;
  color: #3d2010;
  font-family: var(--font-body);
  font-size: 1.5rem;
  line-height: 1.5;
  outline: none;
  resize: vertical;
  min-height: 18rem;
  transition: border-color 0.2s;
}

.textarea-bio:focus {
  border-color: var(--kp-vinho, #6b1d2c);
}

.contador-bio {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: #3d2010;
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
}

.modal-acoes-bio {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}

.modal-acoes-bio .btn-salvar {
  background: var(--kp-vinho, #6b1d2c);
  color: var(--kp-creme, #f5ebdd);
  border-color: var(--kp-vinho, #6b1d2c);
}

.modal-acoes-bio .btn-salvar:hover {
  background: #4a0d1a;
}

.modal-acoes-bio .btn-cancelar {
  background: transparent;
  color: var(--kp-vinho, #6b1d2c);
  border-color: var(--kp-vinho, #6b1d2c);
}

.modal-acoes-bio .btn-cancelar:hover {
  background: rgba(107, 29, 44, 0.08);
}
</style>
