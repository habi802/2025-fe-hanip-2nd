<script setup>
import { reactive, onMounted } from 'vue';
import { getItem, removeCart, removeItem } from '@/services/cartService';

const state = reactive({
  items: [],
});

onMounted(() => {
  load();
});

const load = async () => {
  const res = await getItem();
  if (res === undefined || res.status !== 200) return;
  state.items = res.data;
};

const remove = async (cartId) => {
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) return;
  load();
};

const claer = async () => {
  const res = await removeCart();
  if (res.status !== 200) return;
  load();
};
</script>

<template>
  <div class="cart-empty-wrapper">
    <div class="top-row">
      <div class="header-row">
        <img class="back-icon" alt="뒤로가기" src="/src/imgs/cartimgs/arrowios.svg" />
        <div class="div29">장바구니</div>
      </div>
      <div class="step-horizontal">
        <span class="step-text">01 음식선택</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
        <span class="step-text current">02 장바구니</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
        <span class="step-text">03 주문/결제</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
        <span class="step-text">04 주문완료</span>
      </div>
    </div>

    <div class="div18">장바구니에 담은 음식이 없습니다.</div>

    <div class="groupContainer">
      <div class="rectangleWrapper">
        <div class="groupItem" />
      </div>
      <div class="div19">추천 가게 보기</div>
    </div>
  </div>
</template>

<style scoped>
.cart-empty-wrapper {
  max-width: 720px;
  margin: 50px auto;
  padding: 20px;
}
.top-row {
  display: flex;
  justify-content: space-between;
  column-gap: 100px;
  margin-bottom: 120px;
}
.header-row {
  display: flex;
  align-items: center;
}
.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
.div29 {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}
.step-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
  padding-left: 200px;
  white-space: nowrap;
}
.arrow img {
    width: 12px;
    height: auto;
}
.step-text.current {
    font-size: 19px;
    font-weight:bold;
  color: #FF6666;
}
.arrow {
  font-size: 16px;
}
.div18 {
  font-size: 16px;
  margin-bottom: 70px;
  color: #333;
  text-align: center;
}
.groupContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.div19 {
  border: 2px solid #FF6666;
  color: #FF6666;
  padding: 10px 30px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 100px;
  align-items: center;
}
</style>
