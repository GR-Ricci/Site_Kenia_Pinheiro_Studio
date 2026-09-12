<script setup>
import { RouterView } from 'vue-router'
import Footer from '@/components/global/footer/footer.vue'
import Navbar from '@/components/global/navbar/navbar.vue'
</script>

<template>
  <div class="app">
    <Navbar />
    <main class="app__main">
      <RouterView />
    </main>
    <Footer />
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
