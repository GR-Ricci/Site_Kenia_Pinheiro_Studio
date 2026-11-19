<script setup>
import { computed } from 'vue'

//modularização
const props = defineProps({ senha: { type: String, default: '' } })

//regras
const regraTamanho = computed(() => props.senha.length >= 8 && props.senha.length <= 16)
const regraMaiuscula = computed(() => /[A-Z]/.test(props.senha))
const regraNumero = computed(() => /[0-9]/.test(props.senha))
const regraRepeticao = computed(() => !/(.)\1\1/.test(props.senha)) // Regex que checa 3 caracteres iguais seguidos
</script>

<template>
  <div class="caixa-regras">
    <p :class="senha.length > 0 ? (regraTamanho ? 'valida' : 'invalida') : ''">• Entre 8 e 16 caracteres</p>
    <p :class="senha.length > 0 ? (regraMaiuscula ? 'valida' : 'invalida') : ''">• Pelo menos uma letra maiúscula</p>
    <p :class="senha.length > 0 ? (regraNumero ? 'valida' : 'invalida') : ''">• Pelo menos um número</p>
    <p :class="senha.length > 0 ? (regraRepeticao ? 'valida' : 'invalida') : ''">• Não pode repetir 3 caracteres seguidos</p>
  </div>
</template>

<style scoped>
.caixa-regras {
  background: rgba(0, 0, 0, 0.2); /* Fundo escuro pra destacar */
  border: 1px solid var(--kp-gold-border);
  padding: 1rem;
  border-radius: 0.8rem;
  margin-top: 0.5rem;
  color: var(--kp-creme-low);
  font-size: 1.2rem;
}

.caixa-regras p {
  margin-bottom: 0.4rem;
  transition: color 0.2s ease; /* Pra mudar de cor suavemente */
}

.caixa-regras .invalida {
  color: #ff4d4d; /* Vermelho */
}

.caixa-regras .valida {
  color: #25d366; /* Verde (igual do WhatsApp) */
}
</style>
