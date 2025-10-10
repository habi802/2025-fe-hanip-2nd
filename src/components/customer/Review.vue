<script setup>
import defaultImage from '@/imgs/owner/owner-service3.png'
import { computed, ref } from 'vue';

// 스와이퍼 사용
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';


// 날짜 넣는 법
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';


dayjs.extend(relativeTime);
dayjs.locale('ko');

const timeAgo = computed(() => {
  return dayjs(props.item.createdAt).fromNow();
});



const props = defineProps({
  item: {
    id: Number,
    userName: String,
    rating: Number,
    menuName: String,
    menuCount: Number,
    comment: String,
    imagePath: String,
    ownerComment: String,
    created: String,
    isHide: Number,
  },
});

//리뷰 이미지 저장
// const reviewImg = `/pic/menu-profile/${props.item.id}/${props.item?.imagePath}`

const previewImage = ref(defaultImage);

const baseUrl = ref(import.meta.env.VITE_PIC_URL);


const reviewSrcList = computed(() => {
  if (!props.item?.pic || props.item.pic.length === 0) return [];

  return props.item.pic.map(fileName => `${baseUrl.value}/images/Review/${props.item.id}/${fileName}`);
});


//유저 이미지
const imgSrc = computed(() => {
  const userPic = props.item?.userPic
  if (userPic?.startsWith('http')) {
    return userPic.replace('http://', 'https://')
  }
  if (props.item?.userId && userPic) {
    return `${baseUrl.value}/images/user/${props.item.userId}/${userPic}`
  }
  return defaultImage
})

</script>

<template>
  <!-- 상단 유저 사진, 이름, 별점, 시간 -->
  <div id="big-box" class="border rounded p-3 mb-2" :class="{ isHide: props.item.isHide === 1 }">
    <div class="box-top">
      <div class="user-img-box">
        <img class="user-img" :src="imgSrc" @error="e => e.target.src = defaultImage" alt="리뷰 이미지"></img>
      </div>
      <div class="review-info">
        <div class="info-top">
          <div class="user-name"> {{ props.item.userName }}</div>
          <div class="date"> {{ timeAgo }}</div>
        </div>
        <div class="info-bottom">
          <div v-if="props.item.rating">
            <span class="star" v-for="n in Math.floor(props.item.rating || 0)" :key="n">★</span>
          </div>
          <div v-else>
            <span class="no-star">★★★★★</span>
          </div>
          <span class="star-num">{{ props.item.rating || 0 }}</span>
        </div>
      </div>
    </div>
    <!-- 이미지  -->
    <div class="box-body-img-box">
      <swiper v-if="reviewSrcList.length > 0" :slides-per-view="3"
        :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]" :speed="1000" :space-between="10"
        :resistance="false" :resistance-ratio="0">
        <swiper-slide v-for="(src, index) in reviewSrcList" :key="index">
          <div class="review-image border">
            <img class="reviewImg" :src="src" @error="e => e.target.src = defaultImage" alt="리뷰 이미지" />
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 메뉴 이름들 -->
    <div class="box-body-menu-box">
      <div class="menu-border">
        <span class="menu-name" v-for="value in props.item.menuName" :key="value.id"> {{ value }} </span>
      </div>
    </div>
    <div class="customer-comment-box">
      <div class="customer-comment">
        <div class="u-box">{{ props.item.comment }}</div>
      </div>
    </div>
    <div v-if="props.item.ownerComment" class="owner">
      <hr class="owner-solid">
      </hr>
      <div class="owner-title">사장님 댓글</div>
      <div class="owner-comment-box">
        <div class="owner-comment">
          <div>
            {{ props.item.ownerComment }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#u-comment {
  font-family: 'Pretendard-Regular';
  display: flex;
  flex-wrap: wrap;
  border: #ff6666 1px solid;
  border-radius: 5px;
  width: 476px;
  height: auto;
  min-height: 160px;
  padding: 25px;
  font-size: 20px;

}

.u-box {

  width: 430px;
  word-wrap: break-word;

}

.border {
  font-family: 'Pretendard-Regular';
}

.border-top {
  display: flex;
  border: none !important;
  margin-left: 8px;
}



.user-box {
  margin-top: 7px;
  margin-left: 30px;
}

.user-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.created {
  font-size: 13px;
}

#name {
  font-size: 20px;
  margin-right: 10px;
  letter-spacing: 2px;
}

.star {
  font-family: "BMJUA";
  font-size: 30px;
  color: #FAC729;
  margin-top: -10px;
}

.no-star {
  font-family: "BMJUA";
  font-size: 30px;
  color: #eee;
  margin-top: -10px;
}

.restar {
  width: 20px;
  margin-top: -10px;
}

#menu {
  font-family: 'Pretendard-Regular';
  color: #7F7F7F;
}

#name {
  font-family: 'BMJUA';
  font-size: 25px;
}


// 새로 생긴 css

#big-box {
  padding: 30px !important;
  margin-top: 20px;
  border: #797979 1px solid !important;
}

.box-top {
  display: flex;
  justify-content: start;
  align-items: center;
}

.user-img-box {
  width: 7%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.user-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.info-top {
  display: flex;
  justify-content: start;
  align-items: center;
}

.user-name {
  font-family: 'Pretendard-Regular';
  font-weight: 600;
  font-size: 1.2em;
}

.date {
  margin-left: 10px;
  font-size: 0.7em;
  font-weight: 600;
  color: #ccc;
}

.info-bottom {
  display: flex;
  justify-items: center;
  align-items: center;
}

.star-num {
  margin-left: 10px;
  font-family: "BMJUA";
}

.box-body-img-box {
  padding: 25px;
}



.review-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 240px;
  border-radius: 10px;
  overflow: hidden;

  .reviewImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}


.menu-border {
  width: 100%;
  height: 20%;
  padding: 15px;
  border: 1px #797979 solid;
  border-radius: 10px;
}

.menu-name {
  margin: 10px;
  color: #888;
}

.customer-comment-box {
  display: flex;
  justify-content: start;
}

.customer-comment {
  width: 100%;
  padding: 20px;
}

.owner {}

.owner-solid {
  position: relative;
  width: 859px;
  right: 30px;

}

.owner-title {
  font-family: 'Pretendard-Regular';
  font-weight: 600;
  font-size: 1.2em;
  padding: 10px;
}

.owner-comment-box {
  display: flex;
  justify-content: start;
}

.owner-comment {
  width: 100%;
  padding: 20px;
}

.isHide {
  display: none;
}
</style>
