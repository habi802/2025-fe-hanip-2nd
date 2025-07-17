<script setup></script>

<template>
  <header>
    <div class="navbar shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand"> </router-link>
        <div class="menus d-flex gap-3">
          <a>로그인</a>
          <a>주문 내역</a>
          <a>장바구니</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  background-color: #ff6666;
  color: aliceblue;
}
.container-xxl {
  left: 200px !important;
}
</style>
