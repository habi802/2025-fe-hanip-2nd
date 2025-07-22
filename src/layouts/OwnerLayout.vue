<script setup>
import { useOrderStore } from "@/stores/orderStore";
import { ref, onMounted, onUnmounted, provide, watch } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

// ref, route, router
const router = useRouter();
const route = useRoute();
const isOpen = ref(true);
const redDot = ref(false);
const orderStore = useOrderStore();
const notifications = ref([]); // 알림배열
const removedNotification = ref(new Set());

const homeRouter = () => {
  router.push("/");
};

const menus = [
  { text: "대시보드", path: "/owner" },
  { text: "공지·한마디", path: "/owner/store" },
  { text: "주문 상세", path: "/owner/orders" },
  { text: "메뉴 상세", path: "/owner/menu" },
  { text: "리뷰 관리", path: "/owner/review" },
  { text: "배달 관리", path: "/owner/coupons" },
  { text: "통계 현황", path: "/owner/donations" },
  { text: "고객 관리", path: "/owner/customer" },
  { text: "쿠폰 관리", path: "/owner/coupons" },
  { text: "광고 관리", path: "/owner/ads" },
];

// 데이터 한번 뿌리기
onMounted(async () => {
  // 데이터 가져오기
  orderStore.fetchOrders();

  // 5초마다 가져오기
  setInterval(() => {
    orderStore.fetchOrders();
  }, 5000);

  const saved = localStorage.getItem("removedNotification");
  if (saved) {
    removedNotification.value = new Set(JSON.parse(saved));
  }
});

onUnmounted(() => {
  clearInterval(interval);
});

// 알림 갱신 (watch)
watch(
  () => orderStore.orderedList,
  (newOrders) => {
    newOrders.forEach((order) => {
      // 삭제한 알림이면 추가하지 않음
      if (removedNotification.value.has(order.id)) return;

      const exists = notifications.value.find((n) => n.id === order.id);
      if (!exists) {
        notifications.value.push({
          id: order.id,
          message: `새로운 주문: ${order.id}`,
        });
        redDot.value = true; // 빨간 점 ON
      }
    });
  },
  { deep: true }
);

const openDropdown = () => {
  redDot.value = false;
};

// 삭제할 때 localStorage에 저장
const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
  removedNotification.value.add(id);
  localStorage.setItem(
    "removedNotification",
    JSON.stringify(Array.from(removedNotification.value))
  );
};

// 영업 버튼 토글
const toggleBusiness = () => {
  if (isOpen.value) {
    if (confirm("영업을 중단하시겠습니까?")) {
      isOpen.value = !isOpen.value;
      return;
    }
  }

  if (!isOpen.value) {
    if (confirm("영업을 시작하시겠습니까?")) {
      isOpen.value = !isOpen.value;
      return;
    }
  }
};

// provide (영업 데이터 옮기기)
provide("isOpen", isOpen);
provide("toggleBusiness", toggleBusiness);
</script>

<template>
  <div class="d-flex" style="min-height: 100vh">
    <!-- 사이드바 -->
    <div class="p-4" style="width: 300px; flex-shrink: 0">
      <div class="text-center mb-5">
        <img
          class="logo"
          @click="homeRouter"
          src="/src/imgs/haniplogo3.png"
          alt="logo"
          style="width: 180px"
        />
      </div>
      <ul class="nav nav-pills flex-column gap-4 fw-bolder">
        <li class="nav-item" v-for="menu in menus" :key="menu.text">
          <RouterLink
            :to="menu.path"
            class="nav-link w-100 text-center size d-flex justify-content-center align-items-center"
            :style="{
              backgroundColor: route.path === menu.path ? '#f66463' : '#dddddd',
              color:
                route.path === menu.path
                  ? '#FFFFFF !important'
                  : '#333333 !important',
              padding: '10px 10px',
              fontSize: '17px',
            }"
          >
            {{ menu.text }}
          </RouterLink>
        </li>
      </ul>
      <div class="mt-auto text-center small text-muted">© HanIp Corp. 2025</div>
    </div>

    <!-- 오른쪽 화면 -->
    <div
      class="flex-grow-1 d-flex flex-column"
      style="background-color: #e8e8e8"
    >
      <!-- 검색 + 영업 버튼 -->

      <div
        class="d-flex align-items-center justify-content-between paddingSearch"
      >
        <div class="d-flex align-items-center" style="gap: 16px">
          <li class="nav-item nav-channel-search-wrapper d-none d-sm-block">
            <form id="" class="position-relative">
              <img src="/src/imgs/search_icon.png" class="search-icon-inside" />
              <input
                type="search"
                class="form-control ps-5 search"
                autocomplete="off"
                placeholder="검색"
              />
            </form>
          </li>

          <button
            :class="['btn', isOpen ? 'btn-success' : 'btn-danger']"
            @click="toggleBusiness"
            style="height: 50px"
          >
            {{ isOpen ? "영업 진행" : "영업 중단" }}
          </button>

          <!-- 팝업 메뉴 -->
          <div class="relative d-flex">
            <div class="dropdown position-relative">
              <img
                src="/src/imgs/owner/icon_bell.svg"
                class="icon"
                data-bs-toggle="dropdown"
                style="cursor: pointer"
                role="button"
                @click="openDropdown"
              />
              <div class="red-dot" v-show="redDot"></div>

              <div class="dropdown-menu dropdown-menu-start">
                <div class="title px-3 py-2">알림</div>
                <div class="dropdown-divider"></div>
                <ul class="noti-item-list list-unstyled m-0 px-3">
                  <li v-if="notifications.length === 0">알림이 없습니다.</li>
                  <li
                    v-for="order in notifications"
                    :key="order.id"
                    @click.stop="removeNotification(order.id)"
                    style="cursor: pointer"
                  >
                    {{ order.message }}
                  </li>
                </ul>
              </div>
            </div>

            <img src="/src/imgs/owner/icon_chat.svg" class="icon" />
            <img src="/src/imgs/owner/icon_present.svg" class="icon" />
            <img src="/src/imgs/owner/icon_config.svg" class="icon" />
          </div>
        </div>

        <!-- 유저 정보 -->
        <div class="d-flex align-items-center">
          <span class="me-2">홍길동 사장님</span>
        </div>
      </div>

      <!-- 라우터뷰 -->
      <div class="flex-grow-1 padding">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
img.logo {
  cursor: pointer;
}

.padding {
  padding-top: 20px;
  padding-left: 40px;
}

.paddingSearch {
  padding-top: 40px;
  padding-left: 52px;
}

.searchBox::placeholder {
  font-size: 16px;
  color: #a8a8a8;
}

.icon {
  width: 60px;
  height: 50px;
}

.size {
  height: 54px;
}

.search-icon-inside {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.search {
  border-radius: 10px;
  width: 730px;
  height: 50px;
}

.red-dot {
  width: 12px;
  height: 12px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  right: 4px;
  border: 1px solid white;
}
</style>
