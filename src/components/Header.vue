<script setup></script>

<template>
  <header>
    <div class="navbar shadow-sm">
      <div><img class="logo" src="@/imgs/haniplogo2.png" /></div>
      
      <div class="container">
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
  height: 60px;
  background-color: #ff6666;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

img.logo {
  width: 60px;
  height: auto;
  object-fit: contain;
  margin-left: 100%;
}

.container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menus {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.login a {
  text-decoration: none;
  color: white;
}

</style>
