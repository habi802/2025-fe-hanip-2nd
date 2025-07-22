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
import { reactive } from 'vue';
import StoreList from '@/components/StoreList.vue';
import { getMenus } from '@/services/menuServeice';

const state = reactive({
  stores: [],
});

const onSwiper = async (swiper) => {
  console.log(swiper);
  const res = await getStoreList();
  console.log('res.data :', res.data);
  state.stores = res.data.resultData;
  console.log('state.stores:', state.stores);

  const menus = await getMenus();
  console.log('menus:', menus);
};

const onSlideChange = () => {
  console.log('slide change');
};

const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="text">전체</div>
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
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide
          ><img src="/src/imgs/allImg.png" />
          <div>전체</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/koreanfood.png" />
          <div>한식</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/jjajangmyeon.png" />
          <div>중식</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/porkcutlet.png" />
          <div>일식</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/pasta.png" />
          <div>양식</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/dessert.png" />
          <div>카페/디저트</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/tteokbokki.png" />
          <div>분식</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/hamburger.png" />
          <div>패스트푸드</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/ricenoodles.png" />
          <div>아시안</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/chicken.png" />
          <div>치킨</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/pizza.png" />
          <div>피자</div></swiper-slide
        >
        <swiper-slide
          ><img src="/src/imgs/pigfeet.png" />
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
