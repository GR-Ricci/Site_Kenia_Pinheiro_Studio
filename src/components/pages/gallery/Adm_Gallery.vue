<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useGalleryStore } from '@/stores/galleryAdm.js'
import ConfirmDialog from '@/components/pages/gallery/Adm_Confirm_Change_Gallery.vue'

// Nome multi-palavra exigido pela regra do ESLint (vue/multi-word-component-names).
defineOptions({
  name: 'GallerySection',
})

// Store da galeria — fonte das categorias e das fotos.
const galleryStore = useGalleryStore()

// Categoria ativa no filtro.
const activeCategory = ref(galleryStore.categories[0] ?? '')

// Rascunho do nome — só é aplicado à store ao confirmar no pop-up.
const inputName = ref(activeCategory.value)

// Referência ao input para dar foco automático ao criar categoria.
const inputRef = ref(null)

// Pop-up de confirmação das alterações gerais (renomear, categorias, fotos).
const showChangesDialog = ref(false)

// Foto expandida (lightbox). null = fechado.
const expandedItem = ref(null)

// Pop-up de confirmação para remover a foto expandida.
const showRemoveDialog = ref(false)

// Itens visíveis — filtrados pela categoria ativa.
const filteredItems = computed(() =>
  galleryStore.allImages.filter(
    (item) => item.category === activeCategory.value,
  ),
)

// ─── Sincronizações ─────────────────────────────────────────────────────────

// Se a categoria ativa sumir (removida), cai para a primeira da lista.
watch(
  () => galleryStore.categories,
  (cats) => {
    if (!cats.includes(activeCategory.value)) {
      activeCategory.value = cats[0] ?? ''
    }
  },
  { deep: true },
)

// Sempre que a categoria ativa mudar, o rascunho volta a espelhar ela.
watch(activeCategory, (val) => {
  inputName.value = val
})

// ─── Atalhos de teclado ─────────────────────────────────────────────────────
function handleKeydown(event) {
  // Esc fecha o lightbox (se estiver aberto).
  if (event.key === 'Escape' && expandedItem.value) {
    closeExpanded()
    return
  }

  if (event.key !== 'Enter') return
  // Não abre pop-up de alterações enquanto o lightbox está aberto.
  if (expandedItem.value) return

  const nameChanged =
    inputName.value.trim() !== '' &&
    inputName.value.trim() !== activeCategory.value

  if (!nameChanged && !galleryStore.hasPendingChanges) return
  showChangesDialog.value = true
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

// ─── Lightbox ───────────────────────────────────────────────────────────────
function openExpanded(item) {
  expandedItem.value = item
}

function closeExpanded() {
  expandedItem.value = null
  showRemoveDialog.value = false
}

// Abre o pop-up de confirmação da remoção.
function askRemoveExpanded() {
  showRemoveDialog.value = true
}

// Sim → remove a foto e fecha o lightbox.
function confirmRemoveExpanded() {
  const item = expandedItem.value
  if (item) {
    const list = galleryStore.imagesByCategory[item.category] ?? []
    const index = list.indexOf(item.image)
    if (index >= 0) galleryStore.removeImage(item.category, index)
  }
  showRemoveDialog.value = false
  closeExpanded()
}

// Não → apenas fecha o pop-up, mantém o lightbox aberto.
function cancelRemoveExpanded() {
  showRemoveDialog.value = false
}

// ─── Handlers do bloco de teste ─────────────────────────────────────────────

async function handleAddCategory() {
  const baseName = 'Nova Categoria'
  let candidate = baseName
  let i = 2
  while (galleryStore.categories.includes(candidate)) {
    candidate = `${baseName} ${i++}`
  }

  if (galleryStore.addCategory(candidate)) {
    activeCategory.value = candidate
    inputName.value = candidate
    await nextTick()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
}

function handleRemoveCategory() {
  galleryStore.removeCategory(activeCategory.value)
}

function handleAddImage() {
  galleryStore.addImage(
    activeCategory.value,
    `https://picsum.photos/400/300?random=${Date.now()}`,
  )
}

function handleRemoveImage() {
  galleryStore.removeImage(activeCategory.value, 0)
}

// ─── Confirmação (alterações gerais) ────────────────────────────────────────
function onConfirm() {
  const newName = inputName.value.trim()
  const oldName = activeCategory.value

  if (newName && newName !== oldName) {
    const ok = galleryStore.renameCategory(oldName, newName)
    if (ok) {
      activeCategory.value = newName
    } else {
      inputName.value = oldName
    }
  }

  galleryStore.confirmChanges()
  showChangesDialog.value = false
}

function onCancel() {
  galleryStore.revertChanges()
  activeCategory.value = galleryStore.categories[0] ?? ''
  inputName.value = activeCategory.value
  showChangesDialog.value = false
}
</script>

<template>
  <!-- Seção principal da página de Galeria -->
  <section class="-section-gallery">
    <div class="-container">

      <!-- Cabeçalho: subtítulo dourado + título serifado -->
      <header class="-header">
        <span class="-subtitle">NOSSO TRABALHOS</span>
        <h2 class="-title">Galeria</h2>
      </header>

      <!-- Área de filtros: botões pílula para alternar categorias -->
      <div class="-filters">
        <button
          v-for="category in galleryStore.categories"
          :key="category"
          class="-filters__btn"
          :class="{ '-filters__btn--active': activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <!-- Grade de imagens — cada card abre o lightbox ao clicar -->
      <div class="-grid">
        <button
          v-for="item in filteredItems"
          :key="item.id"
          class="-card"
          type="button"
          @click="openExpanded(item)"
        >
          <img :src="item.image" :alt="item.category" class="-card__image" />
        </button>
      </div>

      <!-- ─── BLOCO DE TESTE — remover quando o painel de admin existir ─── -->
      <div class="-admin-test">
        <input
          ref="inputRef"
          v-model="inputName"
          class="-admin-test__input"
          type="text"
          placeholder="Nome da categoria ativa"
        />
        <button class="-filters__btn" @click="handleAddCategory">
          + Categoria
        </button>
        <button class="-filters__btn" @click="handleRemoveCategory">
          - Categoria
        </button>
        <button class="-filters__btn" @click="handleAddImage">+ Foto</button>
        <button class="-filters__btn" @click="handleRemoveImage">- Foto</button>
      </div>

      <!-- Dica: aparece quando há alterações pendentes -->
      <p
        v-if="
          galleryStore.hasPendingChanges ||
          (inputName.trim() && inputName.trim() !== activeCategory)
        "
        class="-admin-test__hint"
      >
        Pressione <strong>Enter</strong> para confirmar as alterações.
      </p>

    </div>

    <!-- ─── Lightbox: foto expandida ──────────────────────────────────────── -->
    <div
      v-if="expandedItem"
      class="-lightbox"
      role="dialog"
      aria-modal="true"
      @click.self="closeExpanded"
    >
      <div class="-lightbox__frame">
        <!-- Botão de fechar (canto superior direito) -->
        <button
          class="-lightbox__close"
          type="button"
          aria-label="Fechar"
          @click="closeExpanded"
        >
          ×
        </button>

        <!-- Imagem expandida -->
        <img
          :src="expandedItem.image"
          :alt="expandedItem.category"
          class="-lightbox__image"
        />

        <!-- Botão de remover (canto inferior direito, tamanho para toque) -->
        <button
          class="-lightbox__remove"
          type="button"
          aria-label="Remover foto"
          @click="askRemoveExpanded"
        >
          −
        </button>
      </div>
    </div>

    <!-- Pop-up de confirmação das alterações gerais -->
    <ConfirmDialog
      :visible="showChangesDialog"
      title="Prosseguir com as alterações?"
      confirm-label="Sim"
      cancel-label="Não"
      @confirm="onConfirm"
      @cancel="onCancel"
    />

    <!-- Pop-up de confirmação da remoção da foto expandida -->
    <ConfirmDialog
      :visible="showRemoveDialog"
      title="Remover esta foto?"
      confirm-label="Sim"
      cancel-label="Não"
      @confirm="confirmRemoveExpanded"
      @cancel="cancelRemoveExpanded"
    />
  </section>
</template>

<style scoped>
/* ─── Seção Principal ────────────────────────────────────────────────────── */
.-section-gallery {
  background-color: var(--kp-bg, #fcfaf5);
  padding: 80px 0;
}

.-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ─── Cabeçalho ──────────────────────────────────────────────────────────── */
.-header {
  text-align: center;
  margin-bottom: 40px;
}

.-subtitle {
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: var(--kp-gold, #c4a484);
  text-transform: uppercase;
  display: block;
  margin-bottom: 10px;
}

.-title {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2.5rem;
  color: var(--kp-vinho, #4a2c2a);
  margin: 0;
}

/* ─── Filtros ────────────────────────────────────────────────────────────── */
.-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 50px;
}

.-filters__btn {
  background-color: transparent;
  border: 1px solid var(--kp-gold-border, #c4a484);
  color: var(--kp-text, #4a2c2a);
  padding: 8px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--font-body, 'Lato', sans-serif);
  transition: all 0.3s ease;
}

.-filters__btn--active {
  background-color: var(--kp-vinho, #6b1d2c);
  color: var(--kp-bg, #fcfaf5);
  border-color: var(--kp-vinho, #6b1d2c);
}

.-filters__btn:hover {
  background-color: rgba(107, 29, 44, 0.08);
}

/* ─── Grade de Imagens ───────────────────────────────────────────────────── */
.-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Card clicável: reseta o padrão de botão e mantém o visual original. */
.-card {
  border: none;
  padding: 0;
  background: none;
  display: block;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  aspect-ratio: 4 / 3;
}

.-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.-card:hover .-card__image {
  transform: scale(1.05);
}

/* ─── Lightbox ───────────────────────────────────────────────────────────── */
.-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  padding: 24px;
}

/* Moldura que envolve a imagem — ponto de referência para os botões. */
.-lightbox__frame {
  position: relative;
  max-width: min(92vw, 960px);
  max-height: 90vh;
  display: inline-flex;
}

.-lightbox__image {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: block;
}

/* Botão de fechar — canto superior direito */
.-lightbox__close {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--kp-card-bg, #fff);
  color: var(--kp-vinho, #6b1d2c);
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.-lightbox__close:hover {
  transform: scale(1.05);
  background: var(--kp-gold, #c9a66b);
  color: var(--kp-bg, #fcfaf5);
}

/* Botão de remover — canto inferior direito, tamanho confortável para toque */
.-lightbox__remove {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--kp-vinho, #6b1d2c);
  color: var(--kp-bg, #fcfaf5);
  border: 2px solid var(--kp-gold, #c9a66b);
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.-lightbox__remove:hover {
  transform: scale(1.08);
  background: #521822;
}

.-lightbox__remove:active {
  transform: scale(0.96);
}

/* ─── Bloco de Teste (admin temporário) ──────────────────────────────────── */
.-admin-test {
  margin-top: 60px;
  padding: 24px;
  background: rgba(196, 164, 132, 0.08);
  border: 1px dashed var(--kp-gold-border, #c4a484);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.-admin-test__input {
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid var(--kp-gold-border, #c4a484);
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 0.875rem;
  color: var(--kp-text, #4a2c2a);
  background: var(--kp-card-bg, #fff);
  min-width: 220px;
  text-align: center;
  outline: none;
  transition: border-color 0.3s ease;
}

.-admin-test__input:focus {
  border-color: var(--kp-vinho, #6b1d2c);
}

.-admin-test__hint {
  margin-top: 16px;
  text-align: center;
  font-family: var(--font-body, 'Lato', sans-serif);
  font-size: 0.875rem;
  color: var(--kp-text-mid, rgba(30, 18, 10, 0.65));
}
</style>
