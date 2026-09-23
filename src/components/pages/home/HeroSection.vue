<script setup>
import { RouterLink } from 'vue-router'
import { whatsappLink } from '@/data/studio.js'
</script>

<template>
  <section class="-section-hero">
  <img
         class="kenia__foto"
          src="@/assets/images/home/cover01.jpeg"
          alt="Kenia Pinheiro"
          />
    <div class="-hero__overlay" aria-hidden="true"></div>
    
    <div class="-container">
      <div class="-hero__content">
        <span class="-hero__eyebrow">Sertãozinho · SP</span>

        <h1 class="-hero__logo">Kp</h1>
        <span class="-hero__studio">Studio</span>

        <p class="-hero__subtitle">
          Especialistas em realizar a beleza natural dos seus cachos
        </p>

        <div class="-hero__actions">
          <a
            :href="whatsappLink()"
            target="_blank"
            rel="noopener"
            class="-hero__btn -hero__btn--filled"
          >
            Agendar Horário
          </a>

        </div>
      </div>
    </div>

    <a href="#services" class="-hero__scroll" aria-label="Rolar para serviços">
      <i class="fas fa-chevron-down"></i>
    </a>
  </section>
</template>

<style scoped>
.-section-hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--kp-mahogany);
}

.kenia__foto {
  position: absolute;
  inset: 0;                 
  width: 100%;
  height: 100%;
  object-fit: cover;        
  object-position: center; 
  z-index: 0;               
  pointer-events: none;
  
}

.-hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: rgba(61, 32, 16, 0.35);
}
 
.-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 3rem;
}

.-hero__content {
  max-width: 540px;
  color: var(--kp-creme);
  z-index: 2;
}

.-hero__eyebrow {
  position: relative;
  display: inline-block;
  padding-left: 4rem;
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--kp-gold);
  margin-bottom: 2.4rem;
}

.-hero__eyebrow::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3rem;
  height: 1px;
  background: var(--kp-gold);
}

.-hero__logo {
  font-family: var(--font-script);
  font-size: clamp(10rem, 14vw, 18rem);
  font-weight: 400;
  line-height: 0.85;
  color: var(--kp-creme);
  margin: 0;
}

.-hero__studio {
  display: block;
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--kp-gold);
  margin: 1.2rem 0 3rem;
}

.-hero__studio::before,
.-hero__studio::after {
  content: '•';
  margin: 0 0.8rem;
  color: var(--kp-gold);
}

.-hero__subtitle {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 2.2rem;
  line-height: 1.4;
  color: var(--kp-creme);
  margin: 0 0 3.5rem;
}

.-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.4rem 3rem;
  font-family: var(--font-body);
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  border-radius: 2px;
  border: 1px solid transparent;
  transition: all 250ms ease;
  cursor: pointer;
}

.-hero__btn--filled {
  background: var(--kp-gold);
  color: var(--kp-mahogany);
  border-color: var(--kp-gold);
}

.-hero__btn--filled:hover {
  background: transparent;
  color: var(--kp-gold);
}

.-hero__scroll {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--kp-creme-low);
  font-size: 1.6rem;
  text-decoration: none;
  z-index: 2;
  animation: hero-bounce 2.4s infinite;
}

@keyframes hero-bounce {
  0%,
  100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, 1rem);
  }
}
</style>
