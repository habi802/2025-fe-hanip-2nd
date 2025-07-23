<script setup>
//Import Swiper Vue.js components
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

const onSwiper = (swiper) => {
  console.log(swiper);
};

const onSlideChange = () => {
  console.log('slide change');
};
</script>

<template>
  <div class="box">
    <!-- swiper 속성 -->
    <!-- :pagination="true" // 밑에 버튼 생기게 함 -->
    <!-- :loop // 마지막 사진에 도달했을 때 왼쪽으로 화면 전환 되지 않게 해줌 -->
    <swiper
      :slides-per-view="1"
      :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
      :autoplay="{ delay: 3000, disabkeOnItnteraction: false }"
      :speed="5000"
      :loop="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide><img src="/src/imgs/mainImg.png" /></swiper-slide>
      <swiper-slide><img src="/src/imgs/foods.png" /></swiper-slide>
      <swiper-slide><img src="/src/imgs/grab.png" /></swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
template {
  display: flex;
  justify-content: center;
}
img {
  align-items: center;
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
