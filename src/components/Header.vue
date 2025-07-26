<script setup>
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { getUser, logout } from "@/services/userService";
import { reactive, ref } from "vue";

import Menu from "@/components/Menu.vue";
import { getOrder } from "@/services/storeService";

const account = useAccountStore();

const router = useRouter();
const homeRouter = () => {
  router.push("/");
};
//
const state = reactive({
  user: Object
});

const res = getUser();
// console.log("유저 정보", res.data.resultData);

// 주소 확인


//주문하기로 이동하는 함수
const toOrder = () => {
  if (!account.state.loggedIn) {
    alert("로그인 후 주문이 가능합니다.");
    return;
  } else if (state.carts.length < 1) {
    alert("메뉴를 선택해주세요.");
    return;
  }

  carts.state.items = state.carts;
  router.push({ path: `/stores/${route.params.id}/order` });
};

// 로그아웃
const logoutIn = async () => {
  const res = await logout();
  account.setLoggedIn(false);
};

// 마이 페이지 이동
const myPageRouter = () => {
  router.push("/my-page");
};

//카트 페이지로 이동
const cartRouter = () => {
  router.push("/cart");
};
//찜 목록 이동
const faivorite = () => {
  router.push("/favorites");
};

//주문내역 페이지로 이동
const orderRouter = () => {
  router.push("/orders");
};
// 주문내역 페이지 on off
let orderBox = ref(false);

const totalPrice = ref(0);
</script>

<template>
  <header>
    <div class="navbar">
      <div class="naverBox">
        <div class="logoBox">
          <img @click="homeRouter" class="logo" src="/src/imgs/hanipLogogroup.png" />
        </div>
        <template template v-if="account.state.loggedIn">
          <div class="searchBar">
            <img @click="caLink" class="searchImg" src="/src/imgs/weui_location-filled.png" />
            <div class="addressText2">유저 정보에 따른 주소 필요</div>
          </div>
        </template>
        <template template v-else>
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
              <img @click="cartRouter" @mouseover="orderBox = true" @mouseleave="orderBox = false" id="menu"
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
      <!-- 주문표 부분 -->
      <div v-if="orderBox" class="col-12 col-md-4 d-flex flex-column p-3">
        <div class="row border rounded p-4 mb-2">
          <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
            <span>주문표</span>
          </div>
          <div v-if="state.carts.length > 0">
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
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  height: 90px;
  background-color: #fff;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  -webkit-box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
  box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
  //
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
}

.naverBox {
  width: 1500px;
  display: flex;
  justify-content: space-between;
}

.containerOne {
  width: 400px;
  margin-bottom: 30px;
  margin-top: -5px;

  .shooping {
    width: 45px;
    margin-right: 14px;
  }

  .order {
    width: 45px;

    cursor: pointer;
  }

  .myPage {
    margin-right: 14px;
    cursor: pointer;
  }

  .faiorites {
    width: 34px;
    margin-right: 2px;
  }
}

.logoBox {
  display: flex;
  align-items: center;
  width: 400px;
}

.logo {
  width: 190px;
  height: auto;
  object-fit: contain;

  cursor: pointer;
}

.menus {
  justify-content: end;
  color: #ff6666;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 30px;
}

.searchBar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;

  .searchImg {
    width: 20px;
  }
}

.addressText {
  margin-left: 15px;
  color: #fdbdbd;
  font-weight: 800;
}

.addressText2 {
  margin-left: 15px;
  color: #fdbdbd;
}

.col-12 {
  background-color: #fff;
  margin-left: auto;
  margin-top: -10px;
}

.faiorites {
  cursor: pointer;
}

#menu {
  cursor: pointer;
  text-decoration: none;
  font-weight: 800;
  color: #ff6666;
}

@media (max-width: 1650px) {
  .searchBar {
    display: none;
  }
}

@media (max-width: 1200px) {
  .containerOne {
    display: none;
  }

  .navbar {
    display: flex;
    justify-content: center;
    position: fixed;
    margin-left: 0px;

    img.logo {
      margin-left: 0px;
    }
  }
}
</style>
