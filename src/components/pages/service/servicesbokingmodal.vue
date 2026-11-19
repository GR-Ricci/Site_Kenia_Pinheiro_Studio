<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({
  servico: Object,
})
const emit = defineEmits(['close'])

let _cache = null
async function loadBaseData() {
  if (_cache) return _cache

  const [subs, staff] = await Promise.all([apiFetch('/subservicos'), apiFetch('/staff')])

  const profissionais = staff.filter((s) => s.id_profissional !== null && s.id_profissional !== undefined)

  const vinculosPorProf = await Promise.all(profissionais.map((p) => apiFetch(`/profissional-subservicos/${p.id_profissional}`).catch(() => [])))
  const vinculos = vinculosPorProf.flat()

  _cache = { subservicos: subs, profissionais, vinculos }
  return _cache
}

const subservicos = ref([])
const profissionais = ref([])
const vinculos = ref([])
const loading = ref(true)
const errorMsg = ref(null)

// --- ESTADO DO CONTATO DO SALÃO ---
const contatoSalao = ref(null)

const currentStep = ref('professional')
const selectedProfessional = ref(null)
const selectedSubservice = ref(null)

function urlImagemServico(nome) {
  if (!nome) return null
  if (nome.startsWith('http')) return nome
  return `${import.meta.env.VITE_API_URL}/upload/servico/${nome}`
}

function urlImagemProfissional(nome) {
  if (!nome) return null
  if (nome.startsWith('http')) return nome
  return `${import.meta.env.VITE_API_URL}/upload/perfil/${nome}`
}

function urlImagemVinculo(nome) {
  if (!nome) return null
  if (nome.startsWith('http')) return nome
  return `${import.meta.env.VITE_API_URL}/upload/profissional_subservico/${nome}`
}

function formatarPreco(v) {
  if (v == null) return ''
  return `R$ ${Number(v).toFixed(2).replace('.', ',')}`
}

function inicial(nome) {
  return (nome || '?').charAt(0).toUpperCase()
}

async function carregar() {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await loadBaseData()
    subservicos.value = data.subservicos
    profissionais.value = data.profissionais
    vinculos.value = data.vinculos

    // Busca o contato do salão na rota correta (/contato)
    try {
      const contato = await apiFetch('/contato')
      contatoSalao.value = contato
    } catch (e) {
      console.warn('Rota /contato falhou.', e)
    }
  } catch (e) {
    errorMsg.value = e.message || 'Erro ao carregar dados'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(carregar)

const subToServicoMap = computed(() => {
  const map = new Map()
  subservicos.value.forEach((s) => map.set(s.id, s.id_servico))
  return map
})

const availableProfessionals = computed(() => {
  if (!props.servico) return []
  const profIds = new Set(vinculos.value.filter((v) => v.ativo !== false && subToServicoMap.value.get(v.id_subservico) === props.servico.id).map((v) => v.id_profissional))
  return profissionais.value.filter((p) => profIds.has(p.id_profissional))
})

const availableSubservices = computed(() => {
  if (!selectedProfessional.value || !props.servico) return []
  return vinculos.value
    .filter((v) => v.id_profissional === selectedProfessional.value.id_profissional && v.ativo !== false && subToServicoMap.value.get(v.id_subservico) === props.servico.id)
    .map((v) => ({
      id: v.id_subservico,
      nome: v.nome_subservico || '—',
      descricao: v.descricao || '',
      preco: v.preco,
      duracao_minutos: v.duracao_minutos,
      imagem_url: v.imagem_url,
    }))
})

function selectProfessional(p) {
  selectedProfessional.value = p
  currentStep.value = 'subservice'
}

function selectSubservice(s) {
  selectedSubservice.value = s
  currentStep.value = 'booking'
}

function goBack() {
  if (currentStep.value === 'subservice') {
    selectedProfessional.value = null
    currentStep.value = 'professional'
  } else if (currentStep.value === 'booking') {
    selectedSubservice.value = null
    currentStep.value = 'subservice'
  }
}

const stepLabel = computed(
  () =>
    ({
      professional: '1 / 3',
      subservice: '2 / 3',
      booking: '3 / 3',
    })[currentStep.value] ?? '',
)

const instructions = computed(
  () =>
    ({
      professional: 'Escolha o profissional ideal para você.',
      subservice: 'Confira as modalidades disponíveis.',
      booking: 'Confirme os detalhes e envie a mensagem no WhatsApp.',
    })[currentStep.value] ?? '',
)

// --- MENSAGEM DO WHATSAPP VINCULADA AO CONTATO ---
const whatsappLink = computed(() => {
  if (!selectedProfessional.value || !selectedSubservice.value) return '#'

  // Pega o WhatsApp salvo no banco (EditAbout), se não tiver, tenta o telefone
  const numeroBruto = contatoSalao.value?.whatsapp || contatoSalao.value?.telefone || ''

  // Remove tudo que não for número
  let numeroLimpo = String(numeroBruto).replace(/\D/g, '')

  // Se o número existir mas não tiver o DDI 55 (Brasil), adiciona
  if (numeroLimpo && !numeroLimpo.startsWith('55')) {
    numeroLimpo = '55' + numeroLimpo
  }

  const partes = [`Olá! Gostaria de agendar: *${selectedSubservice.value.nome}*`, `- com: ${selectedProfessional.value.nome}`]

  if (selectedSubservice.value.preco != null) {
    partes.push(`- valor: ${formatarPreco(selectedSubservice.value.preco)}`)
  }

  // Rodapé discreto
  partes.push('')
  partes.push('_Mensagem enviada pelo site._')

  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(partes.join('\n'))}`
})
</script>

<template>
  <section class="Services_booking_modal">
    <div class="-Services_booking_modal_background" @click.self="emit('close')">
      <div class="-Services_booking_modal">
        <div class="-Services_booking_modal_image" :style="servico.imagem_url ? { backgroundImage: `url(${urlImagemServico(servico.imagem_url)})` } : {}">
          <div class="-Services_booking_modal_image_text">
            <p>SERVIÇO</p>
            <h1>{{ servico.nome }}</h1>
          </div>
          <button class="-Services_booking_modal_close" aria-label="Fechar" @click="emit('close')">
            <i class="fa-solid fa-x"></i>
          </button>
        </div>

        <div class="-Services_booking_modal_content">
          <div class="-Services_booking_modal_nav">
            <button v-if="currentStep !== 'professional'" class="-Services_booking_modal_back" @click="goBack">
              <i class="fa-solid fa-arrow-left"></i>
              Voltar
            </button>
            <span v-else></span>
            <span class="-Services_booking_modal_step">{{ stepLabel }}</span>
          </div>

          <p class="-Services_booking_modal_instructions">{{ instructions }}</p>

          <p v-if="loading" class="-msg">Carregando...</p>
          <p v-else-if="errorMsg" class="-msg -msg-error">{{ errorMsg }}</p>

          <!-- ETAPA 1: PROFISSIONAL -->
          <div v-else-if="currentStep === 'professional'" class="-Services_booking_modal_choice">
            <p v-if="availableProfessionals.length === 0" class="-msg">Nenhuma profissional disponível para este serviço.</p>
            <button v-for="professional in availableProfessionals" :key="professional.id_profissional" class="-Services_booking_modal_choice_button" @click="selectProfessional(professional)">
              <img v-if="professional.imagem_url" :src="urlImagemProfissional(professional.imagem_url)" :alt="professional.nome" />
              <div v-else class="-avatar">{{ inicial(professional.nome) }}</div>
              <div class="-Services_booking_modal_choice_button_info">
                <h1>{{ professional.nome }}</h1>
              </div>
              <i class="fa-solid fa-arrow-right -arrow"></i>
            </button>
          </div>

          <!-- ETAPA 2: SUBSERVIÇO -->
          <div v-else-if="currentStep === 'subservice'" class="-Services_booking_modal_choice">
            <p v-if="availableSubservices.length === 0" class="-msg">Esta profissional não tem modalidades para este serviço.</p>
            <button v-for="subservice in availableSubservices" :key="subservice.id" class="-Services_booking_modal_choice_button" @click="selectSubservice(subservice)">
              <img v-if="subservice.imagem_url" :src="urlImagemVinculo(subservice.imagem_url)" :alt="subservice.nome" />
              <div v-else class="-avatar">{{ inicial(subservice.nome) }}</div>
              <div class="-Services_booking_modal_choice_button_info">
                <h1>{{ subservice.nome }}</h1>

                <p v-if="subservice.descricao" class="-desc-subservice">
                  {{ subservice.descricao }}
                </p>

                <p v-if="subservice.preco != null || subservice.duracao_minutos">
                  <span v-if="subservice.preco != null">{{ formatarPreco(subservice.preco) }}</span>
                  <span v-if="subservice.preco != null && subservice.duracao_minutos"> · </span>
                  <span v-if="subservice.duracao_minutos">{{ subservice.duracao_minutos }} min</span>
                </p>
              </div>
              <i class="fa-solid fa-arrow-right -arrow"></i>
            </button>
          </div>

          <!-- ETAPA 3: RESUMO / WHATSAPP -->
          <div v-else-if="currentStep === 'booking'" class="-Services_booking_booking">
            <div class="-Services_booking_summary">
              <div class="-Services_booking_summary_row">
                <span>Serviço</span>
                <strong>{{ servico.nome }}</strong>
              </div>
              <div class="-Services_booking_summary_row">
                <span>Profissional</span>
                <strong>{{ selectedProfessional.nome }}</strong>
              </div>
              <div class="-Services_booking_summary_row">
                <span>Modalidade</span>
                <strong>{{ selectedSubservice.nome }}</strong>
              </div>

              <div v-if="selectedSubservice.descricao" class="-Services_booking_summary_row -desc-row">
                <span>Detalhes</span>
                <strong class="-desc-text">{{ selectedSubservice.descricao }}</strong>
              </div>

              <div v-if="selectedSubservice.duracao_minutos" class="-Services_booking_summary_row">
                <span>Duração</span>
                <strong>{{ selectedSubservice.duracao_minutos }} min</strong>
              </div>
              <div v-if="selectedSubservice.preco != null" class="-Services_booking_summary_row">
                <span>Valor</span>
                <strong>{{ formatarPreco(selectedSubservice.preco) }}</strong>
              </div>
            </div>

            <a :href="whatsappLink" target="_blank" rel="noopener" class="-Services_booking_whatsapp">
              <i class="fa-brands fa-whatsapp"></i>
              Enviar mensagem no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.-Services_booking_modal_background {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background: #00000099;
  padding: 16px;
}

.-Services_booking_modal {
  width: min(560px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #faf7f2;
  border: 1px solid #c9a66b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.-Services_booking_modal_image {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 16px;
  width: 100%;
  height: 140px;
  flex-shrink: 0;
  background-color: #3d2010;
  background-image: linear-gradient(135deg, #6b1d2c, #3d2010);
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid #c9a66b;
}

.-Services_booking_modal_image_text {
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(30, 18, 10, 0.72);
}

.-Services_booking_modal_image_text p {
  color: #c9a66b;
  font-family: 'Lato', sans-serif;
  font-size: 10.5px;
  letter-spacing: 2px;
  font-weight: 600;
  margin: 0 0 2px;
}

.-Services_booking_modal_image_text h1 {
  color: #f5ebdd;
  font-family: 'Playfair Display', serif;
  font-size: 19px;
  font-weight: 700;
  margin: 0;
  line-height: 1.15;
}

.-Services_booking_modal_close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(250, 247, 242, 0.9);
  color: #651f2a;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.-Services_booking_modal_close:hover {
  transform: scale(1.08);
  background: #c9a66b;
  color: #faf7f2;
}

.-Services_booking_modal_content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 18px 20px 22px;
  overflow: hidden;
}

.-Services_booking_modal_nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.-Services_booking_modal_back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 50px;
  border: 1px solid #c9a66b;
  background: transparent;
  color: #651f2a;
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.-Services_booking_modal_back:hover {
  background: rgba(201, 166, 107, 0.15);
}

.-Services_booking_modal_step {
  font-family: 'Lato', sans-serif;
  font-size: 11px;
  letter-spacing: 1px;
  color: #c9a66b;
  font-weight: 600;
}

.-Services_booking_modal_instructions {
  font-family: 'Lato', sans-serif;
  color: #3d2010cc;
  font-size: 13px;
  margin: 0 0 16px;
}

.-msg {
  font-family: 'Lato', sans-serif;
  color: #3d2010aa;
  font-size: 13px;
  text-align: center;
  font-style: italic;
  padding: 20px 0;
  margin: 0;
}

.-msg-error {
  color: #8a2a2a;
}

.-Services_booking_modal_choice {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 2px;
}

.-Services_booking_modal_choice_button {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid #c9a66b;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.-Services_booking_modal_choice_button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.-Services_booking_modal_choice_button img,
.-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #651f2a;
  color: #f5ebdd;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 700;
  clip-path: circle(50%);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.-Services_booking_modal_choice_button_info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.-Services_booking_modal_choice_button_info h1 {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 700;
  color: #3d2010;
  margin: 0;
}

.-desc-subservice {
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  color: #3d2010cc;
  margin: 4px 0 0 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
  word-break: break-word;
}

.-Services_booking_modal_choice_button_info p:not(.-desc-subservice) {
  color: #651f2a;
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  font-weight: 600;
  margin: 2px 0 0;
}

.-arrow {
  color: #c9a66b;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.-Services_booking_modal_choice_button:hover .-arrow {
  transform: translateX(4px);
}

.-Services_booking_booking {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.-Services_booking_summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #c9a66b80;
  border-radius: 12px;
}

.-Services_booking_summary_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  gap: 12px;
}

.-Services_booking_summary_row span {
  color: #3d2010aa;
  flex-shrink: 0;
}

.-Services_booking_summary_row strong {
  color: #651f2a;
  font-weight: 600;
  text-align: right;
}

.-desc-row {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-top: 1px dashed #c9a66b80;
  padding-top: 8px;
  margin-top: 4px;
}

.-desc-text {
  font-weight: 400 !important;
  font-size: 12px !important;
  color: #3d2010 !important;
  white-space: pre-line;
  word-break: break-word;
  text-align: left !important;
  line-height: 1.4;
}

.-Services_booking_whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  background: #25d366;
  color: #ffffff;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  font-weight: 700;
  border-radius: 50px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.-Services_booking_whatsapp:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.35);
  background: #1fbe5a;
}

.-Services_booking_whatsapp i {
  font-size: 18px;
}
</style>
