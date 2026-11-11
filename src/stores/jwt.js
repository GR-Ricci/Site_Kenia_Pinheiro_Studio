import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useJwtStore = defineStore('jwt', () => {
  const token = ref(localStorage.getItem('token') || null)
  const tipo = ref(localStorage.getItem('tipo') || null)
  const id = ref(localStorage.getItem('id') || null)

  function logout() {
    token.value = null
    tipo.value = null
    id.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('tipo')
    localStorage.removeItem('id')
  }

  return {
    token,
    tipo,
    id,
    logout,
  }
})
