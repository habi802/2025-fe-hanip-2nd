<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { reactive, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getStoreList } from "@/services/storeService";
import StoreCard from "@/components/customer/StoreCard.vue";

const route = useRoute();

const state = reactive({
  stores: [],
  form: {
    category: "",
    searchText: "",
    sortColumn: "",
    sortOrder: "",
    page: 1,
    size: 8,
  },
  currentPage: 1
});

// 가게 조회
const getStore = async () => {
  const res = await getStoreList(state.form);

  if (res !== undefined && res.status === 200) {
    state.stores = res.data.resultData;
    console.log('stores:', state.stores);
  }
};

onMounted(() => {
  if (route.query.category !== undefined) {
    switch (route.query.category) {
      case "korean":
        state.form.category = "01";
        break;
      case "chinese":
        state.form.category = "02";
        break;
      case "japanese":
        state.form.category = "03";
        break;
      case "western":
        state.form.category = "04";
        break;
      case "dessert":
        state.form.category = "05";
        break;
      case "snack":
        state.form.category = "06";
        break;
      case "fastfood":
        state.form.category = "07";
        break;
      case "asian":
        state.form.category = "08";
        break;
      case "chicken":
        state.form.category = "09";
        break;
      case "pizza":
        state.form.category = "10";
        break;
      case "night":
        state.form.category = "11";
        break;
    }
  }
  if (route.query.searchText !== undefined) {
    state.form.searchText = route.query.searchText;
  }

  getStore();
});

// 데이터 정렬
const sortStore = (column) => {
  if (state.form.sortColumn === column) {
    state.form.sortOrder = state.form.sortOrder === "ASC" ? "DESC" : "ASC";
  } else {
    state.form.sortColumn = column;
    state.form.sortOrder = "ASC";
  }

  getStore();
};

// 페이지 이동
const changePage = page => {
  state.currentPage = page;
  state.form.page = 1 + state.form.size * (page - 1);
  getStore();
};

// 화면 상단 이동
const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="categories">
    <div class="categorySwipe">
      <div class="swiperLeft">
        <img class="left" src="/src/imgs/NavigationLeft.png" />
      </div>
      <swiper :navigation="{ nextEl: '.swiperRight', prevEl: '.swiperLeft' }" :slides-per-view="6"
        :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]" :speed="100" :loop="true">
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '';
                getStore();
              "
              id="cImg"
              src="/src/imgs/allImg.png"
              alt="allImg"
            />
          </div>
          <div id="cName">전체</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '01';
                getStore();
              "
              id="cImg"
              src="/src/imgs/koreanfood.png"
              alt="koreanImg"
            />
          </div>
          <div id="cName">한식</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '02';
                getStore();
              "
              id="cImg"
              src="/src/imgs/jjajangmyeon.png"
              alt="ChinaImg"
            />
          </div>
          <div id="cName">중식</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '03';
                getStore();
              "
              id="cImg"
              src="/src/imgs/porkcutlet.png"
              alt="japanese"
            />
          </div>
          <div id="cName">일식</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '04';
                getStore();
              "
              id="cImg"
              src="/src/imgs/pasta.png"
              alt="westernFood"
            />
          </div>
          <div id="cName">양식</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '05';
                getStore();
              "
              id="cImg"
              src="/src/imgs/dessert.png"
              alt="dessert"
            />
          </div>
          <div id="cName">카페/디저트</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '06';
                getStore();
              "
              id="cImg"
              src="/src/imgs/tteokbokki.png"
              alt="snackFood"
            />
          </div>
          <div id="cName">분식</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '07';
                getStore();
              "
              id="cImg"
              src="/src/imgs/hamburger.png"
              alt="fastFood"
            />
          </div>
          <div id="cName">패스트푸드</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '08';
                getStore();
              "
              id="cImg"
              src="/src/imgs/nd.png"
              alt="asian"
            />
          </div>
          <div id="cName">아시안</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '09';
                getStore();
              "
              id="cImg"
              src="/src/imgs/chicken.png"
              alt="chick"
            />
          </div>
          <div id="cName">치킨</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '10';
                getStore();
              "
              id="cImg"
              src="/src/imgs/pizza.png"
              alt="pizza"
            />
          </div>
          <div id="cName">피자</div>
        </swiper-slide>
        <swiper-slide>
          <div class="imgBox">
            <img
              @click="
                state.form.page = 1;
                state.currentPage = 1;
                state.form.category = '11';
                getStore();
              "
              id="cImg"
              src="/src/imgs/pigfeet.png"
              alt="lateNight"
            />
          </div>
          <div id="cName">야식</div>
        </swiper-slide>
      </swiper>
      <div class="swiperRight">
        <img class="right" src="/src/imgs/NavigationRight.png" />
      </div>
    </div>
  </div>

  <div class="searchBar">
    <input v-model="state.form.searchText" @keyup.enter="
      state.form.page = 1;
    getStore();
    " type="text" class="searchBox" placeholder="찾는 맛집 이름,메뉴가 무엇인가요?" />
    <img @click="
      state.form.page = 1;
    getStore();
    " class="searchImg" src="/src/imgs/fluent_search.png" />
  </div>

  <div class="sort-options">
    <span :class="{ active: state.form.sortColumn === 'minAmount' }" @click="sortStore('minAmount')">
      주문 금액 순
      <span class="arrow" aria-hidden="true">{{
        state.form.sortColumn === "minAmount"
          ? state.form.sortOrder === "ASC"
            ? "▲"
            : "▼"
          : ""
      }}</span>
    </span>
    <span class="divider">|</span>
    <span :class="{ active: state.form.sortColumn === 'rating' }" @click="sortStore('rating')">
      별점 순
      <span class="arrow" aria-hidden="true">{{
        state.form.sortColumn === "rating"
          ? state.form.sortOrder === "ASC"
            ? "▲"
            : "▼"
          : ""
      }}</span>
    </span>
    <span class="divider">|</span>
    <span :class="{ active: state.form.sortColumn === 'favorites' }" @click="sortStore('favorites')">
      찜 순
      <span class="arrow" aria-hidden="true">{{
        state.form.sortColumn === "favorites"
          ? state.form.sortOrder === "ASC"
            ? "▲"
            : "▼"
          : ""
      }}</span>
    </span>
  </div>

  <div class="guideBox" :class="{ 'mb-3': state.stores.length > 0 }">
    <template v-if="state.stores.length > 0">
      <div class="row">
        <div class="col-3 g-3" v-for="store in state.stores" :key="store.id" :class="{
          isActive: store.isActive === 0,
          isOpen: store.isOpen === 0,
        }">
          <StoreCard :store="store" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="w-100 d-flex justify-content-end">
        <img src="/src/imgs/owner/owner-service2.png" />
      </div>
    </template>
  </div>

  <b-pagination
    v-if="state.stores.length && state.stores[0]?.totalRow > 0"
    align="center"
    v-model="state.currentPage"
    :per-page="state.form.size"
    :total-rows="state.stores[0].totalRow"
    @update:model-value="changePage"
  ></b-pagination>

  <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: "Pretendard-Regular";
  letter-spacing: 1px;
}

.categories {
  display: flex;
  justify-content: center;
  margin-top: 60px;
  text-align: center;

  .categorySwipe {
    display: flex;
    justify-content: center;
    width: 1200px;

    .swiper-slide {
      width: 125px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .imgBox {
      width: 125px;
      border-radius: 50%;
      overflow: hidden;
    }

    #cImg {
      cursor: pointer;
      width: 125px;
      object-fit: cover; // 이미지가 비율 유지
      border-radius: 50%;
      transition: transform 0.3s ease-in-out;

      &:hover {
        transform: scale(1.2); // 확대비율
      }
    }

    // 카테고리 이름
    #cName {
      font-size: 20px;
      padding-top: 10px;
      margin-left: -5px;
      font-weight: 400;
    }

    .left {
      width: 17px;
      height: 28px;
      margin-top: 50px;
      margin-right: 50px;
      border-radius: 5px;
    }

    .right {
      width: 17px;
      height: 28px;
      margin-top: 50px;
      margin-left: 50px;
      border-radius: 5px;
    }
  }
}

.searchBar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px auto 0;
  padding: 0 20px;
  width: 600px;
  height: 70px;
  border: 1px solid #ff6666;
  border-radius: 50px;
  position: relative;
  background-color: white;

  input {
    padding-left: 43px;
  }

  input:focus {
    outline: none;
    box-shadow: none;
  }

  .searchImg {
    width: 30px;
    position: relative;
    right: 35px;
    bottom: 2px;
    cursor: pointer;
  }

  .searchBox {
    flex: 1;
    height: 100%;
    border: none;
    border-radius: 50px;
    padding-left: 20px;
    font-size: 1em;
    color: #333;
  }

  .searchBox::placeholder {
    color: #fcaeae;
  }
}

.searchBar::-moz-focus-inner {
  outline: none;
  box-shadow: none;
}

@media (max-width: 650px) {
  .searchBar {
    display: none;
  }
}

.sort-options {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  font-size: 18px;
  color: #ff7b7b;
}

.sort-options span {
  cursor: pointer;
}

.sort-options .divider {
  color: #ffa5a5;
}

.sort-options .active {
  font-weight: bold;
  color: #ff4c4c;
}

.sort-options .active::after {
  font-size: 10px;
  margin-left: 4px;
}

.guideBox {
  margin: 0 auto;
  width: 1180px;
  height: 100%;
  background-color: #fff;
}

.imgBox {
  width: 125px;
  border-radius: 50%;
  overflow: hidden;
}

.arrow {
  position: sticky;
  width: 2.8%;
  bottom: 100px;
  left: 93%;
  z-index: 999;
  margin-bottom: 100px;

  &:hover {
    opacity: 80%;
  }
}
</style>

<style lang="scss">
.page-item {
  display: flex;
  justify-content: center;
  align-items: center;

  &.active {
    .page-link {
      color: #ff6666;
      text-decoration: underline;
    }
  }

  &.disabled {
    .page-link {
      color: #ccc;
    }
  }

  &:first-child,
  &:nth-child(2),
  &:nth-last-child(2),
  &:last-child {
    .page-link {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24pt;
    }
  }

  .page-link {
    color: black;
    border: none;
    background-color: transparent !important;
    font-size: 16pt;

    &:hover {
      color: #ff8989;
    }

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }
}

.isActive {
  display: none;
}

.isOpen {
  opacity: 70%;
  mix-blend-mode: multiply;
  pointer-events: none;
}
</style>
