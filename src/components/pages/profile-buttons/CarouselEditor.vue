<script setup>
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({
  editarCarrossel: Boolean,
})
const emit = defineEmits(['fechar'])

const fotos = ref([])
const categorias = ref([])
const carregando = ref(false)

// Adicionar
const fileFoto = ref(null)
const previewFoto = ref(null)
const inputFotoRef = ref(null)
const idCategoriaNova = ref(null)

// Editar
const fotoEditando = ref(null)
const editCategoriaId = ref(null)

async function carregarDados() {
  carregando.value = true
  try {
    const [f, c] = await Promise.all([apiFetch('/carrossel'), apiFetch('/categorias')])
    fotos.value = f
    categorias.value = c
  } catch (e) {
    console.error('Erro ao carregar:', e)
  } finally {
    carregando.value = false
  }
}
onMounted(() => {
  if (props.editarCarrossel) carregarDados()
})
watch(
  () => props.editarCarrossel,
  (aberto) => {
    if (aberto) {
      resetar()
      carregarDados()
    }
  },
)

function urlImagem(imagem_url) {
  if (!imagem_url) return null
  if (imagem_url.startsWith('http')) return imagem_url
  return `${import.meta.env.VITE_API_URL}/upload/carrossel/${imagem_url}`
}

function resetar() {
  if (previewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(previewFoto.value)
  fileFoto.value = null
  previewFoto.value = null
  idCategoriaNova.value = null
  if (inputFotoRef.value) inputFotoRef.value.value = ''
  fotoEditando.value = null
  editCategoriaId.value = null
}

function selecionarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (previewFoto.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewFoto.value)
  }
  fileFoto.value = file
  previewFoto.value = URL.createObjectURL(file)
}

async function adicionar() {
  if (!fileFoto.value) {
    alert('Escolha uma foto.')
    return
  }
  if (!idCategoriaNova.value) {
    alert('Escolha uma categoria.')
    return
  }
  try {
    const form = new FormData()
    form.append('arquivo', fileFoto.value)
    const res = await apiFetch('/upload/carrossel', { method: 'POST', body: form })

    await apiFetch('/carrossel', {
      method: 'POST',
      body: JSON.stringify({
        imagem_url: res.imagem_url,
        id_categoria: idCategoriaNova.value,
      }),
    })
    resetar()
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

function abrirEdicao(f) {
  fotoEditando.value = { ...f }
  editCategoriaId.value = f.id_categoria
}

function fecharEdicao() {
  fotoEditando.value = null
  editCategoriaId.value = null
}

async function salvarEdicao() {
  if (!fotoEditando.value) return
  try {
    await apiFetch(`/carrossel/${fotoEditando.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({ id_categoria: editCategoriaId.value }),
    })
    fecharEdicao()
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

async function deletarFoto() {
  if (!fotoEditando.value) return
  if (!confirm('Deletar esta foto do carrossel?')) return
  try {
    await apiFetch(`/carrossel/${fotoEditando.value.id}`, { method: 'DELETE' })
    fecharEdicao()
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

function fechar() {
  resetar()
  emit('fechar')
}
</script>

<template>
  <div v-if="editarCarrossel" class="modal-overlay">
    <div class="modal-conteudo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Carrossel</h2>
          <p class="modal-subtitulo">Fotos que aparecem no carrossel principal do site.</p>
        </div>
        <button @click="fechar" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <!-- Adicionar -->
        <section class="add-section">
          <h3 class="section-subtitle">Adicionar nova foto</h3>

          <div class="add-grid">
            <div class="add-foto-col">
              <input ref="inputFotoRef" type="file" accept="image/*" class="input-escondido" @change="selecionarFoto" />
              <button type="button" class="btn-escolher-foto" @click="inputFotoRef.click()"><i class="fa-solid fa-camera"></i> Escolher Foto</button>
              <div v-if="!previewFoto" class="preview-vazio">Sem foto</div>
              <img v-else :src="previewFoto" class="preview-foto" />
            </div>

            <div class="add-form-col">
              <label class="campo">
                <span>Categoria</span>
                <select v-model.number="idCategoriaNova">
                  <option :value="null" disabled>Selecione uma categoria...</option>
                  <option v-for="c in categorias" :key="c.id" :value="c.id">
                    {{ c.nome }}
                  </option>
                </select>
              </label>

              <button type="button" class="btn-salvar" @click="adicionar">Adicionar ao Carrossel</button>
            </div>
          </div>
        </section>

        <!-- Lista -->
        <section class="lista-section">
          <h3 class="section-subtitle">Fotos no Carrossel</h3>

          <p v-if="carregando" class="empty-text">Carregando...</p>
          <p v-else-if="fotos.length === 0" class="empty-text">Nenhuma foto no carrossel ainda.</p>

          <div v-else class="carrossel-grid">
            <div v-for="foto in fotos" :key="foto.id" class="foto-card" @click="abrirEdicao(foto)">
              <img :src="urlImagem(foto.imagem_url)" alt="" class="foto-img" />
              <div class="foto-overlay">
                <span class="foto-categoria">{{ foto.nome_categoria }}</span>
                <i class="fa-solid fa-pen"></i>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <!-- Modal editar -->
  <div v-if="fotoEditando" class="modal-overlay nested" @click.self="fecharEdicao">
    <div class="modal-conteudo modal-edit">
      <header class="modal-header">
        <h2 class="modal-titulo">Editar Foto</h2>
        <button @click="fecharEdicao" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <img :src="urlImagem(fotoEditando.imagem_url)" alt="" class="edit-foto" />

        <label class="campo">
          <span>Categoria</span>
          <select v-model.number="editCategoriaId">
            <option v-for="c in categorias" :key="c.id" :value="c.id">
              {{ c.nome }}
            </option>
          </select>
        </label>

        <div class="modal-acoes">
          <button type="button" class="btn-deletar" @click="deletarFoto"><i class="fa-solid fa-trash"></i> Excluir Foto</button>
          <div class="acoes-direita">
            <button type="button" class="btn-cancelar" @click="fecharEdicao">Cancelar</button>
            <button type="button" class="btn-salvar" @click="salvarEdicao">Salvar</button>
          </div>
        </div>
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
  width: min(85rem, 95%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
}
.modal-conteudo.modal-edit {
  width: min(55rem, 90%);
  max-height: 90vh;
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
  transition: opacity 0.2s;
}
.btn-fechar:hover {
  opacity: 0.7;
}

.modal-body {
  padding: 2.5rem 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* ================= ADICIONAR ================= */
.add-section {
  background: rgba(0, 0, 0, 0.15);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px dashed var(--kp-gold-border);
}
.section-subtitle {
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: 1.9rem;
  margin-bottom: 1.5rem;
}

.add-grid {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.add-foto-col {
  width: 16rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.add-form-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Vertical previews: aspect-ratio 3/4 */
.preview-foto,
.preview-vazio {
  width: 16rem;
  aspect-ratio: 3 / 4;
  border-radius: 0.8rem;
  border: 1px solid var(--kp-gold);
  object-fit: cover;
}
.preview-vazio {
  background: var(--kp-vinho-low);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kp-creme-low);
  font-size: 1.2rem;
}

.btn-escolher-foto {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--kp-gold);
  border-radius: 0.8rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}
.btn-escolher-foto:hover {
  background: #7a2632;
}
.input-escondido {
  display: none;
}

/* ================= CAMPOS ================= */
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
.campo select {
  width: 100%;
  padding: 1.1rem 1.3rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.4rem;
  cursor: pointer;
  outline: none;
}
.campo select:focus {
  border-color: var(--kp-gold);
}

.btn-salvar {
  padding: 1.1rem 2rem;
  border-radius: 99rem;
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: none;
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
}
.btn-salvar:hover {
  background: var(--kp-creme);
}

/* ================= LISTA DE FOTOS ================= */
.carrossel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.2rem;
}

.foto-card {
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid var(--kp-gold-border);
  cursor: pointer;
  transition: transform 0.2s;
}
.foto-card:hover {
  transform: translateY(-2px);
}
.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.foto-card:hover .foto-img {
  transform: scale(1.05);
}

.foto-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(30, 18, 10, 0.85) 0%, rgba(30, 18, 10, 0) 50%);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  color: var(--kp-gold);
}
.foto-card:hover .foto-overlay {
  opacity: 1;
}
.foto-categoria {
  font-family: var(--font-body);
  font-size: 1.2rem;
  background: rgba(201, 166, 107, 0.25);
  padding: 0.3rem 0.8rem;
  border-radius: 99rem;
  align-self: flex-start;
  border: 1px solid var(--kp-gold);
  color: var(--kp-creme);
  margin-bottom: 0.5rem;
}
.foto-overlay i {
  font-size: 1.4rem;
  align-self: flex-end;
}

/* ================= MODAL EDITAR ================= */
.edit-foto {
  width: 100%;
  max-height: 50rem;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 0.8rem;
  border: 1px solid var(--kp-gold-border);
  align-self: center;
  margin-bottom: 0.5rem;
}

.modal-acoes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
  padding-top: 1.5rem;
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
  padding: 1rem 1.8rem;
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
  padding: 1rem 2rem;
  border-radius: 99rem;
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-cancelar:hover {
  background: rgba(245, 235, 221, 0.1);
}

.empty-text {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
  text-align: center;
  padding: 2rem 0;
  font-style: italic;
}

/* ================= RESPONSIVO ================= */
@media (max-width: 768px) {
  .modal-conteudo {
    width: 95%;
  }
  .modal-body {
    padding: 1.8rem;
  }
  .add-grid {
    flex-direction: column;
    align-items: stretch;
  }
  .add-foto-col {
    width: 100%;
    align-items: center;
  }
  .preview-foto,
  .preview-vazio {
    width: 14rem;
  }
  .modal-acoes {
    flex-direction: column-reverse;
  }
  .btn-deletar,
  .acoes-direita {
    width: 100%;
  }
  .acoes-direita {
    flex-direction: column;
  }
  .btn-deletar,
  .btn-cancelar,
  .btn-salvar {
    justify-content: center;
  }
}
</style>
