<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateQuantity, removeItem } from '@/services/cartService';
import { addOrder } from '@/services/orderService';
import { useAccountStore } from '@/stores/account';
import { useCartStore } from '@/stores/cartStore';
import { getUser } from '@/services/userService';
import { getStore } from '@/services/storeService';
import { useUserInfo } from '@/stores/account';
import { kakaoPayReady, naverGetCid, naverPayApply, naverPayReserve, kakaoGetPayApprove } from '@/services/payment';
import LoadingModal from '@/components/modal/LoadingModal.vue';
import AlertResolveModal from '@/components/modal/AlertResolveModal.vue';

const alretModal = ref(null);
const baseUrl = import.meta.env.VITE_BASE_URL;

const loadingModal = ref(null);

const route = useRoute();
const router = useRouter();

const account = useAccountStore();
const cart = useCartStore();
const userInfo = useUserInfo();


const state = reactive({
  carts: [],
  form: {
    postcode: '',
    address: '',
    addressDetail: '',
    storeRequest: '',
    riderRequest: '',
  },
  storeInfo: Object
});

const phone1 = ref('010');
const phone2 = ref('');
const phone3 = ref('');

// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);

onMounted(async () => {
  storeInfo();
  const res = await getUser();

  state.form.postcode = res?.data?.resultData?.postcode ?? "";
  state.form.address = res?.data?.resultData?.address ?? "";
  state.form.addressDetail = res?.data?.resultData?.addressDetail ?? "";

  console.log("유저 정보", res?.data?.resultData ?? {});

  const phone = res?.data?.resultData?.phone?.split('-') ?? ["010", "1111", "1111"];
  phone1.value = phone[0] ?? "010";
  phone2.value = phone[1] ?? "1111";
  phone3.value = phone[2] ?? "1111";
  state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;


  await cart.getCart();

  console.log("카트스토어 넘어왔는지", cart.items);
  state.carts = cart.items;

  console.log("state.carts", state.carts)


  if (state.carts.length <= 0) {
    loadingModal.value.open()
    setTimeout(async () => {
      loadingModal.value.hide();
      const alret = await alretModal.value.showModal("잘못된 접근입니다. 다시 주문해주세요");

      if (alret) {
        router.push("/")
      }
    }, 1500);
  }

  calculateTotal();

  //네이버페이 payId 받았을때만 
  const routeOrderId = route.query.orderId;
  const paymentId = route.query.paymentId;

  const paymentReq = {
    paymentId: route.query.paymentId
  }

  if (paymentId != null) {
    console.log("payId:", paymentId);
    const apply = async () => {
      const check = await naverPayApply(paymentId, routeOrderId);
      console.log("체크 확인", check);
      const finalPaymentId = check.data.resultData.body.paymentId;

      if (check.data || check.data.resultStatus === 200) {
        console.log("라우터 확인용", "잘 이동합니다")
        console.log("쿼리 넘어오는 거 머있니", routeOrderId, finalPaymentId)
        router.push({ path: `/stores/${state.form.storeId}/order/success`, query: { routeOrderId, paymentId: finalPaymentId } })
          .then(() => console.log("라우터 이동 성공!"))
          .catch(error => console.error("라우터 이동 실패:", error));

      }

    }


    apply();

  }
  // 백엔드에서 주소 입력해서 넘겨받음 ^^ 최고의 생각이였다 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const orderId = urlParams.get('orderId');
  const pg_token = urlParams.get('pg_token');

  if (orderId) {
    console.log("orderId", orderId)
    console.log("pg_token", pg_token)

    const params = { pg_token }

    const kakaoRes = await kakaoGetPayApprove(orderId, params);

    console.log("카카오 정보", kakaoRes);
    if (kakaoRes.data.resultStatus === 200) {
      const data = kakaoRes.data.resultData;
      console.log("데이타 정보", data);

      if (data.aid) {
        await router.push({ path: `/stores/${state.form.storeId}/order/success`, query: { routeOrderId } });
      }
    }
  }


});


const storeInfo = async () => {
  const storeId = route.params.id;
  const storeInfo = await getStore(storeId);

  state.storeInfo = storeInfo.data.resultData;
  console.log("스토어 정보", state.storeInfo)
}


watch([phone1, phone2, phone3], () => {
  state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;
});




const calculateTotal = () => {
  let _totalPrice = 0;

  state.carts.forEach(item => {
    _totalPrice += item.price;
    console.log("이거 왜이렇게 비싸", item.price)
  });
  totalPrice.value = _totalPrice;
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

//신규 주문하기 버튼 
const ordering = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
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

  const res = await addOrder(state.form);
  if (res === undefined || res.status !== 200) {
    showModal("등록 실패");
    return;
  }

  console.log("데이터 넘어갓나요?", res)
  const orderId = res.data.resultData.id;
  console.log("오더아이디 확인", orderId)

  // SDK 로드 후 바로 결제 화면 열기
  const script = document.createElement('script');
  script.src = 'https://nsp.pay.naver.com/sdk/js/naverpay.min.js';
  script.async = true;
  document.head.appendChild(script);

  script.onload = async () => {
    const oPay = window.Naver.Pay.create({
      mode: 'development',
      clientId: 'HN3GGCMDdTgGUfl0kFCo',
      chainId: 'NFlxNnUza3lTNzV'
    });

    const res = await naverPayReserve(orderId);
    const item = res.data.resultData;

    oPay.open({
      merchantPayKey: item.merchantPayKey,
      productName: item.productName,
      productCount: item.productCount,
      totalPayAmount: item.totalPayAmount,
      taxScopeAmount: item.taxScopeAmount,
      taxExScopeAmount: item.taxExScopeAmount,
      returnUrl: `${item.returnUrl}?orderId=${orderId}`,
      productItems: item.productItems
    });
  };


}

const isProcessing = ref(false);
const buy = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
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


  const res = await addOrder(state.form);

  if (res === undefined || res.status !== 200) {
    showModal("등록 실패");
    return;
  } else {
    console.log("데이터 넘어갓나요?", res)
    const orderId = res.data.resultData.id;
    console.log("오더아이디 확인", orderId)

    const res2 = await kakaoPayReady(orderId);
    if (res2.data.resultStatus === 200) {
      const data = res2.data.resultData;

      console.log("데이터?", data)
      const redirectUrl = `${data.next_redirect_pc_url}`;
      window.location.href = redirectUrl;
    }

  }
}





// 신규 네이버페이

const naverPayBtn = ref(null);

const pay = reactive({
  product: []
}
)





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
          <input id="address-detail" type="text" class="field" placeholder="(필수) 상세주소 입력" v-model="state.form.
            addressDetail" />

          <label class="field-label">휴대전화번호</label>
          <input id="phone" type="text" class="field" placeholder="(필수) 휴대전화번호 입력" v-model="state.form.phone" />

          <label class="field-label">주문 시 요청사항 (가게)</label>
          <textarea id="store-request" class="textarea" placeholder="예) 간장 빼주세요, 덜 맵게 해주세요"
            v-model="state.form.storeRequest"></textarea>

          <label class="field-label">주문 시 요청사항 (라이더)</label>
          <textarea id="rider-request" class="textarea rider-area" placeholder="예) 상세 요청사항을 입력해주세요"
            v-model="state.form.riderRequest"></textarea>


        </div>

        <div class="right">
          <h4 class="section-title">주문내역</h4>

          <div class="store-name">가게명 {{ state.storeInfo.name }}</div>
          <div class="summary">


            <div class="items">
              <div v-if="state.carts.length > 0" class="items-list">
                <div v-for="item in state.carts" :key="item.id" class="item-row">
                  <div class="item-name">
                    <div class="name">{{ item.name || '' }}</div>
                    <template v-if="item.options && item.options.length > 0">
                      <template v-for="opt in item.options" :key="opt.optionId">
                        <div class="option">
                          - {{ opt.comment || '-' }}
                          <span v-if="opt.price && opt.price > 0">
                            (+{{ opt.price.toLocaleString() }}원)
                          </span>
                        </div>
                        <template v-if="opt.children && opt.children.length > 0">
                          <div v-for="child in opt.children" :key="child.optionId" class="option-child">
                            └ {{ child.comment || '-' }}
                            <span v-if="child.price && child.price > 0">
                              (+{{ child.price.toLocaleString() }}원)
                            </span>
                            <template v-if="child.children && child.children.length > 0">
                              <div v-for="grand in child.children" :key="grand.optionId" class="option-grandchild">
                                └ {{ grand.comment || '-' }}
                                <span v-if="grand.price && grand.price > 0">
                                  (+{{ grand.price.toLocaleString() }}원)
                                </span>
                              </div>
                            </template>
                          </div>
                        </template>
                      </template>
                    </template>
                  </div>

                  <div class="item-qty">{{ item.quantity || 0 }}개</div>
                  <div class="item-price">
                    {{
                      (item.price ?? 0).toLocaleString()
                    }}원
                  </div>
                </div>
              </div>
              <div v-else class="empty">메뉴를 선택해주세요.</div>
            </div>

          </div>

          <div class="fee-box">
            <div class="fee-row">
              <span>배달료</span>
              <span>{{ state.storeInfo.minDeliveryFee }}</span>
            </div>
          </div>

          <div class="total-box">
            <div class="total-row">
              <strong>총 결제 금액</strong>
              <strong>{{ (totalPrice + state.storeInfo.minDeliveryFee ?? 0).toLocaleString() }}원</strong>
            </div>
          </div>

          <div class="agree-area">
            <label class="agree-label">
              <input type="checkbox" v-model="state.form.agree" />
              이용약관, 개인정보 수집 및 이용, 개인정보 제 3자 제공, 전자금융거래 이용약관, 만 14세 이상 이용자 내용 확인하였으며 결제에 동의합니다.
            </label>
          </div>
          <div class="pay-box">
            <div class="kakao-pay-box" @click="buy">
              <div class="kokao-slide-img">
                <img src="/src/imgs/pay/kakaopay.JPG" alt="카카오페이" class="kakao-pay"></img>
              </div>
            </div>

            <div class="naver-pay-box" ref="naverPayBtn" @click="ordering">
              <div class="slide-img">
                <img src="/src/imgs/pay/btn_ext_buying.svg" alt="네이버페이" class="naver-pay"></img>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>

    <div id="alertModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">알림</h5>
          </div>
          <div class="modal-body" id="alertModalBody">내용</div>
          <div class="modal-footer"><button type="button" class="btn" data-bs-dismiss="modal">확인</button></div>
        </div>
      </div>
    </div>
  </div>
  <loading-modal ref="loadingModal"></loading-modal>
  <alert-resolve-modal ref="alretModal"></alert-resolve-modal>
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
  outline: none;
  resize: none;
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
  display: flex;
  justify-content: center;
  height: 100%;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.item-price {
  display: flex;
  justify-content: center;
  height: 100%;
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

  .left,
  .right {
    flex: 1 1 100%;
  }

  .order-steps {
    position: static;
    text-align: left;
    margin-top: 8px;
  }
}

.rider-area {
  margin-bottom: 200px;
}

.option-child {
  color: #ccc;
  font-size: 0.8em;
  font-weight: 200;
}

.naver-pay-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border: 1.5px #3fc754 solid;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 200px;
}

.kakao-pay-box {
  background-color: #fbe200;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}


.slide-img {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 200px;
}

.kakao-pay {
  height: 50px;
}

.naver-pay {
  height: 60px;

  display: block;
}

.pay-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
