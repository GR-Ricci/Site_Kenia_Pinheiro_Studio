<script setup>
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Menu, X } from '@lucide/vue'
import { NAV_LINKS } from '@/data/studio'

const route = useRoute()
const open = ref(false)

// Fecha o menu mobile ao navegar.
watch(
  () => route.fullPath,
  () => (open.value = false),
)

const isActive = (link) => route.name === link.to.name
</script>

<template>
  <nav class="nav sticky top-0 z-50">
    <div
      class="mx-auto flex max-w-5xl items-center px-5"
      :style="{ height: 'var(--kp-nav-height)' }"
    >
      <RouterLink
        :to="{ name: 'HomeView' }"
        class="nav__logo"
        aria-label="KP Studio — página inicial"
      >
        Kp
      </RouterLink>

      <div class="ml-auto hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :to="link.to"
          class="nav__link"
          :class="{ 'nav__link--active': isActive(link) }"
        >
          <span v-if="isActive(link)" class="nav__bullet">•</span
          >{{ link.label }}
        </RouterLink>
      </div>

      <button
        class="nav__toggle ml-auto md:hidden"
        :aria-expanded="open"
        aria-label="Abrir menu"
        @click="open = !open"
      >
        <X v-if="open" :size="22" />
        <Menu v-else :size="22" />
      </button>
    </div>

    <div v-if="open" class="nav__mobile px-5 pb-4 md:hidden">
      <RouterLink
        v-for="link in NAV_LINKS"
        :key="link.label"
        :to="link.to"
        class="nav__mobile-link"
        :class="{ 'nav__link--active': isActive(link) }"
      >
        <span v-if="isActive(link)" class="nav__bullet">•</span>{{ link.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  background: var(--kp-mahogany);
  border-bottom: 1px solid var(--kp-gold);
}

.nav__logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: var(--kp-vinho);
  border: 2px solid var(--kp-gold);
  font-family: var(--font-script);
  font-size: 1.35rem;
  line-height: 1;
  color: var(--kp-creme);
}

.nav__link {
  padding: 0.375rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: rgba(245, 235, 221, 0.72);
  transition: color 0.2s;
}

.nav__link--active {
  color: var(--kp-gold);
  font-weight: 600;
}

.nav__bullet {
  margin-right: 0.25rem;
  color: var(--kp-gold);
}

.nav__toggle {
  color: rgba(245, 235, 221, 0.8);
}

.nav__mobile {
  background: var(--kp-mahogany);
  border-top: 1px solid rgba(201, 166, 107, 0.2);
}

.nav__mobile-link {
  display: block;
  width: 100%;
  padding: 0.75rem 0;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: rgba(245, 235, 221, 0.72);
  border-bottom: 1px solid rgba(201, 166, 107, 0.12);
}

.nav__mobile-link .nav__bullet {
  margin-right: 0.5rem;
}
</style>
