<script setup>
import { RouterLink } from "vue-router";
import { useRouter } from 'vue-router';

const router = useRouter();

const homeRouter = () => {
  router.push('/');
};

const menus = [
  { text: "대시보드", path: "/owner" },
  { text: "공지·한마디", path: "/owner/store" },
  { text: "주문 상세", path: "/owner/orders" },
  { text: "메뉴 상세", path: "/owner/menu" },
  { text: "리뷰 관리", path: "/owner/review" },
  { text: "배달 관리", path: "/owner/coupons" },
  { text: "통계 현황", path: "/owner/donations" },
  { text: "고객 관리", path: "/owner/customer" },
  { text: "쿠폰 관리", path: "/owner/coupons" },
  { text: "광고 관리", path: "/owner/ads" },
];
</script>

<template>
  <div class="d-flex" style="min-height: 100vh">
    <!-- 사이드바 -->
    <div
      class="d-flex flex-column p-4 bg-white"
      style="width: 300px; min-height: 100vh;"
    >
      <div class="text-center mb-4">
        <img class="logo" @click="homeRouter" src="/src/imgs/haniplogo3.png" alt="logo" style="width: 210px" />
      </div>
      <ul class="nav nav-pills flex-column gap-4 fw-bolder">
        <li class="nav-item" v-for="menu in menus" :key="menu.text">
          <RouterLink
            :to="menu.path"
            class="nav-link w-100 text-center"
            :style="{
              backgroundColor: $route.path === menu.path ? '#f66463' : '#dddddd',
              color: $route.path === menu.path ? '#FFFFFF !important' : '#333333 !important', // 사이드바 글자색
               padding: '10px 10px',
               fontSize: '17px'
            }"
          >
            {{ menu.text }}
          </RouterLink>
        </li>
      </ul>

      <div class="mt-auto text-center small text-muted">© HanIp Corp. 2025</div>
    </div>

    <!-- 오른쪽 화면 -->
    <div class="flex-grow-1 d-flex flex-column" style="background-color: #e8e8e8;">
      <!-- 검색 -->
      <div
        class="d-flex align-items-center justify-content-between paddingSearch" style="background-color: #e8e8e8;"
      >
      <div class="box d-flex">
      <div class="searchBar">
        <input
          @click="caLink"
          type="text"
          id="title"
          class="searchBox"
          placeholder="검색"
        />
        <img
          @click="caLink"
          class="searchImg"
          src="/src//imgs/search_icon.png"
        />
      </div>
    </div>

        <!-- 유저 정보 -->
        <div class="d-flex align-items-center">
          <span class="me-2">홍길동 사장님</span>
          <i class="bi bi-person-circle fs-4"></i>
        </div>
      </div>

      <!-- 라우터뷰 -->
      <div class=" flex-grow-1 padding">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
img.logo {
  cursor: pointer;
}

.padding {
  padding-top: 20px;
  padding-left: 40px;
}

.paddingSearch {
  padding-top: 28px;
  padding-left: 52px;
}

.searchBar {
      justify-content: center;
      margin-top: 10px;
      font-size: 0.8em;
      border-radius: 12px;
      input {
        padding-left: 23px;
        font-size: 15px;
      }
      input:focus {
        outline: none;
        box-shadow: none;
      }
      .searchImg {
        width: 24px;
        position: relative;
        right: 40px;
        bottom: 3px;
        cursor: pointer;
      }
      .searchBox {
        border: none;
        width: 730px;
        height: 50px;
        border-radius: 10px;
      }
    }
    .searchBar::placeholder {
      color: #ff6666;
    }

</style>
