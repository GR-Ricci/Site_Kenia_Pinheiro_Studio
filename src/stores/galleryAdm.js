import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { GALLERY_CATS, GALLERY } from '@/data/gallery.js'

/**
 * Store da Galeria — fonte única de verdade para categorias e fotos.
 *
 * Padrão de transação:
 *   – A primeira alteração tira um snapshot do estado atual.
 *   – Enquanto houver alterações pendentes, `hasPendingChanges` fica true.
 *   – `confirmChanges()` mantém o que está na tela (Sim).
 *   – `revertChanges()` restaura o snapshot (Não).
 */
export const useGalleryStore = defineStore('gallery', () => {
  // ─── Estado ─────────────────────────────────────────────────────────────
  const categories = ref([...GALLERY_CATS])
  const imagesByCategory = ref({ ...GALLERY })

  // Controle de transação
  const hasPendingChanges = ref(false)
  const changeCount = ref(0) // incrementa a cada alteração — usado pelo pop-up
  let snapshot = null

  // ─── Getters ────────────────────────────────────────────────────────────
  const allImages = computed(() =>
    Object.entries(imagesByCategory.value).flatMap(([category, images]) =>
      images.map((url, index) => ({
        id: `${category}-${index}`,
        category,
        image: url,
      })),
    ),
  )

  // ─── Transação ──────────────────────────────────────────────────────────
  // Tira um snapshot apenas na primeira alteração da rodada.
  function _ensureSnapshot() {
    if (!snapshot) {
      snapshot = {
        categories: [...categories.value],
        imagesByCategory: JSON.parse(JSON.stringify(imagesByCategory.value)),
      }
    }
    hasPendingChanges.value = true
    changeCount.value++
  }

  function confirmChanges() {
    snapshot = null
    hasPendingChanges.value = false
  }

  function revertChanges() {
    if (snapshot) {
      categories.value = snapshot.categories
      imagesByCategory.value = snapshot.imagesByCategory
    }
    snapshot = null
    hasPendingChanges.value = false
  }

  // ─── Actions (admin) ────────────────────────────────────────────────────
  function addCategory(name) {
    const trimmed = name?.trim()
    if (!trimmed || categories.value.includes(trimmed)) return false
    _ensureSnapshot()
    categories.value.push(trimmed)
    imagesByCategory.value[trimmed] = []
    return true
  }

  function removeCategory(name) {
    if (!categories.value.includes(name)) return false
    _ensureSnapshot()
    categories.value = categories.value.filter((c) => c !== name)
    delete imagesByCategory.value[name]
    return true
  }

  function renameCategory(oldName, newName) {
    const trimmed = newName?.trim()
    if (!trimmed) return false
    if (!categories.value.includes(oldName)) return false
    if (trimmed === oldName) return true
    // Impede dois nomes iguais (evita perder fotos).
    if (categories.value.includes(trimmed)) return false

    _ensureSnapshot()
    categories.value = categories.value.map((c) =>
      c === oldName ? trimmed : c,
    )
    imagesByCategory.value[trimmed] = imagesByCategory.value[oldName]
    delete imagesByCategory.value[oldName]
    return true
  }

  function addImage(category, url) {
    if (!imagesByCategory.value[category]) return false
    _ensureSnapshot()
    imagesByCategory.value[category].push(url)
    return true
  }

  function removeImage(category, index) {
    const list = imagesByCategory.value[category]
    if (!list || index < 0 || index >= list.length) return false
    _ensureSnapshot()
    list.splice(index, 1)
    return true
  }

  return {
    categories,
    imagesByCategory,
    allImages,
    hasPendingChanges,
    changeCount,
    addCategory,
    removeCategory,
    renameCategory,
    addImage,
    removeImage,
    confirmChanges,
    revertChanges,
  }
})
