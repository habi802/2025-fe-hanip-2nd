<script setup>
import { computed, onMounted, ref } from "vue";
import defaultImage from "@/imgs/owner/haniplogo_sample4.png";
import { useRouter } from "vue-router";
import { getReviewsByStoreId } from "@/services/reviewServices";

const router = useRouter();

// 가게 정보
const props = defineProps({
  stores: {},
});

onMounted(() => {
  reviews();
});


// 가게 이미지
const img = `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`;

// 가게 이미지가 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
  return props.stores &&
    props.stores.imagePath &&
    props.stores.imagePath !== "null"
    ? `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`
    : defaultImage;
});

// 해당 가게로 이동
const toStore = () => {
  if (props.stores?.storeId) {
    router.push(`/stores/${props.stores.storeId}`);
  } else {
    console.warn("store id 없음", props.stores);
  }
};

// 별점 조회
let total = ref(0);
let leng = ref(0);

const reviews = async () => {
  const res = await getReviewsByStoreId(props.stores.storeId);
  const length = res.data.resultData;
  leng = length.length;

  let totals = 0;
  for (let i = 0; i < length?.length; i++) {
    const forNum = length[i]?.rating;
    totals += forNum;
  }
  totals = (totals / length?.length).toFixed(1);
  total.value = totals;
  console.log("total", total);
};
</script>

<template>
  <div class="store">
    <div class="storeImgBox">
      <img
        class="sImg"
        :src="imgSrc"
        @error="(e) => (e.target.src = defaultImage)"
      />
    </div>
    <div class="storeTextBox">
      <div class="sText">{{ props.stores?.name }}</div>
      <div class="icons">
        <!--  -->
        <div class="star">
          <img id="icon" src="/src/imgs/star.png" />
          <span class="starNum" v-if="total !== 'NaN'">
            {{ total ? total : 0 }}
          </span>
          <span class="starNum" v-else> 0 </span>
          <span class="starNum"></span>
        </div>
        <!--  -->
        <div class="love">
          <img id="icon" src="/src/imgs/love.png" />
          {{ props.stores?.favorites }}
        </div>
      </div>
      <div id="smallText">배달료 0원 ~ 3000원</div>
      <div id="smallText">최소 주문 금액 11000원</div>
    </div>
    <div class="btn" @click="toStore">자세히보기</div>
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

.f-text {
  font-family: "BMJUA";
  letter-spacing: 2px;
  color: #ff6666;
  font-size: 2em;
  text-align: center;
  padding-top: 105px;
  margin-left: 15px;
}

.guideBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 90px 15px;
  width: 1600px;
  height: 100%;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #fff;

  .store {
    width: 360px;
    height: 470px;
    border-radius: 20px;
    -webkit-box-shadow: 6px 7px 5px -2px rgba(0, 0, 0, 0.33);
    box-shadow: 6px 7px 5px -2px rgba(0, 0, 0, 0.33);

    .storeImgBox {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 330px;
      height: 280px;
      overflow: hidden;
      margin-left: 15px;
      padding-top: 13px;
      border-radius: 20px;

      .sImg {
        width: 340px;
        border-radius: 20px;
      }
    }

    .storeTextBox {
      margin-left: 25px;

      #smallText {
        font-size: 0.8em;
        color: #6c6c6c;
        margin-top: 4px;
      }

      .sText {
        font-size: 1.3em;
        font-weight: 600;
        margin-top: 10px;
      }
    }

    .icons {
      font-family: "BMJUA";
      display: flex;
      margin-top: 5px;

      #icon {
        width: 20px;
      }

      .star {
        .starNum {
          font-size: 18px;
        }
      }

      .love {
        margin-left: 10px;
        font-size: 18px;
      }
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
    margin-top: 15px;
    margin-left: 100px;
    border-radius: 10px;
  }
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
</style>
