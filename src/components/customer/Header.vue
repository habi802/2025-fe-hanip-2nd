<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserInfo, useAccountStore } from "@/stores/account";
import { logout } from "@/services/userService";
import { getOrder } from "@/services/storeService";
import Menu from "@/components/customer/Menu.vue";
import AlertModal from "../modal/AlertModal.vue";
import CartModal from "../modal/CartModal.vue";
import { useCartStore } from "@/stores/cart";

const router = useRouter();

// 유저 정보
const account = useAccountStore();
const userInfo = useUserInfo();

const state = reactive({
  user: Object,
});

// 주문하기로 이동하는 함수
// const toOrder = () => {
//     if (!account.state.loggedIn) {
//         alert("로그인 후 주문이 가능합니다.");
//         return;
//     } else if (state.carts.length < 1) {
//         alert("메뉴를 선택해주세요.");
//         return;
//     }

//     carts.state.items = state.carts;
//     router.push({ path: `/stores/${route.params.id}/order` });
// };

// 로그아웃
const signOut = async () => {
  const res = await logout();
  account.setLoggedIn(false);
  router.push({ path: "/" });
};

// 주문 내역 페이지 on off
//let orderBox = ref(false);

//const totalPrice = ref(0);

const alertModalRef = ref(null);

// Pinia 장바구니 스토어 가져오기
const cartStore = useCartStore();
const cartModalRef = ref(null);

// 모달 표시하는 함수
const showModal = (message) => {
  alertModalRef.value.open(message);
};
// 모달 표시하는 함수
const showCart = () => {
  // ref가 아직 안 잡혔으면 return
  if (!cartModalRef.value) return;

  // items 전달 후 모달 열기
  cartModalRef.value.open(cartStore.items);
};

// 로그인한 유저 주소에 따라 주소를 표시하는 함수
// const userAddr = computed(() => {
//      return (userInfo.userAddr ?? '') + (userInfo.userAddrDetail ?? '');
// });
//const userAddr = computed(() => userInfo.userAddr ?? '주소 없음');
const { userAddr } = storeToRefs(userInfo);

// 유저 정보 불러오기 비동기 실행
onMounted(async () => {
  if (account.state.loggedIn) {
    userInfo.fetchStore();
  }
});

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
</script>

<template>
  <b-container class="d-flex align-items-center justify-content-between h-100">
    <!-- (왼쪽) 로고 -->
    <div>
      <img
        class="logo-image"
        src="/src/imgs/hanipLogogroup.png"
        @click="router.push({ path: '/' })"
      />
    </div>

    <!-- (가운데) 주소 -->
    <div
      class="mx-auto flex-grow-1 text-center"
      @click="goToAddress"
      style="cursor: pointer"
    >
      <img class="address-image" src="/src/imgs/weui_location-filled.png" />
      <span class="address-text ms-3">
        {{
          account.state.loggedIn
            ? userAddr || "주소를 입력해주세요"
            : "주소를 입력해주세요"
        }}
      </span>
    </div>

    <!-- (오른쪽) 메뉴 -->
    <div>
      <!-- 비로그인 시 메뉴 -->
      <template v-if="!account.state.loggedIn">
        <!-- 여러 개의 요소에 같은 스타일 줄 거면 id로 하지 말고 class로 할것 -->
        <img
          class="menu-image me-4"
          src="/src/imgs/shoop.png"
          @click="showModal('로그인 후 이용 가능합니다.')"
          alt="장바구니"
        />
        <router-link class="menu-text me-3" to="/login">로그인</router-link>
        <span class="menu-text me-3">|</span>
        <router-link class="menu-text" to="/join">회원가입</router-link>
      </template>

      <!-- 로그인 시 메뉴 -->
      <template v-else>
        <img
          class="menu-image me-4"
          src="/src/imgs/faivor.png"
          @click="router.push({ path: '/favorites' })"
          alt="찜목록"
        />
        <img
          class="menu-image me-4"
          src="/src/imgs/orders.png"
          @click="router.push({ path: '/orders' })"
          alt="주문내역"
        />
        <img
          class="menu-image me-4"
          src="/src/imgs/shoop.png"
          @click="showCart"
          alt="장바구니"
        />
        <span class="menu-text me-3" @click="signOut">로그아웃</span>
        <span class="menu-text me-3">|</span>
        <router-link class="menu-text" to="/check">마이페이지</router-link>
      </template>
    </div>
  </b-container>

  <!-- <div class="navbar">
        <div class="naverBox">
            <div class="logoBox">
                <img @click="homeRouter" class="logo" src="/src/imgs/hanipLogogroup.png" />
            </div>

            <template v-if="account.state.loggedIn">
                <div class="searchBar">
                    <img @click="caLink" class="searchImg" src="/src/imgs/weui_location-filled.png" />
                    <div class="addressText2">{{ userAddr || '주소 없음' }}</div>
                </div>
            </template>

            <template v-else>
                <div class="searchBar">
                    <img @click="caLink" class="searchImg" src="/src/imgs/weui_location-filled.png" />
                    <div class="addressText">주소를 입력해주세요</div>
                </div>
            </template>
            <div class="containerOne">
                <div class="menus d-flex gap-3">
                    <template v-if="account.state.loggedIn">
                        <img @click="faivorite" class="faiorites" src="/src/imgs/faivor.png" />
                        <img @click="orderRouter" class="order" src="/src/imgs/orders.png" />
                        <img @click="cartRouter" id="menu"
                            class="shooping" src="/src/imgs/shoop.png" />
                        <div id="menu" @click="logoutIn">로그아웃</div>
                        <div>|</div>
                        <div class="myPage" @click="myPageRouter">마이페이지</div>
                    </template>

                    <template v-else>
                        <img @click="cartRouter" id="menu" class="shooping" src="/src/imgs/shoop.png" />
                        <div class="login">
                            <router-link id="menu" to="/login">로그인</router-link>
                        </div>
                        <a id="menu">|</a>
                        <router-link id="menu" to="/join">회원가입</router-link>
                    </template>
                </div>
            </div>
        </div>

        <div v-if="orderBox" class="col-12 col-md-4 d-flex flex-column p-3">
            <div class="row border rounded p-4 mb-2">
                <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                    <span>주문표</span>
                </div>
                <div v-if="state.carts !== undefined && state.carts.length > 0">
                    <div v-for="(item, idx) in state.carts" :key="item.id">
                        <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                            <div class="d-flex justify-content-between mb-2">
                                <span>{{ item.name }}</span>
                                <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <button type="button" class="btn btn-basic btn-quantity" @click="decreaseQuantity(idx)">
                                    -
                                    </button>
                                    <span class="p-3">{{ item.quantity }}</span>
                                    <button type="button" class="btn btn-basic btn-quantity" @click="increaseQuantity(idx)">
                                    +
                                    </button>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-basic btn-submit" @click="deleteCart(item.id)">
                                    메뉴 취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>담긴 메뉴가 없습니다</div>
                <div class="text-end border-top pt-2 mt-2">
                    {{ totalPrice.toLocaleString() }}원
                </div>
            </div>
        </div>
    </div> -->

  <!-- 모달 -->
  <AlertModal ref="alertModalRef" />
  <CartModal ref="cartModalRef" />
</template>

<style lang="scss" scoped>
// .navbar {
//     height: 90px;
//     background-color: #fff;
//     color: #000;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 0 1rem;
//     -webkit-box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
//     box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
//     //
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     z-index: 9999;
// }

// .naverBox {
//     width: 1500px;
//     display: flex;
//     justify-content: space-between;
// }

// .containerOne {
//     width: 400px;
//     margin-bottom: 30px;
//     margin-top: -5px;

//     .shooping {
//         width: 45px;
//         margin-right: 14px;
//     }

//     .order {
//         width: 45px;

//         cursor: pointer;
//     }

//     .myPage {
//         margin-right: 14px;
//         cursor: pointer;
//     }

//     .faiorites {
//         width: 34px;
//         margin-right: 2px;
//     }
// }

// .logoBox {
//     display: flex;
//     align-items: center;
//     width: 400px;
// }

.logo-image {
  width: 190px;
  height: 38px;
  object-fit: contain;
  cursor: pointer;
}

// .menus {
//     justify-content: end;
//     color: #ff6666;
//     font-weight: 800;
//     font-size: 13px;
//     display: flex;
//     gap: 1rem;
//     align-items: center;
//     margin-top: 30px;
// }

// .searchBar {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 400px;
// }

.address-image {
  width: 20px;
}

.address-text {
  color: #fdbdbd;
  font-size: 16px;
  font-weight: 800;
}

.menu-image {
  cursor: pointer;
  object-fit: contain;
  width: 45px;
  height: 40px;
}

.menu-text {
  cursor: pointer;
  text-decoration: none;
  color: #ff6666;
  font-size: 13px;
  font-weight: 800;
}

// @media (max-width: 1650px) {
//     .searchBar {
//         display: none;
//     }
// }

// @media (max-width: 1200px) {
//     .containerOne {
//         display: none;
//     }

//     .navbar {
//         display: flex;
//         justify-content: center;
//         position: fixed;
//         margin-left: 0px;

//         img.logo {
//             margin-left: 0px;
//         }
//     }
// }
</style>
