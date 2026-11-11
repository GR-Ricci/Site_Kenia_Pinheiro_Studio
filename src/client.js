import { useJwtStore } from '@/stores/jwt'

export async function apiFetch(endpoint, options = {}) {
  const mytoken = localStorage.getItem('token')

  const headers = {
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (mytoken) {
    headers['Authorization'] = `Bearer ${mytoken}`
  }

  const url = `${import.meta.env.VITE_API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error('Erro na requisição')

    if (Array.isArray(data.detail) && data.detail.length > 0) {
      error.campos = {}
      data.detail.forEach((err) => {
        error.campos[err.loc[1]] = err.msg
      })
    } else {
      error.message = data.detail
    }

    if (response.status === 401) {
      useJwtStore().logout()
      window.location.href = '/login'
    }

    throw error
  }

  return data
}
