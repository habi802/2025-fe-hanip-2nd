<script setup>
import { ref, onMounted, onUnmounted, provide, watch, computed, reactive, } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAccountStore, useUserInfo, useOwnerStore } from "@/stores/account";
import { logout } from "@/services/userService";
import { patchIsOpen, getOwnerStore } from "@/services/storeService";
import { useOrderStore } from "@/stores/orderStore";
import "@/assets/owner/_ownerStyle.scss";

const router = useRouter();
const route = useRoute();

const account = useAccountStore();
const userInfo = useUserInfo();
const owner = useOwnerStore();
const orderStore = useOrderStore();

onMounted( async () => {
    await owner.fetchStoreInfo();
});

// 로그아웃
const signOut = async () => {
    // 로그아웃 시 가게 영업 상태 바꾸게 되어 있음
    const res = await patchIsOpen(owner.state.storeData.id);
    if (res !== undefined && res.status === 200) {
        owner.setIsOpen();

        const logOutRes = await logout();
        if (logOutRes !== undefined && logOutRes.status === 200) {
            account.setLoggedIn(false);
            userInfo.dispatchUserData();
            router.push({ path: "/" });
        }
    }
};

// 사이드바 메뉴
const menus = [
    { text: "대시보드", path: "/owner/dashboard" },
    { text: "가게 상태 관리", path: "/owner/status" },
    { text: "주문 내역 관리", path: "/owner/orders" },
    { text: "메뉴 관리", path: "/owner/menu" },
    { text: "리뷰 관리", path: "/owner/review" },
    { text: "통계 현황", path: "/owner/donations" },
];


// SSE
onMounted(() => {
    if (owner.state.storeData?.id) {
    connectSSE(owner.state.storeData.id);
  }
});

onUnmounted(() => {
  if (eventSource) eventSource.close();
});

// SSE 대쉬보드 알림
const redDotDashboard = ref(false); // 대시보드 빨간 불 상태
let eventSource = null;

// SSE 연결
function connectSSE(storeId) {
  eventSource = new EventSource(`http://localhost:8080/api/sse/order/${storeId}`);

  eventSource.addEventListener("connect", (e) => {
    console.log("SSE 연결 성공:", e.data);
  });

  eventSource.addEventListener("order", (e) => {
    const data = JSON.parse(e.data);
    console.log("새 주문 도착:", data);
    orderStore.fetchPaidOrders(storeId);
    orderStore.fetchPreparingOrders(storeId);
    orderStore.fetchDeliveredOrders(storeId);
    orderStore.markUpdated(data.orderId);

    if (route.path !== "/owner/dashboard") {
      redDotDashboard.value = true;
    }
  });

  eventSource.onerror = () => {
    console.error("SSE 오류, 재연결 시도...");
    setTimeout(() => connectSSE(storeId), 3000);
  };
}

watch(
  () => route.path,
  (path) => {
    if (path === "/owner/dashboard") {
      redDotDashboard.value = false;
    }
  }
);
</script>

<template>
    <div class="box d-flex" style="min-height: 1080px">
        <!-- 사이드바 -->
        <div class="sideNav p-3" style="width: 345px; flex-shrink: 0">
            <div class="text-center mb-5">
                <img :style="{ width: '220px', }" src="/src/imgs/haniplogo3.png" alt="logo" />
                <div style="font-size: 40px; font-weight: 100; font-family: Pretendard, serif;">
                    {{ owner.state.storeData.name }}
                </div>
                <!-- 유저정보 -->
                <div class="d-flex align-items-center justify-content-center pt-3">
                    <div class="dropdown position-relative">
                        <div class="d-flex align-items-center gap-2" data-bs-toggle="dropdown" role="button" style="cursor: pointer">
                            <img src="/src/imgs/owner/owner_profile.png" style="cursor: pointer; width: 22px;" role="button" />
                            <span class="me-2" style="font-size: 16px;">
                                <span style="font-weight: bold; letter-spacing: 1px">{{ owner.state.storeData.ownerName }}</span> 사장님
                            </span>
                        </div>
                        <div class="dropdown-menu dropdown-menu-end">
                            <div class="title px-3 py-2">
                                {{ owner.state.storeData.ownerName }}
                            </div>
                            <div class="dropdown-divider"></div>
                            <div @click="signOut" style="cursor: pointer" class="dropdown-item">로그아웃</div>
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
                    <RouterLink
                    :to="menu.path"
                    class="nav-link w-80 text-center size d-flex justify-content-center align-items-center"
                    :class="{ blinking: menu.path === '/owner/dashboard' && redDotDashboard }"
                    :style="{
                        backgroundColor: route.path === menu.path ? '#f66463' : '#dddddd',
                        color: route.path === menu.path ? '#FFFFFF !important' : '#333333 !important',
                        fontSize: '17px',
                        }"
                        >
                        {{ menu.text }}
                    </RouterLink>
                </li>
            </ul>
            <div class="footer">
                <div class="callcenter">고객센터 053-1234-5678</div>
                <div class="copyright">All righs Reserved © HanIp Corp. 2025</div>
            </div>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="flex-grow-1" style="background-color: #e8e8e8">
            <!-- 헤더 시작 -->
            <!-- 검색 + 영업 버튼 -->
            <!-- 드랍다운 -->
            <!-- 구분선 -->
            <!-- 유저 정보 -->
            <!--  헤더 끝 :  혹시나 다시 필요할때 위치참고용 주석-->
            <!-- 라우터뷰 -->
            <div class="section">
                <!-- storeData 준비 안되면 로딩 UI 노출 -->
                <div v-if="!owner.state.storeData?.id">
                    가게 정보를 불러오는 중...
                </div>
                <router-view />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.box {
    font-family: "Pretendard", sans-serif;
}

.section {
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    justify-content: left; // 가로 가운데
    align-items: center; // 세로 가운데
    width: 100%;
    height: 100%; // 부모 높이 꽉 차게
}

.icon {
    width: 60px;
    height: 50px;
}

.size {
    height: 54px;
}

.red-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 6px;
  background: red;
  border-radius: 50%;
}

@keyframes blink {
  0%   { background-color: #f66463; }  /* 원래 빨간색 */
  50%  { background-color: #ff9a9a; }  /* 밝은 빨강 */
  100% { background-color: #f66463; }
}

.nav-link.blinking {
  animation: blink 1s ease-in-out infinite;
}

.vertical-line {
    width: 1.5px;
    height: 45px;
    background-color: #d1d1d1;
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