import MainLayout from "@/layouts/MainLayout.vue";
import OwnerLayout from "@/layouts/OwnerLayout.vue";
import { compile } from "sass";
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: "auto" };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/stores/:id",
      component: () => import("@/views/Store.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/stores/:id/order",
      component: () => import("@/views/Order.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/stores/:id/order/success",
      component: () => import("@/views/OrderSuccess.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/owner",
      component: () => import("@/views/owner/Home.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/review",
      component: () => import("@/components/owner/Review.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/categoryList",
      component: () => import("@/views/Category.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/join",
      component: () => import("@/views/Join.vue"),
    },
    {
      path: "/owner/menu",
      component: () => import("@/views/owner/OwnerMenu.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/store",
      component: () => import("@/views/owner/StoreUpdate.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/orders",
      component: () => import("@/components/owner/Orders.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/cart",
      component: () => import("@/views/Cart.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/my-page",
      component: () => import("@/views/Mypage.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/owner/delivery",
      component: () => import("@/views/owner/Delivery.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/donations",
      component: () => import("@/views/owner/Donations.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/customer",
      component: () => import("@/views/owner/Customer.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/coupons",
      component: () => import("@/views/owner/Coupons.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/ads",
      component: () => import("@/views/owner/ads.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/dashboard",
      component: () => import("@/views/owner/Dashboard.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/orders",
      component: () => import("@/components/myPage/OrderDetails.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/favorites",
      component: () => import("@/components/myPage/Favorites.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/reviews-page/:id",
      component: () => import("@/components/myPage/ReviewPage.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/owner/status",
      component: () => import("@/views/owner/StatusStore.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/review/ok",
      component: () => import("@/components/myPage/ReviewRouter.vue"),
      meta: { layout: MainLayout },
    },
    {
      path: "/contact",
      component: () => import("@/components/customerService/contactMain.vue"),
      meta: { layout: MainLayout },
    },
  ],
});
export default router;
