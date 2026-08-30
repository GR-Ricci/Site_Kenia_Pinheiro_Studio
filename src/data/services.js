/**
 * Catálogo de serviços — fonte única de verdade.
 *
 * Transcrito fielmente do protótipo Figma Make (App.tsx, const SERVICES).
 * Início (carrossel), Serviços (grid + abas) e Galeria leem daqui.
 * Ao renomear um serviço, altere só neste arquivo.
 */

export const SERVICES = [
  {
    id: 'penteados',
    name: 'Penteados',
    price: 'A partir de R$ 60',
    description: 'Do dia a dia a ocasiões especiais.',
    img: 'https://images.unsplash.com/photo-1581674210501-c760093514e8?w=600&q=80',
    subServices: [
      {
        id: 'p1',
        name: 'Para Casamento',
        price: 'R$ 150 – 350',
        description:
          'Penteados sofisticados e duradouros para o seu grande dia.',
      },
      {
        id: 'p2',
        name: 'Para Festa',
        price: 'R$ 80 – 200',
        description: 'Produções elegantes para formaturas e comemorações.',
      },
      {
        id: 'p3',
        name: 'Tranças',
        price: 'R$ 100 – 280',
        description: 'Box braids, nagô, twist e outros estilos afro.',
      },
      {
        id: 'p4',
        name: 'Dia a Dia',
        price: 'R$ 60 – 120',
        description: 'Produções práticas e bonitas para o cotidiano.',
      },
    ],
  },
  {
    id: 'coloracao',
    name: 'Coloração',
    price: 'A partir de R$ 150',
    description: 'Técnicas modernas para iluminar seus fios.',
    img: 'https://images.unsplash.com/photo-1785456283212-338f5bc44d50?w=600&q=80',
    subServices: [
      {
        id: 'c1',
        name: 'Descoloração',
        price: 'R$ 200 – 450',
        description: 'Processo seguro com avaliação prévia do fio.',
      },
      {
        id: 'c2',
        name: 'Pintura (Cor Única)',
        price: 'R$ 150 – 300',
        description: 'Cobertura total ou parcial com coloração profissional.',
      },
      {
        id: 'c3',
        name: 'Luzes / Mechas',
        price: 'R$ 250 – 500',
        description: 'Técnicas de iluminação que realçam volume e cachos.',
      },
      {
        id: 'c4',
        name: 'Balayage',
        price: 'R$ 300 – 600',
        description: 'Degradê natural pintado à mão, resultado exclusivo.',
      },
    ],
  },
  {
    id: 'tratamentos',
    name: 'Tratamentos',
    price: 'A partir de R$ 80',
    description: 'Cuidados profundos para cabelos saudáveis.',
    img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80',
    subServices: [
      {
        id: 't1',
        name: 'Hidratação',
        price: 'R$ 80 – 150',
        description: 'Reposição de água e nutrientes para cachos definidos.',
      },
      {
        id: 't2',
        name: 'Reconstrução',
        price: 'R$ 100 – 200',
        description: 'Proteínas para restaurar fios danificados.',
      },
      {
        id: 't3',
        name: 'Cronograma Capilar',
        price: 'R$ 120 – 280',
        description:
          'Protocolo em 3 etapas: hidratação, nutrição e reconstrução.',
      },
    ],
  },
  {
    id: 'sobrancelhas',
    name: 'Sobrancelhas',
    price: 'A partir de R$ 40',
    description: 'Design personalizado que realça o olhar.',
    img: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&q=80',
    subServices: [
      {
        id: 's1',
        name: 'Design & Depilação',
        price: 'R$ 40 – 65',
        description: 'Modelagem precisa com pinça, linha ou cera.',
      },
      {
        id: 's2',
        name: 'Henna',
        price: 'R$ 50 – 80',
        description: 'Pigmentação natural, duração de até 4 semanas.',
      },
      {
        id: 's3',
        name: 'Micropigmentação',
        price: 'R$ 400 – 700',
        description: 'Procedimento semipermanente para sobrancelhas perfeitas.',
      },
    ],
  },
  {
    id: 'depilacao',
    name: 'Depilação',
    price: 'A partir de R$ 30',
    description: 'Pele lisa com técnicas eficientes e seguras.',
    img: 'https://images.unsplash.com/photo-1733145820333-6fa6ed6f8f5d?w=600&q=80',
    subServices: [
      {
        id: 'd1',
        name: 'Buço',
        price: 'R$ 30 – 50',
        description: 'Remoção suave com cera ou linha.',
      },
      {
        id: 'd2',
        name: 'Axilas',
        price: 'R$ 40 – 60',
        description: 'Depilação rápida e eficiente.',
      },
      {
        id: 'd3',
        name: 'Pernas',
        price: 'R$ 80 – 130',
        description: 'Completa ou meia perna.',
      },
      {
        id: 'd4',
        name: 'Virilha',
        price: 'R$ 60 – 110',
        description: 'Tradicional ou cavada, com cuidado e discrição.',
      },
    ],
  },
  {
    id: 'manicuri',
    name: 'Manicuri',
    price: 'A partir de R$ 35',
    description: 'Unhas impecáveis com produtos de qualidade.',
    img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80',
    subServices: [
      {
        id: 'm1',
        name: 'Tradicional',
        price: 'R$ 35 – 55',
        description: 'Esmaltação em esmalte comum ou gel-lac.',
      },
      {
        id: 'm2',
        name: 'Gel / Acrigel',
        price: 'R$ 60 – 120',
        description: 'Alongamento com resistência e acabamento profissional.',
      },
      {
        id: 'm3',
        name: 'Nail Art',
        price: 'R$ 60 – 150',
        description: 'Designs personalizados e exclusivos.',
      },
    ],
  },
  {
    id: 'pedicuri',
    name: 'Pedicuri',
    price: 'A partir de R$ 40',
    description: 'Cuidados completos para os pés.',
    img: 'https://images.unsplash.com/photo-1779636198585-658170ee0283?w=600&q=80',
    subServices: [
      {
        id: 'pc1',
        name: 'Tradicional',
        price: 'R$ 40 – 65',
        description: 'Cutículas, lixamento e esmaltação completa.',
      },
      {
        id: 'pc2',
        name: 'Pedicuri Spa',
        price: 'R$ 70 – 110',
        description: 'Imersão relaxante + hidratação intensiva dos pés.',
      },
      {
        id: 'pc3',
        name: 'Com Gel',
        price: 'R$ 75 – 130',
        description: 'Esmaltação em gel para maior durabilidade.',
      },
    ],
  },
  {
    id: 'maquiagem',
    name: 'Maquiagem',
    price: 'A partir de R$ 120',
    description: 'Produções artísticas para qualquer ocasião.',
    img: 'https://images.unsplash.com/photo-1709477542149-f4e0e21d590b?w=600&q=80',
    subServices: [
      {
        id: 'mq1',
        name: 'Social / Dia',
        price: 'R$ 120 – 200',
        description: 'Make leve e natural para eventos diurnos.',
      },
      {
        id: 'mq2',
        name: 'Para Festa',
        price: 'R$ 150 – 280',
        description: 'Make poderosa e duradoura para a noite.',
      },
      {
        id: 'mq3',
        name: 'Noiva',
        price: 'R$ 280 – 450',
        description: 'Produção exclusiva, resistente e atemporal.',
      },
      {
        id: 'mq4',
        name: 'Artística',
        price: 'R$ 200 – 400',
        description: 'Criações para ensaios e eventos temáticos.',
      },
    ],
  },
  {
    id: 'casamentos',
    name: 'Casamentos',
    price: 'A partir de R$ 350',
    description: 'Pacotes completos para o dia mais especial.',
    img: 'https://images.unsplash.com/photo-1549236177-f9b0031756eb?w=600&q=80',
    subServices: [
      {
        id: 'cs1',
        name: 'Pacote Noiva Completo',
        price: 'R$ 800 – 1.500',
        description: 'Penteado + maquiagem + teste + dia da noiva.',
      },
      {
        id: 'cs2',
        name: 'Penteado da Noiva',
        price: 'R$ 300 – 550',
        description: 'Penteado sofisticado com teste incluso.',
      },
      {
        id: 'cs3',
        name: 'Maquiagem da Noiva',
        price: 'R$ 280 – 480',
        description: 'Make exclusiva com teste e durabilidade garantida.',
      },
      {
        id: 'cs4',
        name: 'Cortejo (por pessoa)',
        price: 'R$ 150 – 300',
        description: 'Produção padronizada para damas e madrinhas.',
      },
    ],
  },
]

/** Abas de filtro, compartilhadas por Início (carrossel) e Serviços (grid). */
export const TABS = [
  { label: 'Todos', ids: null },
  { label: 'Cabelos', ids: ['penteados', 'coloracao', 'tratamentos'] },
  { label: 'Unhas', ids: ['manicuri', 'pedicuri'] },
  { label: 'Estética', ids: ['sobrancelhas', 'depilacao'] },
  { label: 'Eventos', ids: ['maquiagem', 'casamentos'] },
]

/** Os 4 cards fixos do carrossel da Início. Cada um leva à aba de mesmo nome. */
export const CAROUSEL_CATS = [
  {
    label: 'Cabelos',
    tab: 'Cabelos',
    img: 'https://images.unsplash.com/photo-1581674210501-c760093514e8?w=600&q=80',
  },
  {
    label: 'Unhas',
    tab: 'Unhas',
    img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80',
  },
  {
    label: 'Estética',
    tab: 'Estética',
    img: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&q=80',
  },
  {
    label: 'Eventos',
    tab: 'Eventos',
    img: 'https://images.unsplash.com/photo-1709477542149-f4e0e21d590b?w=600&q=80',
  },
]

export const TIME_SLOTS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
]

export const UNAVAILABLE = ['09:00', '13:00']

/** Serviços de uma aba. Rótulo inexistente cai em "Todos". */
export function servicesByTab(label) {
  const tab = TABS.find((t) => t.label === label) ?? TABS[0]
  return tab.ids ? SERVICES.filter((s) => tab.ids.includes(s.id)) : SERVICES
}
