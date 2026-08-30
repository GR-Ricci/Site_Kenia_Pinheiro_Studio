<script setup></script>

<template>
  <p class="eyebrow"><slot /></p>
</template>

<style scoped>
.eyebrow {
  margin-bottom: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--kp-gold);
}
</style>
