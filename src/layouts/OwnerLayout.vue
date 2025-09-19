<script setup>
import { getOwnerOrder } from "@/services/orderService";
import { activeStore, getOwnerStore } from "@/services/storeService";
import { useOrderStore } from "@/stores/orderStore";
import { ref, onMounted, onUnmounted, provide, watch, computed, reactive, } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { check, logout } from "@/services/userService";
import { useAccountStore } from "@/stores/account";
//import '@/assets/customer/customer.css';
import "@/assets/owner/_ownerStyle.scss";
import {useOwnerStore} from '@/stores/account.js'

const ownerStore = useOwnerStore();
console.log('오너스토어:'+ownerStore.resultData);
// 로그인 체크
// const checkAcconut = async () => {
//   const res = await check();
//   console.log('res:', res);
//   if (res == undefined || res.status != 200) {
//     account.setChecked(false);
//     return;
//   }
//   account.setChecked(true);
//   account.setLoggedIn(res.data.resultData > 0);
// };

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
  console.log(res);
  if (res.status !== 200) {
    alert("에러");
    return;
  }

  state.form = res.data.resultData;
  console.log(state.form);
  isOpen.value = state.form.isActive;

  if (state.form.id) {
    await orderStore.fetchOrders(state.form.id);
    // pollingInterval = setInterval(() => {
    //   orderStore.fetchOrders(state.form.id);
    // }, 5000);
  }
});

// 가게 데이터
const state = reactive({
  form: {},
});

const menus = [
  { text: "대시보드", path: "/owner/dashboard" },
  { text: "가게 상태 관리", path: "/owner/status" },
  { text: "주문 내역 관리", path: "/owner/orders" },
  { text: "메뉴 관리", path: "/owner/menu" },
  { text: "리뷰 관리", path: "/owner/review" },
  { text: "통계 현황", path: "/owner/donations" },
  // { text: "배달 관리", path: "/owner/delivery" },
  // { text: "고객 관리", path: "/owner/customer" },
  // { text: "쿠폰 관리", path: "/owner/coupons" },
  // { text: "광고 관리", path: "/owner/ads" },
];

// 알림 갱신
onMounted(async () => {
  const saved = localStorage.getItem("removedNotification");
  if (saved) {
    removedNotification.value = new Set(JSON.parse(saved));
  }
  //checkAcconut();
});
watch(
  () => route.path,
  () => {
    //checkAcconut();
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
        redDot.value = true; // 빨간 점
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
  const willOpen = !isOpen.value;

  const confirmMessage = willOpen
    ? "가게 영업을 시작하시겠습니까?"
    : "가게 영업을 중지하겠습니까?";

  if (confirm(confirmMessage)) {
    await activeStore(storeId);

    const res = await getOwnerStore();
    if (res.status === 200) {
      state.form = res.data.resultData;
      isOpen.value = state.form.isActive;

      // 상태에 따라 경로 이동
      if (isOpen.value) {
        router.push("/owner/dashboard");
      } else {
        router.push("/owner");
      }
    }
  } else {
  }
};

// provide 영업 데이터 옮기기, 가게 사장 이름 옮기기
provide("isOpen", isOpen);
provide("toggleBusiness", toggleBusiness);
const ownerName = computed(() => state.form.ownerName);
provide("ownerName", ownerName);
const storeId = computed(() => state.form.id);
provide("storeId", storeId);
const storeActive = computed(() => state.form.isActive);
provide("storeActive", storeActive);

// 로그아웃
const logoutOwner = async () => {
  await activeStore(storeId.value);
  // console.log("storeId삭제: ", storeId.value);
  const res = await logout();
  if (res.status !== 200) {
    return;
  }

  account.setLoggedIn(false);
  router.push("/");
};

// 가게수정
const storeModify = async () => {
  router.push("/owner/store");
};

// 시계
const currentTime = ref("");

const updateClock = () => {
  const now = new Date();

  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[now.getDay()];

  currentTime.value = `${month}월 ${date}일 (${day})`;
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
  <div class="box d-flex" style="min-height: 1080px">
    <!-- 사이드바 -->
    <div class="sideNav p-3" style="width: 345px; flex-shrink: 0">
      <div class="text-center mb-5">
        <img :style="{ width: '220px', }" src="/src/imgs/haniplogo3.png" alt="logo" />
        <div style="font-size: 40px; font-weight: 100; font-family: Pretendard,serif;">{{ state.form.name }}</div>
        <!-- 유저정보 -->
        <div class="d-flex align-items-center justify-content-center pt-3">
          <div class="dropdown position-relative">
            <div class="d-flex align-items-center gap-2" data-bs-toggle="dropdown" role="button"
              style="cursor: pointer">
              <img src="/src/imgs/owner/owner_profile.png" style="cursor: pointer; width: 22px;" role="button" />
              <span class="me-2" style="font-size: 16px;">
                <span style="font-weight: bold; letter-spacing: 1px">
                  {{ state.form.ownerName }}
                </span>
                사장님
              </span>
            </div>
            <div class="dropdown-menu dropdown-menu-end">
              <div class="title px-3 py-2">
                {{ state.form.ownerName }}
              </div>
              <div class="dropdown-divider">
              </div>
              <div @click="logoutOwner" style="cursor: pointer" class="dropdown-item">
                로그아웃
              </div>
            </div>
          </div>
        </div>
        <!-- 시간 -->
        <!-- <div class="text-black-50 mb-4" style="font-weight: 600; font-size: 20px" >
           {{ currentTime }}
        </div> -->
        <!-- 토글버튼 -->
        <!-- <div class="toggle-container d-flex justify-content-center" style="height: 40px" >
          <span v-if="route.path !== '/owner' || isOpen">영업 상태</span>
          <label v-if="route.path !== '/owner' || isOpen" class="switch">
            <input type="checkbox" :checked="isOpen" @change="toggleBusiness" />
            <span class="slider"></span>
          </label>
        </div> -->
      </div>
      <ul class="nav nav-pills flex-column gap-4 align-items-center">
        <li class="nav-item" v-for="menu in menus" :key="menu.text">
          <RouterLink :to="!isOpen && menu.text === '대시보드' ? '#' : menu.path"
            class="nav-link w-80 text-center size d-flex justify-content-center align-items-center" :style="{
              backgroundColor: route.path === menu.path ? '#f66463' : '#dddddd',
              color:
                route.path === menu.path
                  ? '#FFFFFF !important'
                  : '#333333 !important',
              fontSize: '17px',
            }" @click.prevent="!isOpen ? null : null">
            {{ menu.text }}
          </RouterLink>
        </li>
      </ul>
      <div class="footer">
        <div class="callcenter">
          고객센터 053-1234-5678
        </div>
        <div class="copyright ">
          <!-- text-center small text-muted -->
          All righs Reserved © HanIp Corp. 2025
        </div>
      </div>
    </div>
    <!-- 사이드바 끝 -->


    <!-- 오른쪽 화면 -->
    <div class="flex-grow-1" style="background-color: #e8e8e8">
      <!-- 헤더 시작 -->
      <!-- 검색 + 영업 버튼 -->
      <!-- 드랍다운 -->
      <!-- 구분선 -->
      <!-- 유저 정보 -->
      <!--  헤더 끝 :  혹시나 다시 필요할때 위치참고용 주석-->
      <!-- 라우터뷰 -->
      <div class="section">
        <router-view />
      </div>
    </div>
    <!-- 오른쪽화면 끝 -->
  </div>

</template>

<style lang="scss">
.box {
  font-family: "Pretendard", sans-serif;
}

.section {
  //  padding-top: 20px;
  display: flex;
  justify-content: center; // 가로 가운데
  align-items: center; // 세로 가운데
  height: 100%; // 부모 높이 꽉 차게
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


input:checked+.slider {
  background-color: #ff6666;
}

input:checked+.slider::before {
  transform: translateX(34px);
}

// 왼쪽사이드 메뉴버튼
.nav-link {
  width: 220px;
  height: 60px;
}

.sideNav {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.footer {
  width: 90%;
  align-items: center;
  margin-top: auto;
  text-align: center;

  .copyright {
    bottom: 3px;
  }

}
</style>
