<script setup>
import { ref, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ abrirEditorWallpaper: Boolean })
const emit = defineEmits(['close', 'saved'])

const inputArquivo = ref(null)
const imagemAtual = ref(null) // imagem salva no servidor
const fileNovo = ref(null) // arquivo escolhido (ainda não salvo)
const previewNovo = ref(null) // blob URL do arquivo escolhido
const carregando = ref(false)
const salvando = ref(false)

// Se escolheu foto nova, mostra ela; senão, mostra a salva.
const imagemExibida = ref(null)

function atualizarExibicao() {
  imagemExibida.value = previewNovo.value || imagemAtual.value
}

async function carregarAtual() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/home`)
    if (!res.ok) {
      console.error('GET /home falhou:', res.status)
      imagemAtual.value = null
      atualizarExibicao()
      return
    }
    const dados = await res.json()
    console.log('GET /home respondeu:', dados)
    if (dados.imagem_url) {
      imagemAtual.value = `${import.meta.env.VITE_API_URL}/upload/home/${dados.imagem_url}?v=${dados.atualizado_em}`
    } else {
      imagemAtual.value = null
    }
    atualizarExibicao()
  } catch (e) {
    console.error('Erro ao carregar home:', e)
    imagemAtual.value = null
    atualizarExibicao()
  }
}

function limparNovo() {
  if (previewNovo.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewNovo.value)
  }
  fileNovo.value = null
  previewNovo.value = null
}

watch(
  () => props.abrirEditorWallpaper,
  (aberto) => {
    if (aberto) {
      limparNovo()
      carregarAtual()
    }
  },
)

function selecionarFoto(evento) {
  const file = evento.target.files[0]
  if (!file) return
  limparNovo()
  fileNovo.value = file
  previewNovo.value = URL.createObjectURL(file)
  atualizarExibicao()
}

async function salvar() {
  if (!fileNovo.value) {
    alert('Escolha uma imagem primeiro.')
    return
  }

  const form = new FormData()
  form.append('arquivo', fileNovo.value)

  salvando.value = true
  try {
    const res = await apiFetch('/upload/home', { method: 'POST', body: form })
    console.log('Upload respondeu:', res)
    await carregarAtual()
    limparNovo()
    emit('saved')
    fechar()
  } catch (erro) {
    console.error('Erro no upload:', erro)
    alert('Erro no upload: ' + erro.message)
  } finally {
    salvando.value = false
    if (inputArquivo.value) inputArquivo.value.value = ''
  }
}

function fechar() {
  limparNovo()
  emit('close')
}
</script>

<template>
  <div v-if="abrirEditorWallpaper" class="modal-overlay">
    <div class="modal-conteudo">
      <h2 class="modal-titulo">Imagem Principal do Site</h2>
      <p class="modal-subtitulo">Essa imagem aparece no topo da página inicial.</p>

      <div class="preview-wrapper">
        <img v-if="imagemExibida" :src="imagemExibida" class="preview-home" alt="Wallpaper atual" @error="(e) => console.error('Falha ao carregar imagem:', e.target.src)" />
        <div v-else class="preview-vazio">
          <i class="fa-solid fa-image"></i>
          <span>Sem imagem cadastrada</span>
        </div>
      </div>

      <input ref="inputArquivo" type="file" accept="image/jpeg,image/png,image/webp" class="input-escondido" @change="selecionarFoto" />
      <button type="button" class="btn-escolher-foto" :disabled="salvando" @click="inputArquivo.click()">
        <i class="fa-solid fa-camera"></i>
        {{ imagemExibida ? 'Trocar imagem' : 'Escolher imagem' }}
      </button>

      <div class="modal-acoes">
        <button type="button" class="btn-cancelar" :disabled="salvando" @click="fechar">Cancelar</button>
        <button type="button" class="btn-salvar" :disabled="!fileNovo || salvando" @click="salvar">
          {{ salvando ? 'Salvando...' : 'Salvar' }}
        </button>
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
  padding: 3.5rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(60rem, 90%);
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
}

.modal-titulo {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 500;
  text-align: center;
}

.modal-subtitulo {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
  text-align: center;
  margin-top: -0.8rem;
}

.preview-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid var(--kp-gold);
  background: var(--kp-vinho-low);
}

.preview-home {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-vazio {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
}

.preview-vazio i {
  font-size: 3rem;
  opacity: 0.5;
}

.input-escondido {
  display: none;
}

.btn-escolher-foto {
  align-self: center;
  padding: 1.1rem 2.4rem;
  border: 1px solid var(--kp-gold);
  border-radius: 99rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: background 0.2s;
}
.btn-escolher-foto:hover:not(:disabled) {
  background: #7a2632;
}
.btn-escolher-foto:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-acoes {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.4rem;
}

.btn-cancelar,
.btn-salvar {
  padding: 1rem 2.8rem;
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
.btn-cancelar:hover:not(:disabled) {
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
.btn-salvar:disabled,
.btn-cancelar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
