<script setup>
const props = defineProps({ modalAberto: Boolean, convite: String })
const emit = defineEmits(['close'])

function compartilharWhatsApp() {
  const url = `${window.location.origin}${props.convite}`
  const mensagem = `Olá! Aqui está o seu convite de cadastro no Studio: \n${url}`
  const mensagemCodificada = encodeURIComponent(mensagem)
  const urlWhatsApp = `https://api.whatsapp.com/send?text=${mensagemCodificada}`
  window.open(urlWhatsApp, '_blank')
}

function compartilharEmail() {
  const url = `${window.location.origin}${props.convite}`
  const assunto = 'Convite para o Studio'
  const corpo = `Olá! Aqui está o seu convite de cadastro no Studio: \n${url}`
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`
  window.open(gmailLink, '_blank')
}

async function copiarLink() {
  try {
    const url = `${window.location.origin}${props.convite}`
    await navigator.clipboard.writeText(url)
    alert('Link copiado com sucesso!')
  } catch (erro) {
    alert('Erro ao copiar o link. Tente novamente.')
  }
}
</script>

<template>
  <div v-if="modalAberto" class="invite__modal-overlay">
    <div class="invite__modal">
      <h2>Convite Gerado!</h2>
      <p>Envie o Link pelo:</p>

      <div class="invite__modal-actions">
        <button class="action-btn action-btn--whatsapp" @click="compartilharWhatsApp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
        <button class="action-btn action-btn--email" @click="compartilharEmail"><i class="fa-solid fa-envelope"></i> E-mail</button>
        <button class="action-btn action-btn--copy" @click="copiarLink"><i class="fa-solid fa-copy"></i> Copiar Link</button>
      </div>

      <button @click="emit('close')" class="btn-fechar">Fechar</button>
    </div>
  </div>
</template>

<style scoped>
.invite__modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100; /* Acima da navbar, sem gambiarra de 9999 */
}

.invite__modal {
  background: var(--kp-mahogany);
  padding: 3rem;
  border: 1px solid var(--kp-gold);
  border-radius: 1rem;
  text-align: center;
  width: min(50rem, 90%);
}

.invite__modal h2 {
  color: var(--kp-gold);
  font-family: var(--font-display);
  font-size: 2.4rem;
}

.invite__modal p {
  color: var(--kp-creme-low);
  margin: 1rem 0 2rem;
}

.invite__modal button {
  padding: 0.8rem 2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 99rem;
  background: var(--kp-creme);
  color: var(--kp-vinho);
  cursor: pointer;
}

/* Botões */
.invite__modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* Estilo base dos botões */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.8rem;
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 180ms ease;
}

.action-btn:hover {
  opacity: 0.8;
}

/* Cores específicas de cada botão */
.action-btn--whatsapp {
  background: #25d366;
  color: white;
}

.action-btn--email {
  background: var(--kp-gold);
  color: var(--kp-mahogany);
}

.action-btn--copy {
  background: var(--kp-creme);
  color: var(--kp-vinho);
}

.btn-fechar {
  padding: 0.8rem 2rem;
  border: 1px solid var(--kp-gold-border);
  border-radius: 99rem;
  background: transparent;
  color: var(--kp-creme);
  cursor: pointer;
}
</style>
