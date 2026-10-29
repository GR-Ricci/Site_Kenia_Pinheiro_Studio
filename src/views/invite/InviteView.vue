<script setup></script>

<template>
  <main class="invite">
    <section class="invite__card">
      <p class="invite__eyebrow">Área administrativa</p>
      <h1 class="invite__title">Gerar convite</h1>
      <p class="invite__description">Escolha o tipo de profissional que deseja cadastrar.</p>

      <div class="invite__options">
        <button class="invite__option" type="button">
          <span class="invite__option-title">Profissional - Comum</span>
          <span class="invite__option-description"> Acesso apenas às funções relacionadas ao próprio perfil. </span>
        </button>

        <button class="invite__option" type="button">
          <span class="invite__option-title">Profissional - Administrador</span>
          <span class="invite__option-description"> Acesso às configurações e ao gerenciamento do espaço. </span>
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.invite {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 8rem 2rem 6rem;
  background: var(--kp-vinho);
}

.invite__card {
  width: min(64rem, 100%);
  height: fit-content;
  padding: 3.2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  background: var(--kp-mahogany);
  box-shadow: 0 1.2rem 3rem rgba(61, 32, 16, 0.07);
  text-align: center;
}

.invite__eyebrow {
  color: var(--kp-gold);
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.invite__title {
  margin-top: 0.8rem;
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5vw, 4.4rem);
  font-weight: 500;
}

.invite__description {
  margin-top: 0.8rem;
  color: var(--kp-creme-low);
  font-size: 1.45rem;
}

.invite__options {
  display: grid;
  gap: 1.2rem;
  margin-top: 3rem;
}

.invite__option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  width: 100%;
  padding: 1.8rem 2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1rem;
  color: var(--kp-creme);
  background: rgba(245, 235, 221, 0.08);
  text-align: left;
  transition:
    border-color 180ms ease,
    background 180ms ease;
}

.invite__option:hover {
  border-color: var(--kp-gold);
  background: rgba(245, 235, 221, 0.16);
}

.invite__option-title {
  color: var(--kp-creme);
  font-family: var(--font-body);
  font-size: 1.6rem;
}

.invite__option-description {
  color: var(--kp-creme-low);
  font-size: 1.3rem;
}

@media (max-width: 600px) {
  .invite {
    padding: 6rem 1.6rem 4rem;
  }

  .invite__card {
    padding: 2.4rem 1.8rem;
  }
}
</style>
