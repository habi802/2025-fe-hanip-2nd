<script setup>
import defaultImage from '@/imgs/owner/owner-service3.png'
import { computed } from 'vue';

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

// 날짜 파싱
const formatDateTime = (isoStr) => {
  return new Date(isoStr).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div id="big-box" class="border rounded p-3 mb-2">
    <div class="border-top">
      <!-- 이미지 -->
      <div class="p-2">
        <div>
          <!-- 주문 목록 텍스트 -->
          <div id="menu" class="mb-2">
            <span>{{
              props.item.menuName +
              (props.item.menuCount > 1
                ? " 외 " + (props.item.menuCount - 1) + "개"
                : "")
            }}</span>
          </div>
          <!-- 이미지 -->
          <div class="review-image border">
            <!-- 이미지 필요 -->
            <img class="reviewImg" :src="reviewSrc" @error="e => e.target.src = defaultImage" />

          </div>
        </div>
      </div>

      <div class="user-box">
        <!-- 유저 이름/별점 -->
        <div class="user-top">

          <div id="name-box">
            <span id="name">{{ props.item.userName }}</span>
            <span class="star" v-for="n in Math.floor(props.item.rating || 0)" :key="n"><img class="restar"
                src="/src/imgs/starBoard.png" alt="별점" /></span>
          </div>
          <div id="name-left-box">
            <span class="created">{{ formatDateTime (props.item.created) }}</span>
          </div>
        </div>
        <!-- 유저 코멘트 -->
        <div id="u-comment" class="mb-2">
          <div class="u-box">{{ props.item.comment }}</div>
        </div>
      </div>
    </div>

    <!-- 사장님 코멘트 -->
    <div class="owner-box" v-if="props.item.ownerComment !== null && props.item.ownerComment !== ''">
      <div class="owner-comment border rounded p-2">
        {{ props.item.ownerComment }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 프리텐다드
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
#u-comment {
  font-family: 'Pretendard-Regular';
  display: flex;
  flex-wrap: wrap;
  border: #ff6666 1px solid;
  border-radius: 5px;
  width: 476px;
  height:  auto;
  min-height: 160px;
  padding: 25px;
  font-size: 20px;

}

.u-box {
  
  width: 430px;
  word-wrap: break-word;

}

.border {}

.border-top {
  display: flex;
  border: none !important;
  margin-left: 8px;
}

.owner-comment {
  font-family: 'Pretendard-Regular';
  background-color: #F7F7F7;

  margin-top: 20px;
}

.review-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 270px;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;

  .reviewImg {
    width: 270px;
  }
}

#big-box {
  padding: 20px !important;
  margin-top: 50px;
  border: #797979 1px solid !important;
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
#menu{
  font-family: 'Pretendard-Regular';
  color: #7F7F7F;
}
#name{
  font-family: 'BMJUA';
  font-size: 25px;
}
</style>
