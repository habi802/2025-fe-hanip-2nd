<script setup>
import { computed } from 'vue';
import defaultImage from '@/imgs/owner/haniplogo_sample4.png'
import { useRouter } from 'vue-router';

const router = useRouter()

// 가게 정보
const props = defineProps({
    stores: {
    }
})

// 가게 이미지
const img = `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`

// 가게 이미지가 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
  return props.stores && props.stores.imagePath && props.stores.imagePath !== 'null'
  ? `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`
  : defaultImage;
})

// 해당 가게로 이동
const toStore = () => {
  if (props.stores?.storeId) {
    router.push(`/stores/${props.stores.storeId}`)
  } else {
    console.warn("store id 없음", props.stores)
  }
}
</script>

<template>
  <div class="store">
    <div class="storeImgBox">
      <img class="sImg" :src="imgSrc" @error="e => e.target.src = defaultImage" />
    </div>
    <div class="storeTextBox">
      <div class="sText">{{ props.stores?.name }}</div>
      <div class="icons">
        <div class="star">
          <img id="icon" src="/src/imgs/star.png" />
          {{ props.stores?.rating }}
          <span class="starNum"></span>
        </div>
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
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: 600;
  font-style: normal;
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
      width: 330px;
      height: 280px;
      overflow: hidden;
      margin-left: 15px;
      padding-top: 13px;
      border-radius: 20px;

      .sImg {
        width: 330px;
        border-radius: 20px;
      }
    }

    .storeTextBox {
      margin-left: 25px;

      #smallText {
        font-size: 0.8em;
        color: #6C6C6C;
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
          font-size: 14px;
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
    background-color: #FF6666;
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

@media (max-width:800px) {
  .guideBox {
    width: 450px;
  }
}</style>
