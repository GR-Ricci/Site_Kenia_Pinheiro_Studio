<script setup>
import IconInstagram from '@/components/ui/IconInstagram.vue'

defineProps({
  member: { type: Object, required: true },
})
</script>

<template>
  <div class="member">
    <div class="member__grid">
      <div class="member__photo">
        <img :src="member.img" :alt="member.name" />
      </div>
      <div class="member__panel">
        <p class="member__role">{{ member.role }}</p>
        <h3 class="member__name">{{ member.name }}</h3>
        <p class="member__specialty">{{ member.specialty }}</p>
        <p class="member__hours">{{ member.hours }}</p>
        <p v-if="member.instagram" class="member__instagram">
          <IconInstagram :size="10" />
          {{ member.instagram }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.member {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--kp-gold-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Altura travada para os três cartões ficarem na mesma proporção. */
.member__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 148px;
}

.member__photo {
  overflow: hidden;
}

.member__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: var(--kp-vinho);
}

.member__role {
  margin-bottom: 4px;
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--kp-gold);
}

.member__name {
  margin-bottom: 8px;
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--kp-creme);
}

.member__specialty {
  margin-bottom: 4px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  line-height: 1.4;
  color: rgba(245, 235, 221, 0.68);
}

.member__hours {
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: rgba(245, 235, 221, 0.42);
}

.member__instagram {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 8px;
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: var(--kp-gold);
}
</style>
