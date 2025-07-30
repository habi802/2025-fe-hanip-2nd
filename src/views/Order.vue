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
    <div class="cart-empty-wrapper">
        <div class="top-row">
            <div class="header-row">
                <!-- <img class="back-icon" alt="뒤로가기" src="/src/imgs/cartimgs/arrowios.svg" /> -->
                <div class="div29">장바구니</div>
            </div>
            <div class="step-horizontal">
                <span class="step-text">01 음식선택</span>
                <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
                <span class="step-text">02 장바구니</span>
                <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
                <span class="step-text current">03 주문/결제</span>
                <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
                <span class="step-text">04 주문완료</span>
            </div>
        </div>

        <div class="container">
            <form class="row" @submit.prevent="submit">
                <div class="col-12 col-md-8">
                    <h4 class="mb-5">배달 정보</h4>
                    <div class="row mb-4">
                        <div class="col-12 col-md-3">
                            <label for="address" class="col-form-label">주소</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input id="address" type="text" class="form-control mb-4" placeholder="주소 입력"
                                v-model="state.form.address">
                            <input id="address-detail" type="text" class="form-control" placeholder="상세주소 입력 (필수)"
                                v-model="state.form.addressDetail">
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12 col-md-3">
                            <label for="" class="col-form-label">전화번호</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <div class="row g-2">
                                <div class="col-4">
                                    <select class="form-control" v-model="phone1">
                                        <option>010</option>
                                        <option>016</option>
                                        <option>017</option>
                                        <option>018</option>
                                        <option>019</option>
                                    </select>
                                </div>
                                <div class="col-4">
                                    <input type="text" class="form-control" v-model="phone2" />
                                </div>
                                <div class="col-4">
                                    <input type="text" class="form-control" v-model="phone3" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="request" class="row mb-4">
                        <div class="col-12">
                            <label for="store-request" class="col-form-label">주문 시 요청사항 (가게)</label>
                        </div>
                        <div class="col-12">
                            <input id="store-request" type="text" class="form-control" placeholder="가게 요청사항 입력"
                                v-model="state.form.storeRequest">
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <label for="rider-request" class="col-form-label">주문 시 요청사항 (라이더)</label>
                        </div>
                        <div class="col-12">
                            <input id="rider-request" type="text" class="form-control" placeholder="라이더 요청사항 입력"
                                v-model="state.form.riderRequest">
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <label class="col-form-label">결제 수단 선택</label>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input id="card" class="form-check-input" type="radio" value="CARD"
                                    v-model="state.form.payment">
                                <label class="form-check-label" for="card">카드 결제</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input id="bank" class="form-check-input" type="radio" value="BANK"
                                    v-model="state.form.payment">
                                <label class="form-check-label" for="bank">무통장 입금</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input id="on-site" class="form-check-input" type="radio" value="ON_SITE"
                                    v-model="state.form.payment">
                                <label class="form-check-label" for="on-site">현장 결제(포장)</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 d-flex flex-column p-4">
                    <div id="sheet" class="row border rounded p-4 mb-2">
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <span>주문표</span>
                        </div>
                        <div v-if="state.carts.length > 0">
                            <div v-for="(item, idx) in state.carts" :key="item.id">
                                <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>{{ item.name }}</span>
                                        <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div class="row">
                                            <span>　</span>
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn-basic btn-quantity"
                                                @click="decreaseQuantity(idx)">-</button>
                                            <span class="p-3">{{ item.quantity }}</span>
                                            <button type="button" class="btn btn-basic btn-quantity"
                                                @click="increaseQuantity(idx)">+</button>
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn-basic btn-submit"
                                                @click="deleteItem(item.id)">X</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            메뉴를 선택해주세요.
                        </div>
                        <div class="text-end border-top pt-2 mt-2">
                            {{ totalPrice.toLocaleString() }}원
                        </div>
                    </div>
                    <p class="all-agree">
                        <label class="custom-checkbox">
                            <input type="checkbox" v-model="state.form.agree" />
                            <span>
                                이용약관, 개인정보 수집 및 애용, 개인정보 제 3자 제공, 전자금융거래 이용약관, 만 14세 이상 이용자 내용 확인하였으며 결제에 동의합니다.
                            </span>
                        </label>
                    </p>
                    <button type="submit" class="btn btn-basic btn-submit">결제하기</button>
                </div>
            </form>
        </div>
    </div>
    <div class="last"></div>
    <!-- 공통 알림 모달 -->
    <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">알림</h5>
                </div>
                <div class="modal-body" id="alertModalBody">내용</div>
                <div class="modal-footer">
                    <button type="button" class="btn " data-bs-dismiss="modal">
                        확인
                    </button>
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
    font-weight: 800;
}

.cart-empty-wrapper {
    max-width: 1024px;
    margin: 50px auto;
    padding: 20px;
}

.top-row {
    display: flex;
    justify-content: space-between;
    column-gap: 100px;
    margin-bottom: 60px;
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
    margin-left: 10px;
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
    font-weight: bold;
    color: #FF6666;
}

.arrow {
    font-size: 16px;
}

input,
select {
    height: 50px;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    vertical-align: middle;
}

.form-control:focus {
    box-shadow: none;
    border: 2px solid #000;
}

input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #7d7d7d;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    margin-right: 8px;
    background-color: white;
}

input[type="radio"]:checked {
    background-color: #fff;
    border-color: #ff6666;
}

input[type="radio"]:checked::after {
    content: "";
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background-color: #ff6666;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #7d7d7d;
    position: relative;
    cursor: pointer;
    vertical-align: middle;

    &:checked {
        background-color: #ff6666;
        border-color: #ff6666;
    }

    &:checked::after {
        content: "V";
        color: white;
        font-size: 12px;
        position: absolute;
        left: 3px;
        top: 0.5px;
    }
}

.btn-basic {
    background-color: white;
    border-width: 1px;
    border-style: solid;
    font-family: 'BMJUA';
    letter-spacing: 1px;
    line-height: 1.2;

    &.btn-submit {
        border-color: #ff6666;
        color: #ff6666;
    }

    &.btn-quantity {
        border-color: #000;
        color: #000;
    }

    &:hover {
        background-color: #ffe5e5;
    }
}

#request {
    margin-top: 30px;
}

#sheet {
    margin-top: -25px;
}
</style>
