<script setup>
// Nome multi-palavra exigido pela regra do ESLint (vue/multi-word-component-names).
defineOptions({ name: 'ConfirmDialog' })

// Props controlam a visibilidade e os textos exibidos.
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'Prosseguir com as alterações?' },
  confirmLabel: { type: String, default: 'Sim' },
  cancelLabel: { type: String, default: 'Não' },
})

// Eventos enviados ao componente pai quando o usuário decide.
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <!-- Overlay escurecido cobrindo a tela; aparece só quando `visible` é true -->
  <div v-if="visible" class="-overlay">
    <div class="-dialog">
      <p class="-dialog__title">{{ title }}</p>

      <div class="-dialog__actions">
        <button
          class="-dialog__btn -dialog__btn--confirm"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
        <button
          class="-dialog__btn -dialog__btn--cancel"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Overlay ────────────────────────────────────────────────────────────── */
.-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* ─── Diálogo ────────────────────────────────────────────────────────────── */
.-dialog {
  background: var(--kp-card-bg, #ffffff);
  border-radius: 12px;
  padding: 32px 40px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  text-align: center;
  min-width: 320px;
  max-width: 90vw;
}

.-dialog__title {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 1.25rem;
  color: var(--kp-vinho, #6b1d2c);
  margin: 0 0 24px 0;
}

.-dialog__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* ─── Botões ─────────────────────────────────────────────────────────────── */
.-dialog__btn {
  padding: 8px 28px;
  border-radius: 50px;
  border: 1px solid var(--kp-gold-border, #c4a484);
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.-dialog__btn--confirm {
  background-color: var(--kp-vinho, #6b1d2c);
  color: var(--kp-bg, #fcfaf5);
  border-color: var(--kp-vinho, #6b1d2c);
}

.-dialog__btn--confirm:hover {
  background-color: #521822;
}

.-dialog__btn--cancel {
  background-color: transparent;
  color: var(--kp-text, #4a2c2a);
}

.-dialog__btn--cancel:hover {
  background-color: rgba(196, 164, 132, 0.12);
}
</style>
