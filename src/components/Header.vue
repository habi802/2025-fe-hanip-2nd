<script setup>
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { logout } from "@/services/userService";

const account = useAccountStore();

const router = useRouter();
const homeRouter = () => {
  router.push("/");
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

//주문내역 페이지로 이동
const orderRouter = () => {
  router.push("/orders");
};
</script>

<template>
  <header>
    <div class="navbar">
      <div class="naverBox">
        <div class="logoBox">
          <img
            @click="homeRouter"
            class="logo"
            src="/src/imgs/hanipLogogroup.png"
          />
        </div>
        <div class="searchBar">
          <img
            @click="caLink"
            class="searchImg"
            src="/src/imgs/weui_location-filled.png"
          />
          <div class="addressText">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;주소를 입력해주세요</div>
        </div>
        <div class="containerOne">
          <div class="menus d-flex gap-3">

            
            <template v-if="account.state.loggedIn">
              <img
                @click="orderRouter"
                class="order"
                src="/src/imgs/order.png"
              />
              <img
                @click="cartRouter"
                id="menu"
                class="shooping"
                src="/src/imgs/shopping.png"
              />
              <img
                @click="myPageRouter"
                class="myPage"
                src="/src/imgs/myPage.png"
              />
              <div id="menu" @click="logoutIn">로그아웃</div>
            </template>
            <template v-else>
              <img
                @click="cartRouter"
                id="menu"
                class="shooping"
                src="/src/imgs/shopping.png"
              />
              <div class="login">
                <router-link id="menu" to="/login">로그인</router-link>
              </div>
              <a id="menu">|</a>
              <router-link id="menu" to="/join">회원가입</router-link>
            </template>
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
  margin-bottom: 30px;
  margin-top: -12px;
  .shooping {
    width: 45px;
    margin-right: 14px;
  }

  .order {
    width: 45px;
    margin-right: 14px;
    cursor: pointer;
  }
  .myPage {
    width: 55px;
    margin-right: 14px;
    cursor: pointer;
  }
}
.logoBox {
  display: flex;
  align-items: center;
}
.logo {
  width: 190px;
  height: auto;
  object-fit: contain;

  cursor: pointer;
}



.menus {
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
