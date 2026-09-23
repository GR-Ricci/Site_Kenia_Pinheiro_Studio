<script setup></script>

<template>
  <div class="gold-rule">
    <span class="gold-rule__line gold-rule__line--left" />
    <span class="gold-rule__diamond" />
    <span class="gold-rule__line gold-rule__line--right" />
  </div>
</template>

<style scoped>
.gold-rule {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.gold-rule__line {
  flex: 1;
  height: 1px;
}

.gold-rule__line--left {
  background: linear-gradient(to right, transparent, var(--kp-gold));
}

.gold-rule__line--right {
  background: linear-gradient(to left, transparent, var(--kp-gold));
}

.gold-rule__diamond {
  width: 0.375rem;
  height: 0.375rem;
  rotate: 45deg;
  background: var(--kp-gold);
  opacity: 0.8;
}
</style>
