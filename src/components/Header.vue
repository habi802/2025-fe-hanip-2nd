<script setup></script>

<template>
  <header>
    <div class="navbar shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand"> </router-link>
        <div class="menus d-flex gap-3">
          <div class="login">
            <router-link to="/login">로그인</router-link>
          </div>
          <a>주문 내역</a>
          <a>장바구니</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.login a{
  text-decoration:none; 
  color: white 
}
.navbar {
  height: 50px;
  background-color: #ff6666;
  color: aliceblue;
}
.container-xxl {
  left: 200px !important;
}
</style>
