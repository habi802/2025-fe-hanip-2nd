<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// 모달 표시 상태
const isVisible = ref(false);

// 모달 내부에서 보여줄 items (부모에서 전달)
const items = ref([]);

// 라우터
const router = useRouter();
const route = useRoute();

// 부모에게 이벤트 전달
const emit = defineEmits(["update-items"]);

// 페이지 이동 시 모달 자동 닫기
watch(
  () => route.fullPath,
  () => {
    isVisible.value = false;
  }
);

// 총 합계 계산
const totalPrice = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// 수량 증가/감소
const increaseQty = (item) => {
  item.quantity += 1;
  emit("update-items", items.value);
};
const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity -= 1;
  emit("update-items", items.value);
};

// 삭제
const removeItem = (id) => {
  items.value = items.value.filter((i) => i.id !== id);
  emit("update-items", items.value);
};

// 모달 열기 (부모에서 items 전달 가능)
const open = (cartItems = []) => {
  items.value = cartItems;
  isVisible.value = true;
};

// 모달 닫기
const close = () => {
  isVisible.value = false;
};

// expose로 부모에서 open/close 접근 가능
defineExpose({ open, close });

// 페이지 이동
const goToCategoryList = () => router.push("/categoryList");
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click="close">
    <div class="modal-wrapper" @click.stop>
      <div class="modal-content">
        <h3 class="modal-title">장바구니</h3>

        <!-- 장바구니에 아이템 있을 때 -->
        <div v-if="items.length > 0" class="cart-container">
          <div v-for="(item, idx) in items" :key="item.id" class="cart-item">
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-controls">
                <button @click="decreaseQty(item)">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="increaseQty(item)">+</button>
              </div>
              <div class="item-price">
                {{ (item.price * item.quantity).toLocaleString() }}원
              </div>
              <button class="remove-btn" @click="removeItem(item.id)">삭제</button>
            </div>
            <hr v-if="idx !== items.length - 1" />
          </div>

          <!-- 총 합계 -->
          <div class="cart-total">
            <span>총 합계</span>
            <span>{{ totalPrice.toLocaleString() }}원</span>
          </div>
          <button type="submit" class="order-btn" @click="goToCategoryList">
            음식 담으러 가기
          </button>
        </div>

        <!-- 장바구니 비었을 때 -->
        <div v-else class="empty-cart">
          <div class="cart-box">
            <div class="cart-header">가게 명</div>
            <div class="cart-body">
              <p class="empty-text">장바구니에 담은 음식이 없습니다.</p>
            </div>
            <div class="cart-footer">
              <span class="label">총 합계</span>
              <span class="total">0원</span>
            </div>
          </div>
          <button type="button" class="order-btn" @click="goToCategoryList">
            음식 담으러 가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}
// 전체 overlay (투명, 화면 덮기)
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

// 모달 wrapper
.modal-wrapper {
  position: absolute;
  top: 430px;
  left: 80%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }
}
// 모달 콘텐츠 영역
.modal-content {
  background: white;
  padding: 20px;
  width: 500px;
  max-height: 1000px;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  @media (max-width: 700px) {
    width: 100%;
    max-height: 80vh;
  }
}
// 모달 제목
.modal-title {
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  color: #ff6666;
  font-family: "BMJUA";
}

//장바구니 아이템
.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
// 수량 조절 버튼 영역
.item-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-controls button {
  width: 26px;
  height: 26px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.item-price {
  width: 75px;
  text-align: right;
}
// 총 합계 영역
.cart-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1em;
  padding-top: 12px;
  border-top: 2px solid #ff6666;
  margin-top: 15px;
}
span.label {
  margin-left: 100px;
}
span.total {
  margin-right: 100px;
}
// 주문 버튼
.order-btn {
  width: 100%;
  padding: 12px 0;
  background: #fff;
  color: #ff6666;
  border: 2px solid #ff6666;
  border-radius: 8px;
  margin-top: 15px;
  cursor: pointer;
}
// 빈 장바구니 스타일v
.empty-cart {
  text-align: center;
  font-size: 16px;
  padding: 20px 0;
}

.empty-cart .cart-box {
  border: 1px solid #797979;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.empty-cart .cart-header {
  padding: 0.8rem;
  font-size: 24px;
  font-weight: 500;
  border-bottom: 1px solid #797979;
}

.empty-cart .cart-body {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
  margin-top: 100px;
}

.empty-cart .cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-top: 1px solid #797979;
}

.empty-cart .order-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid #ff6666;
  background-color: #fff;
  color: #ff6666;
  cursor: pointer;
  &:hover {
    background-color: #ffe5e5;
  }
}
</style>
