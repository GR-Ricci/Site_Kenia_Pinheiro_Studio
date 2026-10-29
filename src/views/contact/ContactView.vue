<script setup></script>

<template>
  <div class="contact">
    <header class="contact__header">
      <p class="contact__eyebrow">Estamos aqui para você</p>
      <h1 class="contact__title">Entre em Contato</h1>
      <p class="contact__subtitle">Agende pelo WhatsApp, ou venha nos visitar!</p>
    </header>

    <div class="contact__content">
      <div class="contact__list">
        <a href="tel:+5516992068812" class="contact__item">
          <div class="contact__item-icon"><i class="fa-solid fa-phone"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">Telefone</p>
            <p class="contact__item-value">(16) 99206-8812</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a href="https://wa.me/5516992068812" target="_blank" rel="noreferrer" class="contact__item">
          <div class="contact__item-icon"><i class="fa-brands fa-whatsapp"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">WhatsApp</p>
            <p class="contact__item-value">(16) 99206-8812</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a href="mailto:keniapinheirostudio@gmail.com" class="contact__item">
          <div class="contact__item-icon"><i class="fa-solid fa-envelope"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">E-mail</p>
            <p class="contact__item-value">keniapinheirostudio@gmail.com</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a href="https://instagram.com/keniapinheirostudio" target="_blank" rel="noreferrer" class="contact__item">
          <div class="contact__item-icon"><i class="fa-brands fa-instagram"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">Instagram</p>
            <p class="contact__item-value">@keniapinheirostudio</p>
          </div>
          <i class="fa-solid fa-arrow-right contact__item-arrow"></i>
        </a>

        <a href="https://maps.google.com" target="_blank" rel="noreferrer" class="contact__item">
          <div class="contact__item-icon"><i class="fa-solid fa-location-dot"></i></div>
          <div class="contact__item-text">
            <p class="contact__item-desc">Endereço</p>
            <p class="contact__item-value">Rua Expedicionário Lellis, 1703 — Centro, Sertãozinho SP</p>
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
  padding: 3.5rem 1rem;
  text-align: center;
  background: var(--kp-mahogany);
  border-bottom: 2px solid var(--kp-gold);
}

.contact__eyebrow {
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--kp-gold);
}

.contact__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: var(--kp-creme);
  line-height: 1.2;
  margin-top: 0.8rem;
}

.contact__subtitle {
  font-family: var(--font-body);
  font-size: 1.4rem;
  color: rgba(245, 235, 221, 0.55);
  max-width: 40rem;
  margin: 1.2rem auto 0;
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
