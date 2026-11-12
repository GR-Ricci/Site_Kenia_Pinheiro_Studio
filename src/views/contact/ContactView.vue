<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/client.js'

const contato = ref({
  telefone: '',
  whatsapp: '',
  email: '',
  rede_social: '',
  endereco: '',
})

onMounted(async () => {
  try {
    contato.value = await apiFetch('/contato')
  } catch (e) {
    console.error('Erro ao carregar contato:', e)
  }
})

function telefoneUrl(numero) {
  if (!numero) return '#'
  return `tel:+55${numero.replace(/\D/g, '')}`
}

function whatsappUrl(numero) {
  if (!numero) return '#'
  const soDigitos = numero.replace(/\D/g, '')
  return `https://wa.me/55${soDigitos}`
}

function instagramUrl(rede) {
  if (!rede) return '#'
  const semArroba = rede.replace('@', '')
  return `https://instagram.com/${semArroba}`
}

// FUNÇÃO ADICIONADA AQUI
function googleMapsUrl(endereco) {
  if (!endereco) return '#'
  const enderecoFormatado = encodeURIComponent(endereco)
  return `https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`
}
</script>

<template>
  <div class="contact">
    <header class="contact__header">
      <p class="contact__eyebrow">Estamos aqui para você</p>
      <h1 class="contact__title">Entre em Contato</h1>
      <p class="contact__subtitle">Agende pelo WhatsApp, ou venha nos visitar!</p>
    </header>

    <div class="contact__content">
      <div class="contact__list">
        <a v-if="contato.telefone" :href="telefoneUrl(contato.telefone)" class="contact__item">
          <div class="contact__item-icon"><i class="fa-solid fa-phone"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">Telefone</p>
            <p class="contact__item-value">{{ contato.telefone }}</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a v-if="contato.whatsapp" :href="whatsappUrl(contato.whatsapp)" target="_blank" rel="noreferrer" class="contact__item">
          <div class="contact__item-icon"><i class="fa-brands fa-whatsapp"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">WhatsApp</p>
            <p class="contact__item-value">{{ contato.whatsapp }}</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a v-if="contato.email" :href="`mailto:${contato.email}`" class="contact__item">
          <div class="contact__item-icon"><i class="fa-solid fa-envelope"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">E-mail</p>
            <p class="contact__item-value">{{ contato.email }}</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a v-if="contato.rede_social" :href="instagramUrl(contato.rede_social)" target="_blank" rel="noreferrer" class="contact__item">
          <div class="contact__item-icon"><i class="fa-brands fa-instagram"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">Instagram</p>
            <p class="contact__item-value">{{ contato.rede_social }}</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <!-- LINK DO MAPS CORRIGIDO AQUI -->
        <a v-if="contato.endereco" :href="googleMapsUrl(contato.endereco)" target="_blank" rel="noreferrer" class="contact__item">
          <div class="contact__item-icon"><i class="fa-solid fa-location-dot"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">Endereço</p>
            <p class="contact__item-value">{{ contato.endereco }}</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>
      </div>

      <div class="contact__signature">
        <span>Kp</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   Página
   ============================================ */
.contact {
  min-height: 100vh;
  background: var(--kp-bg);
}

/* ============================================
   Header
   ============================================ */
.contact__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 185px;
  width: auto;
  background-color: #3d2010;
  color: #f5ebdd;
}

.contact__eyebrow {
  color: #c9a66b;
  font-family: 'Lato', sans-serif;
  letter-spacing: 2px;
  font-size: 12px;
}

.contact__title {
  color: #f5ebdd;
  font-family: 'Playfair Display', serif;
  font-size: 35px;
}

.contact__subtitle {
  color: #f5ebdd72;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
}

/* ============================================
   Lista de contatos
   ============================================ */
.contact__content {
  max-width: 60rem;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.contact__list {
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.2rem;
  overflow: hidden;
}

.contact__item {
  display: flex;
  align-items: center;
  gap: 1.6rem;

  padding: 1.6rem 2.4rem;

  background: var(--kp-card-bg);
  border-bottom: 1px solid var(--kp-gold-border);

  text-decoration: none;
  transition: background 200ms ease-in-out;
}

.contact__item:last-child {
  border-bottom: none;
}

.contact__item:nth-child(even) {
  background: rgba(250, 247, 242, 0.7);
}

.contact__item:hover {
  background: #fff8f0;
}

/* ícone circular */
.contact__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  background: rgba(101, 31, 42, 0.07);
  color: var(--kp-vinho);
  font-size: 1.7rem;
}

/* texto */
.contact__item-text {
  flex: 1;
  min-width: 0;
}

.contact__item-desc {
  font-family: var(--font-body);
  font-size: 1.2rem;
  color: var(--kp-text-soft);
}

.contact__item-value {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--kp-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* seta (só aparece no hover) */
.contact__item-arrow {
  flex-shrink: 0;
  color: var(--kp-gold);
  font-size: 1.5rem;

  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.contact__item:hover .contact__item-arrow {
  opacity: 1;
}

/* ============================================
   Assinatura
   ============================================ */
.contact__signature {
  margin-top: 3rem;
  text-align: right;
}

.contact__signature span {
  font-family: var(--font-script);
  font-size: 2rem;
  color: var(--kp-gold);
}
</style>
