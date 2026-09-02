/**
 * Dados institucionais do KP Studio — contato, horários, equipe e navegação.
 *
 * Transcrito do protótipo Figma Make (App.tsx: HOURS, TEAM, ContatoPage, NAV_LINKS).
 * Usado por Nav, Footer, Contato, Sobre nós e pela seção de horários da Início.
 */

const WHATSAPP_NUMBER = '5516992068812'

export const CONTACT = {
  phone: '(16) 99206-8812',
  phoneHref: 'tel:+5516992068812',
  whatsappNumber: WHATSAPP_NUMBER,
  email: 'keniapinheirostudio@gmail.com',
  instagram: '@keniapinheirostudio',
  instagramUrl: 'https://instagram.com/keniapinheirostudio',
  address: 'Rua Expedicionário Lellis, 1703 — Centro, Sertãozinho SP',
  addressShort: 'Sertãozinho, SP · Hora marcada',
  // TODO: apontar para o endereço real do salão (hoje é a home do Maps, como no protótipo).
  mapsUrl: 'https://maps.google.com',
}

/** Link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(
  message = 'Olá! Gostaria de agendar um horário no KP Studio.',
) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const HOURS = [
  { day: 'Segunda', time: '07:00 – 17:00' },
  { day: 'Terça', time: '07:00 – 17:00' },
  { day: 'Quarta', time: '07:00 – 17:00' },
  { day: 'Quinta', time: '07:00 – 17:00' },
  { day: 'Sexta', time: '07:00 – 17:00' },
  { day: 'Sábado', time: '07:00 – 17:00' },
  { day: 'Domingo', time: 'Fechado', closed: true },
]

/**
 * Equipe.
 * Kenia Pinheiro é real; as outras duas são exemplos do protótipo, a substituir
 * pelos nomes e fotos reais das profissionais.
 */
export const TEAM = [
  {
    name: 'Kenia Pinheiro',
    role: 'Cabeleireira',
    specialty: 'Especialista em cabelos cacheados e crespos',
    hours: 'Seg – Sáb · 07:00 – 17:00',
    instagram: '@keniapinheirostudio',
    img: 'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=500&q=80',
  },
  {
    name: 'Ana Beatriz',
    role: 'Manicure',
    specialty: 'Unhas gel, acrílico e nail art',
    hours: 'Seg – Sáb · 09:00 – 17:00',
    instagram: '',
    img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80',
  },
  {
    name: 'Camila Souza',
    role: 'Maquiagem',
    specialty: 'Social, festas e produções para noivas',
    hours: 'Seg – Sáb · 09:00 – 17:00',
    instagram: '',
    img: 'https://images.unsplash.com/photo-1709477542149-f4e0e21d590b?w=500&q=80',
  },
]

/** Ordem dos links no menu e no rodapé. `to` casa com os nomes de rota. */
export const NAV_LINKS = [
  { label: 'Início', to: { name: 'HomeView' } },
  { label: 'Serviços', to: { name: 'ServicesView' } },
  { label: 'Sobre nós', to: { name: 'AboutView' } },
  { label: 'Contato', to: { name: 'ContactView' } },
  { label: 'Galeria', to: { name: 'GalleryView' } },
]
