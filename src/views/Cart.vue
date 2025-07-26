<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getItem, removeCart, removeItem } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const items = computed(() => cartStore.state.items);

// 라우터 및 스토어 인스턴스 생성
const router = useRouter();
const account = useAccountStore();

// 장바구니 아이템 상태
const state = reactive({
  items: [],
});

// 로그인 여부 계산
const loggedIn = computed(() => account.state.loggedIn);

// 페이지 진입 시 장바구니 데이터 불러오기
onMounted(() => {
  console.log("CartStore 상태:", items.value);
  if(loggedIn.value) {
    load();
    state.items = items.value
  }
});

// 장바구니 데이터 API 요청
const load = async () => {
  if (!loggedIn.value) return;
  const res = await getItem();
  if (res === undefined || res.status !== 200 || res.data.resultStatus !== 200)
    return;

  state.items = res.data.resultData || [];
};

// 장바구니 항목 개별 삭제
const remove = async (cartId) => {
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) return;

  load();
};

// 수량 증가
const increaseQty = (item) => {
  item.quantity++;
};

// 수량 감소 (1 미만으로 내려가지 않도록 제한)
const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity--;
};

// 전체 금액 계산
const totalPrice = computed(() =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// 페이지 이동 처리
const goToLogin = () => router.push('/login');
const goToMain = () => router.push('/');

// 주문 페이지로 이동하면서 orderItems 저장
const goToOrder = (group) => {
  if (!group || !group.items || group.items.length === 0) {
    alert('주문할 메뉴가 없습니다.');
    return;
  }

  const orderItems = group.items.map((item) => ({
    id: item.id,
    menuId: item.menuId || item.menu_id || item.id,
    quantity: item.quantity,
    price: item.price,
    name: item.name,
    imagePath: item.image_path,
  }));

  localStorage.setItem('orderItems', JSON.stringify(orderItems));
  router.push(`/stores/${group.items[0].storeId}/order`);
};

// 매장별로 장바구니 아이템 그룹화
const groupedItems = computed(() => {
  const groups = {};
  for (const item of state.items) {
    if (!groups[item.storeName]) {
      groups[item.storeName] = {
        storeId: item.storeId,
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
  <!-- 헤더 및 단계 표시 영역 -->
  <div class="cart-empty-wrapper">
    <div class="top-row">
      <div class="header-row">
        <div class="title-wrap">
          <img class="back-icon" alt="뒤로가기" src="/src/imgs/cartimgs/arrowios.svg" />
          <div class="div29">장바구니</div>
        </div>
      </div>
  </div>
      <div class="step-horizontal">
        <span class="step-text">01 음식선택</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png" /></span>
        <span class="step-text current">02 장바구니</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png" /></span>
        <span class="step-text">03 주문/결제</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png" /></span>
        <span class="step-text">04 주문완료</span>
      </div>
  </div>

  <!-- 비로그인 상태 안내 -->
  <div v-if="!loggedIn" class="div18">
    <p class="login-cart">로그인을 하시면 장바구니를 사용할 수 있습니다.</p>
    <div class="groupContainer">
      <button class="div-login" @click="goToLogin">로그인하기</button>
    </div>
  </div>

  <!-- 로그인 상태지만 장바구니가 비어 있는 경우 -->
  <div v-else-if="state.items.length === 0">
    <div class="div18">장바구니에 담은 음식이 없습니다.</div>
    <div class="groupContainer">
      <div class="rectangleWrapper">
        <div class="groupItem" />
      </div>
      <div class="div19" @click="goToMain">음식 담으러 가기</div>
    </div>
  </div>

  <!-- 장바구니에 음식이 있는 경우 -->
  <div v-else>
    <div v-for="group in groupedItems" :key="group.storeName" class="store-box">
      <!-- 매장 정보 -->
      <div class="store-info">
        <p class="store-name">{{ group.storeName }}</p>
        <p class="store-sub">{{ group.storeNotice }}</p>
      </div>

      <!-- 매장별 메뉴 목록 -->
      <div v-for="item in group.items" :key="item.id" class="cart-item">
        <img :src="item.image_path" alt="음식 이미지" style="width: 60px; height: 60px" />
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

      <!-- 매장별 주문 영역 -->
      <div class="cart-footer">
        <p class="total">
          총 금액:
          {{
            group.items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()
          }}원
        </p>
        <div class="groupContainer">
          <div class="div19" @click="goToOrder(group)">주문하기</div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* 전체 장바구니 페이지 레이아웃 */
.cart-empty-wrapper {
  max-width: 1024px;
  margin: 50px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
}

/* 상단 타이틀 영역 */
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

/* 헤더 행: 타이틀 + 단계 표시 조합 */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* 뒤로가기 아이콘 */
.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

/* "장바구니" 타이틀 텍스트 */
.div29 {
  font-size: 28px;
  font-weight: bold;
}

/* 주문 단계 수평 표시줄 */
.step-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
}

/* 현재 단계 강조 */
.step-text.current {
  color: #ff6666;
  font-size: 16px;
}

/* 단계 사이의 화살표 아이콘 */
.arrow img {
  width: 12px;
  height: auto;
}

/* 비로그인/빈 장바구니 안내 문구 */
.login-cart,
.div18 {
  font-size: 16px;
  margin-bottom: 50px;
  text-align: center;
  color: #555;
}

/* 버튼이나 기타 요소의 공통 컨테이너 */
.groupContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
}

/* 로그인 버튼 */
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

/* "음식 담으러 가기", "주문하기" 버튼 */
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

/* 매장별 카드 형태의 컨테이너 */
.store-box {
  max-width: 900px;
  margin: 0 auto 40px auto;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 매장 이름, 공지 정보 */
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

/* 개별 장바구니 아이템 */
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

/* 음식 이미지 스타일 */
.cart-item img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

/* 음식명, 수량 조절, 가격, 삭제 버튼 영역 */
.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

/* 음식명 */
.item-name {
  font-weight: 600;
  flex: 1;
}

/* 수량 조절 박스 */
.qty-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
}

/* 수량 증감 버튼 */
.qty-box button {
  padding: 4px 10px;
  background-color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

/* 수량 숫자 */
.qty-box span {
  padding: 0 12px;
}

/* 가격 표시 */
.item-price {
  font-weight: bold;
  margin-left: 16px;
  min-width: 80px;
  text-align: right;
}

/* 삭제 버튼 (X) */
.item-content button {
  margin-left: 16px;
  background: none;
  border: none;
  color: #ff6666;
  font-weight: bold;
  cursor: pointer;
}

/* 그룹별 하단 총 금액 및 주문 버튼 */
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

