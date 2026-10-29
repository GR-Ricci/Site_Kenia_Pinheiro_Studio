export async function apiFetch(endpoint, options = {}) {
  const mytoken = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescrever ou adicionar headers específicos na chamada
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
    throw new Error(data.detail || 'Erro na requisição')
  }

  return data
}
