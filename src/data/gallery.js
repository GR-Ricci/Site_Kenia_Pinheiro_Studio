/**
 * Galeria de trabalhos.
 *
 * Transcrito do protótipo Figma Make (App.tsx, GALLERY_CATS / GALLERY).
 *
 * ATENÇÃO — divergência conhecida, mantida no port por fidelidade ao protótipo:
 * estas categorias NÃO batem com as de `services.js`. Faltam Penteados,
 * Tratamentos e Sobrancelhas, e "Eventos" não é um serviço (o serviço chama-se
 * Casamentos). As fotos também se repetem entre categorias. Corrigir junto com
 * a troca pelas fotos reais do salão.
 */

export const GALLERY_CATS = [
  'Coloração',
  'Depilação',
  'Eventos',
  'Manicuri',
  'Maquiagem',
  'Pedicuri',
]

export const GALLERY = {
  Coloração: [
    'https://images.unsplash.com/photo-1785456283212-338f5bc44d50?w=500&q=80',
    'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?w=500&q=80',
    'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=500&q=80',
    'https://images.unsplash.com/photo-1632765866070-3fadf25d3d5b?w=500&q=80',
    'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=500&q=80',
    'https://images.unsplash.com/photo-1581674210501-c760093514e8?w=500&q=80',
  ],
  Depilação: [
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=500&q=80',
    'https://images.unsplash.com/photo-1779636198585-658170ee0283?w=500&q=80',
    'https://images.unsplash.com/photo-1659391542239-9648f307c0b1?w=500&q=80',
    'https://images.unsplash.com/photo-1733145820333-6fa6ed6f8f5d?w=500&q=80',
  ],
  Eventos: [
    'https://images.unsplash.com/photo-1549236177-f9b0031756eb?w=500&q=80',
    'https://images.unsplash.com/photo-1581674210501-c760093514e8?w=500&q=80',
    'https://images.unsplash.com/photo-1632765866070-3fadf25d3d5b?w=500&q=80',
    'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=500&q=80',
  ],
  Manicuri: [
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80',
    'https://images.unsplash.com/photo-1659391542239-9648f307c0b1?w=500&q=80',
    'https://images.unsplash.com/photo-1779636198585-658170ee0283?w=500&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=500&q=80',
    'https://images.unsplash.com/photo-1709477542149-f4e0e21d590b?w=500&q=80',
    'https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?w=500&q=80',
  ],
  Maquiagem: [
    'https://images.unsplash.com/photo-1709477542149-f4e0e21d590b?w=500&q=80',
    'https://images.unsplash.com/photo-1709477542170-f11ee7d471a0?w=500&q=80',
    'https://images.unsplash.com/photo-1632765866070-3fadf25d3d5b?w=500&q=80',
    'https://images.unsplash.com/photo-1549236177-f9b0031756eb?w=500&q=80',
  ],
  Pedicuri: [
    'https://images.unsplash.com/photo-1779636198585-658170ee0283?w=500&q=80',
    'https://images.unsplash.com/photo-1659391542239-9648f307c0b1?w=500&q=80',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=500&q=80',
  ],
}
