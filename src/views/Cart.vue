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
  if (res === undefined || res.status !== 200 || res.data.resultStatus !== 200)
    return;

  state.items = res.data.resultData || [];
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
const goToOrder = () => router.push('/order');

const groupedItems = computed(() => {
  const groups = {};
  for (const item of state.items) {
    if (!groups[item.storeName]) {
      groups[item.storeName] = {
        storeName: item.storeName,
        storeNotice: item.storeNotice,
        items: [],
      };
    }
    groups[item.storeName].items.push(item);
  }
  return Object.values(groups);
});
</script>

<template>
  <div class="cart-empty-wrapper">
    <div class="top-row">
      <div class="header-row">
        <div class="title-wrap">
          <img
            class="back-icon"
            alt="뒤로가기"
            src="/src/imgs/cartimgs/arrowios.svg"
          />
          <div class="div29">장바구니</div>
        </div>
        <div class="clear" @click="clear">장바구니 삭제</div>
      </div>
      <div class="step-horizontal">
        <span class="step-text">01 음식선택</span>
        <span class="arrow"
          ><img src="/src/imgs/cartimgs/arrow-back.png"
        /></span>
        <span class="step-text current">02 장바구니</span>
        <span class="arrow"
          ><img src="/src/imgs/cartimgs/arrow-back.png"
        /></span>
        <span class="step-text">03 주문/결제</span>
        <span class="arrow"
          ><img src="/src/imgs/cartimgs/arrow-back.png"
        /></span>
        <span class="step-text">04 주문완료</span>
      </div>
    </div>
  </div>

  <!-- 1. 비로그인 상태 -->
  <div v-if="!loggedIn" class="div18">
    <p class="login-cart">로그인을 하시면 장바구니를 사용할 수 있습니다.</p>
    <div class="groupContainer">
      <button class="div-login" @click="goToLogin">로그인하기</button>
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
    <div v-for="group in groupedItems" :key="group.storeName" class="store-box">
      <div class="store-info">
        <p class="store-name">{{ group.storeName }}</p>
        <p class="store-sub">{{ group.storeNotice }}</p>
      </div>

      <div v-for="item in group.items" :key="item.id" class="cart-item">
        <img
          :src="item.image_path"
          alt="음식 이미지"
          style="width: 60px; height: 60px"
        />
        <div class="item-content">
          <p class="item-name">{{ item.name }}</p>
          <div class="qty-box">
            <button @click="decreaseQty(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQty(item)">+</button>
          </div>
          <p class="item-price">
            {{ (item.price * item.quantity).toLocaleString() }}원
          </p>
          <button @click="remove(item.id)">X</button>
        </div>
      </div>
    </div>

    <div class="cart-footer">
      <p class="total">총 금액: {{ totalPrice.toLocaleString() }}원</p>
      <div class="groupContainer">
        <div class="div19" @click="goToOrder">주문하기</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.cart-empty-wrapper {
  max-width: 1024px;
  margin: 50px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.title-wrap {
  display: flex;
  align-items: center;
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
  justify-content: space-between;
  gap: 20px
}

.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.div29 {
  font-size: 28px;
  font-weight: bold;
}

.step-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
}

.step-text.current {
  color: #ff6666;
  font-size: 16px;
}

.arrow img {
  width: 12px;
  height: auto;
}

.login-cart {
    font-size: 16px;
  margin-bottom: 50px;
  text-align: center;
  color: #555;
}

/* 로그인 상태 안내 */
.div18 {
  font-size: 16px;
  margin-bottom: 50px;
  text-align: center;
  color: #555;
}

.groupContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
}

.clear {
  color: #fff;
  background-color: #ff6666;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 14\px;
}

.div-login {
    border: 2px solid #ff6666;
  color: #ff6666;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 40px;
}

.div19 {
  border: 2px solid #ff6666;
  color: #ff6666;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 91px;
}

.store-box {
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
}

.store-info {
  margin-bottom: 20px;
}

.store-name {
  font-size: 20px;
  font-weight: bold;
}

.store-sub {
  font-size: 14px;
  color: #888;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.cart-item img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.item-name {
  font-weight: 600;
  flex: 1;
}

.qty-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
}

.qty-box button {
  padding: 4px 10px;
  background-color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.qty-box span {
  padding: 0 12px;
}

.item-price {
  font-weight: bold;
  margin-left: 16px;
  min-width: 80px;
  text-align: right;
}

.item-content button {
  margin-left: 16px;
  background: none;
  border: none;
  color: #ff6666;
  font-weight: bold;
  cursor: pointer;
}

.cart-footer {
  margin-top: 40px;
  text-align: right;
}

.total {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
