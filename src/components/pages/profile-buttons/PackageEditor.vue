<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ abrirPacotes: Boolean })
const emit = defineEmits(['fechar'])

// ===== Estado =====
const tipoUsuario = ref('')
const meuIdProfissional = ref(null)

const pacotes = ref([])
const categorias = ref([])
const portfolio = ref([])
const carregando = ref(false)

// ===== Form =====
const pacoteEditando = ref(null)
const buscaSub = ref('')
const listaAberta = ref(false)
const inputFotoRef = ref(null)
const criandoSub = ref(false)

// ===== Computed =====
const categoriaOptions = computed(() => {
  const temPacotes = categorias.value.some(
    (c) => c.nome.toLowerCase() === 'pacotes'
  )
  const base = categorias.value.slice()
  if (!temPacotes) {
    return [{ id: null, nome: 'Pacotes' }, ...base]
  }
  return base
})

const subservicosDisponiveis = computed(() => {
  const jaSelecionados = new Set(
    (pacoteEditando.value?.itens || []).map((i) => i.id_subservico)
  )
  const termo = buscaSub.value.trim().toLowerCase()

  return portfolio.value.filter((s) => {
    if (jaSelecionados.has(s.id_subservico)) return false
    if (termo && !s.nome_subservico.toLowerCase().includes(termo)) return false
    return true
  })
})

const podeCriarNovo = computed(() => {
  const termo = buscaSub.value.trim().toLowerCase()
  if (!termo) return false
  return !portfolio.value.some(
    (s) => s.nome_subservico.toLowerCase() === termo
  )
})

// ===== Helpers =====
function decodificarToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    const payload = JSON.parse(atob(token.split('.')[1]))
    tipoUsuario.value = payload.tipo
    return true
  } catch {
    return false
  }
}

function urlImagem(imagem_url) {
  if (!imagem_url) return null
  if (imagem_url.startsWith('http') || imagem_url.startsWith('blob:')) return imagem_url
  return `${import.meta.env.VITE_API_URL}/upload/pacote/${imagem_url}`
}

// Fallback: se /upload/pacote/xxx falhar, tenta /upload/pacotepreview/xxx
// (cobre pacotes antigos cujas fotos ainda não foram movidas pelo backend)
function onImgError(e) {
  const img = e.target
  if (img.dataset.fallback === '1') return
  img.dataset.fallback = '1'
  if (img.src.includes('/upload/pacote/')) {
    img.src = img.src.replace('/upload/pacote/', '/upload/pacotepreview/')
  } else if (img.src.includes('/upload/pacotepreview/')) {
    img.src = img.src.replace('/upload/pacotepreview/', '/upload/pacote/')
  }
}

function formatarPreco(v) {
  return Number(v).toFixed(2).replace('.', ',')
}

// ===== Carregamento =====
async function carregarMe() {
  try {
    const me = await apiFetch('/staff/me')
    meuIdProfissional.value = me.id_profissional
  } catch (e) {
    console.error('Erro /staff/me:', e)
    meuIdProfissional.value = null
  }
}

async function carregarPortfolio(idProf) {
  if (!idProf) {
    portfolio.value = []
    return
  }
  try {
    if (tipoUsuario.value === 'ADMIN' && idProf !== meuIdProfissional.value) {
      portfolio.value = await apiFetch(`/profissional-subservicos/${idProf}`)
    } else {
      portfolio.value = await apiFetch('/profissional-subservicos')
    }
  } catch (e) {
    console.error('Erro portfolio:', e)
    portfolio.value = []
  }
}

async function carregarDados() {
  carregando.value = true
  try {
    const [pacsRes, catsRes] = await Promise.allSettled([
      apiFetch('/pacotes'),
      apiFetch('/categorias'),
    ])

    if (pacsRes.status === 'fulfilled') pacotes.value = pacsRes.value
    else {
      console.error('Erro /pacotes:', pacsRes.reason)
      pacotes.value = []
    }

    if (catsRes.status === 'fulfilled') categorias.value = catsRes.value
    else {
      console.error('Erro /categorias:', catsRes.reason)
      categorias.value = []
    }
  } finally {
    carregando.value = false
  }
}

async function inicializar() {
  if (!decodificarToken()) {
    emit('fechar')
    return
  }
  await carregarMe()
  await carregarDados()
}

onMounted(() => {
  if (props.abrirPacotes) inicializar()
})

watch(
  () => props.abrirPacotes,
  (aberto) => {
    if (aberto) {
      resetar()
      inicializar()
    }
  }
)

// ===== Abrir form =====
async function abrirNovo() {
  if (!meuIdProfissional.value) {
    alert(
      'Você ainda não tem perfil profissional cadastrado.\n\n' +
      'Vá em "Meu Perfil" e crie seu perfil antes de cadastrar pacotes.'
    )
    return
  }
  await carregarPortfolio(meuIdProfissional.value)

  const pacotesCat = categorias.value.find(
    (c) => c.nome.toLowerCase() === 'pacotes'
  )
  pacoteEditando.value = {
    id: null,
    id_profissional_dono: meuIdProfissional.value,
    id_categoria: pacotesCat ? pacotesCat.id : null,
    nome: '',
    preco: '',
    descricao: '',
    imagem_url: null,
    ativo: true,
    file: null,
    preview: null,
    itens: [],
  }
  buscaSub.value = ''
  listaAberta.value = false
}

async function abrirEdicao(pacote) {
  await carregarPortfolio(pacote.id_profissional)
  pacoteEditando.value = {
    id: pacote.id,
    id_profissional_dono: pacote.id_profissional,
    id_categoria: pacote.id_categoria,
    nome: pacote.nome,
    preco: pacote.preco,
    descricao: pacote.descricao || '',
    imagem_url: pacote.imagem_url,
    ativo: pacote.ativo,
    file: null,
    preview: pacote.imagem_url ? urlImagem(pacote.imagem_url) : null,
    itens: pacote.itens.map((i) => ({
      id_subservico: i.id_subservico,
      nome_subservico: i.nome_subservico,
      nome_servico: i.nome_servico,
      quantidade: i.quantidade,
    })),
  }
  buscaSub.value = ''
  listaAberta.value = false
}

function fecharEdicao() {
  if (pacoteEditando.value?.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(pacoteEditando.value.preview)
  }
  pacoteEditando.value = null
  buscaSub.value = ''
  listaAberta.value = false
  if (inputFotoRef.value) inputFotoRef.value.value = ''
}

// ===== Upload =====
function selecionarFoto(e) {
  const file = e.target.files[0]
  if (!file || !pacoteEditando.value) return
  if (pacoteEditando.value.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(pacoteEditando.value.preview)
  }
  pacoteEditando.value.file = file
  pacoteEditando.value.preview = URL.createObjectURL(file)
}

// ===== Itens =====
function adicionarExistente(sub) {
  pacoteEditando.value.itens.push({
    id_subservico: sub.id_subservico,
    nome_subservico: sub.nome_subservico,
    nome_servico: sub.nome_servico,
    quantidade: 1,
  })
  buscaSub.value = ''
  listaAberta.value = false
}

async function criarNovo() {
  if (!podeCriarNovo.value || criandoSub.value) return
  const nome = buscaSub.value.trim()
  criandoSub.value = true
  try {
    const novo = await apiFetch('/pacotes/subservico-rapido', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    })

    pacoteEditando.value.itens.push({
      id_subservico: novo.id_subservico,
      nome_subservico: novo.nome_subservico,
      nome_servico: novo.nome_servico,
      quantidade: 1,
    })

    portfolio.value.push({
      id_subservico: novo.id_subservico,
      nome_subservico: novo.nome_subservico,
      nome_servico: novo.nome_servico,
      nome_categoria: novo.nome_categoria,
      preco: 0.01,
      duracao_minutos: 1,
    })

    buscaSub.value = ''
    listaAberta.value = false
  } catch (e) {
    alert('Erro ao criar subserviço: ' + e.message)
  } finally {
    criandoSub.value = false
  }
}

function removerItem(index) {
  pacoteEditando.value.itens.splice(index, 1)
}

// ===== Salvar =====
async function salvar() {
  const e = pacoteEditando.value
  if (!e) return

  if (!e.nome.trim()) return alert('Informe o nome do pacote.')
  if (!e.preco || parseFloat(e.preco) <= 0) return alert('Preço inválido.')
  if (e.itens.length === 0) return alert('Adicione pelo menos um subserviço.')

  for (const item of e.itens) {
    if (!item.quantidade || item.quantidade < 1) {
      return alert(`Quantidade inválida para "${item.nome_subservico}".`)
    }
  }

  try {
    let imagem_url = e.imagem_url
    if (e.file) {
      const fd = new FormData()
      fd.append('arquivo', e.file)
      const res = await apiFetch('/upload/pacote', { method: 'POST', body: fd })
      imagem_url = res.imagem_url
    }

    const idCat =
      e.id_categoria === null || e.id_categoria === ''
        ? null
        : Number(e.id_categoria)

    const body = {
      id_categoria: idCat,
      nome: e.nome.trim(),
      preco: parseFloat(e.preco),
      descricao: e.descricao?.trim() || null,
      imagem_url: imagem_url || null,
      ativo: e.ativo,
      itens: e.itens.map((i) => ({
        id_subservico: i.id_subservico,
        quantidade: i.quantidade,
      })),
    }

    if (e.id === null) {
      await apiFetch('/pacotes', { method: 'POST', body: JSON.stringify(body) })
    } else {
      await apiFetch(`/pacotes/${e.id}`, { method: 'PUT', body: JSON.stringify(body) })
    }

    fecharEdicao()
    await carregarDados()
  } catch (err) {
    alert('Erro: ' + err.message)
  }
}

// ===== Deletar =====
async function deletarPacote(pacote) {
  try {
    const impacto = await apiFetch(`/pacotes/${pacote.id}/impacto-delete`)
    let ok
    if (impacto.pode_deletar) {
      ok = confirm(`Deletar "${pacote.nome}"?`)
    } else {
      ok = confirm(
        `⚠️ "${pacote.nome}" tem ${impacto.agendamentos_afetados} agendamento(s) vinculado(s).\n\n` +
        `Os agendamentos continuarão existindo, mas sem referência ao pacote.\n\n` +
        `Recomendado: DESATIVE em vez de apagar.\n\nContinuar?`
      )
    }
    if (!ok) return
    const url = impacto.pode_deletar
      ? `/pacotes/${pacote.id}`
      : `/pacotes/${pacote.id}?force=true`
    await apiFetch(url, { method: 'DELETE' })
    await carregarDados()
  } catch (e) {
    alert('Erro: ' + e.message)
  }
}

// ===== Reset / fechar =====
function resetar() {
  fecharEdicao()
  pacotes.value = []
  categorias.value = []
  portfolio.value = []
  meuIdProfissional.value = null
  buscaSub.value = ''
  criandoSub.value = false
}

function fechar() {
  resetar()
  emit('fechar')
}
</script>

<template>
  <!-- ================= MODAL PRINCIPAL ================= -->
  <div v-if="abrirPacotes" class="modal-overlay">
    <div class="modal-conteudo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Pacotes</h2>
          <p class="modal-subtitulo">
            <template v-if="tipoUsuario === 'ADMIN'">
              Todos os pacotes das profissionais.
            </template>
            <template v-else>Gerencie seus pacotes de subserviços.</template>
          </p>
        </div>
        <div class="header-actions">
          <button class="btn-adicionar" @click="abrirNovo">
            <i class="fa-solid fa-plus"></i> Cadastrar Pacote
          </button>
          <button class="btn-fechar" @click="fechar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </header>

      <div class="modal-body">
        <p v-if="carregando" class="empty-text">Carregando...</p>
        <p v-else-if="pacotes.length === 0" class="empty-text">
          Nenhum pacote cadastrado ainda.
        </p>

        <div v-else class="pacotes-grid">
          <div
            v-for="p in pacotes"
            :key="p.id"
            class="pacote-card"
            :class="{ inativo: !p.ativo }"
          >
            <div class="card-foto">
              <img
                v-if="p.imagem_url"
                :src="urlImagem(p.imagem_url)"
                alt=""
                @error="onImgError"
              />
              <div v-else class="foto-vazia">
                <i class="fa-solid fa-box-open"></i>
              </div>
            </div>

            <div class="card-info">
              <h3 class="card-nome">
                {{ p.nome }}
                <span v-if="!p.ativo" class="badge-inativo">Desativado</span>
              </h3>
              <p class="card-cat">
                <i class="fa-solid fa-tag"></i> {{ p.nome_categoria }}
              </p>
              <p class="card-preco">R$ {{ formatarPreco(p.preco) }}</p>
              <p class="card-itens">{{ p.itens.length }} subserviço(s)</p>
              <p v-if="tipoUsuario === 'ADMIN' && p.nome_profissional" class="card-prof">
                <i class="fa-solid fa-user"></i> {{ p.nome_profissional }}
              </p>
            </div>

            <div class="card-acoes">
              <button class="btn-acao btn-editar" title="Editar" @click="abrirEdicao(p)">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-acao btn-remover" title="Deletar" @click="deletarPacote(p)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= SUB-MODAL CADASTRAR/EDITAR ================= -->
  <div v-if="pacoteEditando" class="modal-overlay nested" @click.self="fecharEdicao">
    <div class="modal-conteudo modal-edit">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">
            {{ pacoteEditando.id === null ? 'Cadastrar Pacote' : 'Editar Pacote' }}
          </h2>
          <p class="modal-subtitulo">Defina os dados e os subserviços inclusos.</p>
        </div>
        <button class="btn-fechar" @click="fecharEdicao">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <!-- Dados básicos -->
        <section class="form-section">
          <h3 class="section-subtitle">Dados do Pacote</h3>

          <div class="form-split">
            <div class="form-col-foto">
              <input
                ref="inputFotoRef"
                type="file"
                accept="image/*"
                class="input-escondido"
                @change="selecionarFoto"
              />
              <button type="button" class="btn-escolher-foto" @click="inputFotoRef.click()">
                <i class="fa-solid fa-camera"></i>
                {{ pacoteEditando.preview ? 'Trocar foto' : 'Escolher foto' }}
              </button>
              <div v-if="!pacoteEditando.preview" class="preview-foto preview-vazio">
                Sem foto
              </div>
              <img
                v-else
                :src="pacoteEditando.preview"
                class="preview-foto"
                @error="onImgError"
              />
            </div>

            <div class="form-col-campos">
              <label class="campo">
                <span>Nome do Pacote</span>
                <input type="text" v-model="pacoteEditando.nome" placeholder="Ex: Combo Noiva" />
              </label>

              <label class="campo">
                <span>Categoria</span>
                <select v-model="pacoteEditando.id_categoria">
                  <option
                    v-for="c in categoriaOptions"
                    :key="c.id ?? 'default'"
                    :value="c.id"
                  >
                    {{ c.nome }}{{ c.id === null ? ' (criar automaticamente)' : '' }}
                  </option>
                </select>
              </label>

              <label class="campo">
                <span>Preço Total (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  v-model="pacoteEditando.preco"
                  placeholder="0,00"
                />
              </label>

              <label class="campo">
                <span>Descrição (opcional)</span>
                <textarea
                  v-model="pacoteEditando.descricao"
                  rows="2"
                  placeholder="Detalhes do pacote..."
                ></textarea>
              </label>

              <label class="checkbox-campo">
                <input type="checkbox" v-model="pacoteEditando.ativo" />
                <span>Ativo (visível para clientes)</span>
              </label>
            </div>
          </div>
        </section>

        <!-- Subserviços -->
        <section class="form-section">
          <h3 class="section-subtitle">Subserviços Inclusos</h3>

          <label class="campo">
            <span>Adicionar subserviço</span>
            <div class="relative-container">
              <input
                type="text"
                v-model="buscaSub"
                placeholder="Buscar no seu portfólio ou digitar novo..."
                @focus="listaAberta = true"
                @click="listaAberta = true"
                @blur="listaAberta = false"
              />
              <ul v-if="listaAberta" class="dropdown-lista">
                <li
                  class="dropdown-criar"
                  :class="{
                    'criar-hint': !buscaSub.trim(),
                    'criar-bloqueado': buscaSub.trim() && !podeCriarNovo,
                  }"
                  @mousedown.prevent="podeCriarNovo && !criandoSub && criarNovo()"
                >
                  <template v-if="!buscaSub.trim()">
                    <i class="fa-solid fa-plus"></i>
                    Digite acima para criar um novo subserviço
                  </template>
                  <template v-else-if="criandoSub">
                    <i class="fa-solid fa-spinner fa-spin"></i> Criando...
                  </template>
                  <template v-else-if="!podeCriarNovo">
                    <i class="fa-solid fa-check"></i>
                    "{{ buscaSub.trim() }}" já existe — escolha abaixo
                  </template>
                  <template v-else>
                    <i class="fa-solid fa-plus"></i>
                    Criar novo: "{{ buscaSub.trim() }}"
                  </template>
                </li>

                <li
                  v-for="sub in subservicosDisponiveis"
                  :key="sub.id_subservico"
                  @mousedown.prevent="adicionarExistente(sub)"
                >
                  <span class="drop-nome">{{ sub.nome_subservico }}</span>
                  <span class="drop-serv">- {{ sub.nome_servico }}</span>
                </li>

                <li
                  v-if="buscaSub.trim() && subservicosDisponiveis.length === 0 && !podeCriarNovo"
                  class="dropdown-vazio"
                >
                  Nenhum subserviço encontrado.
                </li>
                <li
                  v-if="!buscaSub.trim() && subservicosDisponiveis.length === 0"
                  class="dropdown-vazio"
                >
                  Nenhum subserviço no seu portfólio ainda.
                </li>
              </ul>
            </div>
          </label>

          <div v-if="pacoteEditando.itens.length > 0" class="itens-lista">
            <div
              v-for="(item, i) in pacoteEditando.itens"
              :key="item.id_subservico"
              class="item-row"
            >
              <div class="item-info">
                <span class="item-nome">{{ item.nome_subservico }}</span>
                <span class="item-meta">{{ item.nome_servico }}</span>
              </div>
              <label class="item-qtd">
                <span>Qtd</span>
                <input type="number" min="1" v-model.number="item.quantidade" />
              </label>
              <button
                type="button"
                class="btn-remover-item"
                title="Remover"
                @click="removerItem(i)"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <p v-else class="aviso">Nenhum subserviço adicionado ainda.</p>
        </section>

        <div class="modal-acoes">
          <button type="button" class="btn-cancelar" @click="fecharEdicao">Cancelar</button>
          <button type="button" class="btn-salvar" @click="salvar">
            {{ pacoteEditando.id === null ? 'Cadastrar' : 'Salvar' }}
          </button>
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
  width: min(80rem, 95%);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-adicionar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 1.8rem;
  border-radius: 99rem;
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: none;
  font-family: var(--font-body);
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
}
.btn-adicionar:hover {
  background: var(--kp-creme);
}

.btn-fechar {
  background: transparent;
  border: none;
  color: var(--kp-gold);
  font-size: 2.2rem;
  cursor: pointer;
}
.btn-fechar:hover {
  opacity: 0.7;
}

.modal-body {
  padding: 2.5rem 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ================= LISTA DE PACOTES ================= */
.pacotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 1.5rem;
}

.pacote-card {
  display: flex;
  gap: 1.2rem;
  background: rgba(245, 235, 221, 0.05);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
  padding: 1.2rem;
  align-items: stretch;
}
.pacote-card.inativo {
  opacity: 0.6;
  border-style: dashed;
}

.card-foto img,
.foto-vazia {
  width: 9rem;
  height: 9rem;
  border-radius: 0.8rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold-border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.foto-vazia {
  background: var(--kp-vinho-low);
  color: var(--kp-creme-low);
  font-size: 2.4rem;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-nome {
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 0.4rem;
}

.card-cat {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
}
.card-cat i {
  color: var(--kp-gold);
  margin-right: 0.3rem;
}

.card-preco {
  color: var(--kp-gold);
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.3rem;
}

.card-itens {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
}

.card-prof {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-style: italic;
  margin-top: 0.2rem;
}
.card-prof i {
  color: var(--kp-gold);
  margin-right: 0.3rem;
}

.card-acoes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.btn-acao {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  border: 1px solid var(--kp-gold-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.2s;
}
.btn-editar {
  color: var(--kp-gold);
}
.btn-editar:hover {
  background: var(--kp-gold);
  color: var(--kp-mahogany);
}
.btn-remover {
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.3);
}
.btn-remover:hover {
  background: #ff6b6b;
  color: #fff;
}

.badge-inativo {
  padding: 0.2rem 0.8rem;
  background: rgba(255, 77, 77, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 77, 77, 0.4);
  border-radius: 99rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  font-family: var(--font-body);
}

/* ================= FORM ================= */
.form-section {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
  padding: 2rem;
}

.section-subtitle {
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.form-split {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.form-col-foto {
  width: 16rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-col-campos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-foto,
.preview-vazio {
  width: 16rem;
  height: 16rem;
  border-radius: 0.8rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold);
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
  font-size: 1.2rem;
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
.campo input,
.campo select,
.campo textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.3rem;
  outline: none;
  resize: vertical;
}
.campo input:focus,
.campo select:focus,
.campo textarea:focus {
  border-color: var(--kp-gold);
}

.checkbox-campo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  cursor: pointer;
}
.checkbox-campo input {
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
}

/* ================= DROPDOWN ================= */
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
  max-height: 20rem;
  overflow-y: auto;
}
.dropdown-lista li {
  padding: 1rem 1.4rem;
  font-family: var(--font-body);
  font-size: 1.3rem;
  color: var(--kp-text);
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  flex-wrap: wrap;
}
.dropdown-lista li:hover {
  background: var(--kp-creme);
}
.dropdown-lista li.dropdown-criar {
  color: #7a5c1e;
  font-weight: bold;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.dropdown-lista li.dropdown-criar.criar-hint {
  color: #9b8b6e;
  font-weight: normal;
  font-style: italic;
  cursor: default;
}
.dropdown-lista li.dropdown-criar.criar-hint:hover {
  background: transparent;
}
.dropdown-lista li.dropdown-criar.criar-bloqueado {
  color: #7a8a5c;
  font-weight: normal;
  font-style: italic;
  cursor: default;
}
.dropdown-lista li.dropdown-criar.criar-bloqueado:hover {
  background: transparent;
}
.dropdown-lista li.dropdown-criar i {
  font-size: 1.1rem;
}
.drop-nome {
  font-weight: 500;
}
.drop-serv {
  color: #7a5c1e;
  font-size: 1.1rem;
}
.dropdown-vazio {
  color: var(--kp-creme-low);
  font-style: italic;
  cursor: default;
}
.dropdown-vazio:hover {
  background: transparent;
}

/* ================= ITENS ================= */
.itens-lista {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: rgba(245, 235, 221, 0.05);
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.item-nome {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 500;
}
.item-meta {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.1rem;
}

.item-qtd {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.2rem;
}
.item-qtd input {
  width: 7rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.6rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.3rem;
  outline: none;
  text-align: center;
}

.btn-remover-item {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 107, 107, 0.3);
  background: transparent;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-remover-item:hover {
  background: #ff6b6b;
  color: #fff;
}

.aviso {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-style: italic;
}

/* ================= AÇÕES ================= */
.modal-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
  padding-top: 1.6rem;
  margin-top: 0.5rem;
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
.btn-salvar:hover {
  background: var(--kp-creme);
}

.empty-text {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
  text-align: center;
  padding: 3rem 0;
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
  .form-split {
    flex-direction: column;
  }
  .form-col-foto {
    width: 100%;
    align-items: center;
  }
  .pacotes-grid {
    grid-template-columns: 1fr;
  }
  .pacote-card {
    flex-direction: column;
  }
  .card-acoes {
    flex-direction: row;
  }
  .item-row {
    flex-wrap: wrap;
  }
}
</style>
