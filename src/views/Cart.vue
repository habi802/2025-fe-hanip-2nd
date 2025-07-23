<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getItems, removeCart, removeItem } from '@/services/cartService';

const router = useRouter();
const goToCart = () => {
  console.log('이동 좀 합시다')
  router.push('/cart');
};

const state = reactive({
  items: [],
});

onMounted(() => {
  load();
});

const load = async () => {
  const res = await getItems();
  if (res === undefined || res.status !== 200) return;
  state.items = res.data;
};

const remove = async (cartId) => {
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) return;
  load();
};

const clear = async () => {
  const res = await removeCart();
  if (res.status !== 200) return;
  load();
};
</script>

<template>
  <div :class="$style.container">
    <!-- 상단 헤더 및 타이틀 -->
    <img :class="$style.groupIcon" src="Group 1124.png" alt="헤더 배경"  @click="goToCart"/>
    <div :class="$style.div29">장바구니</div>
  </div>

    <!-- 단계 진행 바 -->
    <div :class="$style.groupParent1">
      <div :class="$style.parent">
        <div :class="$style.div20">음식선택</div>
        <div :class="$style.div21">01</div>
      </div>
      <img :class="$style.materialSymbolsarrowForwardIcon1" src="material-symbols:arrow-forward-ios-rounded.svg" />
      <div :class="$style.group">
        <div :class="$style.div22">장바구니</div>
        <div :class="$style.div23">02</div>
      </div>
      <img :class="$style.materialSymbolsarrowForwardIcon2" src="material-symbols:arrow-forward-ios-rounded.svg" />
      <div :class="$style.parent1">
        <div :class="$style.div24">주문/결제</div>
        <div :class="$style.div21">03</div>
      </div>
      <img :class="$style.materialSymbolsarrowForwardIcon3" src="material-symbols:arrow-forward-ios-rounded.svg" />
      <div :class="$style.parent2">
        <div :class="$style.div21">04</div>
        <div :class="$style.div24">주문완료</div>
      </div>
    </div>

    <!-- 장바구니 내용 -->
    <div v-if="state.items.length > 0">
      <ul>
        <li v-for="item in state.items" :key="item.id">
          {{ item.name }} - {{ item.price }}원
          <button @click="remove(item.id)">삭제</button>
        </li>
      </ul>
      <button @click="clear">전체 비우기</button>
    </div>

    <!-- 장바구니 비어있을 때 -->
    <div v-else>
      <img :class="$style.materialSymbolsarrowForwardIcon" src="material-symbols:arrow-forward-ios-rounded.png" />
      <div :class="$style.div18">장바구니에 담은 음식이 없습니다.</div>
    </div>

    <!-- 추천 가게 보기 버튼 -->
    <div :class="$style.groupContainer">
      <div :class="$style.rectangleWrapper">
        <div :class="$style.groupItem" >
      </div>
      <div :class="$style.div19">추천 가게 보기</div>
    </div>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>
<<<<<<< HEAD
<style scoped></style>
=======
<style scoped>

</style>
>>>>>>> 0e8d89af13fdef8c62c6434cba6559bbf28591b2
