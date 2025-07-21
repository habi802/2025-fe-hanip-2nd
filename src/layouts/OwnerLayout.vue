<script setup>
import { RouterLink } from "vue-router";

const menus = [
  { text: "대시보드", path: "/owner" },
  { text: "공지·한마디", path: "/owner/store" },
  { text: "주문 내역", path: "/owner/orders" },
  { text: "메뉴 관리", path: "/owner/menu" },
  { text: "리뷰 관리", path: "/owner/review" },
  { text: "쿠폰 관리", path: "/owner/coupons" },
  { text: "후원 관리", path: "/owner/donations" },
  { text: "광고 관리", path: "/owner/ads" },
];
</script>

<template>
  <div class="d-flex" style="min-height: 100vh">
    <!-- 사이드바 -->
    <div
      class="d-flex flex-column p-3 bg-white"
      style="width: 220px; min-height: 100vh"
    >
      <div class="mb-4 text-center">
        <img src="/src/imgs/logoname.png" alt="logo" style="width: 100px" />
      </div>

      <ul class="nav nav-pills flex-column gap-4">
        <li class="nav-item" v-for="menu in menus" :key="menu.text">
          <RouterLink
            :to="menu.path"
            class="nav-link w-100 text-center"
            :style="{
              backgroundColor:
                $route.path === menu.path ? '#f66463' : '#dddddd',
              color:
                $route.path === menu.path
                  ? '#FFFFFF !important' // 사이드바 버튼색
                  : '#333333 !important', // 사이드바 글자색
            }"
          >
            {{ menu.text }}
          </RouterLink>
        </li>
      </ul>

      <div class="mt-auto text-center small text-muted">© HanIp Corp. 2025</div>
    </div>

    <!-- 오른쪽 화면 -->
    <div class="flex-grow-1 d-flex flex-column bg-light">
      <!-- 검색 -->
      <div
        class="d-flex align-items-center justify-content-between p-4 bg-light"
      >
        <div class="d-flex align-items-center flex-grow-1">
          <input
            type="text"
            class="form-control"
            placeholder="검색"
            style="max-width: 1000px; margin-right: 20px"
          />
        </div>

        <!-- 유저 정보 -->
        <div class="d-flex align-items-center">
          <span class="me-2">홍길동 사장님</span>
          <i class="bi bi-person-circle fs-4"></i>
        </div>
      </div>

      <!-- 라우터뷰 -->
      <div class="p-4 flex-grow-1">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
