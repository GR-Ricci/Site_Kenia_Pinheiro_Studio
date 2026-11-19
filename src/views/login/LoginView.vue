<script setup>
import { ref } from 'vue'
import { apiFetch } from '@/client.js'
import { useRouter } from 'vue-router'
import { useJwtStore } from '@/stores/jwt'

const jwtStore = useJwtStore()
const router = useRouter()

//Login
const email = ref('')
const senha = ref('')
const erroLogin = ref('')
const login = ref({
  access_token: '',
  tipo: '',
  id: '',
})
async function verificarLogin(email, senha) {
  try {
    const dados = await apiFetch('/login', { method: 'POST', body: JSON.stringify({ email: email, senha: senha }) })
    login.value = dados

    //Salvar jwt do return
    localStorage.setItem('token', dados.access_token)
    localStorage.setItem('id', dados.id)
    localStorage.setItem('tipo', dados.tipo)

    //Salvar jwt no store (Para não barrar o push, pois ele não deixa entrar devido ao guard, impedindo a função da pagina de buscar o jwt de sequer rodar)
    jwtStore.token = dados.access_token
    jwtStore.tipo = dados.tipo
    jwtStore.id = dados.id

    //Agora é seguro redirecionar
    router.push('/profile')
  } catch (erro) {
    console.error('Erro ao logar', erro.message)

    if (!email || !senha) {
      erroLogin.value = 'E-mail e senha são obrigatórios!'
    } else {
      erroLogin.value = `${erro.message}`
    }
  }
}
</script>

<template>
  <main class="access-page">
    <section class="access-card">
      <p class="access-card__eyebrow">Bem-vindo</p>
      <h1 class="access-card__title">Entrar</h1>
      <p class="access-card__description">Acesse sua conta para continuar.</p>

      <form class="access-form" @submit.prevent="verificarLogin(email, senha)">
        <label class="access-form__field">
          <span>E-mail</span>
          <input type="email" v-model="email" placeholder="seuemail@exemplo.com" />
        </label>
        <label class="access-form__field">
          <span>Senha</span>
          <input type="password" v-model="senha" placeholder="Digite sua senha" />
        </label>

        <p v-if="erroLogin" class="mensagem-erro">{{ erroLogin }}</p>

        <button class="access-form__button" type="submit">Entrar</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.access-page {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 8rem 2rem 6rem;
  background: var(--kp-vinho);
}

.access-card {
  width: min(44rem, 100%);
  height: fit-content;
  padding: 3.2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 1.4rem;
  background: var(--kp-mahogany);
  box-shadow: 0 1.2rem 3rem rgba(30, 18, 10, 0.2);
}

.access-card__eyebrow {
  color: var(--kp-gold);
  font-size: 1.1rem;
  letter-spacing: 0.16em;
  text-align: center;
  text-transform: uppercase;
}

.access-card__title {
  margin-top: 0.8rem;
  color: var(--kp-creme);
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4.4rem);
  font-weight: 500;
  text-align: center;
}

.access-card__description {
  margin-top: 0.8rem;
  color: var(--kp-creme-low);
  font-size: 1.4rem;
  text-align: center;
}

.access-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-top: 3rem;
}

.access-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  color: var(--kp-creme);
  font-size: 1.35rem;
}

.access-form__field input {
  width: 100%;
  border: 1px solid var(--kp-gold-border);
  border-radius: 0.8rem;
  padding: 1.2rem 1.4rem;
  outline: none;
  color: var(--kp-text);
  background: var(--kp-creme);
  font: inherit;
  font-size: 1.4rem;
}

.access-form__field input:focus {
  border-color: var(--kp-gold);
  box-shadow: 0 0 0 0.3rem rgba(201, 166, 107, 0.15);
}

.access-form__button {
  margin-top: 0.6rem;
  border: 1px solid var(--kp-gold);
  border-radius: 99rem;
  padding: 1.1rem 2rem;
  color: var(--kp-vinho);
  background: var(--kp-gold);
  font-family: var(--font-body);
  font-size: 1.4rem;
}

.access-form__button:hover {
  background: var(--kp-creme);
}

@media (max-width: 600px) {
  .access-page {
    padding: 6rem 1.6rem 4rem;
  }

  .access-card {
    padding: 2.4rem 1.8rem;
  }
}

/* Erros */

.input-erro {
  border-color: #ff4d4d !important;
  background-color: #ffe6e6;
}
.mensagem-erro {
  color: #ff4d4d;
  font-size: 1.3rem;
}
</style>
