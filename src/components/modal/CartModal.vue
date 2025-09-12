<script setup>
import { ref, computed } from "vue";

// 부모로부터 items 전달
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

// 모달 표시 상태
const isVisible = ref(false);

// 총 합계 계산
const totalPrice = computed(() =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// 수량 증가/감소
const increaseQty = (item) => {
  item.quantity += 1;
};

const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity -= 1;
};

// 삭제
const removeItem = (id) => {
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) items.splice(index, 1);
};

// 모달 열기
const open = () => {
  isVisible.value = true;
};

// 모달 닫기
const close = () => {
  isVisible.value = false;
};

// 부모에서 호출 가능하게 expose
defineExpose({ open, close });
</script>

<template>
    <div v-if="isVisible" class="modal-overlay" @click="close">    
  <!-- 배경 overlay -->
  <div v-if="isVisible" class="modal-wrapper" @click.stop>
    <div class="modal-content">
      <h3 class="modal-title">장바구니</h3>

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
          </div>
          <hr v-if="idx !== items.length - 1" />
        </div>

        <div class="cart-total">
          <span>총 합계</span>
          <span>{{ totalPrice.toLocaleString() }}원</span>
        </div>

        <button type="button" class="order-btn">주문 변경 및 주문하기</button>
      </div>

      <div v-else class="empty-cart">
        <div class="cart-box">
          <div class="cart-header">도리신 닭도리탕</div>

          <div class="cart-body">
            <p class="empty-text">장바구니에 담은 음식이 없습니다.</p>
          </div>

          <div class="cart-footer">
            <span class="label">총 합계</span>
            <span class="total">0원</span>
          </div>
        </div>
        <button type="submit" class="order-btn">음식 담으러 가기</button>
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
  // 프리텐다드
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
  z-index: 999; // 맨 위에
}

// 헤더 오른쪽 아래 위치를 위한 모달
.modal-wrapper {
  position: absolute; 
  top: 430px; 
  left: 80%;
  transform: translate(-50%, -50%);
  z-index: 1000; // overlay보다 높게

  // 반응형 처리 
  @media (max-width: 768px) {
    position: fixed; 
    top: 60px; 
    right: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }
}

// 기존 modal-content 에만 일부 수정 
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
    max-height: 80vh; // 모바일은 화면 더 많이 쓰도록
  }
}

// 장바구니 글짜
.modal-title {
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  color: #ff6666;
  font-family: "BMJUA";
}
// 장바구니 아이템
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
// 개별 아이템 가격
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
// 빈 장바구니 
.empty-cart {
    text-align: center;
  font-size: 16px;
  padding: 20px 0;

  .cart-box {
    border: 1px solid #797979;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;

    .cart-header {
      padding: 0.8rem;
      font-size: 24px;
      font-weight: 500;
      border-bottom: 1px solid #797979;
    }
// 장바구니에 담은 음식이 없습니다.
    .cart-body {
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 100px;
      margin-top: 100px;

      .empty-text {
        font-size: 20px;
        color: #969696;
      }
    }
// 총 합계
    .cart-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      border-top: 1px solid #797979;

      .label {
        font-size: 24px;
        font-weight: 500;
        margin-left: 100px;
      }

      .total {
        font-size: 24px;
        font-weight: 500;
        margin-right: 100px;
      }
    }
  }

  .go-order-btn {
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
}
</style>
