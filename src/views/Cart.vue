<script setup>
import { reactive, onMounted } from 'vue';
import { getItems, removeCart, removeItem } from '@/services/cartService';

const state = reactive({
  items: [],
});

onMounted(() => {
  load();
})

const load = async () => {
  const res = await getItems();
  if (res === undefined || res.status !== 200) {
    return;
  }
  state.items = res.data;
}

const remove = async (cartId) => {
  console.log('힘들어와유..');
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) {
    return;
  }
  load();
}

const clear = async () => {
  const res = await removeCart();
  if (res.status !== 200) {
    return;
  }
  load();
}
</script>

<template>
  <div :class="$style.container">
    <!-- 헤더 아이콘 + 로고 -->
    <img :class="$style.groupIcon" src="Group 1124.png" alt="헤더 배경" />
    <div :class="$style.div29">장바구니</div>

    <!-- 단계 진행 바 -->
    <div :class="$style.groupParent1">
      <StepItem label="음식선택" step="01" />
      <Arrow />
      <StepItem label="장바구니" step="02" active />
      <Arrow />
      <StepItem label="주문/결제" step="03" />
      <Arrow />
      <StepItem label="주문완료" step="04" />
    </div>

    <!-- 비어있을 때 메시지 -->
    <img :class="$style.materialSymbolsarrowForwardIcon" src="material-symbols:arrow-forward-ios-rounded.png" />
    <div :class="$style.div18">장바구니에 담은 음식이 없습니다.</div>

    <!-- 추천 가게 보기 버튼 -->
    <div :class="$style.groupContainer">
      <div :class="$style.rectangleWrapper">
        <div :class="$style.groupItem" />
      </div>
      <div :class="$style.div19">추천 가게 보기</div>
    </div>

    <!-- Footer -->
    <FooterSection />
  </div>ㅊ
</template>

<style scoped>

</style>