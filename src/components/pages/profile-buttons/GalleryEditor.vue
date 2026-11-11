<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ abrirGaleria: Boolean })
const emit = defineEmits(['fechar'])

// --- Dados do banco ---
const tagsDisponiveis = ref([])
const fotos = ref([])

// --- Adicionar foto ---
const fileFoto = ref(null)
const previewFoto = ref(null)
const inputFotoRef = ref(null)
const inputTagRef = ref(null)
const inputTag = ref('')
const listaTagsAberta = ref(false)
const tagsSelecionadas = ref([])

// --- Edição de foto ---
const fotoEmEdicao = ref(null)
const inputTagEditRef = ref(null)
const inputTagEdit = ref('')
const listaTagsEditAberta = ref(false)

// --- Gerenciar tags (global) ---
const gerenciarTagsAberto = ref(false)
const tagEmEdicao = ref(null)
const nomeTagEdicao = ref('')

// --- Carregar dados ---
async function carregarDados() {
  try {
    const [tags, fotosData] = await Promise.all([apiFetch('/tags'), apiFetch('/galeria')])
    tagsDisponiveis.value = tags
    fotos.value = fotosData
  } catch (e) {
    console.error('Erro ao carregar galeria:', e)
  }
}
onMounted(carregarDados)
watch(
  () => props.abrirGaleria,
  (aberto) => {
    if (aberto) carregarDados()
  },
)

// --- Filtros dos dropdowns ---
const tagsFiltradas = computed(() => {
  const termo = inputTag.value.trim().toLowerCase()
  return tagsDisponiveis.value.filter((t) => {
    if (tagsSelecionadas.value.find((s) => s.id === t.id)) return false
    if (!termo) return true
    return t.nome.toLowerCase().includes(termo)
  })
})

const podeCriarTag = computed(() => {
  const termo = inputTag.value.trim().toLowerCase()
  if (!termo) return false
  return !tagsDisponiveis.value.some((t) => t.nome.toLowerCase() === termo)
})

const tagsEditFiltradas = computed(() => {
  if (!fotoEmEdicao.value) return []
  const termo = inputTagEdit.value.trim().toLowerCase()
  return tagsDisponiveis.value.filter((t) => {
    if (fotoEmEdicao.value.tags.find((s) => s.id === t.id)) return false
    if (!termo) return true
    return t.nome.toLowerCase().includes(termo)
  })
})

const podeCriarTagEdit = computed(() => {
  const termo = inputTagEdit.value.trim().toLowerCase()
  if (!termo) return false
  return !tagsDisponiveis.value.some((t) => t.nome.toLowerCase() === termo)
})

// --- Upload ---
function selecionarFoto(evento) {
  const file = evento.target.files[0]
  if (!file) return
  if (previewFoto.value) URL.revokeObjectURL(previewFoto.value)
  fileFoto.value = file
  previewFoto.value = URL.createObjectURL(file)
}

// --- Dropdown (adicionar) ---
function abrirListaTags() {
  listaTagsAberta.value = true
}

function adicionarTag(tag) {
  if (!tagsSelecionadas.value.find((t) => t.id === tag.id)) {
    tagsSelecionadas.value.push(tag)
  }
  inputTag.value = ''
  // NÃO fecha a lista — corrige o bug de precisar clicar fora e voltar
}

async function criarNovaTag() {
  const nome = inputTag.value.trim()
  if (!nome) return
  try {
    const nova = await apiFetch('/tags', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    })
    tagsDisponiveis.value.push(nova)
    tagsDisponiveis.value.sort((a, b) => a.nome.localeCompare(b.nome))
    tagsSelecionadas.value.push(nova)
    inputTag.value = ''
  } catch (e) {
    // Se já existia, recarrega e tenta achar
    await carregarDados()
    const existente = tagsDisponiveis.value.find((t) => t.nome.toLowerCase() === nome.toLowerCase())
    if (existente) {
      tagsSelecionadas.value.push(existente)
      inputTag.value = ''
    } else {
      alert('Erro ao criar tag: ' + e.message)
    }
  }
}

function removerTag(index) {
  tagsSelecionadas.value.splice(index, 1)
}

// --- Adicionar à galeria ---
async function adicionarFoto() {
  if (!fileFoto.value) {
    alert('Escolha uma foto.')
    return
  }
  try {
    const form = new FormData()
    form.append('arquivo', fileFoto.value)
    const res = await apiFetch('/upload/galeria', { method: 'POST', body: form })

    await apiFetch('/galeria', {
      method: 'POST',
      body: JSON.stringify({
        imagem_url: res.imagem_url,
        id_tags: tagsSelecionadas.value.map((t) => t.id),
      }),
    })

    alert('Foto adicionada!')
    await carregarDados()
    resetarFormulario()
  } catch (e) {
    alert('Erro ao adicionar: ' + e.message)
  }
}

function resetarFormulario() {
  if (previewFoto.value) URL.revokeObjectURL(previewFoto.value)
  fileFoto.value = null
  previewFoto.value = null
  tagsSelecionadas.value = []
  inputTag.value = ''
  listaTagsAberta.value = false
  if (inputFotoRef.value) inputFotoRef.value.value = ''
}

// --- Edição de foto ---
function abrirEdicao(foto) {
  fotoEmEdicao.value = {
    id: foto.id,
    imagem_url: foto.imagem_url,
    tags: foto.tags.map((t) => ({ ...t })),
  }
  inputTagEdit.value = ''
  listaTagsEditAberta.value = false
}

function fecharEdicao() {
  fotoEmEdicao.value = null
  inputTagEdit.value = ''
  listaTagsEditAberta.value = false
}

function abrirListaTagsEdit() {
  listaTagsEditAberta.value = true
}

function adicionarTagEdit(tag) {
  if (!fotoEmEdicao.value.tags.find((t) => t.id === tag.id)) {
    fotoEmEdicao.value.tags.push(tag)
  }
  inputTagEdit.value = ''
}

async function criarNovaTagEdit() {
  const nome = inputTagEdit.value.trim()
  if (!nome) return
  try {
    const nova = await apiFetch('/tags', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    })
    tagsDisponiveis.value.push(nova)
    tagsDisponiveis.value.sort((a, b) => a.nome.localeCompare(b.nome))
    fotoEmEdicao.value.tags.push(nova)
    inputTagEdit.value = ''
  } catch (e) {
    await carregarDados()
    const existente = tagsDisponiveis.value.find((t) => t.nome.toLowerCase() === nome.toLowerCase())
    if (existente) {
      fotoEmEdicao.value.tags.push(existente)
      inputTagEdit.value = ''
    } else {
      alert('Erro ao criar tag: ' + e.message)
    }
  }
}

function removerTagEdit(index) {
  fotoEmEdicao.value.tags.splice(index, 1)
}

async function salvarEdicao() {
  try {
    await apiFetch(`/galeria/${fotoEmEdicao.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id_tags: fotoEmEdicao.value.tags.map((t) => t.id),
      }),
    })
    alert('Foto atualizada!')
    await carregarDados()
    fecharEdicao()
  } catch (e) {
    alert('Erro ao salvar: ' + e.message)
  }
}

async function deletarFoto() {
  if (!confirm('Tem certeza que quer deletar esta foto?')) return
  try {
    await apiFetch(`/galeria/${fotoEmEdicao.value.id}`, { method: 'DELETE' })
    alert('Foto deletada!')
    await carregarDados()
    fecharEdicao()
  } catch (e) {
    alert('Erro ao deletar: ' + e.message)
  }
}

// --- Gerenciar tags (global) ---
function abrirGerenciarTags() {
  gerenciarTagsAberto.value = true
  tagEmEdicao.value = null
  nomeTagEdicao.value = ''
}

function fecharGerenciarTags() {
  gerenciarTagsAberto.value = false
  tagEmEdicao.value = null
  nomeTagEdicao.value = ''
}

function iniciarEdicaoTag(tag) {
  tagEmEdicao.value = { ...tag }
  nomeTagEdicao.value = tag.nome
}

async function salvarTagEdicao() {
  try {
    await apiFetch(`/tags/${tagEmEdicao.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({ nome: nomeTagEdicao.value.trim() }),
    })
    await carregarDados()
    tagEmEdicao.value = null
    nomeTagEdicao.value = ''
  } catch (e) {
    alert('Erro ao renomear: ' + e.message)
  }
}

async function deletarTagGlobal(tag) {
  if (!confirm(`Deletar tag "${tag.nome}"? Ela será removida de todas as fotos.`)) return
  try {
    await apiFetch(`/tags/${tag.id}`, { method: 'DELETE' })
    await carregarDados()
    if (fotoEmEdicao.value) {
      fotoEmEdicao.value.tags = fotoEmEdicao.value.tags.filter((t) => t.id !== tag.id)
    }
  } catch (e) {
    alert('Erro ao deletar: ' + e.message)
  }
}

// --- Helpers ---
function fotosDaTag(tag) {
  return fotos.value.filter((f) => f.tags.some((t) => t.id === tag.id))
}

function urlCompleta(imagem_url) {
  return `${import.meta.env.VITE_API_URL}/upload/galeria/${imagem_url}`
}

function fecharModal() {
  resetarFormulario()
  fecharEdicao()
  fecharGerenciarTags()
  emit('fechar')
}
</script>

<template>
  <!-- Modal principal -->
  <div v-if="abrirGaleria" class="modal-overlay">
    <div class="modal-conteudo modal-largo">
      <header class="modal-header">
        <h2 class="modal-titulo">Gerenciar Galeria</h2>
        <div class="header-actions">
          <button @click="abrirGerenciarTags" class="btn-gerenciar-tags"><i class="fa-solid fa-tags"></i> Gerenciar Tags</button>
          <button @click="fecharModal" class="btn-fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </header>

      <div class="modal-body">
        <!-- ADICIONAR FOTO -->
        <section class="add-photo-section">
          <h3 class="section-subtitle">Adicionar nova foto</h3>

          <div class="form-split">
            <div class="form-col">
              <label class="campo">
                <input ref="inputFotoRef" type="file" accept="image/*" class="input-escondido" @change="selecionarFoto" />
                <button type="button" class="btn-escolher-foto" @click="inputFotoRef.click()"><i class="fa-solid fa-camera"></i> Escolher Foto</button>
                <div v-if="!previewFoto" class="preview-foto preview-vazio">Sem foto</div>
                <img v-else :src="previewFoto" class="preview-foto" />
              </label>
            </div>

            <div class="form-col">
              <label class="campo">
                <span>Tags da Foto</span>
                <div class="relative-container">
                  <input ref="inputTagRef" type="text" v-model="inputTag" placeholder="Buscar ou criar tag..." @focus="abrirListaTags" @blur="listaTagsAberta = false" />
                  <ul v-if="listaTagsAberta" class="dropdown-lista">
                    <li v-for="tag in tagsFiltradas" :key="tag.id" @mousedown.prevent="adicionarTag(tag)"># {{ tag.nome }}</li>
                    <li v-if="podeCriarTag" class="dropdown-criar" @mousedown.prevent="criarNovaTag">+ Criar tag "{{ inputTag }}"</li>
                  </ul>
                </div>
              </label>

              <div class="tags-selecionadas" v-if="tagsSelecionadas.length > 0">
                <span v-for="(tag, index) in tagsSelecionadas" :key="tag.id" class="tag-badge">
                  # {{ tag.nome }}
                  <button type="button" @click="removerTag(index)" class="tag-remover">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </span>
              </div>

              <div class="acoes-add">
                <button type="button" class="btn-salvar" @click="adicionarFoto">Adicionar à Galeria</button>
              </div>
            </div>
          </div>
        </section>

        <!-- LISTAGEM DE FOTOS -->
        <div class="gallery-list">
          <section v-for="tag in tagsDisponiveis" :key="tag.id" class="tag-section">
            <div class="tag-header">
              <h3 class="tag-title"># {{ tag.nome }}</h3>
              <span class="tag-count">{{ fotosDaTag(tag).length }} fotos</span>
            </div>

            <div class="photo-grid" v-if="fotosDaTag(tag).length > 0">
              <div v-for="foto in fotosDaTag(tag)" :key="foto.id" class="photo-card" @click="abrirEdicao(foto)">
                <img :src="urlCompleta(foto.imagem_url)" alt="Trabalho" class="photo-image" />
                <div class="photo-overlay"><i class="fa-solid fa-pen"></i></div>
              </div>
            </div>

            <p v-else class="empty-text">Nenhuma foto cadastrada com esta tag.</p>
          </section>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: EDITAR FOTO -->
  <div v-if="fotoEmEdicao" class="modal-overlay nested" @click.self="fecharEdicao">
    <div class="modal-conteudo modal-edit">
      <header class="modal-header">
        <h2 class="modal-titulo">Editar Foto</h2>
        <button @click="fecharEdicao" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <div class="edit-content">
          <img :src="urlCompleta(fotoEmEdicao.imagem_url)" class="edit-foto" />

          <div class="edit-tags">
            <label class="campo">
              <span>Tags da Foto</span>
              <div class="relative-container">
                <input ref="inputTagEditRef" type="text" v-model="inputTagEdit" placeholder="Buscar ou criar tag..." @focus="abrirListaTagsEdit" @blur="listaTagsEditAberta = false" />
                <ul v-if="listaTagsEditAberta" class="dropdown-lista">
                  <li v-for="tag in tagsEditFiltradas" :key="tag.id" @mousedown.prevent="adicionarTagEdit(tag)"># {{ tag.nome }}</li>
                  <li v-if="podeCriarTagEdit" class="dropdown-criar" @mousedown.prevent="criarNovaTagEdit">+ Criar tag "{{ inputTagEdit }}"</li>
                </ul>
              </div>
            </label>

            <div class="tags-selecionadas" v-if="fotoEmEdicao.tags.length > 0">
              <span v-for="(tag, index) in fotoEmEdicao.tags" :key="tag.id" class="tag-badge">
                # {{ tag.nome }}
                <button type="button" @click="removerTagEdit(index)" class="tag-remover">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="modal-acoes">
          <button type="button" @click="deletarFoto" class="btn-deletar"><i class="fa-solid fa-trash"></i> Excluir Foto</button>
          <div class="acoes-direita">
            <button type="button" @click="fecharEdicao" class="btn-cancelar">Cancelar</button>
            <button type="button" @click="salvarEdicao" class="btn-salvar">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: GERENCIAR TAGS -->
  <div v-if="gerenciarTagsAberto" class="modal-overlay nested" @click.self="fecharGerenciarTags">
    <div class="modal-conteudo modal-tags">
      <header class="modal-header">
        <h2 class="modal-titulo">Gerenciar Tags</h2>
        <button @click="fecharGerenciarTags" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <div class="tags-list" v-if="tagsDisponiveis.length > 0">
          <div v-for="tag in tagsDisponiveis" :key="tag.id" class="tag-row">
            <template v-if="tagEmEdicao && tagEmEdicao.id === tag.id">
              <input type="text" v-model="nomeTagEdicao" class="tag-edit-input" />
              <button @click="salvarTagEdicao" class="btn-small btn-save">
                <i class="fa-solid fa-check"></i>
              </button>
              <button @click="tagEmEdicao = null" class="btn-small btn-cancel">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </template>
            <template v-else>
              <span class="tag-nome"># {{ tag.nome }}</span>
              <button @click="iniciarEdicaoTag(tag)" class="btn-small btn-edit">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button @click="deletarTagGlobal(tag)" class="btn-small btn-delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </template>
          </div>
        </div>
        <p v-else class="empty-text">Nenhuma tag cadastrada.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================= ESTRUTURA ================= */
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

.modal-overlay.nested {
  z-index: 1100;
  background: rgba(30, 18, 10, 0.92);
}

.modal-conteudo {
  background: var(--kp-mahogany);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(90rem, 95%);
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-conteudo.modal-edit {
  width: min(70rem, 90%);
  height: auto;
  max-height: 90vh;
}

.modal-conteudo.modal-tags {
  width: min(50rem, 90%);
  height: auto;
  max-height: 80vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem 3.5rem;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
}

.modal-titulo {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-gerenciar-tags {
  background: transparent;
  border: 1px solid var(--kp-gold-border);
  color: var(--kp-creme);
  padding: 0.8rem 1.4rem;
  border-radius: 0.6rem;
  font-family: var(--font-body);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s;
}
.btn-gerenciar-tags:hover {
  border-color: var(--kp-gold);
  color: var(--kp-gold);
}

.btn-fechar {
  background: transparent;
  border: none;
  color: var(--kp-gold);
  font-size: 2.4rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-fechar:hover {
  opacity: 0.7;
}

.modal-body {
  padding: 3rem 3.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* ================= ADICIONAR ================= */
.add-photo-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px dashed var(--kp-gold-border);
}

.section-subtitle {
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: 2rem;
}

.form-split {
  display: flex;
  gap: 3rem;
}

.form-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.campo span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
}

.campo input[type='text'] {
  width: 100%;
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-size: 1.4rem;
  outline: none;
}

/* Dropdown */
.relative-container {
  position: relative;
  width: 100%;
}
.dropdown-lista {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0 0 0.8rem 0.8rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
  max-height: 15rem;
  overflow-y: auto;
}
.dropdown-lista li {
  padding: 1rem 1.4rem;
  font-size: 1.3rem;
  color: var(--kp-text);
  cursor: pointer;
}
.dropdown-lista li:hover {
  background: var(--kp-creme);
}
.dropdown-lista li.dropdown-criar {
  color: #7a5c1e;
  font-weight: bold;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
}

/* Badges */
.tags-selecionadas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(245, 235, 221, 0.05);
  border-radius: 0.8rem;
  border: 1px dashed var(--kp-gold-border);
  min-height: 4rem;
}
.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold);
  border-radius: 99rem;
  font-size: 1.2rem;
}
.tag-remover {
  background: none;
  border: none;
  color: var(--kp-gold);
  cursor: pointer;
  font-size: 1.4rem;
}

/* Upload */
.input-escondido {
  display: none;
}
.btn-escolher-foto {
  width: 100%;
  max-width: 25rem;
  padding: 1rem;
  border: 1px solid var(--kp-gold);
  border-radius: 0.8rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-size: 1.3rem;
  cursor: pointer;
}
.preview-foto {
  width: 12rem;
  height: 12rem;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--kp-gold);
  margin-top: 1rem;
}
.preview-vazio {
  background: var(--kp-vinho-low);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kp-creme-low);
}

.acoes-add {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
.btn-salvar {
  padding: 1rem 2.5rem;
  border-radius: 99rem;
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: none;
  font-weight: bold;
  cursor: pointer;
}
.btn-salvar:hover {
  background: var(--kp-creme);
}

/* ================= GALERIA ================= */
.gallery-list {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.tag-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
  padding-bottom: 2rem;
}

.tag-header {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
}
.tag-title {
  font-family: var(--font-display);
  color: var(--kp-gold);
  font-size: 2.4rem;
}
.tag-count {
  font-family: var(--font-body);
  color: var(--kp-creme-low);
  font-size: 1.2rem;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}
.photo-card {
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--kp-gold-border);
  position: relative;
  cursor: pointer;
}
.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 18, 10, 0.75);
  color: var(--kp-gold);
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.photo-card:hover .photo-overlay {
  opacity: 1;
}
.photo-card:hover .photo-image {
  transform: scale(1.05);
}

.empty-text {
  font-family: var(--font-body);
  color: var(--kp-creme-low);
  font-size: 1.3rem;
  font-style: italic;
}

/* ================= EDITAR FOTO ================= */
.edit-content {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
}
.edit-foto {
  width: 35rem;
  height: 30rem;
  object-fit: cover;
  border-radius: 1rem;
  border: 1px solid var(--kp-gold-border);
}
.edit-tags {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ================= AÇÕES ================= */
.modal-acoes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
  padding-top: 2rem;
  margin-top: 1rem;
}
.acoes-direita {
  display: flex;
  gap: 1rem;
}
.btn-deletar {
  background: #8a2a2a;
  color: var(--kp-creme);
  border: 1px solid #a33636;
  padding: 1rem 2rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.btn-deletar:hover {
  background: #a33636;
}
.btn-cancelar {
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
  padding: 1rem 2.5rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-cancelar:hover {
  background: rgba(245, 235, 221, 0.1);
}

/* ================= GERENCIAR TAGS ================= */
.tags-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tag-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.4rem;
  background: rgba(245, 235, 221, 0.05);
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
}
.tag-nome {
  flex: 1;
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.4rem;
}
.tag-edit-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--kp-gold);
  border-radius: 0.6rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-size: 1.3rem;
  outline: none;
}
.btn-small {
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-edit {
  background: var(--kp-vinho);
  color: var(--kp-creme);
}
.btn-delete {
  background: #8a2a2a;
  color: var(--kp-creme);
}
.btn-save {
  background: var(--kp-gold);
  color: var(--kp-vinho);
}
.btn-cancel {
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
}

/* ================= RESPONSIVO ================= */
@media (max-width: 768px) {
  .form-split {
    flex-direction: column;
  }
  .modal-body {
    padding: 2rem;
  }
  .edit-content {
    flex-direction: column;
  }
  .edit-foto {
    width: 100%;
    height: auto;
  }
  .modal-acoes {
    flex-direction: column-reverse;
    gap: 1rem;
  }
  .btn-deletar,
  .acoes-direita {
    width: 100%;
  }
}
</style>
