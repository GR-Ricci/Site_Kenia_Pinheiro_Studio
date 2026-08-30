<script setup>
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from '@lucide/vue'
import IconInstagram from '@/components/ui/IconInstagram.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { CONTACT } from '@/data/studio'

const rows = [
  {
    icon: Phone,
    label: CONTACT.phone,
    desc: 'Telefone',
    href: CONTACT.phoneHref,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    desc: CONTACT.phone,
    href: `https://wa.me/${CONTACT.whatsappNumber}`,
  },
  {
    icon: Mail,
    label: CONTACT.email,
    desc: 'E-mail',
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: IconInstagram,
    label: CONTACT.instagram,
    desc: 'Instagram',
    href: CONTACT.instagramUrl,
  },
  {
    icon: MapPin,
    label: CONTACT.address,
    desc: 'Endereço',
    href: CONTACT.mapsUrl,
  },
]
</script>

<template>
  <div class="contact">
    <div class="contact__header px-4 py-14 text-center">
      <SectionEyebrow>Estamos aqui para você</SectionEyebrow>
      <h1 class="contact__title">Entre em Contato</h1>
      <p class="contact__lead">
        Agende pelo WhatsApp, ligue ou venha nos visitar.
      </p>
    </div>

    <div class="mx-auto max-w-xl px-4 py-12">
      <div class="contact__list">
        <a
          v-for="(row, i) in rows"
          :key="row.desc"
          :href="row.href"
          target="_blank"
          rel="noreferrer"
          class="row group"
          :class="{
            'row--alt': i % 2 !== 0,
            'row--last': i === rows.length - 1,
          }"
        >
          <span class="row__icon">
            <component :is="row.icon" :size="17" />
          </span>
          <span class="row__body">
            <span class="row__desc">{{ row.desc }}</span>
            <span class="row__label">{{ row.label }}</span>
          </span>
          <ArrowRight :size="15" class="row__arrow" />
        </a>
      </div>

      <div class="mt-8 text-right">
        <span class="contact__mark">Kp</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact {
  min-height: 100vh;
  background: var(--kp-bg);
}

.contact__header {
  background: var(--kp-mahogany);
  border-bottom: 2px solid var(--kp-gold);
}

.contact__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: var(--kp-creme);
}

.contact__lead {
  margin: 0.75rem auto 0;
  max-width: 24rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: rgba(245, 235, 221, 0.55);
}

.contact__list {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--kp-card-bg);
  border-bottom: 1px solid var(--kp-gold-border);
  transition: background-color 0.2s;
}

.row--alt {
  background: rgba(250, 247, 242, 0.7);
}

.row--last {
  border-bottom: none;
}

.row:hover {
  background: #fff8f0;
}

.row__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(101, 31, 42, 0.07);
  color: var(--kp-vinho);
}

.row__body {
  flex: 1;
  min-width: 0;
}

.row__desc {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--kp-text-soft);
}

.row__label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--kp-text);
}

.row__arrow {
  flex-shrink: 0;
  opacity: 0;
  color: var(--kp-gold);
  transition: opacity 0.2s;
}

.row:hover .row__arrow {
  opacity: 1;
}

.contact__mark {
  font-family: var(--font-script);
  font-size: 2rem;
  color: var(--kp-gold);
}
</style>
