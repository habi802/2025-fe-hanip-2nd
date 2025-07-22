<script setup>
import { ref, onMounted, provide, onBeforeUnmount } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// ref, route, router
const router = useRouter();
const route = useRoute();
const isOpen = ref(true);
const bell = ref(false);

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


// 드랍다운 메뉴
const toggle = () => {
  bell.value = !bell.value;
};

const handleClickOutside = (e) => {
  if (!e.target.closest('.popover-menu') && !e.target.closest('.icon')) {
    bell.value = false;
  }
};

</script>

<template>
  <div class="d-flex" style="min-height: 100vh">
    <!-- 사이드바 -->
    <div class="p-4" style="width: 300px; flex-shrink: 0;">
      <div class="text-center mb-5">
        <img
          class="logo"
          @click="homeRouter"
          src="/src/imgs/haniplogo3.png"
          alt="logo"
          style="width: 180px"
        />
      </div>
      <ul class="nav nav-pills flex-column gap-4 fw-bolder">
        <li class="nav-item" v-for="menu in menus" :key="menu.text">
          <RouterLink
            :to="menu.path"
            class="nav-link w-100 text-center size d-flex justify-content-center align-items-center"
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
          <div class="relative">
            <img src="/src/imgs/owner/icon_bell.svg" class="icon" style="cursor: pointer;" @click="toggle" />
          <img src="/src/imgs/owner/icon_chat.svg" class="icon" />
          <img src="/src/imgs/owner/icon_present.svg" class="icon" />
          <img src="/src/imgs/owner/icon_config.svg" class="icon" />
        </div>

          <!-- 벨 알림 팝 오버 -->
           <div v-if="bell" class="popover-menu">
              <ul class="py-2 text-sm text-gray-700">
                <li class="px-4 py-2 hover:bg-gray-100">메뉴 1</li>
                <li class="px-4 py-2 hover:bg-gray-100">메뉴 2</li>
                <li class="px-4 py-2 hover:bg-gray-100">메뉴 3</li>
              </ul>
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

.icon {
  width: 60px;
  height: 50px;
}

.popover-menu {
  position: absolute;
  right: 605px; 
  top: 95px;    
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  width: 200px;
}

.size {
 height: 54px;
}
</style>
