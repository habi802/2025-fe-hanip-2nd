import { createRouter, createWebHistory } from "vue-router";

import CustomerLayout from "@/layouts/CustomerLayout.vue";
import OwnerLayout from "@/layouts/OwnerLayout.vue";
import ManagerLayout from "@/layouts/ManagerLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: "auto" };
  },
  routes: [
    // 고객 페이지
    {
      path: "/",
      name: "home",
      component: () => import("@/views/customer/Home.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/login",
      component: () => import("@/views/customer/Login.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/join",
      component: () => import("@/views/customer/Join.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/address",
      component: () => import("@/views/customer/Address.vue"),
    },
    {
      path: "/check",
      component: () => import("@/views/customer/check.vue"),
    },
    {
      path: "/my-page",
      component: () => import("@/views/customer/Mypage.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/categoryList",
      component: () => import("@/views/customer/Category.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/contact",
      component: () => import("@/views/customer/Contact.vue"),
    },
    {
      path: "/stores/:id",
      component: () => import("@/views/customer/Store.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/stores/:id/order",
      component: () => import("@/views/customer/Order.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/stores/:id/order/success",
      component: () => import("@/views/customer/OrderSuccess.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/orders",
      component: () => import("@/components/myPage/OrderDetails.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/cart",
      component: () => import("@/views/customer/Cart.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/favorites",
      component: () => import("@/components/myPage/Favorites.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/reviews-page/:id",
      component: () => import("@/components/myPage/ReviewPage.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/review/ok",
      component: () => import("@/components/myPage/ReviewRouter.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/order-test",
      component: () => import("@/components/customer/OrderTest.vue"),
      meta: { layout: CustomerLayout },
    },
    // 사장 페이지
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
      component: () => import("@/views/owner/Orders.vue"),
      meta: { layout: OwnerLayout },
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
      path: "/owner/status/check",
      component: () => import("@/views/owner/StatusStoreCheck.vue"),
      meta: { layout: OwnerLayout },
    },
    {
    path: "/owner/status",
    component: () => import("@/views/owner/StatusStore.vue"),
    meta: { layout: OwnerLayout },
    },
    // 관리자 페이지
    {
      path: "/hanip-manager/login",
      name: "manager-login",
      component: () => import("@/views/manager/Login.vue"),
      meta: { layout: EmptyLayout }
    },
    {
      path: "/hanip-manager",
      name: "manager-dashboard",
      component: () => import("@/views/manager/Dashboard.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/user",
      name: "manager-user",
      component: () => import("@/views/manager/User.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/store",
      name: "manager-store",
      component: () => import("@/views/manager/Store.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/review",
      name: "manager-review",
      component: () => import("@/views/manager/Review.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/order",
      name: "manager-order",
      component: () => import("@/views/manager/Order.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/recommand",
      name: "manager-recommand",
      component: () => import("@/views/manager/Recommand.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/stats",
      name: "manager-stats",
      component: () => import("@/views/manager/Stats.vue"),
      meta: { layout: ManagerLayout }
    },
  ],
});
export default router;
