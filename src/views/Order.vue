<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateQuantity, removeItem } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';
import { useCartStore } from '@/stores/cart';

const router = useRouter();

const account = useAccountStore();
const carts = useCartStore();

const state = reactive({
    user: {},
    carts: [],
    form: {
        address: '',
        addressDetail: '',
        phone: '',
        storeRequest: '',
        riderRequest: '',
        payment: 'CARD',
        menuIds: []
    }
});

const phone1 = ref('010');
const phone2 = ref('');
const phone3 = ref('');

const totalPrice = ref(0);

onMounted(() => {
    if (!account.state.loggedIn) {
        alert('로그인 후 주문이 가능합니다.');
        router.push({ path: '/' });
        return;
    } else if (carts.state.items < 1) {
        alert('메뉴를 선택해주세요.');
        router.back();
        return;
    }

    state.carts = carts.state.items;
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
            alert(res.data.resultMessage);
            return;
        }

        state.carts[idx].quantity--;
        calculateTotal();
    }
}

const increaseQuantity = async idx => {
    const params = {
        cartId: state.carts[idx].id,
        quantity: state.carts[idx].quantity + 1
    }

    const res = await updateQuantity(params);

    if (res === undefined || res.data.resultStatus !== 200) {
        alert(res.data.resultMessage);
        return;
    }

    state.carts[idx].quantity++;
    calculateTotal();
}

const calculateTotal = () => {
    totalPrice.value = 0;

    state.carts.forEach(item => {
        const price = item.price * item.quantity;
        totalPrice.value += price;
    });
};

const submit = () => {
    if (state.form.address.trim().length === 0) {
        alert('주소를 입력해주세요.');
        return;
    } else if (state.form.addressDetial.trim().length === 0) {
        alert('전화번호를 입력해주세요.');
        return;
    } else if (phone2.value.trim().length === 0 || phone3.value.trim().length === 0) {
        alert('전화번호를 입력해주세요.');
        return;
    }

    
};
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
                    <div class="row">
                        <h4>배달 정보</h4>
                        <div class="mb-2">
                            <label for="address" class="form-label">주소</label>
                            <input id="address" type="text" class="form-control" placeholder="주소 입력" v-model="state.form.address">
                        </div>
                        <div class="mb-2">
                            <input id="address-detail" type="text" class="form-control" placeholder="상세주소 입력" v-model="state.form.addressDetail">
                        </div>
                        <div class="mb-2">
                            <label for="phone" class="form-label">전화번호</label>
                            <select class="form-control" v-model="phone1">
                                <option>010</option>
                                <option>016</option>
                                <option>017</option>
                                <option>018</option>
                                <option>019</option>
                            </select>
                            <input type="text" class="form-control" v-model="phone2" />
                            <input type="text" class="form-control" v-model="phone3" />
                        </div>
                        <div class="mb-2">
                            <label for="store-request" class="form-label">요청사항 (가게)</label>
                            <input id="store-request" type="text" class="form-control" placeholder="요청사항 입력" v-model="state.form.storeRequest">
                        </div>
                        <div class="mb-2">
                            <label for="rider-request" class="form-label">요청사항 (라이더)</label>
                            <input id="rider-request" type="text" class="form-control" placeholder="주소 입력" v-model="state.form.riderRequest">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">결제 수단 선택</label>
                            <div class="form-check">
                                <input id="card" class="form-check-input" type="radio" value="CARD" v-model="state.form.payment">
                                <label class="form-check-label" for="card">카드 결제</label>
                            </div>
                            <div class="form-check">
                                <input id="bank" class="form-check-input" type="radio" value="BANK" v-model="state.form.payment">
                                <label class="form-check-label" for="bank">무통장 입금</label>
                            </div>
                            <div class="form-check">
                                <input id="on-site" class="form-check-input" type="radio" value="ON_SITE" v-model="state.form.payment">
                                <label class="form-check-label" for="on-site">현장 결제(포장)</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 d-flex flex-column p-3">
                    <div class="row border rounded p-4 mb-2">
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <span>주문표</span>
                        </div>
                        <div v-if="state.carts.length > 0">
                            <div v-for="(item, idx) in state.carts" :key="item.id">
                                <div class="p-2" :class="{'border-top': idx !== 0}">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>{{ item.name }}</span>
                                        <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div class="row">
                                            <span>　</span>
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn-basic btn-quantity" @click="decreaseQuantity(idx)">-</button>
                                            <span class="p-3">{{ item.quantity }}</span>
                                            <button type="button" class="btn btn-basic btn-quantity" @click="increaseQuantity(idx)">+</button>
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn-basic btn-submit" @click="deleteCart(item.id)">X</button>
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
                    <button type="submit" class="btn btn-basic btn-submit">결제하기</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cart-empty-wrapper {
    max-width: 720px;
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
.form-floating {
    position: relative;
    width: 100%;

    input {
        width: 440px;
        padding: 0.75rem 1rem;
        border: 1px solid #7d7d7d;
        border-radius: 6px;
        font-size: 14px;
        letter-spacing: -0.5px;
    }

    label {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: #7d7d7d;
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
</style>