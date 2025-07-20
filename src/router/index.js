import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/join",
      component: () => import("@/views/Join.vue"),
    },
    {
      path: "/categoryList",
      component: () => import("@/views/Category.vue"),
    },
  ],
});

export default router;
