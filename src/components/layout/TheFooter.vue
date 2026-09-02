<script setup>
import { RouterLink } from 'vue-router'
import { MessageCircle } from '@lucide/vue'
import IconInstagram from '@/components/ui/IconInstagram.vue'
import { CONTACT, NAV_LINKS, whatsappLink } from '@/data/studio'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div
      class="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-7 md:grid-cols-3"
    >
      <!-- Marca -->
      <div>
        <RouterLink
          :to="{ name: 'HomeView' }"
          class="mb-3 flex items-center gap-2.5"
        >
          <span class="footer__mark">K</span>
          <span class="footer__wordmark">KP Studio</span>
        </RouterLink>
        <p class="footer__address">{{ CONTACT.addressShort }}</p>
      </div>

      <!-- Navegação -->
      <div>
        <p class="footer__heading">Navegação</p>
        <div class="space-y-1.5">
          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.label"
            :to="link.to"
            class="footer__link"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>

      <!-- Instagram + CTA -->
      <div>
        <p class="footer__heading">Nos siga</p>
        <a
          :href="CONTACT.instagramUrl"
          target="_blank"
          rel="noreferrer"
          class="footer__instagram mb-4 flex items-center gap-2"
        >
          <IconInstagram :size="13" class="footer__instagram-icon" />
          {{ CONTACT.instagram }}
        </a>
        <a
          :href="whatsappLink()"
          target="_blank"
          rel="noreferrer"
          class="footer__cta inline-flex items-center gap-2"
        >
          <MessageCircle :size="11" />
          Agendar pelo WhatsApp
        </a>
      </div>
    </div>

    <div class="footer__bottom px-6 py-2.5">
      <p class="footer__copy">
        © {{ year }} KP Studio · Sertãozinho, SP · Todos os direitos reservados
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--kp-mahogany);
  border-top: 1px solid rgba(201, 166, 107, 0.18);
}

.footer__mark {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: var(--kp-vinho);
  border: 1.5px solid rgba(201, 166, 107, 0.5);
  font-family: var(--font-script);
  font-size: 1.25rem;
  line-height: 1;
  color: var(--kp-creme);
}

.footer__wordmark {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--kp-creme);
}

.footer__address {
  font-family: var(--font-body);
  font-size: 0.7rem;
  line-height: 1.6;
  color: rgba(245, 235, 221, 0.38);
}

.footer__heading {
  margin-bottom: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--kp-gold);
}

.footer__link {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: rgba(245, 235, 221, 0.52);
  transition: opacity 0.2s;
}

.footer__link:hover {
  opacity: 0.7;
}

.footer__instagram {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.88rem;
  color: var(--kp-creme);
  transition: opacity 0.2s;
}

.footer__instagram:hover {
  opacity: 0.7;
}

.footer__instagram-icon {
  color: var(--kp-gold);
}

.footer__cta {
  padding: 0.375rem 1rem;
  background: var(--kp-vinho);
  border: 1px solid rgba(201, 166, 107, 0.3);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--kp-creme);
  transition: opacity 0.2s;
}

.footer__cta:hover {
  opacity: 0.85;
}

.footer__bottom {
  border-top: 1px solid rgba(201, 166, 107, 0.1);
}

.footer__copy {
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.62rem;
  color: rgba(245, 235, 221, 0.22);
}
</style>
