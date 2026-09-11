<script setup></script>

<template>
  <div class="navbar">
    <div class="navbar__icon">
      <i class="card--icon"> KP </i>
    </div>

    <div class="navbar__buttons">
      <RouterLink to="/" class="card card--home" active-class="card--active"
        >Início</RouterLink
      >

      <RouterLink
        to="/services"
        class="card card--service"
        active-class="card--active"
        >Serviços</RouterLink
      >

      <RouterLink
        to="/about"
        class="card card--about"
        active-class="card--active"
        >Sobre Nós</RouterLink
      >

      <RouterLink
        to="/contact"
        class="card card--contact"
        active-class="card--active"
        >Contato</RouterLink
      >

      <RouterLink
        to="/gallery"
        class="card card--gallery"
        active-class="card--active"
        >Galeria</RouterLink
      >
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  background: var(--kp-mahogany);
  border-bottom: 0.3rem solid var(--kp-gold);
}

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
  visibility: hidden; /* ← ocupa espaço, mas não aparece */
}

card:active {
  color: var(--kp-gold-low);
}

.card--active {
  transition: all 200ms ease-in-out;
  color: var(--kp-gold);
}

.card--active::before {
  transition: all 200ms ease-in-out;
  color: var(--kp-gold);
  visibility: visible; /* ← só aparece no ativo */
}

.card--icon {
  display: flex;
  margin: 0.5rem 0 0.5rem 4rem;

  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 5rem;
  height: 5rem;

  background: rgb(101, 31, 42);
  border: 2px solid rgb(201, 166, 107);

  /* <- tira o itálico do <i> */
  font-style: normal;

  /* <- aplica a fonte no próprio <i> */
  font-family: var(--font-script), sans-serif;
  font-size: 2rem;
  line-height: 1;
  color: rgb(245, 235, 221);
}
</style>
