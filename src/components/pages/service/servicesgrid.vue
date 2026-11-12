<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/client.js'
import ServicesBooking from '@/components/pages/service/servicesbokingmodal.vue'

const route = useRoute()

const categories = ref([])
const services = ref([])
const loading = ref(true)

const ActiveTag = ref(null)
const SelectedService = ref(null)

// --- CONTROLE DO BOTÃO DE ADMIN ---
// Por padrão é false (só mostra o que tem profissional)
// Quando você criar o botão, é só mudar para true
const mostrarTodos = ref(false)

function urlImagemServico(nome) {
  if (!nome) return null
  if (nome.startsWith('http')) return nome
  return `${import.meta.env.VITE_API_URL}/upload/servico/${nome}`
}

async function carregar() {
  loading.value = true
  try {
    const [cats, servs] = await Promise.all([apiFetch('/categorias'), apiFetch('/servicos')])

    let servicosDisponiveis = servs.filter((s) => s !== null && s.ativo !== false)

    // Se NÃO for pra mostrar todos, precisamos filtrar os que têm profissional
    if (!mostrarTodos.value) {
      // Puxa os subserviços e os profissionais para cruzar a informação
      const [subs, staff] = await Promise.all([apiFetch('/subservicos'), apiFetch('/staff')])

      const profissionais = staff.filter((s) => s.id_profissional)

      // Puxa todos os vínculos de todas as profissionais
      const vinculosArrays = await Promise.all(profissionais.map((p) => apiFetch(`/profissional-subservicos/${p.id_profissional}`).catch(() => [])))
      const vinculos = vinculosArrays.flat()

      // Cria uma lista de IDs de subserviços que alguém atende
      const subservicosAtivosIds = new Set(vinculos.filter((v) => v.ativo !== false).map((v) => v.id_subservico))

      // Mapeia qual subserviço pertence a qual serviço
      const subToServico = new Map()
      subs.forEach((s) => subToServico.set(s.id, s.id_servico))

      // Descobre quais serviços têm pelo menos 1 subserviço ativo
      const servicosOfertados = new Set()
      subservicosAtivosIds.forEach((idSub) => {
        const idServ = subToServico.get(idSub)
        if (idServ) servicosOfertados.add(idServ)
      })

      // Filtra a lista de serviços para manter só os ofertados
      servicosDisponiveis = servicosDisponiveis.filter((s) => servicosOfertados.has(s.id))
    }

    services.value = servicosDisponiveis

    // Filtra as categorias para não mostrar categorias vazias
    categories.value = cats.filter((c) => {
      if (!c || c.ativo === false) return false
      // A categoria só aparece se tiver algum serviço visível nela
      return services.value.some((serv) => serv.id_categoria === c.id)
    })
  } catch (e) {
    console.error('Erro ao carregar serviços:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.categoria) {
    ActiveTag.value = Number(route.query.categoria)
  }
  carregar()
})

// Função para você usar no futuro botão de "Ver todos" (Admin)
function toggleMostrarTodos() {
  mostrarTodos.value = !mostrarTodos.value
  carregar() // Recarrega a lista com a nova regra
}

function setActiveTag(tag) {
  ActiveTag.value = tag
}

const FilteredServices = computed(() => {
  if (ActiveTag.value === null) return services.value
  return services.value.filter((s) => s && s.id_categoria === ActiveTag.value)
})

function openBooking(service) {
  if (!service) return
  SelectedService.value = service
}
</script>

<template>
  <section class="Services_Grid">
    <div class="-Services_Grid">
      <!-- Filtros (Categorias vazias já foram removidas via JS) -->
      <div class="-Services_Filter">
        <button @click="setActiveTag(null)" :class="{ '-active': ActiveTag === null }">Todas</button>
        <button v-for="categorie in categories" :key="categorie.id" @click="setActiveTag(categorie.id)" :class="{ '-active': ActiveTag === categorie.id }">
          {{ categorie.nome }}
        </button>

        <!-- ESPAÇO RESERVADO PARA O FUTURO BOTÃO DE ADMIN
        <button @click="toggleMostrarTodos" style="margin-left: auto;">
          {{ mostrarTodos ? 'Ocultar vazios' : 'Mostrar todos' }}
        </button>
        -->
      </div>

      <div class="-Services_Grid_Content">
        <p v-if="loading" class="-Services_Grid_Status">Carregando...</p>

        <p v-else-if="FilteredServices.length === 0" class="-Services_Grid_Status">Nenhum serviço disponível nesta categoria.</p>

        <button v-for="service in FilteredServices" :key="service?.id || Math.random()" class="-Services_Grid_Card" @click="openBooking(service)">
          <div class="-Services_Grid_Card_Image" :style="service?.imagem_url ? { backgroundImage: `url(${urlImagemServico(service.imagem_url)})` } : {}"></div>

          <div class="-Services_Grid_Card_Info">
            <div class="-Service_Grid_Card_Info_group">
              <h1>{{ service?.nome || 'Sem nome' }}</h1>
              <p v-if="service?.descricao" class="-desc">{{ service.descricao }}</p>
            </div>
            <i class="fa-solid fa-arrow-right -arrow"></i>
          </div>
        </button>

        <ServicesBooking v-if="SelectedService" :servico="SelectedService" @close="SelectedService = null" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.-Services_Filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px 16px;
  background-color: #faf7f2;
  border-bottom: 1px solid #1c100910;
}

.-Services_Filter button {
  background-color: transparent;
  border: 1px solid #c4a484;
  color: #4a2c2a;
  padding: 8px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.-Services_Filter button.-active {
  background-color: #6b1d2c;
  color: #fcfaf5;
  border-color: #6b1d2c;
}

.-Services_Filter button:hover:not(.-active) {
  background-color: rgba(107, 29, 44, 0.08);
}

.-Services_Grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 0 48px;
}

.-Services_Grid_Content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  max-width: 1080px;
  width: 100%;
  padding: 0 16px;
}

.-Services_Grid_Status {
  width: 100%;
  text-align: center;
  font-family: 'Lato', sans-serif;
  color: #3d2010aa;
  font-style: italic;
  padding: 40px 0;
  margin: 0;
}

.-Services_Grid_Card {
  position: relative;
  width: 250px;
  height: 300px;
  padding: 0;
  border: 1px solid #c9a66b;
  border-radius: 10px;
  overflow: hidden;
  background: #faf7f2;
  cursor: pointer;
  text-align: left;
  clip-path: inset(0 round 10px);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.-Services_Grid_Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px -10px rgba(61, 32, 16, 0.3);
}

.-Services_Grid_Card_Image {
  position: absolute;
  inset: 0;
  background-color: #3d2010;
  background-image: linear-gradient(135deg, #6b1d2c, #3d2010);
  background-size: cover;
  background-position: center;
}

.-Services_Grid_Card_Info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(250, 247, 242, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid #c9a66b;
}

.-Service_Grid_Card_Info_group {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.-Service_Grid_Card_Info_group h1 {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  color: #651f2a;
  margin: 0;
  line-height: 1.25;
}

.-desc {
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  color: #3d2010;
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.-arrow {
  color: #c9a66b;
  font-size: 16px;
  flex-shrink: 0;
  transition:
    color 0.25s ease,
    transform 0.25s ease;
}

.-Services_Grid_Card:hover .-arrow {
  color: #651f2a;
  transform: translateX(4px);
}

@media (max-width: 700px) {
  .-Services_Grid_Content {
    gap: 16px;
  }

  .-Services_Grid_Card {
    width: 170px;
    height: 210px;
  }

  .-Service_Grid_Card_Info_group h1 {
    font-size: 14px;
  }

  .-desc {
    font-size: 11px;
  }
}
</style>
