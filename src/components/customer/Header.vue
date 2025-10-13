<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserInfo, useAccountStore } from "@/stores/account";
import { logout } from "@/services/userService";
import { getOrder } from "@/services/storeService";
import Menu from "@/components/customer/Menu.vue";
import AlertModal from "../modal/AlertModal.vue";
import CartModal from "../modal/CartModal.vue";
import { useCartStore } from "@/stores/cartStore";
import { getUser } from "@/services/userService";
import AlertResolveModal from "../modal/AlertResolveModal.vue";

const router = useRouter();
const route = useRoute();

// 유저 정보
const account = useAccountStore();
const userInfo = useUserInfo();

const state = reactive({
  user: Object,
});

// 로그아웃
const signOut = async () => {
  const res = await logout();

  if (res !== undefined && res.status === 200) {
    account.setLoggedIn(false);
    userInfo.dispatchUserData();
    router.push({ path: "/" });
  }
};

const alertModalRef = ref(null);
const alertResolveModal = ref(null);

// Pinia 장바구니 스토어 가져오기
const cartModalRef = ref(null);

// 모달 표시하는 함수
const showModal = (message) => {
  alertModalRef.value.open(message);
};
// 모달 표시하는 함수
const showCart = async () => {
  if (isCartPage.value) return;
  if (route.name === "order") return;

  try {
    await cartStore.getCart(); // 최신 카트 가져오기
    console.log("Header에서 cartStore.items:", cartStore.items); // ← 여기서 확인
    cartModalRef.value.open(cartStore.items); // 모달 열기
  } catch (err) {
    console.error("카트 가져오기 실패", err);
    alert("장바구니를 불러오는데 실패했습니다.");
  }
};

const { userAddr } = storeToRefs(userInfo);

// 유저 정보 불러오기 비동기 실행
onMounted(async () => {
  window.addEventListener("address-changed", async () => {
    const res = await getUser();
    state.user = res.data.resultData;


  })
  if (account.state.loggedIn) {
    userInfo.fetchStore();
  }
  await cartStore.getCart();
  const res = await getUser();
  state.user = res.data.resultData;
  console.log("유저데이터", state.user);
  if (!state.user.address) {
    const conf = alertResolveModal.value.showModal("주소를 추가하고 기본 주소로 설정해주세요")
    if (conf) {
      router.push("/address")
    }
  }
  if (!state.user.phone) {
    const conf = alertResolveModal.value.showModal("전화번호를 추가해주세요.")
    if (conf) {
      router.push("/my-page")
    }
  }
});

//로그인 바로 적용되게
const isLoggedIn = computed(() => account.state.loggedIn);

// 로그인 상태가 바뀌면 fetchStore 실행
watch(
  () => account.state.loggedIn,
  (val) => {
    if (val) {
      userInfo.fetchStore();
    }
  }
);
// 주소창 이동
const goToAddress = () => {
  if (account.state.loggedIn) {
    router.push("/address");
  } else {
    showModal("로그인 후 이용 가능합니다.");
  }
};

//새로 만든 함수 [ 희진 ]

const cartStore = useCartStore();

const isCartPage = computed(() => route.path.startsWith("/cart"));
</script>

<template>
  <b-container class="d-flex align-items-center justify-content-spween h-100 container">
    <!-- 큰 박스 -->
    <div class="big-box">
      <!-- (왼쪽) 로고 -->
      <div>
        <img class="logo-image" src="/src/imgs/hanipLogogroup.png" @click="router.push({ path: '/' })" />
      </div>

      <!-- (가운데) 주소 -->
      <div v-if="isLoggedIn" class="mx-auto flex-grow-1 text-center" @click="goToAddress" style="cursor: pointer">
        <div class="address-box">
          <img class="address-image" src="/src/imgs/weui_location-filled.png" />
          <span class="address-text ms-3">
            <span class="login-address">{{ state.user.address }}
              {{ state.user.addressDetail ?? "주소를 입력해주세요" }}</span>
          </span>
        </div>
      </div>

      <div v-else class="mx-auto flex-grow-1 text-center" @click="goToAddress" style="cursor: pointer">
        <img class="address-image" src="/src/imgs/weui_location-filled.png" />
        <span class="address-text ms-3">
          <span>주소를 입력해주세요</span>
        </span>
      </div>

      <!-- (오른쪽) 메뉴 -->
      <div class="menu-box">
        <!-- 비로그인 시 메뉴 -->
        <div></div>
        <template v-if="!isLoggedIn">
          <div class="login-menu">
            <!-- 여러 개의 요소에 같은 스타일 줄 거면 id로 하지 말고 class로 할것 -->
            <img class="menu-image me-4" src="/src/imgs/shoop.png" @click="showModal('로그인 후 이용 가능합니다.')" alt="장바구니" />
            <router-link class="menu-text me-3" to="/login">로그인</router-link>
            <span class="menu-text me-3">|</span>
            <router-link class="menu-text" to="/join">회원가입</router-link>
          </div>
        </template>

        <!-- 로그인 시 메뉴 -->
        <template v-else>
          <img class="menu-image me-4 favorite" src="/src/imgs/faivor.png" @click="router.push({ path: '/favorites' })"
            alt="찜목록" />
          <img class="menu-image me-4" src="/src/imgs/orders.png" @click="router.push({ path: '/orders' })"
            alt="주문내역" />
          <img class="menu-image me-4" src="/src/imgs/shoop.png" @click="showCart" alt="장바구니" />
          <span class="menu-text me-3" @click="signOut">로그아웃</span>
          <span class="menu-text me-3">|</span>
          <!-- 카카오는 비밀번호 x.. 마이페이지 수정을 못함 -->
          <router-link class="menu-text" to="/my-page">마이페이지</router-link>
        </template>
      </div>
    </div>
  </b-container>

  <!-- 모달 -->
  <AlertModal ref="alertModalRef" />
  <CartModal ref="cartModalRef" />
  <AlertResolveModal ref="alertResolveModal" />
</template>

<style lang="scss" scoped>
.logo-image {
  width: 150px;
  height: 38px;
  object-fit: contain;
  cursor: pointer;
}

.address-image {
  width: 17px;
}

.address-text {
  color: #fdbdbd;
  font-size: 16px;
  font-weight: 400;
}

.menu-image {
  cursor: pointer;
  object-fit: contain;
  width: 35px;
  height: 35px;
}

.menu-text {
  cursor: pointer;
  text-decoration: none;
  color: #ff6666;
  font-size: 13px;
  font-weight: 500;
}

.container {
  width: 67%;
  justify-content: space-around;
}

.big-box {
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: space-around;
}

.address-box {
  margin-left: 150px;
}

.favorite {
  width: 27px;
}

* {
  user-select: none;
  -webkit-user-drag: none;
}

@media (max-width: 1700px) {
  .address-box {
    display: none;
  }
}
</style>
