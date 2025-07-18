<script setup></script>

<template>
  <header>
    <div class="navbar">
      <div><img class="logo" src="/src/imgs/hanip_logo02 2.png" /></div>
      <div class="container">
        <router-link to="/" class="navbar-brand"> </router-link>
        <div class="menus d-flex gap-3">
          <a>주문 내역</a>
          <a>장바구니</a>
          <a>로그인</a>
          <a>회원가입</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  background-color: #f9f9f9;
  color: black;
  // 그림자
  -webkit-box-shadow: 0px 5px 21px 5px rgba(105, 105, 105, 0.51);
  box-shadow: 0px 5px 21px 5px rgba(105, 105, 105, 0.51);
  .logo {
    width: 50px;
    margin-left: 190px;
    margin-top: -5px;
  }
  .menus {
    margin-bottom: 10px;
    a {
      cursor: pointer;
    }
  }
}
</style>
