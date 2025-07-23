<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  stores: Object,
});

const storeRouter = () => {
  router.push(`/stores/${props.stores.storeId}`);
};
</script>

<template>
  <div @click="storeRouter" class="router">
    <div class="store">
      <div class="storeImgBox">
        <img class="sImg" src="/src/imgs/recStore_1.png" />
      </div>
      <div class="storeTextBox">
        <div class="sTextBox">
          <div class="sText">{{ props.stores.name }}</div>
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.store {
  width: 420px;
  height: 371px;
  border-radius: 20px;
  border: #6b6b6b solid 1px;
  overflow: hidden;
  .storeImgBox {
    width: 420px;
    height: 250px;
    overflow: hidden;
    border-radius: 20px 20px 0px 0px;
    .sImg {
      width: 420px;
      border-radius: 20px 20px 0px 0px;
    }
  }
  .storeTextBox {
    position: relative;
    display: flex;
    margin-left: 15px;
    #smallText {
      font-size: 12px;
      font-family: sans-serif;
      color: darkgray;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }
    .sText {
      font-family: sans-serif;
      font-size: 1.2em;
      font-weight: 500;
      margin-top: 17px;
    }
  }
  .icons {
    font-family: 'BMJUA';
    display: flex;
    margin-top: 25px;
    font-size: 13px;
    flex-direction: column;
    margin-left: 25px;
    #icon {
      width: 15px;
    }
    .star {
      .starNum {
        font-size: 10px;
        letter-spacing: 0.5px;
      }
    }
    .love {
      font-size: 13px;
      letter-spacing: 0.5px;
    }
  }
}
.btn {
  position: absolute;
  font-family: 'BMJUA';
  font-size: 0.8em;
  color: #fff;
  background-color: #ff6666;
  text-align: center;
  width: 94px;
  height: 36px;
  padding: 10px;
  margin-left: 280px;
  border-radius: 10px;
  top: 55px;
}
</style>
