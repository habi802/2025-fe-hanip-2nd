<script setup>
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/account';

const account = useAccountStore();

const router = useRouter();
const homeRouter = () => {
  router.push('/');
};

// 로그아웃
const logout = () => {
  account.setLoggedIn(false);
};
</script>

<template>
  <header>
    <div class="navbar">
      <div>
        <img
          @click="homeRouter"
          class="logo"
          src="/src/imgs/hanipLogogroup.png"
        />
      </div>
      <div class="searchBar">
        <input
          @click="caLink"
          type="text"
          id="title"
          class="searchBox"
          placeholder="주소를 검색해 주세요"
          onfocus="this.placeholder=''"
          onblur="this.placeholder='주소를 검색해 주세요'"
        />
        <img
          @click="caLink"
          class="searchImg"
          src="/src/imgs/weui_location-filled.png"
        />
      </div>
      <div class="containerOne">
        <div class="menus d-flex gap-3">
          <template v-if="account.state.loggedIn">
            <img class="order" src="/src/imgs/order.png" />
            <img id="menu" class="shooping" src="/src/imgs/shopping.png" />
            <img class="myPage" src="/src/imgs/myPage.png"/>
            <div @click="logout">로그아웃</div>
          </template>
          <template v-else>
            <img id="menu" class="shooping" src="/src/imgs/shopping.png" />
            <div class="login">
              <router-link id="menu" to="/login">로그인</router-link>
            </div>
            <a id="menu">|</a>
            <router-link id="menu" to="/join">회원가입</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  height: 77px;
  background-color: #fff;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  -webkit-box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
  box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
}
.containerOne {
  margin-bottom: 30px;
  margin-right: 100px;
  margin-top: -12px;
  .shooping {
    width: 45px;
    margin-right: 14px;
  }
  margin-right: 215px;
  .order {
    width: 45px;
    margin-right: 14px;
  }
  .myPage{
    width: 55px;
    margin-right: 14px;
  }
}
img.logo {
  width: 190px;
  height: auto;
  object-fit: contain;
  margin-left: 210px;
  margin-bottom: 8px;
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

#menu {
  text-decoration: none;
  font-weight: 800;
  color: #ff6666;
}

.searchBar {
  // margin-bottom: 15px;
  font-size: 0.7em;
  border: 2px solid #fcaeae;
  border-radius: 20px;
  margin-right: -30px;
  margin-bottom: 15px;
  input {
    padding-left: 43px;
  }
  input:focus {
    outline: none;
    box-shadow: none;
  }
  .searchImg {
    width: 20px;
    position: relative;
    right: 35px;
    bottom: 2px;
    cursor: pointer;
  }
  .searchBox {
    border: none;
    width: 564px;
    height: 36px;
    border-radius: 20px;
  }
  .searchBox::placeholder {
    color: #fcaeae;
    text-align: center;
    margin-left: 40px;
  }
}
</style>
