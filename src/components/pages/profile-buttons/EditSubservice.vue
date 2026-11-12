<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({
  editarSubservico: Boolean,
})
const emit = defineEmits(['fechar'])

const tipoUsuario = ref('')
const idUsuarioLogado = ref(null)
const profissionais = ref([])
const idProfSelecionado = ref(null)
const nomeProfSelecionada = ref(null)
const meuIdProfissional = ref(null)
const vinculos = ref([])
const carregando = ref(false)

const vinculoEditando = ref(null)
const formPreco = ref('')
const formDuracao = ref(30)
const formAtivo = ref(true)
const formFileFoto = ref(null)
const formPreviewFoto = ref(null)
const formDescricao = ref('')

const trocando = ref(null)
const todosSubservicos = ref([])
const todosServicos = ref([])
const trocaTermoBusca = ref('')
const trocaListaAberta = ref(false)
const trocaSubservicoSelecionado = ref(null)
const trocaServicoSelecionado = ref(null)
const trocaListaServAberta = ref(false)
const trocaMostrarForm = ref(false)
const trocaFileFoto = ref(null)
const trocaPreviewFoto = ref(null)
const trocaPreco = ref('')
const trocaDuracao = ref(30)
const trocaDescricao = ref('')

const modalDescricaoAberto = ref(false)
const descricaoRascunho = ref('')
const contextoDescricao = ref(null)
const limiteDescricao = 300

const trocaSubservicosFiltrados = computed(() => {
  const termo = trocaTermoBusca.value.trim().toLowerCase()
  if (!termo) return todosSubservicos.value
  const palavras = termo.split(/\s+/).filter(Boolean)
  return todosSubservicos.value.filter((s) => palavras.some((p) => s.nome.toLowerCase().includes(p)))
})

function urlImagem(imagem_url) {
  if (!imagem_url) return null
  if (imagem_url.startsWith('http')) return imagem_url
  return `${import.meta.env.VITE_API_URL}/upload/profissional_subservico/${imagem_url}`
}

function formatarPreco(v) {
  return Number(v).toFixed(2).replace('.', ',')
}

function decodificarToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    const payload = JSON.parse(atob(token.split('.')[1]))
    tipoUsuario.value = payload.tipo
    idUsuarioLogado.value = payload.id
    return true
  } catch {
    return false
  }
}

async function carregarStaff() {
  try {
    const staff = await apiFetch('/staff')
    profissionais.value = staff.filter((s) => s.id_profissional)
  } catch (e) {
    console.error(e)
  }
}

async function carregarMe() {
  try {
    const me = await apiFetch('/staff/me')
    meuIdProfissional.value = me.id_profissional
    return me.id_profissional
  } catch (e) {
    return null
  }
}

async function carregarVinculos() {
  if (!idProfSelecionado.value) {
    vinculos.value = []
    return
  }
  carregando.value = true
  try {
    vinculos.value = await apiFetch(`/profissional-subservicos/${idProfSelecionado.value}`)
  } catch (e) {
    vinculos.value = []
  } finally {
    carregando.value = false
  }
}

async function inicializar() {
  if (!decodificarToken()) {
    emit('fechar')
    return
  }
  if (tipoUsuario.value === 'ADMIN') {
    await carregarStaff()
    if (profissionais.value.length > 0) {
      idProfSelecionado.value = profissionais.value[0].id_profissional
      nomeProfSelecionada.value = profissionais.value[0].nome
    }
  } else {
    const id = await carregarMe()
    if (id) idProfSelecionado.value = id
  }
  await carregarVinculos()
}

onMounted(() => {
  if (props.editarSubservico) inicializar()
})

watch(
  () => props.editarSubservico,
  (aberto) => {
    if (aberto) {
      resetar()
      inicializar()
    }
  },
)

watch(idProfSelecionado, async (novo, antigo) => {
  if (novo && novo !== antigo) {
    const p = profissionais.value.find((x) => x.id_profissional === novo)
    nomeProfSelecionada.value = p?.nome || ''
    cancelarEdicao()
    await carregarVinculos()
  }
})

function abrirModalDescricao(contexto, textoAtual) {
  contextoDescricao.value = contexto
  descricaoRascunho.value = textoAtual || ''
  modalDescricaoAberto.value = true
}

function salvarDescricao() {
  const texto = descricaoRascunho.value.trim()
  if (contextoDescricao.value === 'inline') formDescricao.value = texto
  else if (contextoDescricao.value === 'troca') trocaDescricao.value = texto
  modalDescricaoAberto.value = false
}

function cancelarDescricao() {
  modalDescricaoAberto.value = false
}

function abrirEdicao(v) {
  vinculoEditando.value = { id_profissional: v.id_profissional, id_subservico: v.id_subservico }
  formPreco.value = v.preco
  formDuracao.value = v.duracao_minutos
  formAtivo.value = v.ativo
  formDescricao.value = v.descricao || ''
  formFileFoto.value = null
  if (formPreviewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(formPreviewFoto.value)
  formPreviewFoto.value = v.imagem_url ? urlImagem(v.imagem_url) : null
}

function cancelarEdicao() {
  vinculoEditando.value = null
  formPreco.value = ''
  formDuracao.value = 30
  formAtivo.value = true
  formDescricao.value = ''
  formFileFoto.value = null
  if (formPreviewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(formPreviewFoto.value)
  formPreviewFoto.value = null
}

function selecionarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (formPreviewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(formPreviewFoto.value)
  formFileFoto.value = file
  formPreviewFoto.value = URL.createObjectURL(file)
  e.target.value = ''
}

async function salvarEdicao() {
  if (!vinculoEditando.value) return
  try {
    let imagem_url = undefined
    if (formFileFoto.value) {
      const fd = new FormData()
      fd.append('arquivo', formFileFoto.value)
      const res = await apiFetch('/upload/profissional_subservico', { method: 'POST', body: fd })
      imagem_url = res.imagem_url
    }
    await apiFetch(`/profissional-subservicos/${vinculoEditando.value.id_profissional}/${vinculoEditando.value.id_subservico}`, {
      method: 'PUT',
      body: JSON.stringify({
        preco: parseFloat(formPreco.value),
        duracao_minutos: parseInt(formDuracao.value),
        ativo: formAtivo.value,
        descricao: formDescricao.value,
        ...(imagem_url !== undefined && { imagem_url }),
      }),
    })
    await carregarVinculos()
    cancelarEdicao()
  } catch (e) {
    alert('Erro ao salvar: ' + e.message)
  }
}

async function removerVinculo(v) {
  const ok = confirm(`Desvincular "${v.nome_subservico}"?\nA foto e as configurações serão removidas.`)
  if (!ok) return
  try {
    await apiFetch(`/profissional-subservicos/${v.id_profissional}/${v.id_subservico}`, { method: 'DELETE' })
    await carregarVinculos()
  } catch (e) {
    alert('Erro ao remover: ' + e.message)
  }
}

async function abrirTroca(v) {
  trocando.value = { id_profissional: v.id_profissional, id_subservico_atual: v.id_subservico, nome_subservico_atual: v.nome_subservico }
  trocaTermoBusca.value = ''
  trocaListaAberta.value = false
  trocaSubservicoSelecionado.value = null
  trocaServicoSelecionado.value = null
  trocaListaServAberta.value = false
  trocaMostrarForm.value = false
  trocaFileFoto.value = null
  if (trocaPreviewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(trocaPreviewFoto.value)
  trocaPreviewFoto.value = null
  trocaPreco.value = ''
  trocaDuracao.value = 30
  trocaDescricao.value = ''
  try {
    const [subs, servs] = await Promise.all([apiFetch('/subservicos'), apiFetch('/servicos')])
    todosSubservicos.value = subs
    todosServicos.value = servs
  } catch (e) {
    console.error(e)
  }
}

function fecharTroca() {
  trocando.value = null
  trocaTermoBusca.value = ''
  trocaListaAberta.value = false
  trocaSubservicoSelecionado.value = null
  trocaServicoSelecionado.value = null
  trocaMostrarForm.value = false
  trocaFileFoto.value = null
  if (trocaPreviewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(trocaPreviewFoto.value)
  trocaPreviewFoto.value = null
  trocaPreco.value = ''
  trocaDuracao.value = 30
  trocaDescricao.value = ''
}

function trocaSelecionarSubservico(sub) {
  trocaSubservicoSelecionado.value = sub
  trocaTermoBusca.value = sub.nome
  trocaListaAberta.value = false
  trocaServicoSelecionado.value = null
  trocaMostrarForm.value = true
}

function trocaCriarNovo() {
  trocaSubservicoSelecionado.value = null
  trocaListaAberta.value = false
  trocaMostrarForm.value = false
}

function trocaSelecionarServico(serv) {
  trocaServicoSelecionado.value = serv
  trocaListaServAberta.value = false
  trocaMostrarForm.value = true
}

function trocaOnInputBusca() {
  if (trocaSubservicoSelecionado.value) {
    trocaSubservicoSelecionado.value = null
    trocaServicoSelecionado.value = null
    trocaMostrarForm.value = false
  }
}

function trocaSelecionarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (trocaPreviewFoto.value?.startsWith('blob:')) URL.revokeObjectURL(trocaPreviewFoto.value)
  trocaFileFoto.value = file
  trocaPreviewFoto.value = URL.createObjectURL(file)
  e.target.value = ''
}

async function salvarTroca() {
  if (!trocando.value) return
  try {
    let idSubNovo = trocaSubservicoSelecionado.value?.id
    if (!idSubNovo) {
      if (!trocaServicoSelecionado.value) {
        alert('Escolha um serviço.')
        return
      }
      const novo = await apiFetch('/subservicos', {
        method: 'POST',
        body: JSON.stringify({ nome: trocaTermoBusca.value.trim(), id_servico: trocaServicoSelecionado.value.id }),
      })
      idSubNovo = novo.id
    }
    let urlFoto = null
    if (trocaFileFoto.value) {
      const fd = new FormData()
      fd.append('arquivo', trocaFileFoto.value)
      const res = await apiFetch('/upload/profissional_subservico', { method: 'POST', body: fd })
      urlFoto = res.imagem_url
    }
    await apiFetch('/profissional-subservicos', {
      method: 'POST',
      body: JSON.stringify({
        id_subservico: idSubNovo,
        preco: parseFloat(trocaPreco.value),
        duracao_minutos: parseInt(trocaDuracao.value),
        imagem_url: urlFoto,
        id_profissional: trocando.value.id_profissional,
        descricao: trocaDescricao.value,
      }),
    })
    await apiFetch(`/profissional-subservicos/${trocando.value.id_profissional}/${trocando.value.id_subservico_atual}`, { method: 'DELETE' })
    alert('Subserviço trocado com sucesso!')
    fecharTroca()
    await carregarVinculos()
  } catch (e) {
    alert('Erro ao trocar: ' + e.message)
  }
}

function resetar() {
  cancelarEdicao()
  fecharTroca()
  vinculos.value = []
  profissionais.value = []
  idProfSelecionado.value = null
  nomeProfSelecionada.value = ''
  todosSubservicos.value = []
  todosServicos.value = []
  modalDescricaoAberto.value = false
}

function fechar() {
  resetar()
  emit('fechar')
}
</script>

<template>
  <div v-if="editarSubservico" class="modal-overlay">
    <div class="modal-conteudo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Editar Subserviços</h2>
          <p class="modal-subtitulo">
            <template v-if="tipoUsuario === 'ADMIN'"
              >Visualizando: <strong>{{ nomeProfSelecionada || '—' }}</strong></template
            >
            <template v-else>Seus subserviços vinculados</template>
          </p>
        </div>
        <button @click="fechar" class="btn-fechar"><i class="fa-solid fa-xmark"></i></button>
      </header>

      <div class="modal-body">
        <div v-if="tipoUsuario === 'ADMIN'" class="seletor-prof">
          <label class="campo">
            <span>Profissional</span>
            <select v-model.number="idProfSelecionado">
              <option v-if="profissionais.length === 0" :value="null">Nenhum perfil cadastrado</option>
              <option v-for="p in profissionais" :key="p.id_profissional" :value="p.id_profissional">{{ p.nome }} <template v-if="p.tipo === 'ADMIN'"> (Admin)</template> ({{ p.email }})</option>
            </select>
          </label>
        </div>

        <p v-if="carregando" class="empty-text">Carregando...</p>
        <p v-else-if="!idProfSelecionado" class="empty-text">Selecione uma profissional para ver os subserviços.</p>
        <p v-else-if="vinculos.length === 0" class="empty-text">Nenhum subserviço vinculado ainda.</p>

        <div v-else class="lista-vinculos">
          <div v-for="v in vinculos" :key="`${v.id_profissional}-${v.id_subservico}`" class="vinculo-card" :class="{ 'vinculo-inativo': !v.ativo }">
            <template v-if="!vinculoEditando || vinculoEditando.id_subservico !== v.id_subservico">
              <div class="v-foto">
                <img v-if="v.imagem_url" :src="urlImagem(v.imagem_url)" alt="" />
                <div v-else class="v-foto-vazia"><i class="fa-solid fa-image"></i></div>
              </div>

              <div class="v-info">
                <h3 class="v-nome">{{ v.nome_subservico }}</h3>
                <p class="v-meta">
                  {{ v.nome_servico }} <span class="tag-categoria">({{ v.nome_categoria }})</span>
                </p>
                <p class="v-meta-2">
                  R$ {{ formatarPreco(v.preco) }} · {{ v.duracao_minutos }} min
                  <span v-if="!v.ativo" class="badge-inativo">Desativado</span>
                </p>

                <p v-if="v.descricao" class="v-meta v-descricao">
                  {{ v.descricao }}
                </p>
              </div>

              <div class="v-acoes">
                <button class="btn-acao btn-editar" title="Editar" @click="abrirEdicao(v)"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-acao btn-trocar" title="Trocar subserviço" @click="abrirTroca(v)"><i class="fa-solid fa-arrows-rotate"></i></button>
                <button class="btn-acao btn-remover" title="Desvincular" @click="removerVinculo(v)"><i class="fa-solid fa-trash"></i></button>
              </div>
            </template>

            <template v-else>
              <div class="v-edit-form">
                <div class="v-edit-header">
                  <h3>{{ v.nome_subservico }}</h3>
                  <p class="v-meta">
                    {{ v.nome_servico }} <span class="tag-categoria">({{ v.nome_categoria }})</span>
                  </p>
                </div>

                <div class="v-edit-campos">
                  <label class="campo">
                    <span>Preço (R$)</span>
                    <input type="number" step="0.01" min="0.01" v-model="formPreco" />
                  </label>
                  <label class="campo">
                    <span>Duração (min)</span>
                    <input type="number" min="1" v-model="formDuracao" />
                  </label>
                  <label class="campo checkbox-campo">
                    <input type="checkbox" v-model="formAtivo" />
                    <span>Ativo</span>
                  </label>
                </div>

                <label class="campo" style="margin-top: 1rem">
                  <span>
                    Descrição (Opcional)
                    <small style="opacity: 0.6; font-size: 1.1rem; margin-left: 0.5rem">{{ formDescricao.length }}/{{ limiteDescricao }}</small>
                  </span>
                  <input type="text" :value="formDescricao" placeholder="Clique para detalhar o subserviço..." class="input-clicavel" readonly @click="abrirModalDescricao('inline', formDescricao)" />
                </label>

                <div class="v-edit-foto">
                  <label class="btn-escolher-foto">
                    <i class="fa-solid fa-camera"></i> {{ formPreviewFoto ? 'Trocar foto' : 'Escolher foto' }}
                    <input type="file" accept="image/*" class="input-escondido" @change="selecionarFoto" />
                  </label>
                  <img v-if="formPreviewFoto" :src="formPreviewFoto" class="preview-edit" />
                </div>

                <div class="v-edit-acoes">
                  <button type="button" class="btn-cancelar" @click="cancelarEdicao">Cancelar</button>
                  <button type="button" class="btn-salvar" @click="salvarEdicao">Salvar</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="trocando" class="modal-overlay nested" @click.self="fecharTroca">
    <div class="modal-conteudo modal-troca">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Trocar Subserviço</h2>
          <p class="modal-subtitulo">
            Substituindo: <strong>{{ trocando.nome_subservico_atual }}</strong>
          </p>
        </div>
        <button @click="fecharTroca" class="btn-fechar"><i class="fa-solid fa-xmark"></i></button>
      </header>

      <div class="modal-body">
        <label class="campo">
          <span>1. Digite o nome do novo subserviço</span>
          <div class="relative-container">
            <input type="text" v-model="trocaTermoBusca" placeholder="Ex: corte de cabelo, unha em gel..." @focus="trocaListaAberta = true" @click="trocaListaAberta = true" @input="trocaOnInputBusca" @blur="trocaListaAberta = false" required />
            <ul v-if="trocaListaAberta && trocaTermoBusca.trim() && !trocaSubservicoSelecionado" class="dropdown-lista">
              <li class="dropdown-criar" @mousedown.prevent="trocaCriarNovo">+ Criar novo subserviço: "{{ trocaTermoBusca }}"</li>
              <li v-for="sub in trocaSubservicosFiltrados" :key="sub.id" @mousedown.prevent="trocaSelecionarSubservico(sub)">{{ sub.nome }}</li>
            </ul>
          </div>
        </label>

        <div v-if="trocaSubservicoSelecionado" class="badge-vinculo">
          <i class="fa-solid fa-link"></i>
          Vinculado a <strong>{{ trocaSubservicoSelecionado.nome_servico }}</strong>
          <span v-if="trocaSubservicoSelecionado.nome_categoria" class="sub-badge">({{ trocaSubservicoSelecionado.nome_categoria }})</span>
        </div>

        <label v-if="!trocaSubservicoSelecionado && trocaTermoBusca.trim()" class="campo">
          <span>2. Vincular a qual serviço?</span>
          <div class="relative-container">
            <input type="text" :value="trocaServicoSelecionado ? `${trocaServicoSelecionado.nome} (${trocaServicoSelecionado.nome_categoria})` : ''" placeholder="Clique para escolher..." readonly @click="trocaListaServAberta = !trocaListaServAberta" @blur="trocaListaServAberta = false" />
            <ul v-if="trocaListaServAberta" class="dropdown-lista">
              <li v-for="serv in todosServicos" :key="serv.id" @mousedown.prevent="trocaSelecionarServico(serv)">
                {{ serv.nome }} <span class="tag-categoria">- {{ serv.nome_categoria }}</span>
              </li>
            </ul>
          </div>
        </label>

        <div v-if="trocaMostrarForm" class="etapa-troca">
          <div class="troca-foto-col">
            <label class="btn-escolher-foto">
              <i class="fa-solid fa-camera"></i> {{ trocaPreviewFoto ? 'Trocar foto' : 'Escolher Foto' }}
              <input type="file" accept="image/*" class="input-escondido" @change="trocaSelecionarFoto" />
            </label>
            <div v-if="!trocaPreviewFoto" class="preview-troca preview-vazio">Sem foto</div>
            <img v-else :src="trocaPreviewFoto" class="preview-troca" />
          </div>

          <div class="troca-campos-col">
            <label class="campo">
              <span>Preço (R$)</span>
              <input type="number" step="0.01" min="0.01" v-model="trocaPreco" placeholder="0,00" required />
            </label>
            <label class="campo">
              <span>Duração (min)</span>
              <input type="number" min="1" v-model="trocaDuracao" required />
            </label>

            <label class="campo">
              <span>
                Descrição (Opcional)
                <small style="opacity: 0.6; font-size: 1.1rem; margin-left: 0.5rem">{{ trocaDescricao.length }}/{{ limiteDescricao }}</small>
              </span>
              <input type="text" :value="trocaDescricao" placeholder="Clique para detalhar o subserviço..." class="input-clicavel" readonly @click="abrirModalDescricao('troca', trocaDescricao)" />
            </label>
          </div>
        </div>

        <div class="modal-acoes">
          <button type="button" @click="fecharTroca" class="btn-cancelar">Cancelar</button>
          <button type="button" @click="salvarTroca" class="btn-salvar" :disabled="!trocaMostrarForm">Trocar</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="modalDescricaoAberto" class="modal-overlay-nested" @click.self="cancelarDescricao">
    <div class="modal-descricao-conteudo">
      <h3 class="modal-descricao-titulo">Detalhes do Subserviço</h3>
      <p class="modal-descricao-subtitulo">Escreva detalhes, diferenciais ou observações sobre este serviço.</p>
      <div class="textarea-wrapper">
        <textarea v-model="descricaoRascunho" :maxlength="limiteDescricao" placeholder="Ex: Inclui lavagem, hidratação e finalização..." class="textarea-descricao" rows="6" autofocus></textarea>
        <span class="contador-bio">{{ descricaoRascunho.length }} / {{ limiteDescricao }}</span>
      </div>
      <div class="modal-acoes-bio">
        <button type="button" @click="cancelarDescricao" class="btn-cancelar">Cancelar</button>
        <button type="button" @click="salvarDescricao" class="btn-salvar">Confirmar</button>
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

.modal-overlay.nested {
  z-index: 1100;
  background: rgba(30, 18, 10, 0.92);
}

.modal-overlay-nested {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  backdrop-filter: blur(6px);
}

.modal-conteudo {
  background: var(--kp-mahogany);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(85rem, 95%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-conteudo.modal-troca {
  width: min(65rem, 90%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2.5rem 3.5rem;
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

.modal-subtitulo strong {
  color: var(--kp-gold);
}

.btn-fechar {
  background: transparent;
  border: none;
  color: var(--kp-gold);
  font-size: 2.2rem;
  cursor: pointer;
}

.modal-body {
  padding: 2.5rem 3.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.campo > span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.2rem;
  letter-spacing: 0.05em;
}

.campo input[type='number'],
.campo input[type='text'],
.textarea-descricao {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.4rem;
  outline: none;
}

.input-clicavel {
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.checkbox-campo {
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
}

.checkbox-campo input {
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
}

.seletor-prof {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
}

.seletor-prof select {
  width: 100%;
  padding: 1.2rem 1.4rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.4rem;
}

.lista-vinculos {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.vinculo-card {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.4rem;
  background: rgba(245, 235, 221, 0.05);
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
}

.vinculo-inativo {
  opacity: 0.55;
  border-style: dashed;
}

.v-foto {
  flex-shrink: 0;
}

.v-foto img,
.v-foto-vazia {
  width: 8rem;
  height: 8rem;
  border-radius: 0.8rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-foto-vazia {
  background: var(--kp-vinho-low);
  color: var(--kp-creme-low);
  font-size: 2rem;
}

.v-info {
  flex: 1;
}

.v-nome {
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}

.v-meta {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
}

.v-meta-2 {
  color: var(--kp-gold);
  font-family: var(--font-body);
  font-size: 1.3rem;
  margin-top: 0.4rem;
}

.v-descricao {
  margin-top: 0.6rem;
  white-space: pre-line;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vinculo-card .tag-categoria {
  color: #a88d5c;
  font-size: 1.1rem;
  margin-left: 0.3rem;
  opacity: 1;
}

.badge-inativo {
  display: inline-block;
  margin-left: 0.8rem;
  padding: 0.2rem 0.8rem;
  background: rgba(255, 77, 77, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 77, 77, 0.4);
  border-radius: 99rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.v-acoes {
  display: flex;
  gap: 0.6rem;
  flex-shrink: 0;
}

.btn-acao {
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--kp-gold-border);
  background: transparent;
  cursor: pointer;
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

.btn-trocar {
  color: #8fb4d8;
}

.btn-trocar:hover {
  background: #8fb4d8;
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

.v-edit-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.v-edit-header {
  border-bottom: 1px solid rgba(201, 166, 107, 0.15);
  padding-bottom: 0.8rem;
}

.v-edit-header h3 {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}

.v-edit-campos {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.2rem;
  align-items: end;
}

.v-edit-foto {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1rem;
}

.btn-escolher-foto {
  padding: 1rem 1.6rem;
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
  transition: background 0.2s;
}

.btn-escolher-foto:hover {
  background: #7a2632;
}

.preview-edit {
  width: 7rem;
  height: 7rem;
  border-radius: 0.6rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold);
}

.v-edit-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.4rem;
}

.input-escondido {
  display: none;
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

.btn-salvar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-text {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.3rem;
  text-align: center;
  padding: 3rem 0;
  font-style: italic;
}

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
}

.dropdown-lista li.dropdown-criar {
  color: #7a5c1e;
  font-weight: bold;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
}

.badge-vinculo {
  padding: 1rem 1.4rem;
  background: rgba(201, 166, 107, 0.15);
  border: 1px solid var(--kp-gold);
  border-radius: 0.8rem;
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.etapa-troca {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.troca-foto-col {
  width: 14rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.troca-campos-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-troca {
  width: 14rem;
  height: 14rem;
  border-radius: 0.8rem;
  object-fit: cover;
  border: 1px solid var(--kp-gold);
  align-self: center;
}

.preview-vazio {
  background: var(--kp-vinho-low);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kp-creme-low);
}

.modal-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
  padding-top: 1.6rem;
  margin-top: 0.8rem;
}

.modal-descricao-conteudo {
  background: var(--kp-creme, #f5ebdd);
  padding: 3rem;
  border: 1px solid var(--kp-gold);
  border-radius: 1.4rem;
  width: min(65rem, 90%);
}

.modal-descricao-titulo {
  color: var(--kp-vinho, #6b1d2c);
  font-family: var(--font-display);
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.modal-descricao-subtitulo {
  color: var(--kp-text, #4a2c2a);
  text-align: center;
  margin-bottom: 2rem;
}

.textarea-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.textarea-descricao {
  resize: vertical;
  min-height: 14rem;
}

.contador-bio {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  color: #3d2010;
  opacity: 0.6;
}

.modal-acoes-bio {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}

.modal-acoes-bio .btn-salvar {
  background: var(--kp-vinho);
  color: var(--kp-creme);
  border-color: var(--kp-vinho);
}

.modal-acoes-bio .btn-cancelar {
  background: transparent;
  color: var(--kp-vinho);
  border-color: var(--kp-vinho);
}

@media (max-width: 768px) {
  .modal-conteudo {
    width: 95%;
  }
  .modal-body {
    padding: 2rem;
  }
  .vinculo-card {
    flex-wrap: wrap;
  }
  .v-edit-campos {
    grid-template-columns: 1fr;
  }
  .v-acoes {
    width: 100%;
    justify-content: flex-end;
  }
  .etapa-troca {
    flex-direction: column;
  }
  .troca-foto-col {
    width: 100%;
  }
}
</style>
