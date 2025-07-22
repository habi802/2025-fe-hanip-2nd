import MainLayout from '@/layouts/MainLayout.vue';
import OwnerLayout from '@/layouts/OwnerLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { layout: MainLayout },
    },
    {
      path: '/stores/:id',
      component: () => import('@/views/Store.vue'),
      meta: { layout: MainLayout },
    },
    {
      path: '/owner',
      component: () => import('@/views/Category.vue'),
      meta: { layout: OwnerLayout },
    },
    {
      path: '/owner/review',
      component: () => import('@/components/owner/Review.vue'),
      meta: { layout: OwnerLayout },
    },
  ],
});
export default router;
