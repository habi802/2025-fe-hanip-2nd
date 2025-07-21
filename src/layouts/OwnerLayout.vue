<script setup>
import { ref, provide } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isOpen = ref(true);

const homeRouter = () => {
  router.push("/");
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

// 영업 버튼 토글
const toggleBusiness = () => {
  if (isOpen.value) {
    if (confirm("영업을 중단하시겠습니까?")) {
      isOpen.value = !isOpen.value;
      return;
    }
  }

  if (!isOpen.value) {
    if (confirm("영업을 시작하시겠습니까?")) {
      isOpen.value = !isOpen.value;
      return;
    }
  }
};

// 검색 링크
const caLink = () => {
  console.log("검색!");
};

// provide (영업 데이터 옮기기)
provide("isOpen", isOpen);
provide("toggleBusiness", toggleBusiness);
</script>

<template>
  <div class="d-flex" style="min-height: 100vh">
    <!-- 사이드바 -->
    <div
      class="d-flex flex-column p-4 bg-white"
      style="width: 300px; min-height: 100vh"
    >
      <div class="text-center mb-4">
        <img
          class="logo"
          @click="homeRouter"
          src="/src/imgs/haniplogo3.png"
          alt="logo"
          style="width: 210px"
        />
      </div>
      <ul class="nav nav-pills flex-column gap-4 fw-bolder">
        <li class="nav-item" v-for="menu in menus" :key="menu.text">
          <RouterLink
            :to="menu.path"
            class="nav-link w-100 text-center"
            :style="{
              backgroundColor: route.path === menu.path ? '#f66463' : '#dddddd',
              color:
                route.path === menu.path
                  ? '#FFFFFF !important'
                  : '#333333 !important',
              padding: '10px 10px',
              fontSize: '17px',
            }"
          >
            {{ menu.text }}
          </RouterLink>
        </li>
      </ul>
      <div class="mt-auto text-center small text-muted">© HanIp Corp. 2025</div>
    </div>

    <!-- 오른쪽 화면 -->
    <div
      class="flex-grow-1 d-flex flex-column"
      style="background-color: #e8e8e8"
    >
      <!-- 검색 + 영업 버튼 -->
      <div
        class="d-flex align-items-center justify-content-between paddingSearch"
      >
        <div class="d-flex align-items-center" style="gap: 16px">
          <div class="searchBar d-flex align-items-center">
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
              src="/src/imgs/search_icon.png"
            />
          </div>
          <button
            :class="['btn', isOpen ? 'btn-success' : 'btn-danger']"
            @click="toggleBusiness"
            style="height: 50px"
          >
            {{ isOpen ? "영업 중" : "영업 중단" }}
          </button>
        </div>

        <!-- 유저 정보 -->
        <div class="d-flex align-items-center">
          <span class="me-2">홍길동 사장님</span>
        </div>
      </div>

      <!-- 라우터뷰 -->
      <div class="flex-grow-1 padding">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
img.logo {
  cursor: pointer;
}

.padding {
  padding-top: 20px;
  padding-left: 40px;
}

.paddingSearch {
  padding-top: 40px;
  padding-left: 52px;
}

.searchBar {
  position: relative;
  font-size: 0.8em;

  .searchBox {
    border: none;
    width: 730px;
    height: 50px;
    border-radius: 10px;
    padding-left: 23px;
    font-size: 15px;
  }

  .searchBox:focus {
    outline: none;
    box-shadow: none;
  }

  .searchImg {
    width: 24px;
    position: absolute;
    right: 15px;
    cursor: pointer;
  }
}

.searchBox::placeholder {
  font-size: 16px;
  color: #a8a8a8;
}
</style>
