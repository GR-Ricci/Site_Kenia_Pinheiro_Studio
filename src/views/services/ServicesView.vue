<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import TabBar from '@/components/pages/services/TabBar.vue'
import ServiceCard from '@/components/pages/services/ServiceCard.vue'
import SubServiceModal from '@/components/pages/services/SubServiceModal.vue'
import BookingModal from '@/components/pages/services/BookingModal.vue'
import { TABS, servicesByTab } from '@/data/services'

const route = useRoute()
const router = useRouter()

// A aba vem da URL, então /services?tab=Cabelos abre já filtrado —
// é assim que o carrossel da Início entrega o filtro escolhido.
const activeTab = computed(() => {
  const wanted = route.query.tab
  return TABS.some((t) => t.label === wanted) ? wanted : 'Todos'
})

const setTab = (label) =>
  router.replace({ name: 'ServicesView', query: { tab: label } })

const filtered = computed(() => servicesByTab(activeTab.value))

const selectedCategory = ref(null)
const bookingItem = ref(null)

const openBooking = (sub) => {
  selectedCategory.value = null
  bookingItem.value = { name: sub.name, price: sub.price }
}
</script>

<template>
  <div class="services">
    <div class="services__header px-4 py-10 text-center">
      <SectionEyebrow>Conheça</SectionEyebrow>
      <h1 class="services__title">Nossos Serviços</h1>
      <p class="services__lead">
        Selecione uma categoria e clique para agendar.
      </p>
    </div>

    <div class="services__tabs px-4 py-3">
      <div class="mx-auto max-w-4xl">
        <TabBar :active="activeTab" @change="setTab" />
      </div>
    </div>

    <div class="mx-auto max-w-4xl px-4 py-10">
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
        <ServiceCard
          v-for="category in filtered"
          :key="category.id"
          :category="category"
          @select="selectedCategory = $event"
        />
      </div>
    </div>

    <SubServiceModal
      v-if="selectedCategory"
      :category="selectedCategory"
      @select="openBooking"
      @close="selectedCategory = null"
    />

    <BookingModal
      v-if="bookingItem"
      :item="bookingItem"
      @close="bookingItem = null"
    />
  </div>
</template>

<style scoped>
.services {
  min-height: 100vh;
  background: var(--kp-bg);
}

.services__header {
  background: var(--kp-mahogany);
}

.services__title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4vw, 2.3rem);
  font-weight: 600;
  color: var(--kp-creme);
}

.services__lead {
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: rgba(245, 235, 221, 0.45);
}

.services__tabs {
  position: sticky;
  top: var(--kp-nav-height);
  z-index: 10;
  background: var(--kp-bg);
  border-bottom: 1px solid rgba(28, 16, 9, 0.07);
}
</style>
