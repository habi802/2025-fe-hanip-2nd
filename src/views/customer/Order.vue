<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateQuantity, removeItem } from '@/services/cartService';
import { addOrder } from '@/services/orderService';
import { useAccountStore } from '@/stores/account';
import { useCartStore } from '@/stores/cart';
import { getUser } from '@/services/userService';

const route = useRoute();
const router = useRouter();

const account = useAccountStore();
const cart = useCartStore();

const state = reactive({
    // 장바구니 정보
    carts: cart.state.items,
    // 주문 등록 form 정보
    form: {
        storeId: route.params.id,
        address: '',
        addressDetail: '',
        phone: '',
        storeRequest: '',
        riderRequest: '',
        payment: 'CARD',
        orders: [],
        agree: false
    }
});

const phone1 = ref('010');
const phone2 = ref('');
const phone3 = ref('');

// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);

onMounted(async () => {
    // // 나현 씨가 담당한 장바구니 화면에서 받아오려고 쓴 변수(자바스크립트 localStorage 검색)
    // const saved = localStorage.getItem('orderItems');
    // const items = saved ? JSON.parse(saved) : [];

    // 
    // 주소창에 입력해서 강제로 들어가는 것을 방지하기 위함
    if (!account.state.loggedIn) {
        showModal("로그인 후 주문이 가능합니다");
        router.push({ path: '/' });
        return;
    } else if (cart.state.items < 1 && items.length < 1) {
        showModal("메뉴를 선택해주세요");
        router.back();
        return;
    }

    const res = await getUser();

    if (res === undefined) {
        showModal("조회 실패");
        router.push({ path: '/' });
        return;
    } else if (res.data.resultStatus === 401) {
        showModal(res.data.resultMessage);
        router.push({ path: '/' });
        return;
    }

    state.form.address = res.data.resultData.address;
    const phone = res.data.resultData.phone.split('-');
    phone1.value = phone[0];
    phone2.value = phone[1];
    phone3.value = phone[2];
    state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;

    // state.carts = items.length !== 0 ? items : cart.state.items;
    state.carts = cart.state.items;
    calculateTotal();
});

watch([phone1, phone2, phone3], () => {
    state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;
});

const decreaseQuantity = async idx => {
    if (state.carts[idx].quantity > 1) {
        const params = {
            cartId: state.carts[idx].id,
            quantity: state.carts[idx].quantity - 1
        }

        const res = await updateQuantity(params);

        if (res === undefined || res.data.resultStatus !== 200) {
            showModal(res.data.resultMessage);
            return;
        }

        state.carts[idx].quantity--;
        calculateTotal();
    } else if (state.carts[idx].quantity == 1) {
        deleteItem(state.carts[idx].id);
    }
}

const increaseQuantity = async idx => {
    const params = {
        cartId: state.carts[idx].id,
        quantity: state.carts[idx].quantity + 1
    }

    const res = await updateQuantity(params);

    if (res === undefined || res.data.resultStatus !== 200) {
        showModal(res.data.resultMessage);
        return;
    }

    state.carts[idx].quantity++;
    calculateTotal();
}

const deleteItem = async cartId => {
    const res = await removeItem(cartId);

    if (res === undefined || res.data.resultStatus !== 200) {
        showModal("삭제 실패");
        return;
    }

    if (res.data.resultData === 1) {
        const deleteIdx = state.carts.findIndex(item => item.id === cartId);
        if (deleteIdx > -1) {
            state.carts.splice(deleteIdx, 1);
            calculateTotal();
        }

        if (state.carts < 1) {
            showModal("메뉴가 전부 삭제되었습니다");
            router.back();
        }
    }
}

const calculateTotal = () => {
    totalPrice.value = 0;

    state.carts.forEach(item => {
        const price = item.price * item.quantity;
        totalPrice.value += price;
    });
};

const submit = async () => {
    if (state.form.address.trim().length === 0) {
        showModal("주소를 입력해주세요");
        return;
    } else if (state.form.addressDetail.trim().length === 0) {
        showModal("상세 주소를 입력해주세요");

        return;
    } else if (phone2.value.trim().length === 0 || phone3.value.trim().length === 0) {
        showModal("전화번호를 입력해주세요");
        return;
    } else if (!state.form.agree) {
        showModal("결제 약관에 동의해주세요");
        return;
    }

    state.form.orders = state.carts.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity
    }));

    const res = await addOrder(state.form);

    if (res === undefined || res.status !== 200) {
        showModal("등록 실패");
        return;
    }

    if (state.form.payment === 'BANK') {

    }

    if (cart.state.items.length < 1) {
        cart.state.items = state.carts;
    }
    cart.setLatestOrder([...cart.state.items]);

    cart.clearCart()
    await router.push({ path: `/stores/${route.params.id}/order/success` });
};

// 모달창 함수
const showModal = (message) => {
    const modalBody = document.getElementById("alertModalBody");
    if (modalBody) modalBody.textContent = message;
    const modal = new bootstrap.Modal(document.getElementById("alertModal"));
    modal.show();
};
// 모달 버튼 색상 변경

</script>

<template>
  <div class="order-wrapper">
    <div class="order-header">
      <h2>결제하기</h2>
      <div class="order-steps">
        <span>01 음식 선택</span> ›
        <span>02 장바구니</span> ›
        <span class="current">03 주문/결제</span> ›
        <span>04 주문완료</span>
      </div>
      <div class="header-divider"></div>
    </div>

    <div class="order-main">
      <form class="order-form" @submit.prevent="submit">
        <div class="left">
          <h4 class="section-title">배달정보</h4>

          <label class="field-label">주소</label>
          <input id="address" type="text" class="field" placeholder="주소 입력" v-model="state.form.address" />

          <label class="sr-only">상세주소</label>
          <input id="address-detail" type="text" class="field" placeholder="(필수) 상세주소 입력" v-model="state.form.addressDetail" />

          <label class="field-label">휴대전화번호</label>
          <input id="phone" type="text" class="field" placeholder="(필수) 휴대전화번호 입력" v-model="state.form.phone" />

          <label class="field-label">주문 시 요청사항 (가게)</label>
          <textarea id="store-request" class="textarea" placeholder="예) 간장 빼주세요, 덜 맵게 해주세요" v-model="state.form.storeRequest"></textarea>

          <label class="field-label">주문 시 요청사항 (라이더)</label>
          <textarea id="rider-request" class="textarea" placeholder="예) 상세 요청사항을 입력해주세요" v-model="state.form.riderRequest"></textarea>

          <div class="payment-section">
            <div class="payment-title">결제수단 선택</div>
            <div class="payment-list">
              <label class="radio-label"><input type="radio" value="CARD" v-model="state.form.payment" /> 카드 결제</label>
              <label class="radio-label"><input type="radio" value="BANK" v-model="state.form.payment" /> 무통장 입금</label>
              <label class="radio-label"><input type="radio" value="KAKAOPAY" v-model="state.form.payment" /> KakaoPay 결제</label>
              <label class="radio-label"><input type="radio" value="NPAY" v-model="state.form.payment" /> NPay 결제</label>
              <label class="radio-label"><input type="radio" value="ON_SITE" v-model="state.form.payment" /> 현장 결제</label>
            </div>
          </div>
        </div>

        <div class="right">
          <h4 class="section-title">주문내역</h4>

          <div class="summary">
            <div class="store-name">가게명</div>

            <div class="items">
              <div v-if="state.carts.length > 0" class="items-list">
                <div v-for="(item) in state.carts" :key="item.id" class="item-row">
                  <div class="item-name">
                    <div class="name">{{ item.name }}</div>
                    <div v-if="item.optionName" class="option">　└ {{ item.optionName }}</div>
                    <div v-for="(ex, i) in item.extra" :key="i" class="option">└ {{ ex }}</div>
                  </div>
                  <div class="item-qty">{{ item.quantity }}개</div>
                  <div class="item-price">{{ (item.price * item.quantity).toLocaleString() }}원</div>
                </div>
              </div>
              <div v-else class="empty">메뉴를 선택해주세요.</div>
            </div>
          </div>

          <div class="fee-box">
            <div class="fee-row">
              <span>배달료</span>
              <span>2,000원</span>
            </div>
          </div>

          <div class="total-box">
            <div class="total-row">
              <strong>총 결제 금액</strong>
              <strong>{{ (totalPrice + 2000).toLocaleString() }}원</strong>
            </div>
          </div>

          <div class="agree-area">
            <label class="agree-label">
              <input type="checkbox" v-model="state.form.agree" />
              이용약관, 개인정보 수집 및 이용, 개인정보 제 3자 제공, 전자금융거래 이용약관, 만 14세 이상 이용자 내용 확인하였으며 결제에 동의합니다.
            </label>
          </div>

          <button type="submit" class="btn-outline">결제하기</button>
        </div>
      </form>
    </div>

    <div id="alertModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">알림</h5></div>
          <div class="modal-body" id="alertModalBody">내용</div>
          <div class="modal-footer"><button type="button" class="btn" data-bs-dismiss="modal">확인</button></div>
        </div>
      </div>
    </div>
  </div>
</template>




<style lang="scss" scoped>
@font-face {
  // 프리텐다드
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

* {
  font-family: 'Pretendard-Regular';
  box-sizing: border-box;
}

.order-wrapper {
  max-width: 1180px;
  margin: 40px auto;
  padding: 0 18px 80px;
  color: #222;
}

.order-header {
  position: relative;
  margin-bottom: 36px;
  text-align: center;
}

.order-header h2 {
  margin: 0;
  font-size: 30px;
  font-weight: 500;
  padding-top: 6px;
}

.order-steps {
  position: absolute;
  right: 0;
  top: 70px;
  font-size: 16px;
  color: #6b6b6b;
}

.order-steps .current {
  color: #ff6666;
  font-weight: 700;
}

.header-divider {
  margin-top: 70px;
  height: 2px;
  background: #000000;
}

.order-main {
  margin-top: 26px;
}

.order-form {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

/* left column */
.left {
  flex: 0 0 62%;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 18px;
  color: #111;
}

.field-label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
  color: #444;
}

.field {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 14px;
  background: #fff;
}

.textarea {
  width: 100%;
  min-height: 72px;
  padding: 12px 14px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 14px;
  resize: vertical;
  background: #fff;
}

.payment-section {
  margin-top: 8px;
}

.payment-title {
  margin-bottom: 8px;
  font-weight: 700;
  color: #222;
}

.payment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 40px;
  font-weight: 600;
}

.radio-label {
  display: flex;
  align-items: center;
  width: 200px;
  font-size: 14px;
  color: #222;
}

.radio-label input {
  margin-right: 10px;
}

/* right column */
.right {
  flex: 0 0 36%;
}

.summary {
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
  margin-bottom: 14px;
}

.store-name {
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 14px;
  color: #222;
}

.items {
  max-height: 240px;
  overflow: auto;
  padding-right: 6px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: grid;
  grid-template-columns: 1fr 72px 100px;
  align-items: center;
  border-bottom: 1px dashed #f0f0f0;
  padding: 8px 4px;
}

.item-row:last-child {
  border-bottom: none;
}

.item-name .name {
  font-size: 14px;
  color: #222;
}

.option {
  font-size: 12px;
  color: #9a9a9a;
  margin-top: 4px;
}

.item-qty {
  text-align: center;
  font-size: 13px;
  color: #666;
}

.item-price {
  text-align: right;
  font-size: 13px;
  color: #222;
}

/* fee and total boxes */
.fee-box {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fff;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #222;
}

.total-box {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
  background: #fff;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #222;
  font-weight: 700;
}

/* agreement and button */
.agree-area {
  font-size: 12px;
  color: #444;
  margin-bottom: 18px;
}

.agree-label input {
  margin-right: 8px;
}

.btn-outline {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #ff6666;
  background: #fff;
  color: #ff6666;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}

.btn-outline:hover {
  background: #fff6f6;
}

/* responsive */
@media (max-width: 991px) {
  .order-form {
    flex-direction: column;
  }
  .left, .right { flex: 1 1 100%; }
  .order-steps { position: static; text-align: left; margin-top: 8px; }
}
</style>



