<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

const contato = ref(null)

async function carregarContato() {
  try {
    contato.value = await apiFetch('/contato')
  } catch (e) {
    console.warn('Erro ao buscar contato:', e)
  }
}

function whatsappLink() {
  const numBruto = contato.value?.whatsapp || contato.value?.telefone || '5516992568812'
  let num = String(numBruto).replace(/\D/g, '')
  if (num && !num.startsWith('55')) num = '55' + num
  return `https://wa.me/${num}?text=${encodeURIComponent('Olá! Gostaria de reservar um horário.')}`
}

onMounted(carregarContato)
</script>

<template>
  <section class="-section-cta">
    <div class="-container">
      <span class="-cta__eyebrow">Pronta para uma nova versão de si mesma?</span>
      <h2 class="-cta__title">Reserve seu horário hoje</h2>

      <a :href="whatsappLink()" target="_blank" rel="noopener" class="-cta__btn"> Agendar Agora </a>
    </div>
  </section>
</template>

<style scoped>
.-section-cta {
  background: var(--kp-bg);
  padding: 10rem 0;
  text-align: center;
}
.-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 3rem;
}
.-cta__eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--kp-gold);
  margin-bottom: 2rem;
}
.-cta__title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 4.8rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--kp-vinho);
  margin: 0 0 4rem;
}
.-cta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem 4rem;
  background: var(--kp-vinho);
  color: var(--kp-creme);
  border: 1px solid var(--kp-vinho);
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 250ms ease;
}
.-cta__btn:hover {
  background: transparent;
  color: var(--kp-vinho);
}
</style>
