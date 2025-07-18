<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const homeRouter = () => {
  router.push('/');
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
        />
        <img
          @click="caLink"
          class="searchImg"
          src="/src/imgs/weui_location-filled.png"
        />
      </div>
      <div class="containerOne">
        <router-link to="/" class="navbar-brand"></router-link>
        <div class="menus d-flex gap-3">
          <a>주문 내역</a>
          <a>장바구니</a>
          <div class="login">
            <router-link to="/login">로그인</router-link>
          </div>
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
}
.containerOne {
  margin-bottom: 30px;
  margin-right: 100px;
}

img.logo {
  width: 190px;
  height: auto;
  object-fit: contain;
  margin-left: 210px;
  cursor: pointer;
}
.menus {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.login a {
  text-decoration: none;
  color: #000;
}
.searchBar {
  margin-bottom: 10px;
  font-size: 0.7em;
  border: 2px solid #fcaeae;
  border-radius: 20px;
  margin-right: 90px;
  input {
    padding-left: 43px;
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
