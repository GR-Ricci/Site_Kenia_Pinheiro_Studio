import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import { useJwtStore } from '@/stores/jwt'

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
      path: '/example',
      name: 'ExampleView',
      component: () => import('@/views/example/ExampleView.vue'),
    },

    //Meta
    {
      path: '/profile',
      name: 'ProfileView',
      component: () => import('@/views/profile/ProfileView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/invite',
      name: 'InviteView',
      component: () => import('@/views/invite/InviteView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'RegisterView',
      component: () => import('@/views/register/RegisterView.vue'),
      //meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('@/views/login/LoginView.vue'),
      //meta: { requiresAuth: true },
    },
  ],
})

// router.beforeEach((to, from) => {
//  const JwtStore = useJwtStore()

//  if (to.meta.requiresAuth && !JwtStore.token) {
//    return { path: '/' }
//  }

//  if (to.path === '/register' && !to.query.token) {
//    return { path: '/' }
//})

export default router
