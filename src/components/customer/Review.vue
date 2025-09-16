<script setup>
import defaultImage from '@/imgs/owner/owner-service3.png'
import { computed } from 'vue';

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
  return dayjs(props.item.created).fromNow();
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
  },
});

//리뷰 이미지 저장
// const reviewImg = `/pic/menu-profile/${props.item.id}/${props.item?.imagePath}`

const reviewSrc = computed(() => {
  return props.item && props.item?.imagePath && props.item?.imagePath !== 'null'
    ? `/pic/review-profile/${props.item.id}/${props.item?.imagePath}`
    : defaultImage;
})
</script>

<template>
  <!-- 상단 유저 사진, 이름, 별점, 시간 -->
  <div id="big-box" class="border rounded p-3 mb-2">
    <div class="box-top">
      <div class="user-img-box">
        <img class="user-img" src="/src/imgs/userImg.png"></img>
      </div>
      <div class="review-info">
        <div class="info-top">

          <div class="user-name"> 이희진 </div>
          <div class="date"> 2달전 </div>

          <!-- <div class="user-name"> {{ props.item.userName }}</div>
          <div class="date"> {{ timeAgo }}</div> -->
        </div>

        <div class="info-bottom">


          <span class="star"><img class="restar" src="/src/imgs/starBoard.png" alt="별점" /></span>
          <span class="star"><img class="restar" src="/src/imgs/starBoard.png" alt="별점" /></span>
          <span class="star"><img class="restar" src="/src/imgs/starBoard.png" alt="별점" /></span>
          <span class="star"><img class="restar" src="/src/imgs/starBoard.png" alt="별점" /></span>
          <span class="star"><img class="restar" src="/src/imgs/starBoard.png" alt="별점" /></span>
          <span class="star-num">5</span>

          <!-- <span class="star" v-for="n in Math.floor(props.item.rating || 0)" :key="n"><img class="restar"
              src="/src/imgs/starBoard.png" alt="별점" /></span>
          <span class="star-num">{{ props.item.rating || 0 }}</span> -->
        </div>
      </div>
    </div>


    <!-- 이미지  -->
    <div class="box-body-img-box">

      <swiper :slides-per-view="4" :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]" :speed="1000"
        :space-between="230" :resistance="false" :resistance-ratio="0" :allowSlidePrev="false">
        <swiper-slide>
          <div class="review-image border">
            <img class="reviewImg" :src="reviewSrc" @error="e => e.target.src = defaultImage" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="review-image border">
            <img class="reviewImg" :src="reviewSrc" @error="e => e.target.src = defaultImage" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="review-image border">
            <img class="reviewImg" :src="reviewSrc" @error="e => e.target.src = defaultImage" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="review-image border">
            <img class="reviewImg" :src="reviewSrc" @error="e => e.target.src = defaultImage" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="review-image border">
            <img class="reviewImg" :src="reviewSrc" @error="e => e.target.src = defaultImage" />
          </div>
        </swiper-slide>
      </swiper>



    </div>


    <!-- 메뉴 이름들 -->
    <div class="box-body-menu-box">
      <div class="menu-border">
        <span class="menu-name"> 햄부기 세트 </span>
        <span class="menu-name"> 햄부기 세트 </span>
        <span class="menu-name"> 햄부기 세트 </span>
        <span class="menu-name"> 햄부기 세트 </span>

        <!-- <span>{{
          props.item.menuName +
          (props.item.menuCount > 1
            ? " 외 " + (props.item.menuCount - 1) + "개"
            : "")
        }}</span> -->

      </div>
    </div>

    <div class="customer-comment-box">
      <div class="customer-comment">
        이건 두 번째 주문😎
        친구가 패션후르츠 에이드가 맛있다고 하길래 디저트와 같이 주문을 해봤습니다. 또 주문할게요 !

        <!-- <div class="u-box">{{ props.item.comment }}</div> -->
      </div>

    </div>

    <div class="owner">
      <hr class="owner-solid">
      </hr>
      <div class="owner-title">사장님 댓글</div>
      <div class="owner-comment-box">
        <div class="owner-comment">
          <div>
            리뷰 감사합니다. 조용한 공간에서 여유로운 시간을 보내셨다니 정말 기쁩니다. 다음 방문도 기다릴게요!
          </div>

          <!-- <div >
            {{ props.item.ownerComment }}
          </div> -->
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
  font-size: 20px;
  color: #FAC729;
  padding: 3px;
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
  width: 6%;
  height: 6%;
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
  font-family: "BMJUA";
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
  border: 1px #888 solid;
  border-radius: 10px;
}

.menu-name {
  margin: 10px;
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
  font-family: "BMJUA";
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
</style>
