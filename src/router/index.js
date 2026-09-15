import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),

  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/services',
      name: 'ServicesView',
      component: () => import('@/views/services/ServicesView.vue'),
    },
    {
      path: '/about',
      name: 'AboutView',
      component: () => import('@/views/about/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'ContactView',
      component: () => import('@/views/contact/ContactView.vue'),
    },
    {
      // Galeria pública — apenas exibe as fotos.
      path: '/gallery',
      name: 'GalleryView',
      component: () => import('@/views/gallery/GalleryView.vue'),
    },
    {
      // Galeria administrativa — permite editar categorias e fotos.
      path: '/adm/gallery',
      name: 'AdmGalleryView',
      component: () => import('@/views/gallery/Adm_GalleryView.vue'),
    },
    {
      path: '/example',
      name: 'ExampleView',
      component: () => import('@/views/example/ExampleView.vue'),
    },
  ],
})

export default router
