<script setup>
//função vue url
import { useRouter } from 'vue-router'
const router = useRouter()

import { useJwtStore } from '@/stores/jwt'
const JwtStore = useJwtStore()

function sair() {
  JwtStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="navbar">
    <div class="left__area">
      <RouterLink to="/" class="navbar__icon">
        <img src="@/assets/images/logo/logo.svg" alt="logo" />
      </RouterLink>
      <div class="navbar__buttons">
        <RouterLink v-if="JwtStore.token" to="/profile" class="card card--profile" active-class="card--active">Perfil</RouterLink>
        <RouterLink v-if="JwtStore.token" to="/invite" class="card card--invite" active-class="card--active">Cadastrar usuario</RouterLink>
        <button v-if="JwtStore.token" @click="sair" class="card card--logout">Sair</button>
        <RouterLink to="/login" class="card card--profile" active-class="card--active">[Login - Temporario]</RouterLink>
        <RouterLink v-if="JwtStore.token" to="/register" class="card card--profile" active-class="card--active">[Cadastro - Temporario]</RouterLink>
      </div>
    </div>

    <div class="navbar__buttons">
      <RouterLink to="/" class="card card--home" active-class="card--active">Início</RouterLink>

      <RouterLink to="/services" class="card card--service" active-class="card--active">Serviços</RouterLink>

      <RouterLink to="/about" class="card card--about" active-class="card--active">Sobre Nós</RouterLink>

      <RouterLink to="/contact" class="card card--contact" active-class="card--active">Contato</RouterLink>

      <RouterLink to="/gallery" class="card card--gallery" active-class="card--active">Galeria</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* --------------footer geral----------------------------------------------------*/

.navbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  background: var(--kp-mahogany);
  border-bottom: 0.3rem solid var(--kp-gold);
}

.left__area {
  display: flex;
  gap: 2rem;
  align-items: center;
}
/* --------------buttons ----------------------------------------------------*/

.navbar__buttons {
  display: flex;
  padding-left: 2rem;
  padding-right: 2rem;
  gap: 3rem;
  margin-right: 5rem;
  font-family: lato, sans-serif;
  color: var(--kp-creme-low);
}

.card::before {
  content: '•';
  margin-right: 0.4rem;
  color: var(--kp-gold-low);
  visibility: hidden;
}

.card:active {
  color: var(--kp-gold-low);
}

.card--active {
  transition: all 200ms ease-in-out;
  color: var(--kp-gold);
}

.card--active::before {
  transition: all 200ms ease-in-out;
  color: var(--kp-gold);
  visibility: visible;
}

.navbar__icon {
  display: inline-block;
  width: fit-content;
  height: fit-content;
  line-height: 0;
}

.navbar__icon img {
  margin: 0.5rem 0 0.6rem 4rem;

  width: 5rem;
  height: auto;
}

.navbar__icon:hover {
  opacity: 80%;
}

.navbar__icon:active {
  opacity: 100%;
}

.card--logout {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  display: inline;
}
</style>
