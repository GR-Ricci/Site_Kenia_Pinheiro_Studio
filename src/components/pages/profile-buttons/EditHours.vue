<script setup>
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/client.js'

const props = defineProps({ editarHorario: Boolean })
const emit = defineEmits(['fechar'])

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const dias = ref([]) // [{dia, horarios: [{abertura, fechamento}]}]
const carregando = ref(false)
const editandoDia = ref(null) // dia number ou null
const editSlots = ref([]) // [{abertura, fechamento}]

async function carregar() {
  carregando.value = true
  try {
    dias.value = await apiFetch('/funcionamento')
  } catch (e) {
    alert('Erro ao carregar: ' + e.message)
  } finally {
    carregando.value = false
  }
}
onMounted(() => {
  if (props.editarHorario) carregar()
})
watch(
  () => props.editarHorario,
  (aberto) => {
    if (aberto) {
      resetar()
      carregar()
    }
  },
)

function resetar() {
  editandoDia.value = null
  editSlots.value = []
}

function iniciarEdicao(dia) {
  editandoDia.value = dia.dia
  editSlots.value = dia.horarios.map((horario) => ({ ...horario }))
}

function adicionarSlot() {
  editSlots.value.push({ abertura: '09:00', fechamento: '18:00' })
}

function removerSlot(i) {
  editSlots.value.splice(i, 1)
}

function cancelar() {
  resetar()
}

async function salvarDia() {
  try {
    await apiFetch(`/funcionamento/${editandoDia.value}`, {
      method: 'PUT',
      body: JSON.stringify({ horarios: editSlots.value }),
    })
    editandoDia.value = null
    await carregar()
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
  <div v-if="editarHorario" class="modal-overlay">
    <div class="modal-conteudo">
      <header class="modal-header">
        <div>
          <h2 class="modal-titulo">Horários de Funcionamento</h2>
          <p class="modal-subtitulo">Defina os horários de cada dia. Sem horários = fechado.</p>
        </div>
        <button @click="fechar" class="btn-fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="modal-body">
        <p v-if="carregando" class="empty-text">Carregando...</p>

        <div v-else class="dias-lista">
          <div v-for="dia in dias" :key="dia.dia" class="dia-card">
            <div class="dia-header">
              <h3 class="dia-titulo">{{ DIAS[dia.dia] }}</h3>
              <template v-if="editandoDia !== dia.dia">
                <span v-if="dia.horarios.length === 0" class="fechado-badge">Fechado</span>
                <span v-else class="horarios-resumo">
                  <span v-for="(v, i) in dia.horarios" :key="i">
                    {{ v.abertura }} - {{ v.fechamento }}
                    <template v-if="i < dia.horarios.length - 1"> · </template>
                  </span>
                </span>
                <button class="btn-small btn-edit" @click="iniciarEdicao(dia)">
                  <i class="fa-solid fa-pen"></i>
                </button>
              </template>
            </div>

            <div v-if="editandoDia === dia.dia" class="edit-form">
              <p v-if="editSlots.length === 0" class="aviso-fechado">Sem horários — este dia ficará como <strong>Fechado</strong>.</p>

              <div v-for="(v, i) in editSlots" :key="i" class="slot-row">
                <input type="time" v-model="v.abertura" />
                <span class="slot-sep">até</span>
                <input type="time" v-model="v.fechamento" />
                <button type="button" class="btn-small btn-delete" @click="removerSlot(i)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <button type="button" class="btn-add-slot" @click="adicionarSlot">+ Adicionar horário</button>

              <div class="edit-acoes">
                <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
                <button type="button" class="btn-salvar" @click="salvarDia">Salvar</button>
              </div>
            </div>
          </div>
        </div>
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
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  width: min(65rem, 95%);
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
}
.dias-lista {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.dia-card {
  background: rgba(245, 235, 221, 0.04);
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  padding: 1.2rem 1.4rem;
}
.dia-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.dia-titulo {
  flex: 1;
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 1.6rem;
}
.horarios-resumo {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.3rem;
}
.fechado-badge {
  padding: 0.2rem 0.8rem;
  background: rgba(255, 77, 77, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 77, 77, 0.4);
  border-radius: 99rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
}
.edit-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(201, 166, 107, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.aviso-fechado {
  color: var(--kp-creme-low);
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-style: italic;
}
.slot-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.slot-row input[type='time'] {
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.5rem;
  background: var(--kp-creme);
  color: var(--kp-text);
  font-family: var(--font-body);
  font-size: 1.3rem;
  outline: none;
}
.slot-sep {
  color: var(--kp-creme);
  font-size: 1.2rem;
  font-family: var(--font-body);
}
.btn-add-slot {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px dashed var(--kp-gold-border);
  color: var(--kp-gold);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: 1.2rem;
  cursor: pointer;
}
.btn-add-slot:hover {
  background: rgba(201, 166, 107, 0.1);
  border-style: solid;
}
.edit-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.4rem;
}
.btn-small {
  padding: 0.5rem 0.9rem;
  border-radius: 0.4rem;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
.btn-edit {
  background: var(--kp-vinho);
  color: var(--kp-creme);
}
.btn-delete {
  background: #8a2a2a;
  color: var(--kp-creme);
}
.btn-cancelar,
.btn-salvar {
  padding: 0.7rem 1.6rem;
  border-radius: 99rem;
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-cancelar {
  background: transparent;
  color: var(--kp-creme);
  border: 1px solid var(--kp-gold-border);
}
.btn-salvar {
  background: var(--kp-gold);
  color: var(--kp-vinho);
  border: 1px solid var(--kp-gold);
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
  .slot-row {
    flex-wrap: wrap;
  }
}
</style>
