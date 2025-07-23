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
        <div class="step-wrapper">
          <div class="step">
            <div class="step-number">01</div>
            <div class="step-label">음식선택</div>
          </div>
          <img class="arrowIcon" alt="arrow" src="/src/imgs/cartimgs/arrowios.svg" />
          <div class="step">
            <div class="step-number current">02</div>
            <div class="step-label">장바구니</div>
          </div>
          <img class="arrowIcon" alt="arrow" src="/src/imgs/cartimgs/arrowios.svg" />
          <div class="step">
            <div class="step-number">03</div>
            <div class="step-label">주문/결제</div>
          </div>
          <img class="arrowIcon" alt="arrow" src="/src/imgs/cartimgs/arrowios.svg" />
          <div class="step">
            <div class="step-number">04</div>
            <div class="step-label">주문완료</div>
          </div>
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
    margin: 100px auto;
    padding: 20px;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
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
  }
  .step-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .step-number {
    font-size: 13px;
    font-weight: bold;
  }
  .step-number.current {
    color: red;
  }
  .step-label {
    font-size: 12px;
  }
  .arrowIcon {
    width: 12px;
    height: 12px;
  }
  .div18 {
    font-size: 16px;
    margin-bottom: 30px;
    color: #333;
    text-align: center;
  }
  .groupContainer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .div19 {
    border: 1px solid #ff5c5c;
    color: #ff5c5c;
    padding: 10px 30px;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>
