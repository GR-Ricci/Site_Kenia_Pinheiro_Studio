<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ abrirCadastro: Boolean })
const emit = defineEmits(['fechar'])

const categorias = ref([])
const servicos = ref([])
const carregando = ref(false)

// ESTA É A CORREÇÃO: A versão só muda quando os dados são carregados do banco!
const versaoImagem = ref(Date.now())

const novaCategoria = ref('')
const editandoCat = ref(null)
const editCatNome = ref('')
const editCatAtivo = ref(true)
const editandoServ = ref(null)

const servicosPorCategoria = computed(() => {
  const mapa = {}
  for (const s of servicos.value) {
    if (!mapa[s.id_categoria]) mapa[s.id_categoria] = []
    mapa[s.id_categoria].push(s)
  }
  return mapa
})

async function carregarDados() {
  carregando.value = true
  try {
    const [cats, servs] = await Promise.all([apiFetch('/categorias'), apiFetch('/servicos')])
    categorias.value = cats
    servicos.value = servs
    // Atualiza a versão APENAS quando o back retorna os dados novos
    versaoImagem.value = Date.now()
  } catch (e) {
    console.error('Erro ao carregar:', e)
  } finally {
    carregando.value = false
  }
}
onMounted(() => {
  if (props.abrirCadastro) carregarDados()
})
watch(
  () => props.abrirCadastro,
  (aberto) => {
    if (aberto) {
      resetar()
      carregarDados()
    }
  },
)

function resetar() {
  novaCategoria.value = ''
  editandoCat.value = null
  cancelarEdicaoServ()
}

// A função agora usa a versão estável. Sem loop infinito.
function urlImagem(nome) {
  if (!nome) return null
  if (nome.startsWith('http') || nome.startsWith('blob:')) return nome
  return `${import.meta.env.VITE_API_URL}/upload/servico/${nome}?v=${versaoImagem.value}`
}

async function criarCategoria() {
  if (!novaCategoria.value.trim()) return
  try {
    await apiFetch('/categorias', {
      method: 'POST',
      body: JSON.stringify({ nome: novaCategoria.value.trim() }),
    })
    novaCategoria.value = ''
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

function iniciarEdicaoCat(c) {
  editandoCat.value = c.id
  editCatNome.value = c.nome
  editCatAtivo.value = c.ativo
  cancelarEdicaoServ()
}

function cancelarEdicaoCat() {
  editandoCat.value = null
}

async function salvarEdicaoCat() {
  try {
    await apiFetch(`/categorias/${editandoCat.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: editCatNome.value.trim(),
        ativo: editCatAtivo.value,
      }),
    })
    editandoCat.value = null
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

async function deletarCategoria(c) {
  try {
    const impacto = await apiFetch(`/categorias/${c.id}/impacto-delete`)
    let ok
    if (impacto.pode_deletar) {
      ok = confirm(`Deletar "${c.nome}"?`)
    } else {
      ok = confirm(`⚠️ "${c.nome}" tem ${impacto.profissionais_afetadas} profissional(is) vinculada(s).\n\n` + `Serviços: ${impacto.servicos_afetados} | Subserviços: ${impacto.subservicos_afetados}\n\n` + `Você vai apagar: preços, durações, fotos, agendamentos.\n\n` + `Recomendado: DESATIVE em vez de apagar.\n\nContinuar?`)
    }
    if (!ok) return
    const url = impacto.pode_deletar ? `/categorias/${c.id}` : `/categorias/${c.id}?force=true`
    await apiFetch(url, { method: 'DELETE' })
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

function iniciarNovoServico(idCategoria) {
  cancelarEdicaoCat()
  cancelarEdicaoServ()
  editandoServ.value = {
    id: null,
    id_categoria: idCategoria,
    nome: '',
    ativo: true,
    imagem_url: null,
    file: null,
    preview: null,
  }
}

function iniciarEdicaoServ(s) {
  cancelarEdicaoCat()
  cancelarEdicaoServ()
  editandoServ.value = {
    id: s.id,
    id_categoria: s.id_categoria,
    nome: s.nome,
    ativo: s.ativo,
    imagem_url: s.imagem_url,
    file: null,
    preview: s.imagem_url ? urlImagem(s.imagem_url) : null,
  }
}

function cancelarEdicaoServ() {
  if (editandoServ.value?.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(editandoServ.value.preview)
  }
  editandoServ.value = null
}

function selecionarFoto(e) {
  const file = e.target.files[0]
  if (!file || !editandoServ.value) return
  if (editandoServ.value.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(editandoServ.value.preview)
  }
  editandoServ.value.file = file
  editandoServ.value.preview = URL.createObjectURL(file)
  e.target.value = ''
}

async function salvarEdicaoServ() {
  const e = editandoServ.value
  if (!e) return
  try {
    let imagem_url = e.imagem_url
    if (e.file) {
      const form = new FormData()
      form.append('arquivo', e.file)
      const res = await apiFetch('/upload/servico', { method: 'POST', body: form })
      imagem_url = res.imagem_url
    }

    if (e.id === null) {
      await apiFetch('/servicos', {
        method: 'POST',
        body: JSON.stringify({
          nome: e.nome.trim(),
          id_categoria: e.id_categoria,
          imagem_url,
        }),
      })
    } else {
      await apiFetch(`/servicos/${e.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nome: e.nome.trim(),
          id_categoria: e.id_categoria,
          imagem_url,
          ativo: e.ativo,
        }),
      })
    }

    cancelarEdicaoServ()
    await carregarDados()
  } catch (err) {
    alert('Erro no salvamento: ' + err.message)
    console.error(err)
  }
}

async function deletarServico(s) {
  try {
    const impacto = await apiFetch(`/servicos/${s.id}/impacto-delete`)
    let ok
    if (impacto.pode_deletar) {
      ok = confirm(`Deletar "${s.nome}"?`)
    } else {
      ok = confirm(`⚠️ "${s.nome}" tem ${impacto.profissionais_afetadas} profissional(is) vinculada(s).\n\n` + `Subserviços: ${impacto.subservicos_afetados}\n\n` + `Você vai apagar: preços, durações, fotos, agendamentos.\n\n` + `Recomendado: DESATIVE em vez de apagar.\n\nContinuar?`)
    }
    if (!ok) return
    const url = impacto.pode_deletar ? `/servicos/${s.id}` : `/servicos/${s.id}?force=true`
    await apiFetch(url, { method: 'DELETE' })
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
  <div v-if="abrirCadastro" class="modal-overlay">
    <div class="modal-conteudo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Categorias e Serviços</h2>
          <p class="modal-subtitulo">Crie categorias, adicione serviços e edite tudo num lugar só.</p>
        </div>
        <button @click="fechar" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <div class="add-cat-row">
          <input type="text" v-model="novaCategoria" placeholder="Nova categoria (ex: Cabelos)" @keydown.enter.prevent="criarCategoria" />
          <button type="button" class="btn-adicionar" @click="criarCategoria">+ Adicionar Categoria</button>
        </div>

        <p v-if="carregando" class="empty-text">Carregando...</p>
        <p v-else-if="categorias.length === 0" class="empty-text">Nenhuma categoria cadastrada.</p>

        <div v-else class="categorias-lista">
          <section v-for="cat in categorias" :key="cat.id" class="cat-section" :class="{ inativa: !cat.ativo }">
            <div class="cat-header">
              <template v-if="editandoCat === cat.id">
                <input type="text" v-model="editCatNome" class="edit-input" />
                <label class="toggle-ativo">
                  <input type="checkbox" v-model="editCatAtivo" />
                  Ativo
                </label>
                <button class="btn-small btn-save" @click="salvarEdicaoCat">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn-small btn-cancel" @click="cancelarEdicaoCat">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </template>
              <template v-else>
                <h3 class="cat-titulo">
                  {{ cat.nome }}
                  <span v-if="!cat.ativo" class="badge-inativo">Desativada</span>
                </h3>
                <div class="acoes">
                  <button class="btn-small btn-edit" @click="iniciarEdicaoCat(cat)">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-small btn-delete" @click="deletarCategoria(cat)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </template>
            </div>

            <div class="servicos-lista">
              <template v-for="serv in servicosPorCategoria[cat.id] || []" :key="serv.id">
                <div v-if="!(editandoServ && editandoServ.id === serv.id)" class="serv-row" :class="{ inativo: !serv.ativo }">
                  <div class="serv-foto-mini">
                    <img v-if="serv.imagem_url" :src="urlImagem(serv.imagem_url)" alt="" />
                    <div v-else class="serv-foto-vazia">
                      <i class="fa-solid fa-image"></i>
                    </div>
                  </div>
                  <span class="serv-nome">
                    {{ serv.nome }}
                    <span v-if="!serv.ativo" class="badge-inativo">Desativado</span>
                  </span>
                  <div class="acoes">
                    <button class="btn-small btn-edit" @click="iniciarEdicaoServ(serv)">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-small btn-delete" @click="deletarServico(serv)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </template>

              <div v-if="editandoServ && editandoServ.id_categoria === cat.id" class="serv-edit-form">
                <div class="serv-edit-foto">
                  <label class="btn-escolher-foto">
                    <i class="fa-solid fa-camera"></i>
                    {{ editandoServ.preview ? 'Trocar foto' : 'Escolher foto' }}
                    <input type="file" accept="image/*" class="input-escondido" @change="selecionarFoto" />
                  </label>

                  <img v-if="editandoServ.preview" :src="editandoServ.preview" class="preview-foto" />
                  <div v-else class="preview-foto preview-vazio">Sem foto</div>
                </div>

                <div class="serv-edit-campos">
                  <label class="campo">
                    <span>Nome do Serviço</span>
                    <input type="text" v-model="editandoServ.nome" />
                  </label>
                  <label v-if="editandoServ.id !== null" class="toggle-ativo">
                    <input type="checkbox" v-model="editandoServ.ativo" />
                    Ativo
                  </label>
                </div>

                <div class="serv-edit-acoes">
                  <button type="button" class="btn-cancelar" @click="cancelarEdicaoServ">Cancelar</button>
                  <button type="button" class="btn-salvar" @click="salvarEdicaoServ">
                    {{ editandoServ.id === null ? 'Criar' : 'Salvar' }}
                  </button>
                </div>
              </div>

              <p v-if="(servicosPorCategoria[cat.id] || []).length === 0 && !(editandoServ && editandoServ.id_categoria === cat.id)" class="servicos-vazio">Nenhum serviço cadastrado nesta categoria.</p>

              <button v-if="!editandoServ" type="button" class="btn-add-serv" @click="iniciarNovoServico(cat.id)">+ Adicionar serviço em "{{ cat.nome }}"</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mantenha o seu CSS original intacto aqui */
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
  padding: 2rem 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
.add-cat-row {
  display: flex;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--kp-mahogany);
  padding: 0.5rem 0 1rem 0;
}
.add-cat-row input {
  flex: 1;
  padding: 1.1rem 1.3rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-size: 1.4rem;
  outline: none;
}
.add-cat-row input:focus {
  border-color: var(--kp-gold);
}
.btn-adicionar {
  padding: 1rem 1.8rem;
  border-radius: 99rem;
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: none;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}
.btn-adicionar:hover {
  background: var(--kp-creme);
}
.categorias-lista {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.cat-section {
  background: rgba(245, 235, 221, 0.04);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
  padding: 1.5rem;
}
.cat-section.inativa {
  opacity: 0.6;
}
.cat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(201, 166, 107, 0.15);
  margin-bottom: 1rem;
}
.cat-titulo {
  flex: 1;
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.servicos-lista {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-left: 1rem;
}
.serv-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(201, 166, 107, 0.15);
  border-radius: 0.6rem;
}
.serv-row.inativo {
  opacity: 0.55;
  border-style: dashed;
}
.serv-foto-mini {
  flex-shrink: 0;
}
.serv-foto-mini img,
.serv-foto-vazia {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.5rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold-border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.serv-foto-vazia {
  background: var(--kp-vinho-low);
  color: var(--kp-creme-low);
  font-size: 1.4rem;
}
.serv-nome {
  flex: 1;
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.servicos-vazio {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-style: italic;
  padding: 0.6rem 0;
}
.btn-add-serv {
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px dashed var(--kp-gold-border);
  color: var(--kp-gold);
  border-radius: 0.6rem;
  font-family: var(--font-body);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add-serv:hover {
  background: rgba(201, 166, 107, 0.1);
  border-style: solid;
}
.serv-edit-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  padding: 1.2rem;
  background: rgba(201, 166, 107, 0.08);
  border: 1px solid var(--kp-gold);
  border-radius: 0.6rem;
  align-items: flex-start;
}
.serv-edit-foto {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 10rem;
  flex-shrink: 0;
}
.preview-foto,
.preview-vazio {
  width: 10rem;
  height: 10rem;
  border-radius: 0.6rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold);
}
.preview-vazio {
  background: var(--kp-vinho-low);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kp-creme-low);
  font-size: 1.1rem;
}
.btn-escolher-foto {
  padding: 0.7rem 1rem;
  border: 1px solid var(--kp-gold);
  border-radius: 0.6rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
}
.btn-escolher-foto:hover {
  background: #7a2632;
}
.serv-edit-campos {
  flex: 1;
  min-width: 15rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.serv-edit-acoes {
  display: flex;
  gap: 0.8rem;
  align-self: flex-end;
  margin-left: auto;
}
.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.campo > span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.2rem;
}
.campo input[type='text'] {
  width: 100%;
  padding: 0.9rem 1.1rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.6rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-size: 1.3rem;
  outline: none;
}
.campo input[type='text']:focus {
  border-color: var(--kp-gold);
}
.toggle-ativo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.2rem;
  cursor: pointer;
  white-space: nowrap;
}
.toggle-ativo input {
  width: 1.6rem;
  height: 1.6rem;
  cursor: pointer;
}
.edit-input {
  flex: 1;
  padding: 0.8rem 1.1rem;
  border: 1px solid var(--kp-gold);
  border-radius: 0.6rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-size: 1.3rem;
  outline: none;
}
.badge-inativo {
  padding: 0.15rem 0.6rem;
  background: rgba(255, 77, 77, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 77, 77, 0.4);
  border-radius: 99rem;
  font-size: 0.95rem;
  font-weight: bold;
  text-transform: uppercase;
}
.acoes {
  display: flex;
  gap: 0.5rem;
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
.btn-edit:hover {
  background: #7a2632;
}
.btn-delete {
  background: #8a2a2a;
  color: var(--kp-creme);
}
.btn-delete:hover {
  background: #a33636;
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
.btn-cancelar,
.btn-salvar {
  padding: 0.8rem 1.6rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.2rem;
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
.btn-salvar:hover {
  background: var(--kp-creme);
}
.input-escondido {
  display: none;
}
.empty-text {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
  text-align: center;
  padding: 2rem 0;
  font-style: italic;
}
@media (max-width: 768px) {
  .modal-conteudo {
    width: 95%;
  }
  .modal-body {
    padding: 1.8rem;
  }
  .serv-edit-form {
    flex-direction: column;
  }
  .serv-edit-foto {
    width: 100%;
  }
  .serv-edit-acoes {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
