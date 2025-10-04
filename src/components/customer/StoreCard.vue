<script setup>
import { computed } from "vue";
import defaultImage from "@/imgs/owner/haniplogo_sample4.png";
import { useRouter } from "vue-router";

const router = useRouter();

// 가게 정보
const props = defineProps({
  store: Object,
});

// 가게 이미지
const storeImage = computed(() => {
  return props.store && props.store.imagePath && props.store.imagePath !== null
    ? `/pic/store/${props.store.id}/${props.store.imagePath}`
    : defaultImage;
});
</script>

<template>
    <div class="store">
      <div v-if="store.isOpen ===0" class="overlay">운영 준비중 입니다...</div>
    <div class="storeImgBox">
      <img
        class="sImg"
        :src="storeImage"
        @error="(e) => (e.target.src = defaultImage)"
      />
    </div>
    <div class="storeTextBox">
      <div class="sText">{{ props.store.name }}</div>
      <div class="icons">
        <div class="d-flex align-items-center star">
          <span class="star">★</span>
          <span class="starNum">{{
            props.store.rating !== 0 ? props.store.rating.toFixed(1) : 0
          }}</span>
        </div>
        <div class="d-flex align-items-center love">
          <span class="love">♥</span>
          <span class="love-num">
              {{ props.store.favorites }}
          </span>
        </div>
      </div>
      <div id="smallText">
        <span
          v-if="
            props.store.maxDeliveryFee !== 0 && props.store.minDeliveryFee !== 0
          "
        >
          배달료 {{ props.store.minDeliveryFee.toLocaleString() }}원 ~
          {{ props.store.maxDeliveryFee.toLocaleString() }}원
        </span>
        <span v-else> 배달료 0원 </span>
      </div>
      <div id="smallText">
        최소 주문 금액 {{ props.store.minAmount.toLocaleString() }}원
      </div>
    </div>
    <div class="w-100 d-flex justify-content-center mt-3">
      <div class="btn" @click="router.push(`/stores/${props.store.id}`)">
        자세히보기
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: 'YFavorite';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/YOnepickTTF-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

.f-text {
  font-family: "BMJUA";
  letter-spacing: 2px;
  color: #ff6666;
  font-size: 2em;
  text-align: center;
  padding-top: 105px;
  margin-left: 15px;
}

.store {
    display: flex;
    flex-direction: column;
  width: 280px;
  height: 380px;
  border-radius: 20px;
  border: #797979 solid 1px;
  //-webkit-box-shadow: 6px 7px 5px -2px rgba(0, 0, 0, 0.33);
  //box-shadow: 6px 7px 5px -2px rgba(0, 0, 0, 0.33);

  .storeImgBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 180px;
    overflow: hidden;
    border-radius: 20px 20px 0 0;

    .sImg {
      width: 100%;
      height: 100%;
      text-align: center;
      margin: auto;
      border-radius: 20px 20px 0 0;
      object-fit: cover;
    }
  }
  

  .storeTextBox {
    margin-left: 25px;

    #smallText {
      font-size: 0.8em;
      color: #6c6c6c;

    }

    .sText {
      font-size: 1.3em;
      font-weight: 700;
      margin-top: 15px;
    }
  }

  .star {
    font-family: "BMJUA";
    font-size: 1.4em;
    color: #fac729;
    gap: 5px;
    .starNum {
      color: #000;
      font-size: 18px;
    }
  }

  .love {
    font-family: "YFavorite";
    font-size: 1.25em;
    color: red;
    gap: 5px;
  }
  .love-num{
    font-size: 0.85em;
    color: #000;
  }
}

.btn {
  font-family: "BMJUA";
  font-size: 1em;
  color: #fff;
  background-color: #ff6666;
  text-align: center;
  width: 163px;
  padding: 7px;
  border-radius: 10px;
}

.icons{
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer {
  margin-bottom: 100px;
}
.overlay{
    position:absolute;
     transform: translate(50%, 300%);
}
</style>
