import { createRouter, createWebHistory } from "vue-router";
import { useAccountStore, useUserInfo, useOwnerStore } from "@/stores/account";
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
      name: "login",
      component: () => import("@/views/customer/Login.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/join",
      name: "join",
      component: () => import("@/views/customer/Join.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/address",
      name: "address",
      component: () => import("@/views/customer/Address.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/check",
      name: "check",
      component: () => import("@/views/customer/Check.vue"),
    },
    {
      path: "/my-page",
      name: "my-page",
      component: () => import("@/views/customer/Mypage.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/stores",
      name: "stores",
      component: () => import("@/views/customer/Stores.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/views/customer/Contact.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/stores/:id",
      name: "store",
      component: () => import("@/views/customer/Store.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/stores/:id/order",
      name: "order",
      component: () => import("@/views/customer/Order.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/stores/:id/order/success",
      name: "order-success",
      component: () => import("@/views/customer/OrderSuccess.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("@/views/customer/Orders.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/orders/:id",
      name: "order-detail",
      component: () => import("@/views/customer/OrderDetail.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("@/views/customer/Cart.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/favorites",
      name: "favorite",
      component: () => import("@/components/myPage/Favorites.vue"),
      meta: { layout: CustomerLayout },
    },
    {
      path: "/order-test",
      name: "order-test",
      component: () => import("@/components/customer/OrderTest.vue"),
      meta: { layout: CustomerLayout },
    },
    // 사장 페이지
    {
      path: "/owner",
      name: "owner",
      component: () => import("@/views/owner/Home.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/review",
      name: "owner-review",
      component: () => import("@/views/owner/Review.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/menu",
      name: "owner-menu",
      component: () => import("@/views/owner/OwnerMenu.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/store",
      name: "owner-store",
      component: () => import("@/views/owner/StoreUpdate.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/orders",
      name: "owner-order",
      component: () => import("@/views/owner/Orders.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/delivery",
      name: "owner-delivery",
      component: () => import("@/views/owner/Delivery.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/donations",
      name: "owner-stats",
      component: () => import("@/views/owner/Stats.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/customer",
      name: "owner-customer",
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
      name: "owner-dashboard",
      component: () => import("@/views/owner/Dashboard.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/status/check",
      name: "owner-check",
      component: () => import("@/views/owner/StatusStoreCheck.vue"),
      meta: { layout: OwnerLayout },
    },
    {
      path: "/owner/status",
      name: "owner-status",
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
      path: "/hanip-manager/order",
      name: "manager-order",
      component: () => import("@/views/manager/Order.vue"),
      meta: { layout: ManagerLayout }
    },
    {
      path: "/hanip-manager/review",
      name: "manager-review",
      component: () => import("@/views/manager/Review.vue"),
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
    // 배달원 페이지
    {
      path: "/hanip-rider",
      name: "rider",
      component: () => import("@/views/rider/Rider.vue"),
      meta: { layout: EmptyLayout }
    },
  ],
});

const customerPathList = ['address', 'check', 'my-page', 'cart', 'order', 'order-success', 'orders', 'order-detail', 'favorite', 'order-test'];
const ownerPathList = ['owner', 'owner-dashboard', 'owner-check', 'owner-status', 'owner-store', 'owner-menu', 'owner-order', 'owner-review', 'owner-stats', 'owner-delivery', 'owner-customer', 'owner-coupons', 'owner-ads'];
const managerPathList = ['manager-dashboard', 'manager-user', 'manager-store', 'manager-order', 'manager-review', 'manager-recommand', 'manager-stats'];
const loginPath = ['login', 'join', 'manager-login'];
const ownerRouteNames = new Set([
  'owner','owner-dashboard','owner-check','owner-status','owner-store',
  'owner-menu','owner-order','owner-review','owner-stats','owner-delivery',
  'owner-customer','owner-coupons','owner-ads'
]);

router.beforeEach(async (to, from) => {
  const account  = useAccountStore();
  const userInfo = useUserInfo();
  const owner    = useOwnerStore();

  // A) 라우트 존재 여부 안전 체크 (name 없을 때 path로 보조)
  const existsByName = to.name ? router.hasRoute(to.name) : true;
  const existsByPath = router.getRoutes().some(r => r.path === to.path);
  if (!existsByName && !existsByPath) {
    if (account.state.loggedIn) {
      const role = userInfo.state.userData && userInfo.state.userData.role;
      if (role === '관리자') return { path: '/hanip-manager' };
      if (role === '사장')   return { path: '/owner' };
      return { path: '/' };
    }
    return { path: '/' };
  }

  // B) 로그인 상태면 role 하이드레이션 보장
  if (account.state.loggedIn && !(userInfo.state.userData && userInfo.state.userData.role)) {
    await userInfo.fetchStore();
  }
  const role = userInfo.state.userData && userInfo.state.userData.role;

  // C) 사장 영역 접근 시 isActive까지 고려해 단일 분기
  if (ownerRouteNames.has(String(to.name))) {
    if (role !== '사장') {
      return { path: role === '관리자' ? '/hanip-manager' : '/' };
    }

    if (!owner.state.storeData) {
      try { await owner.fetchStoreInfo(); } catch (e) {}
    }

    const sd = owner.state.storeData;
    const isActiveNum = Number(
      sd && sd.isActive === true ? 1
      : sd && sd.isActive === false ? 0
      : sd && sd.isActive != null ? sd.isActive
      : 0
    );

    // 비활성 사장은 /owner 고정, 활성 사장은 /owner/dashboard 고정
    if (isActiveNum === 0 && to.name !== 'owner') {
      return { path: '/owner', replace: true };
    }
    if (isActiveNum === 1 && to.name === 'owner') {
      return { path: '/owner/dashboard', replace: true };
    }
  }
});

router.beforeEach(async (to, from) => {
  const account = useAccountStore();
  const userInfo = useUserInfo();

  if (account.state.loggedIn && userInfo.state.userId === 0) {
    // 로그인 중에 페이지가 먼저 이동하게 되어버려 페이지를 잘못 이동하는 경우 생김
    // 그래서 유저 정보가 들어올 때까지 대기
    await userInfo.fetchStore();
  }

  if (!router.hasRoute(to.name)) {
    // 라우터에 등록하지 않은 주소(없는 페이지)로 이동하려고 하는 경우
    if (account.state.loggedIn) {
      if (userInfo.state.userData.role === '관리자') {
        return { path: '/hanip-manager' };
      } else if (userInfo.state.userData.role === '사장') {
        return { path: '/owner' };
      } else {
        return { path: '/' };
      }
    } else {
      return { path: '/' };
    }
  }

  if (customerPathList.includes(to.name) && (!account.state.loggedIn || account.state.loggedIn && userInfo.state.userData.role !== '고객')) {
    // 로그인 상태가 아니거나, 고객이 아닌 계정으로 고객 정보가 필요한 페이지로 이동하려고 하는 경우
    if (account.state.loggedIn) {
      if (userInfo.state.userData.role === '관리자') {
        return { path: '/hanip-manager' };
      } else {
        return { path: '/owner' };
      }
    } else {
      return { path: '/' };
    }
  }

  if (ownerPathList.includes(to.name) && (!account.state.loggedIn || account.state.loggedIn && userInfo.state.userData.role !== '사장')) {
    // 로그인 상태가 아니거나, 사장이 아닌 계정으로 로그인한 상태로 사장 페이지로 이동하려고 하는 경우
    if (account.state.loggedIn) {
      if (userInfo.state.userData.role === '관리자') {
        return { path: '/hanip-manager' };
      } else {
        return { path: '/' };
      }
    } else {
      return { path: '/' };
    }
  }

  if (loginPath.includes(to.name) && account.state.loggedIn) {
    // 로그인한 상태에서 로그인 페이지, 관리자 로그인 페이지, 회원 가입 페이지로 이동하려고 하는 경우
    if (userInfo.state.userData.role === '관리자') {
      return { path: '/hanip-manager' };
    } else if (userInfo.state.userData.role === '사장') {
      return { path: '/owner' };
    } else {
      return { path: '/' };
    }
  }

  if (managerPathList.includes(to.name) && (!account.state.loggedIn || (account.state.loggedIn && userInfo.state.userData.role !== '관리자'))) {
    // 로그인 상태가 아니거나, 관리자가 아닌 계정으로 로그인한 상태로 관리자 페이지로 이동하려고 하는 경우
    if (account.state.loggedIn) {
      if (userInfo.state.userData.role === '사장') {
        return { path: '/owner' };
      } else {
        return { path: '/' };
      }
    } else {
      return { path: '/' };
    }
  }
});

export default router;
