<script setup>
import { computed, onMounted, ref } from "vue";
import defaultImage from "@/imgs/owner/haniplogo_sample4.png";
import { useRouter } from "vue-router";
import { getReviewsByStoreId } from "@/services/reviewServices";
const router = useRouter();
// 가게 정보
const props = defineProps({
  stores: {},
  reviews: []
});
onMounted(() => {
});
// 가게 이미지
const img = `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`;
// 가게 이미지가 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
  return props.stores && props.stores.imagePath && props.stores.imagePath !== "null"
    ? `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`
    : defaultImage;
});
// 해당 가게로 이동
const toStore = () => {
  if (props.stores?.id) {
    router.push(`/stores/${props.stores.id}`);
  } else {
    console.warn("store id 없음", props.stores);
  }
};
</script>
<template>
  <div class="store">
    <div class="store-img">
      <div class="storeImgBox">
        <img class="sImg" :src="imgSrc" @error="(e) => (e.target.src = defaultImage)" />
      </div>
    </div>
    <div class="storeTextBox">
      <div class="sText">{{ props.stores?.name }}</div>
      <div class="icons">
        <!--  -->
        <div class="star">
          <div class="starIcon">★</div>
          <span class="starNum">
            {{ props.stores?.rating }}
          </span>
          <span class="starNum"></span>
        </div>
        <!--  -->
        <div class="love">
          <div class="loveIcon">♥</div>
          {{ props.stores?.favorites }}
        </div>
      </div>
      <div class="text-box">
        <div id="smallText">배달료
          {{ (props.stores?.minDeliveryFee ?? 0).toLocaleString() }}원~{{ (props.stores?.maxDeliveryFee).toLocaleString()
          }}원
        </div>
        <div id="smallText">최소 주문 금액 {{ (props.stores?.minAmount ?? 0).toLocaleString() }}원</div>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn btn-outline-danger btn-sm" @click="toStore">자세히보기</div>
    </div>
  </div>
</template>
1:55
<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff") format("woff");
  font-weight: 600;
  font-style: normal;
}

.store-img {
  display: flex;
  padding: 10px;
}

.f-text {
  font-family: "BMJUA";
  letter-spacing: 2px;
  color: #FF6666;
  font-size: 2em;
  text-align: center;
  padding-top: 105px;
  margin-left: 15px;
}

.guideBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 80px 30px;
  width: 1600px;
  height: 100%;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #fff;

  .store {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // margin: 20px;
    width: 320px;
    height: 470px;
    border-radius: 20px;
    border: #ccc solid 2px;

    //-webkit-box-shadow: 6px 7px 5px -2px rgba(0, 0, 0, 0.33);
    //box-shadow: 6px 7px 5px -2px rgba(0, 0, 0, 0.33);
    .storeImgBox {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 280px;
      overflow: hidden;
      border-radius: 15px;

      .sImg {
        width: 100%;
        height: 100%;
        text-align: center;
        margin: auto;
        border-radius: 10px 10px 0 0;
        object-fit: cover;
      }
    }

    .storeTextBox {
      margin-left: 25px;
      margin-top: -20px;
      padding: 5px;

      #smallText {
        font-size: 0.8em;
        color: #6C6C6C;
        margin-top: 2px;
      }

      .sText {
        margin-top: 10px;
        font-size: 1.3em;
        font-weight: 500;
      }
    }

    .icons {
      font-family: "BMJUA";
      display: flex;
      margin-top: -5px;

      #icon {
        width: 20px;
      }

      .star {
        display: flex;
        justify-content: center;
        align-items: center;

        .starNum {
          font-size: 18px;
        }
      }

      .love {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        font-size: 18px;
      }
    }
  }

  .btn {
    font-family: "BMJUA";
    font-size: 1em;
    color: #fff;
    background-color: #FF6666;
    width: 163px;
    padding: 7px;
    border-radius: 10px;
  }
}

.btn-box {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.footer {
  margin-bottom: 100px;
}

// 반응형
@media (max-width: 1800px) {
  .guideBox {
    justify-content: center;
    width: 1200px;
  }
}

@media (max-width: 1400px) {
  .guideBox {
    width: 900px;

    .store {
      width: 200px;
      height: 300px;

      .storeImgBox {
        width: 150px;
        height: 130px;
        margin-left: 25px;
        margin-top: 2px;

        .sImg {
          width: 150px;
        }
      }

      .storeTextBox {
        margin-top: -10px;
        font-size: 0.8em;
      }

      .btn {
        width: 100px;
        font-size: 0.6em;
        margin-top: 3px;
        margin-left: 50px;
      }
    }
  }
}

.starIcon {
  padding: 0px 3px 0px 0px;
  font-family: "BMJUA";
  font-size: 2em;
  color: #FAC729;
}

.loveIcon {
  padding: 0px 3px 0px 0px;
  font-family: 'YFavorite';
  font-size: 1.5em;
  color: red;
}

.text-box {
  margin-top: -10px;
}

@media (max-width: 1030px) {
  .guideBox {
    width: 800px;
  }
}

@media (max-width: 800px) {
  .guideBox {
    width: 450px;
  }
}

@font-face {
  font-family: 'YFavorite';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/YOnepickTTF-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
</style>