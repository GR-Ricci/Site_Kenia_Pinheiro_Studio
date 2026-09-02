<script setup>
/**
 * Ícone do Instagram.
 *
 * O @lucide/vue v1 removeu os ícones de marca, então este fica local.
 * Traço idêntico ao dos demais ícones lucide (24×24, stroke 2, cantos redondos)
 * e mesma prop `size`, para uso intercambiável.
 */
defineProps({
  size: { type: [Number, String], default: 24 },
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
</template>
