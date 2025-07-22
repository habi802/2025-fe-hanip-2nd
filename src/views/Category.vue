<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

//
import { getStoreList } from '@/services/storeService';
import { reactive, onMounted } from 'vue';
import StoreList from '@/components/StoreList.vue';
import { getMenus } from '@/services/menuService';
import Category from '@/components/Category.vue';

const state = reactive({
  stores: [],
});

const name = reactive({
  text: '전체',
});

// 카테고리 필터
// 전체 찾기
const searchAll = () => {
  findAll();
  name.text = '전체';
};
// 한식 찾기
const searchKoreanFood = () => {
  const searchCategory = {
    category: '한식',
  };
  name.text = '한식';
  findAll(searchCategory);
};
// 중식 찾기
const searchChina = () => {
  const searchCategory = {
    category: '중식',
  };
  name.text = '중식';
  findAll(searchCategory);
};
// 일식 찾기
const searchJapanese = () => {
  const searchCategory = {
    category: '일식',
  };
  name.text = '일식';
  findAll(searchCategory);
};
// 양식 찾기
const searchWesternFood = () => {
  const searchCategory = {
    category: '양식',
  };
  name.text = '양식';
  findAll(searchCategory);
};
// 디저트 찾기
const searchDessert = () => {
  const searchCategory = {
    category: '디저트',
  };
  name.text = '디저트';
  findAll(searchCategory);
};
// 분식 찾기
const searchSnackFood = () => {
  const searchCategory = {
    category: '분식',
  };
  name.text = '분식';
  findAll(searchCategory);
};
// 패스트푸드 찾기
const searchFastFood = () => {
  const searchCategory = {
    category: '패스트푸드',
  };
  name.text = '패스트푸드';
  findAll(searchCategory);
};
// 아시안 푸드 찾기
const searchAsian = () => {
  const searchCategory = {
    category: '아시안',
  };
  name.text = '아시안';
  findAll(searchCategory);
};
// 치킨 찾기
const searchChick = () => {
  const searchCategory = {
    category: '치킨',
  };
  name.text = '치킨';
  findAll(searchCategory);
};
// 피자 찾기
const searchPizza = () => {
  const searchCategory = {
    category: '피자',
  };
  name.text = '피자';
  findAll(searchCategory);
};
// 야식 찾기
const searchLateNight = () => {
  const searchCategory = {
    category: '야식',
  };
  name.text = '야식';
  findAll(searchCategory);
};

//

const findAll = async (params) => {
  const res = await getStoreList(params);
  state.stores = res.data.resultData;
};

onMounted(async () => {
  findAll({});
});

const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="text">{{ name.text }}</div>
  <div class="categorys">
    <div class="categorySwipe">
      <div class="swiperLeft">
        <img class="left" src="/src/imgs/NavigationLeft.png" />
      </div>
      <swiper
        :navigation="{
          nextEl: '.swiperRight',
          prevEl: '.swiperLeft',
        }"
        :slides-per-view="6"
        :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
        :speed="100"
        :loop="true"
      >
        <swiper-slide
          ><img @click="searchAll" src="/src/imgs/allImg.png" alt="allImg" />
          <div>전체</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchKoreanFood"
            src="/src/imgs/koreanfood.png"
            alt="koreanImg"
          />
          <div>한식</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchChina"
            src="/src/imgs/jjajangmyeon.png"
            alt="ChinaImg"
          />
          <div>중식</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchJapanese"
            src="/src/imgs/porkcutlet.png"
            alt="japanese"
          />
          <div>일식</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchWesternFood"
            src="/src/imgs/pasta.png"
            alt="westernFood"
          />
          <div>양식</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchDessert"
            src="/src/imgs/dessert.png"
            alt="dessert"
          />
          <div>카페/디저트</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchSnackFood"
            src="/src/imgs/tteokbokki.png"
            alt="snackFood"
          />
          <div>분식</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchFastFood"
            src="/src/imgs/hamburger.png"
            alt="fastFood"
          />
          <div>패스트푸드</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchAsian"
            src="/src/imgs/ricenoodles.png"
            alt="asian"
          />
          <div>아시안</div></swiper-slide
        >
        <swiper-slide
          ><img @click="searchChick" src="/src/imgs/chicken.png" alt="chick" />
          <div>치킨</div></swiper-slide
        >
        <swiper-slide
          ><img @click="searchPizza" src="/src/imgs/pizza.png" alt="pizza" />
          <div>피자</div></swiper-slide
        >
        <swiper-slide
          ><img
            @click="searchLateNight"
            src="/src/imgs/pigfeet.png"
            alt="lateNight"
          />
          <div>야식</div></swiper-slide
        >
      </swiper>
      <div class="swiperRight">
        <img class="right" src="/src/imgs/NavigationRight.png" />
      </div>
    </div>
  </div>
  <hr class="line" />
  <div class="guideBox">
    <div v-for="stores in state.stores">
      <StoreList :stores="stores" />
    </div>
    <!--  -->
    <!--  -->
    <!-- <div class="store">
      <div class="storeImgBox">
        <img class="sImg" src="/src/imgs/recStore_1.png" />
      </div>
      <div class="storeTextBox">
        <div class="sTextBox">
          <div class="sText">오십계</div>
          <div id="smallText">배달료 0원 ~ 3000원</div>
          <div id="smallText">최소 주문 금액 13000원</div>
        </div>
        <div class="icons">
          <div class="star">
            <img id="icon" src="/src/imgs/star.png" />
            4.8
            <span class="starNum">(938)</span>
          </div>
          <div class="love">
            <img id="icon" src="/src/imgs/love.png" />
            927
          </div>
        </div>
        <div class="btn">자세히보기</div>
      </div>
    </div> -->
  </div>
  <div class="footer"></div>
  <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}
* {
  font-family: 'BMJUA';
  letter-spacing: 1px;
}
.text {
  text-align: center;
  margin-top: 135px;
  font-size: 2.5em;
  color: #ff6666;
}
.categorys {
  display: flex;
  justify-content: center;
  margin-top: 90px;
  text-align: center;
  .categorySwipe {
    display: flex;
    justify-content: center;
    width: 1200px;

    .swiper-slide {
      width: 125px;
    }

    img {
      width: 125px;
      height: 125px;
      border-radius: 50%;
      cursor: pointer;
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
.line {
  width: 1280px;
  margin: 0 auto;
  margin-top: 30px;
}

.guideBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 80px 110px;
  width: 1480px;
  height: 100%;
  margin: 0 auto;
  margin-top: 150px;
  background-color: #fff;
}
.footer {
  margin-bottom: 300px;
}
.arrow {
  position: sticky;
  width: 72px;
  bottom: 100px;
  left: 1800px;
  z-index: 999;
  margin-bottom: 100px;
}
</style>
