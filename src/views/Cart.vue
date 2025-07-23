<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getItem, removeCart, removeItem } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';

const router = useRouter();
const account = useAccountStore();

const state = reactive({
  items: [],
});

const loggedIn = computed(() => account.state.loggedIn);

onMounted(() => {
  load();
});

const load = async () => {
  if (!loggedIn.value) return;
  const res = await getItem();
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

const increaseQty = (item) => {
  item.quantity++;
  // 서버에도 수량 변경 요청 추가 가능
};

const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity--;
};

const totalPrice = computed(() =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const goToLogin = () => router.push('/login');
const goToMain = () => router.push('/');
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

    <!-- 1. 비로그인 상태 -->
    <div v-if="!loggedIn" class="div18">
      <p class="login-cart">로그인을 하시면 장바구니를 사용할 수 있습니다.</p>
      <div class="groupContainer">
        <button class="div19" @click="goToLogin">로그인하기</button>
      </div>
    </div>

    <!-- 2. 로그인했지만 장바구니 비어있음 -->
    <div v-else-if="state.items.length === 0">
      <div class="div18">장바구니에 담은 음식이 없습니다.</div>
      <div class="groupContainer">
        <div class="rectangleWrapper">
          <div class="groupItem" />
        </div>
        <div class="div19" @click="goToMain">음식 담으러 가기</div>
      </div>
    </div>

    <!-- 3. 장바구니에 음식 있음 -->
    <div v-else>
      <div v-for="item in state.items" :key="item.id" class="cart-item">
        <img :src="item.image_path" alt="음식 이미지" />
        <p>{{ item.name }}</p>
        <div>
          <button @click="decreaseQty(item)">-</button>
          {{ item.quantity }}
          <button @click="increaseQty(item)">+</button>
        </div>
        <p>{{ item.price.toLocaleString() }}원</p>
        <button @click="remove(item.id)">삭제</button>
      </div>

      <p>총 금액: {{ totalPrice.toLocaleString() }}원</p>
      <div class="groupContainer">
        <div class="div19" @click="clear">전체 삭제</div>
        <div class="div19" @click="goToMain">주문하러 가기</div>
      </div>
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
    font-size: 18px;
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
  background-color: #ffffff;
  padding: 10px 30px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 100px;
  align-items: center;
}

.login-cart  {
    text-align: center;
    margin-bottom: 50px;

}

</style>
