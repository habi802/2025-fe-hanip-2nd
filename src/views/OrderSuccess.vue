<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getStore } from '@/services/storeService';
import { useAccountStore } from '@/stores/account';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();

const account = useAccountStore();
const cart = useCartStore();

const state = reactive({
    store: {},
    carts: []
});

const totalPrice = ref(0);

onMounted(async () => {
    if (!account.state.loggedIn) {
        alert('이용할 수 없습니다.');
        router.push({ path: '/' });
        return;
    }

    const res = await getStore(route.params.id);

    if (res === undefined) {
        alert('조회 실패');
        router.push({ path: '/' });
        return;
    } else if (res.data.resultStatus !== 200) {
        alert(res.data.resultMessage);
        router.push({ path: '/' });
        return;
    }

    state.store = res.data.resultData;
    state.carts = cart.state.items;
    calculateTotal();
});

const calculateTotal = () => {
    totalPrice.value = 0;

    state.carts.forEach(item => {
        const price = item.price * item.quantity;
        totalPrice.value += price;
    });
};
</script>

<template>
    <div class="cart-empty-wrapper">
        <div class="top-row">
            <div class="header-row">
                <div class="div29">주문완료</div>
            </div>
            <div class="step-horizontal">
                <span class="step-text">01 음식선택</span>
                <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
                <span class="step-text">02 장바구니</span>
                <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
                <span class="step-text">03 주문/결제</span>
                <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png"></span>
                <span class="step-text current">04 주문완료</span>
            </div>
        </div>

        <div class="container">
            <div class="border rounded p-3 mb-3">
                <div class="row mb-2">
                    <div class="col-12">
                        <h5>주문 내역</h5>
                        <span>{{ state.store.name }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="store-image border rounded">
                            이것은 가게의 이미지다
                        </div>
                    </div>
                    <div class="col-8">
                        <div v-if="state.carts.length > 0">
                            <div v-for="(item, idx) in state.carts" :key="item.id">
                                <div class="p-2" :class="{'border-top': idx !== 0}">
                                    <div class="d-flex justify-content-between mb-2">
                                        <div class="row">
                                            <span>{{ item.name }}</span>
                                            <span>　</span>
                                        </div>
                                        <span>{{ item.quantity }}개</span>
                                        <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-end border-top pt-2 mt-2">
                            <span><strong>총 결제 금액 : </strong></span>
                            <span>{{ totalPrice.toLocaleString() }}원</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <h4>주문 처리 현황</h4>
                <div class="border rounded">

                </div>
            </div>

            <div>
                <h4>다른 가게 주문하기</h4>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
</style>