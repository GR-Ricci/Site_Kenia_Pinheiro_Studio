<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
</script>

<template>
  <div class="app">
    <TheNavbar />
    <main class="app__main">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--kp-bg);
}

.app__main {
  flex: 1;
}
</style>
