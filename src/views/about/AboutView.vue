<script setup>
import GoldRule from '@/components/ui/GoldRule.vue'
import TeamCard from '@/components/pages/about/TeamCard.vue'
import { TEAM } from '@/data/studio'

const bannerImg =
  'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=1400&q=80'
</script>

<template>
  <div class="about">
    <div class="about__banner">
      <img :src="bannerImg" alt="Equipe do KP Studio" />
      <div class="about__banner-veil" />
      <div class="about__banner-caption">
        <p class="about__mark">Kp</p>
        <p class="about__studio">•STUDIO•</p>
      </div>
    </div>

    <div class="mx-auto max-w-xl px-4 py-12">
      <div class="about__quote mb-10">
        <h2 class="about__quote-title">SOBRE NÓS</h2>
        <div class="mb-3 mt-3"><GoldRule /></div>
        <p class="about__quote-text">
          "Nossos valores são beleza, cuidado e autenticidade."
        </p>
      </div>

      <p class="about__section-label">
        <span class="about__bullet">•</span> Nossa equipe
      </p>

      <div class="space-y-3">
        <TeamCard v-for="member in TEAM" :key="member.name" :member="member" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  background: var(--kp-bg);
}

.about__banner {
  position: relative;
  height: 14rem;
  overflow: hidden;
}

@media (min-width: 768px) {
  .about__banner {
    height: 18rem;
  }
}

.about__banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.about__banner-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 4, 2, 0.1),
    rgba(10, 4, 2, 0.55)
  );
}

.about__banner-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
}

.about__mark {
  font-family: var(--font-script);
  font-size: 2.5rem;
  line-height: 1;
  color: var(--kp-creme);
}

.about__studio {
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  color: rgba(245, 235, 221, 0.8);
}

.about__quote {
  padding: 1.75rem;
  text-align: center;
  border-radius: 0.75rem;
  background: var(--kp-card-bg);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.about__quote-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--kp-vinho);
}

.about__quote-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--kp-text-mid);
}

.about__section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--kp-text);
}

.about__bullet {
  color: var(--kp-gold);
}
</style>
