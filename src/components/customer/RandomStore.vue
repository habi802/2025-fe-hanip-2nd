<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getReviewsByStoreId } from "@/services/reviewServices";

import defaultImage from "@/imgs/owner/haniplogo_sample2.png";

const router = useRouter();

const props = defineProps({
  store: Object,
  review: [],
});

// 가게 이미지
// const imgSrc = computed(() => {
//   return state.store.id && state.store.imagePath && state.store.imagePath !== 'null'
//     ? `${baseUrl.value}/images/store/${state.store.id}/${state.store.imagePath}`
//     : defaultImage;
// })

const baseUrl = ref(import.meta.env.VITE_BASE_URL);

// 가게 이미지
const imgSrc = computed(() => {
  return props.store &&
    props.store.imagePath &&
    props.store.imagePath !== "null"
    ? `${baseUrl.value}/images/store/${props.store.id}/${props.store.imagePath}`
    : defaultImage;
});

// 자세히보기 이동
const sotreRouter = () => {
  router.push(`/stores/${props.store.id}`);
};

onMounted(async () => {
  reviews();
  console.log("가게 정보", props.store);
});

// 별점 조회

let leng = ref(0);

const reviews = async () => {
  const res = await getReviewsByStoreId(props.store.id, {
    rowPerPage: 1000,
    page: 1,
  });
  const length = res.data.resultData;
  leng.value = length.length;
};
</script>

<template>
  <div class="all">
    <div id="imgBigBox" class="card h-100 shadow-sm">
      <div id="imgBox" class="card-img-top">
        <img class="sImg" :src="imgSrc" @error="(e) => (e.target.src = defaultImage)" />
      </div>
      <!-- <img src="" class="card-img-top" alt="음식 이미지"> -->
      <div class="card-body">
        <div class="card-top">
          <div class="card-title">{{ props.store.name }}</div>
          <div class="score-box">
            <span class="star">★</span>
            <span class="small">
              {{ Number(props.store.rating).toFixed(1) }} ({{ leng }})
            </span>
            <sapn class="love">♥</sapn>
            <span class="small">
              {{ props.store.favorites }}
            </span>
          </div>
        </div>
        <div class="cart-bottom">
          <div>
            <div class="card-text">배달비 0원 ~ 3000원</div>
            <div class="card-text">최소 주문 금액 10,000원</div>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <button @click="sotreRouter" class="btn btn-outline-danger btn-sm">
              자세히보기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@font-face {
  font-family: "YFavorite";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/YOnepickTTF-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

* {
  font-family: "Pretendard-Regular";
}

#imgBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 251px;
  overflow: hidden;
}

.sImg {
  height: 100%;
  width: 100%;
  border-radius: 15px;
}

#imgBigBox {
  border-radius: 15px;
  overflow: hidden;
}

.imgBox {
  width: 100%;
}

.btn {
  width: 150px;
  background-color: #ff6666;
  color: #fff;
  border-radius: 6px;
}

.star {
  width: 20px;
  margin-right: 5px;
  font-family: "BMJUA";
  font-size: 1.6em;
  color: #fac729;
}

.love {
  font-family: "YFavorite";
  font-size: 1.45em;
  color: red;
}

.card-top {
  display: flex;
  justify-content: space-between;
}

.cart-bottom {
  display: flex;
  justify-content: space-between;
}

.card-text {
  color: #797979;
  font-weight: 400;
  font-size: 0.8em;
}

.btn {
  width: 100px;
}

.small {
  letter-spacing: 1.5px;
  text-align: center;
}

.score-box {
  display: flex;
  align-items: center;
  gap: 3px;

}
</style>
