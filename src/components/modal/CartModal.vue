<script setup>
import { ref, computed, watch, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { minusQuantity, plusQuantity, removeItem, getItem } from "@/services/cartService";

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

// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);

// 장바구니 총 금액 계산하는 함수
const calculateTotal = () => {
  let _totalPrice = 0;

  items.value.forEach((item) => {
    _totalPrice += item.price;
    console.log("이거 왜이렇게 비싸", item.price)
  });

  totalPrice.value = _totalPrice;

};

// 수량 증가/감소
const increaseQty = async (item) => {

  if (item.quantity < 100) {
    item.quantity += 1;
    item.price = item.oneMenuPrice
      * item.quantity;
    calculateTotal();
    await plusQuantity(item.id);

    emit("update-items", items.value);
  }

};
const decreaseQty = async (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
    await minusQuantity(item.id);
    item.price = item.oneMenuPrice
      * item.quantity;
    calculateTotal();
  }
  else {
    await removeItem(item.id);
    items.value = items.value.filter(i => i.id !== item.id);
  }
  emit("update-items", items.value);
};

// 모달 열기 (부모에서 items 전달 가능)
const open = (cartItems = []) => {
  items.value = cartItems;
  isVisible.value = true;
  calculateTotal();
};

// 모달 닫기
const close = () => {
  isVisible.value = false;
};

// expose로 부모에서 open/close 접근 가능
defineExpose({ open, close });

// 페이지 이동
const goToCategoryList = () => {
  if (items.value.length > 0) {

    router.push("/cart")

  } else {

    router.push("/categoryList");
  }

}

const optionTotal = (item) => {
  if (!item.options) return 0;
  return item.options.reduce(
    (sum, option) =>
      sum +
      (option.children?.reduce((cSum, c) => cSum + (c.price ?? 0), 0) ?? 0),
    0
  );
};

</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click="close">
    <div class="modal-wrapper" @click.stop>
      <div class="modal-content">
        <h3 class="modal-title">장바구니</h3>

        <!-- 장바구니에 아이템 있을 때 -->
        <div v-if="items.length > 0" class="cart-container">
          <div class="storeName">{{ items[0].storeName }}</div>
          <hr />


          <div class="big-box">
            <div v-for="(item, idx) in items" :key="item.id" class="cart-item">
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-controls">
                  <div class="quantity-box">
                    <div class="quantity-text-m" @click="decreaseQty(item)">-</div>
                  </div>
                  <span class="quantity">{{ item.quantity }}</span>
                  <div class="quantity-box">
                    <div class="quantity-text-p" @click="increaseQty(item)">+</div>
                  </div>
                </div>
                <div class="item-price">
                  {{ (item.price).toLocaleString() }}원
                </div>
              </div>
              <div class="option-box">

                <div v-if="item.options?.length" class="options-wrapper">
                  <div v-for="option in item.options" :key="option.optionId" class="option-row">
                    <div class="option-comment">{{ option.comment }}</div>
                    <div class="option-price" v-if="option.children?.length">
                      <div v-for="child in option.children" :key="child.optionId">
                        {{ child.comment }} (+{{ child.price.toLocaleString() }}원)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr v-if="idx !== items.length - 1" />
            </div>
          </div>
          <!-- 총 합계 -->
          <div class="cart-total">
            <span>총 합계</span>
            <span>{{ totalPrice.toLocaleString() }}원</span>
          </div>
          <button type="submit" class="order-btn" @click="goToCategoryList">
            옵션 변경 / 주문하러 가기
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
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}

.item-name {
  width: 190px;
  min-height: 20px;
}

.storeName {
  font-family: "Pretendard-Regular";
  font-size: 1.5em;
  text-align: center;
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
  top: 100px;
  left: 70%;
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
  width: 460px;
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
  font-weight: 400;
  text-align: center;
  color: #ff6666;
  font-family: "Pretendard-Regular";
  margin-bottom: 10px;
}

//장바구니 아이템
.cart-item {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;

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
  width: 100px;
  text-align: right;
}

// 총 합계 영역
.cart-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1em;
  padding-top: 12px;
  border-top: 1px solid #ccc;
  margin-top: 25px;
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

.item-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.option-item {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.cart-container {
  padding: 20px;
  border: #888 1px solid;
  border-radius: 10px;

}

.options-wrapper {

  gap: 16px;
  overflow-x: auto;
  padding: 10px 0;
}

.option-row {
  white-space: nowrap;
  display: flex;
  color: #ccc;
  justify-content: space-between;
}

.big-box {
  max-width: 500px;
  min-height: 40px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

.big-box::-webkit-scrollbar {
  width: 10px;
}

.big-box::-webkit-scrollbar-track {
  background: #ffeeee;
  border-radius: 10px;
}

.big-box::-webkit-scrollbar-thumb {
  background: #ffb7b7;
  border-radius: 10px;
}

.big-box::-webkit-scrollbar-button {
  display: none;
}
</style>
