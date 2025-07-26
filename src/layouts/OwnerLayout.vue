<script setup>
import { getOwnerOrder } from "@/services/orderService";
import { activeStore, getOwnerStore } from "@/services/storeService";
import { useOrderStore } from "@/stores/orderStore";
import { ref, onMounted, onUnmounted, provide, watch, computed, reactive } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { logout } from "@/services/userService";
import { useAccountStore } from "@/stores/account";

// 로그아웃 상태 반영
const account = useAccountStore();

// ref, route, router
const router = useRouter();
const route = useRoute();
const redDot = ref(false);
const orderStore = useOrderStore();
const notifications = ref([]); // 알림배열
const removedNotification = ref(new Set());

onMounted(async () => {
  const res = await getOwnerStore();
  
  // console.log("res: ", res.data.resultData)
  if (res.status !== 200) {
    alert("에러");
    return;
  }
  state.form = res.data.resultData;
  isOpen.value = state.form.isActive;

  // id가 준비된 후에 호출
  if (state.form.id) {
    await getOwnerOrder(state.form.id);
    orderStore.fetchOrders(state.form.id);
  }

  // 5초마다 반복 호출 서버 로그 방해 되면 아랫줄 주석 처리할것
  if(state.form.id) {
    orderStore.fetchOrders(state.form.id);
  }
  setInterval(() => {
    orderStore.fetchOrders(state.form.id);
  }, 5000);
   
});

// 가게 데이터
const state = reactive({
  form: {},
});

const menus = [
  { text: "대시보드", path: "/owner/dashboard" },
  { text: "가게 상태 관리", path: "/owner/status" },
  { text: "주문 관리", path: "/owner/orders" },
  { text: "메뉴 관리", path: "/owner/menu" },
  { text: "리뷰 관리", path: "/owner/review" },
  { text: "배달 관리", path: "/owner/delivery" },
  { text: "통계 현황", path: "/owner/donations" },
  { text: "고객 관리", path: "/owner/customer" },
  { text: "쿠폰 관리", path: "/owner/coupons" },
  { text: "광고 관리", path: "/owner/ads" },
];

// 데이터 가져오기
watch(
  () => state.form.id,
  (newId) => {
    if (newId) {
      console.log("보내는 storeId:", newId);
      orderStore.fetchOrders(newId);
    }
  }
);

// 알림 갱신
onMounted(async () => {
  const saved = localStorage.getItem("removedNotification");
  if (saved) {
    removedNotification.value = new Set(JSON.parse(saved));
  }
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
const isOpen = ref(false);

const toggleBusiness = async () => {
  const storeId = state.form.id;
  const willOpen = !isOpen.value; // <- 변경 전 값을 기준으로

  const confirmMessage = willOpen
    ? "가게 영업을 시작하시겠습니까?"
    : "가게 영업을 중지하겠습니까?";

  if (confirm(confirmMessage)) {
    await activeStore(storeId);

    const res = await getOwnerStore();
    if (res.status === 200) {
      state.form = res.data.resultData;
      isOpen.value = state.form.isActive;
    }
  } else {
    // 취소되면 원래대로 복원
    // 현재는 토글된 상태이므로 반대로 되돌려야 함
    isOpen.value = !willOpen;
  }
};

// provide 영업 데이터 옮기기, 가게 사장 이름 옮기기
provide("isOpen", isOpen);
provide("toggleBusiness", toggleBusiness);
const ownerName = computed(() => state.form.ownerName);
provide("ownerName", ownerName);
const storeId = computed(() => state.form.id);
provide("storeId", storeId)
const storeActive = computed(() => state.form.isActive);
provide("storeActive", storeActive)


// 로그아웃
const logoutOwner = async () => {
  await logout();
  account.setLoggedIn(false);
  router.push("/");
};

// 가게수정
const storeModify = async() => {
  router.push("/owner/store");
}

// 시계
const currentTime = ref('');

const updateClock = () => {
  const now = new Date();

  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const day = dayNames[now.getDay()];

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  currentTime.value = `${month}월 ${date}일 (${day})  ${hours}:${minutes}:${seconds}`;
};

let intervalId = null;

onMounted(() => {
  updateClock();
  intervalId = setInterval(updateClock, 1000); 
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="d-flex box" style="min-height: 100vh">
    <!-- 사이드바 -->
    <div class="p-4" style="width: 300px; flex-shrink: 0">
      <div class="text-center mb-5">
        <img
          class="logo"
          src="/src/imgs/haniplogo3.png"
          alt="logo"
          style="width: 180px"
        />
        <!-- 시각 -->
        <div class="text-black-50 mb-4" style="font-weight: 600; font-size: 17px;">{{ currentTime  }}</div>
        <!-- 토글버튼 -->
         <div class="toggle-container d-flex justify-content-center">
          <span>영업 상태</span>
          <label class="switch">
            <input type="checkbox" :checked="isOpen" @change="toggleBusiness" />
            <span class="slider"></span>
          </label>
         </div>
      </div>
      <ul class="nav nav-pills flex-column gap-4">
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
      <div class="mt-5 text-center small text-muted">
        All righs Reserved © HanIp Corp. 2025
      </div>
    </div>

    <!-- 오른쪽 화면 -->
    <div
      class="flex-grow-1 d-flex flex-column"
      style="background-color: #e8e8e8"
    >
      <!-- 검색 + 영업 버튼 -->

      <div class="d-flex align-items-center paddingSearch">
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

          <!-- 드랍다운 -->
          <div class="relative d-flex gap-2">
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
        <!-- 구분선 -->
        <div class="vertical-line mx-4"></div>
        <!-- 유저 정보 -->
        <div class="d-flex align-items-center">
          <div class="dropdown position-relative">
            <div
              class="d-flex align-items-center"
              data-bs-toggle="dropdown"
              role="button"
              style="cursor: pointer"
            >
              <span class="me-2"
                ><span style="font-weight: bold; letter-spacing: 1px">{{
                  state.form.ownerName
                }}</span>
                사장님</span
              >
              <img
                src="/src/imgs/owner/owner_profile.png"
                style="cursor: pointer"
                role="button"
              />
            </div>

            <div class="dropdown-menu dropdown-menu-end">
              <div class="title px-3 py-2">{{ state.form.ownerName }}</div>
              <div class="dropdown-divider"></div>
              <div @click="storeModify" style="cursor: pointer" class="dropdown-item">가게수정</div>
              <div
                @click="logoutOwner"
                style="cursor: pointer"
                class="dropdown-item"
              >
                로그아웃
              </div>
            </div>
          </div>
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
.box {
  font-family: "Pretendard", sans-serif;
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
  width: 800px;
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

.vertical-line {
  width: 1.5px;
  height: 45px;
  background-color: #d1d1d1;
}

// 토글버튼
.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: #403f57;
  margin: 10px 0;
  font-size: 17px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 66px;
  height: 32px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #c4c4c4;
  border: 1px solid #403f57;
  border-radius: 34px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 30px;
  width: 30px;
  left: 0px;
  bottom: 0px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #ff6666;
}

input:checked + .slider::before {
  transform: translateX(34px);
}
</style>
