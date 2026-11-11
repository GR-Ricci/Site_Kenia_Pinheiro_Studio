<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ abrirSubservico: Boolean })
const emit = defineEmits(['fechar'])

// --- Dados do banco ---
const todosSubservicos = ref([])
const todosServicos = ref([])

// --- Estado da busca / seleção ---
const termoBusca = ref('')
const listaAberta = ref(false)
const subservicoSelecionado = ref(null)
const servicoSelecionado = ref(null)
const listaServAberta = ref(false)
const mostrarFoto = ref(false)

// --- Foto + preço ---
const fileFoto = ref(null)
const previewFoto = ref(null)
const inputFotoRef = ref(null)
const preco = ref('')
const duracao = ref(30)

// --- Filtro inteligente (OR por palavra) ---
const subservicosFiltrados = computed(() => {
  const termo = termoBusca.value.trim().toLowerCase()
  if (!termo) return todosSubservicos.value
  const palavras = termo.split(/\s+/).filter(Boolean)
  return todosSubservicos.value.filter((s) => palavras.some((p) => s.nome.toLowerCase().includes(p)))
})

// --- Carregar dados ---
async function carregarDados() {
  try {
    const [subs, servs] = await Promise.all([apiFetch('/subservicos'), apiFetch('/servicos')])
    todosSubservicos.value = subs
    todosServicos.value = servs
  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  }
}
onMounted(carregarDados)

// --- Ações ---
async function onFocusBusca() {
  await carregarDados()
  listaAberta.value = true
}

function selecionarSubservico(sub) {
  subservicoSelecionado.value = sub
  termoBusca.value = sub.nome
  listaAberta.value = false
  servicoSelecionado.value = null
  mostrarFoto.value = true
}

function criarNovo() {
  subservicoSelecionado.value = null
  listaAberta.value = false
  mostrarFoto.value = false
}

function selecionarServico(serv) {
  servicoSelecionado.value = serv
  listaServAberta.value = false
  mostrarFoto.value = true
}

function onInputBusca() {
  if (subservicoSelecionado.value) {
    subservicoSelecionado.value = null
    servicoSelecionado.value = null
    mostrarFoto.value = false
  }
}

function selecionarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (previewFoto.value) URL.revokeObjectURL(previewFoto.value)
  fileFoto.value = file
  previewFoto.value = URL.createObjectURL(file)
}

function resetar() {
  termoBusca.value = ''
  subservicoSelecionado.value = null
  servicoSelecionado.value = null
  mostrarFoto.value = false
  fileFoto.value = null
  if (previewFoto.value) URL.revokeObjectURL(previewFoto.value)
  previewFoto.value = null
  preco.value = ''
  duracao.value = 30
  listaAberta.value = false
  listaServAberta.value = false
}

function cancelar() {
  resetar()
  emit('fechar')
}

async function salvar() {
  try {
    let idSub = subservicoSelecionado.value?.id

    // Se for novo, cria o subserviço primeiro
    if (!idSub) {
      if (!servicoSelecionado.value) {
        alert('Escolha um serviço para o novo subserviço.')
        return
      }
      const novo = await apiFetch('/subservicos', {
        method: 'POST',
        body: JSON.stringify({
          nome: termoBusca.value.trim(),
          id_servico: servicoSelecionado.value.id,
        }),
      })
      idSub = novo.id
    }

    // Upload da foto (se existir)
    let urlFoto = null
    if (fileFoto.value) {
      const form = new FormData()
      form.append('arquivo', fileFoto.value)
      const res = await apiFetch('/upload/profissional_subservico', {
        method: 'POST',
        body: form,
      })
      urlFoto = res.imagem_url
    }

    // Vincula à profissional
    await apiFetch('/profissional-subservicos', {
      method: 'POST',
      body: JSON.stringify({
        id_subservico: idSub,
        preco: parseFloat(preco.value),
        duracao_minutos: parseInt(duracao.value),
        imagem_url: urlFoto,
      }),
    })

    alert('Subserviço vinculado com sucesso!')
    await carregarDados()
    resetar()
    emit('fechar')
  } catch (e) {
    console.error('Erro ao salvar:', e)
    alert('Erro ao salvar: ' + e.message)
  }
}
</script>

<template>
  <div v-if="abrirSubservico" class="modal-overlay">
    <div class="modal-conteudo">
      <h2 class="modal-titulo">Adicionar Subserviço</h2>
      <p class="modal-subtitulo">Escolha um existente ou crie um novo.</p>

      <form @submit.prevent novalidate class="form-vertical">
        <!-- ETAPA 1: Busca -->
        <label class="modal-campo">
          <span>1. Digite o nome do subserviço</span>
          <div class="relative-container">
            <input type="text" v-model="termoBusca" placeholder="Ex: corte de cabelo, unha em gel..." @focus="onFocusBusca" @click="listaAberta = true" @input="onInputBusca" @blur="listaAberta = false" required />
            <ul v-if="listaAberta && termoBusca.trim() && !subservicoSelecionado" class="dropdown-lista">
              <li class="dropdown-criar" @mousedown.prevent="criarNovo">+ Criar novo subserviço: "{{ termoBusca }}"</li>
              <li v-for="sub in subservicosFiltrados" :key="sub.id" @mousedown.prevent="selecionarSubservico(sub)">
                {{ sub.nome }}
              </li>
            </ul>
          </div>
        </label>

        <!-- ETAPA 2a: Selecionou existente → badge -->
        <div v-if="subservicoSelecionado" class="badge-vinculo">
          <i class="fa-solid fa-link"></i>
          Vinculado a <strong>{{ subservicoSelecionado.nome_servico }}</strong>
          <span v-if="subservicoSelecionado.nome_categoria" class="sub-badge"> ({{ subservicoSelecionado.nome_categoria }}) </span>
        </div>

        <!-- ETAPA 2b: Criar novo → escolher serviço -->
        <label v-if="!subservicoSelecionado && termoBusca.trim()" class="modal-campo">
          <span>2. Vincular a qual serviço?</span>
          <div class="relative-container">
            <input type="text" :value="servicoSelecionado ? `${servicoSelecionado.nome} (${servicoSelecionado.nome_categoria})` : ''" placeholder="Clique para escolher..." readonly @click="listaServAberta = !listaServAberta" @blur="listaServAberta = false" />
            <ul v-if="listaServAberta" class="dropdown-lista">
              <li v-for="serv in todosServicos" :key="serv.id" @mousedown.prevent="selecionarServico(serv)">
                {{ serv.nome }}
                <span class="tag-categoria">- {{ serv.nome_categoria }}</span>
              </li>
            </ul>
          </div>
        </label>

        <!-- ETAPA 3: Foto + preço -->
        <div v-if="mostrarFoto" class="etapa-foto">
          <label class="modal-campo">
            <span>3. Foto (opcional)</span>
            <input ref="inputFotoRef" type="file" accept="image/*" class="input-escondido" @change="selecionarFoto" />
            <button type="button" class="btn-escolher-foto" @click="inputFotoRef.click()"><i class="fa-solid fa-camera"></i> Escolher Foto</button>
            <div v-if="!previewFoto" class="preview-foto preview-vazio">Sem foto</div>
            <img v-else :src="previewFoto" class="preview-foto" />
          </label>

          <div class="campos-extras">
            <label class="modal-campo">
              <span>Preço (R$)</span>
              <input type="number" step="0.01" min="0.01" v-model="preco" placeholder="0,00" required />
            </label>
            <label class="modal-campo">
              <span>Duração (min)</span>
              <input type="number" min="1" v-model="duracao" required />
            </label>
          </div>
        </div>

        <div class="modal-acoes">
          <button type="button" @click="cancelar" class="btn-cancelar">Cancelar</button>
          <button type="button" @click="salvar" class="btn-salvar" :disabled="!mostrarFoto">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Fundo escuro */
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

/* Caixa */
.modal-conteudo {
  background: var(--kp-mahogany);
  padding: 3.5rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(65rem, 90%);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.5);
}

.modal-titulo {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
}

.modal-subtitulo {
  color: var(--kp-creme-low);
  text-align: center;
  font-family: var(--font-body);
  font-size: 1.4rem;
  margin-bottom: 3rem;
}

/* Layout vertical */
.form-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

/* Campos */
.modal-campo {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal-campo > span {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.05em;
}

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
}

.modal-campo input:focus {
  border-color: var(--kp-gold);
  box-shadow: 0 0 0 0.3rem rgba(201, 166, 107, 0.15);
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
}

.dropdown-lista li:hover {
  background: var(--kp-creme);
}

.dropdown-lista li.dropdown-criar {
  color: #7a5c1e;
  font-weight: bold;
  border-bottom: 1px solid rgba(201, 166, 107, 0.2);
}

/* Tag categoria VISÍVEL */
.dropdown-lista .tag-categoria {
  color: #7a5c1e;
  font-size: 1.1rem;
  margin-left: 0.4rem;
  opacity: 1;
}

/* Badge de vínculo */
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

.badge-vinculo i {
  color: var(--kp-gold);
}

.badge-vinculo strong {
  color: var(--kp-gold);
}

.sub-badge {
  color: var(--kp-creme-low);
  font-size: 1.1rem;
}

/* Foto + preço */
.etapa-foto {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.etapa-foto .modal-campo:first-child {
  width: 14rem;
  flex-shrink: 0;
}

.campos-extras {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Botões e imagem */
.input-escondido {
  display: none;
}

.btn-escolher-foto {
  width: 100%;
  padding: 1rem 1.4rem;
  border: 1px solid var(--kp-gold);
  border-radius: 0.8rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-escolher-foto:hover {
  background: #7a2632;
}

.preview-foto {
  width: 14rem;
  height: 14rem;
  border-radius: 8px;
  object-fit: cover;
  align-self: center;
  border: 1px solid var(--kp-gold);
  margin-top: 1rem;
}

.preview-vazio {
  background-color: var(--kp-vinho-low);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kp-creme-low);
  font-size: 1.2rem;
}

/* Ações */
.modal-acoes {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  border-top: 1px solid rgba(201, 166, 107, 0.2);
  padding-top: 2rem;
  margin-top: 1rem;
}

.btn-salvar,
.btn-cancelar {
  padding: 1.1rem 3rem;
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

.btn-salvar:hover:not(:disabled) {
  background: var(--kp-creme);
}

.btn-salvar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-cancelar {
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
}

.btn-cancelar:hover {
  background: rgba(245, 235, 221, 0.1);
}

/* Responsivo */
@media (max-width: 768px) {
  .modal-conteudo {
    padding: 2rem;
  }
  .etapa-foto {
    flex-direction: column;
    align-items: stretch;
  }
  .etapa-foto .modal-campo:first-child {
    width: 100%;
  }
}
</style>
