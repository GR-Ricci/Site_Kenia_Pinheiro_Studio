<script setup>
import { computed, ref } from 'vue'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X } from '@lucide/vue'
import GoldRule from '@/components/ui/GoldRule.vue'
import { TIME_SLOTS, UNAVAILABLE } from '@/data/services'

defineProps({
  item: { type: Object, required: true },
})

defineEmits(['close'])

const month = ref(new Date())
const selDate = ref(null)
const selTime = ref(null)
const done = ref(false)

const today = startOfDay(new Date())

const days = computed(() =>
  eachDayOfInterval({
    start: startOfMonth(month.value),
    end: endOfMonth(month.value),
  }),
)
const pad = computed(() => getDay(startOfMonth(month.value)))
const monthLabel = computed(() =>
  format(month.value, 'MMMM yyyy', { locale: ptBR }),
)

const prevMonth = () => {
  const p = subMonths(month.value, 1)
  if (!isBefore(endOfMonth(p), today)) month.value = p
}
const nextMonth = () => (month.value = addMonths(month.value, 1))

// Domingo é fechado (ver HOURS), e datas passadas não são selecionáveis.
const isOff = (day) => isBefore(day, today) || getDay(day) === 0
const isOn = (day) => (selDate.value ? isSameDay(day, selDate.value) : false)

const pickDay = (day) => {
  if (isOff(day)) return
  selDate.value = day
  selTime.value = null
}

const dayLabel = (day) => format(day, 'd')
const selDateLabel = computed(() =>
  selDate.value ? format(selDate.value, 'EEE dd/MM', { locale: ptBR }) : '',
)
const doneDateLabel = computed(() =>
  selDate.value ? format(selDate.value, "dd 'de' MMMM", { locale: ptBR }) : '',
)
</script>

<template>
  <Teleport to="body">
    <!-- Confirmação -->
    <div v-if="done" class="overlay overlay--center">
      <div class="done">
        <div class="done__check"><span>✓</span></div>
        <h3 class="done__title">Agendamento Confirmado!</h3>
        <p class="done__line">{{ item.name }}</p>
        <p v-if="selDate" class="done__line">
          {{ doneDateLabel }} às {{ selTime }}
        </p>
        <p class="done__note">Você receberá a confirmação via WhatsApp.</p>
        <button class="done__btn" @click="$emit('close')">Fechar</button>
      </div>
    </div>

    <!-- Calendário -->
    <div v-else class="overlay" @click="$emit('close')">
      <div class="sheet" @click.stop>
        <div class="sheet__head">
          <div>
            <p class="sheet__kicker">Agendar</p>
            <h3 class="sheet__title">{{ item.name }}</h3>
            <p class="sheet__price">{{ item.price }}</p>
          </div>
          <button
            class="sheet__close"
            aria-label="Fechar"
            @click="$emit('close')"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="p-5">
          <div class="mb-4 flex items-center justify-between">
            <button
              class="cal__nav"
              aria-label="Mês anterior"
              @click="prevMonth"
            >
              <ChevronLeft :size="16" />
            </button>
            <span class="cal__month">{{ monthLabel }}</span>
            <button
              class="cal__nav"
              aria-label="Próximo mês"
              @click="nextMonth"
            >
              <ChevronRight :size="16" />
            </button>
          </div>

          <div class="mb-1 grid grid-cols-7">
            <div
              v-for="(d, i) in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
              :key="i"
              class="cal__dow"
            >
              {{ d }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-y-1">
            <div v-for="n in pad" :key="`pad-${n}`" />
            <button
              v-for="day in days"
              :key="day.toISOString()"
              class="cal__day"
              :class="{
                'cal__day--on': isOn(day),
                'cal__day--off': isOff(day),
              }"
              :disabled="isOff(day)"
              @click="pickDay(day)"
            >
              {{ dayLabel(day) }}
            </button>
          </div>

          <div v-if="selDate" class="mt-5">
            <GoldRule />
            <p class="cal__slots-title">
              Horários — <span class="cal__slots-date">{{ selDateLabel }}</span>
            </p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="t in TIME_SLOTS"
                :key="t"
                class="slot"
                :class="{
                  'slot--on': selTime === t,
                  'slot--off': UNAVAILABLE.includes(t),
                }"
                :disabled="UNAVAILABLE.includes(t)"
                @click="selTime = t"
              >
                {{ t }}
              </button>
            </div>
          </div>

          <button
            v-if="selDate && selTime"
            class="confirm"
            @click="done = true"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.overlay--center {
  align-items: center;
  padding: 1rem;
}

.sheet {
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 1rem 1rem 0 0;
  background: var(--kp-bg);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@media (min-width: 640px) {
  .overlay {
    align-items: center;
    padding: 1rem;
  }

  .sheet {
    max-width: 28rem;
    border-radius: 0.75rem;
  }
}

.sheet__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--kp-vinho);
  border-radius: 1rem 1rem 0 0;
}

.sheet__kicker {
  margin-bottom: 0.125rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(201, 166, 107, 0.8);
}

.sheet__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--kp-creme);
}

.sheet__price {
  margin-top: 0.125rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--kp-gold);
}

.sheet__close {
  color: rgba(245, 235, 221, 0.5);
}

.cal__nav {
  padding: 0.375rem;
  border-radius: 9999px;
  color: var(--kp-text);
}

.cal__nav:hover {
  background: rgba(0, 0, 0, 0.05);
}

.cal__month {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  color: var(--kp-text);
}

.cal__dow {
  padding: 0.25rem 0;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--kp-text-soft);
}

.cal__day {
  width: 2rem;
  height: 2rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--kp-text);
  transition: background-color 0.2s;
}

.cal__day--on {
  background: var(--kp-vinho);
  color: var(--kp-creme);
}

.cal__day--off {
  color: rgba(30, 18, 10, 0.22);
  cursor: not-allowed;
}

.cal__slots-title {
  margin: 0.75rem 0 0.625rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--kp-text-mid);
}

.cal__slots-date {
  font-weight: 500;
  text-transform: capitalize;
  color: var(--kp-gold);
}

.slot {
  padding: 0.5rem 0;
  border-radius: 0.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--kp-text);
  border: 1px solid var(--kp-gold-border);
  background: transparent;
  transition: all 0.2s;
}

.slot--on {
  background: var(--kp-vinho);
  border-color: var(--kp-vinho);
  color: var(--kp-creme);
}

.slot--off {
  color: var(--kp-text-soft);
  text-decoration: line-through;
  cursor: not-allowed;
}

.confirm {
  margin-top: 1.25rem;
  width: 100%;
  padding: 0.75rem 0;
  border-radius: 0.25rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
}

/* ─── Confirmação ─────────────────────────────────────────────────────────── */

.done {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;
  text-align: center;
  border-radius: 0.75rem;
  background: var(--kp-bg);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.done__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border-radius: 9999px;
  background: rgba(101, 31, 42, 0.08);
  color: var(--kp-vinho);
  font-size: 1.3rem;
}

.done__title {
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--kp-vinho);
}

.done__line {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--kp-text-mid);
}

.done__note {
  margin-top: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--kp-text-soft);
}

.done__btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.625rem 0;
  border-radius: 0.25rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
