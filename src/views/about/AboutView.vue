<script setup>
import GoldRule from '@/components/ui/GoldRule.vue'
import TeamCard from '@/components/pages/about/TeamCard.vue'
import { TEAM } from '@/data/studio'

const bannerImg = 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=1400&q=80'
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

    <div class="about__content">
      <div class="about__quote">
        <h2 class="about__quote-title">SOBRE NÓS</h2>
        <div class="about__quote-rule"><GoldRule /></div>
        <p class="about__quote-text">"Nossos valores são beleza, cuidado e autenticidade."</p>
      </div>

      <p class="about__section-label"><span class="about__bullet">•</span> Nossa equipe</p>

      <div class="about__team">
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
  height: 22.4rem;
  overflow: hidden;
}

@media (min-width: 768px) {
  .about__banner {
    height: 28.8rem;
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
  background: linear-gradient(to bottom, rgba(10, 4, 2, 0.1), rgba(10, 4, 2, 0.55));
}

.about__banner-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.4rem;
}

.about__mark {
  font-family: var(--font-script);
  font-size: 4rem;
  line-height: 1;
  color: var(--kp-creme);
}

.about__studio {
  font-family: var(--font-body);
  font-size: 1.12rem;
  letter-spacing: 0.5em;
  color: rgba(245, 235, 221, 0.8);
}

.about__content {
  max-width: 57.6rem;
  margin: 0 auto;
  padding: 4.8rem 1.6rem;
}

.about__quote {
  margin-bottom: 4rem;
  padding: 2.8rem;
  text-align: center;
  border-radius: 1.2rem;
  background: var(--kp-card-bg);
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.about__quote-title {
  font-family: var(--font-display);
  font-size: 1.76rem;
  font-weight: 600;
  color: var(--kp-vinho);
}

.about__quote-rule {
  margin: 1.2rem 0;
}

.about__quote-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.4rem;
  line-height: 1.6;
  color: var(--kp-text-mid);
}

.about__section-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2.4rem;
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--kp-text);
}

.about__bullet {
  color: var(--kp-gold);
}

.about__team {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
</style>
