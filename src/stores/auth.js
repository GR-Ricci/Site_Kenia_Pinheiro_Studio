import { ref } from 'vue'
import { defineStore } from 'pinia'

// O pacote (token, tipo, id) que a Store guarda vem da feature user (função verificar_login), que lê a tabela usuario no back.

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const tipo = ref(localStorage.getItem('tipo') || null)
  const id = ref(localStorage.getItem('id') || null)

  return {
    token,
    tipo,
    id,
  }
})
