<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getStore } from '@/services/storeService';
import { getOneMenu } from '@/services/menuService';
import { getReviewsByStoreId } from '@/services/reviewServices';
import { getFavorite, addFavorite, deleteFavorite } from '@/services/favoriteService';
import { updateQuantity, removeItem, removeCart } from '@/services/cartService';
import { useAccountStore } from '@/stores/account';
import { useCartStore } from '@/stores/cart';
import Menu from '@/components/Menu.vue';
import Review from '@/components/Review.vue';

const route = useRoute();
const router = useRouter();

const account = useAccountStore();
const carts = useCartStore();

const state = reactive({
    store: {
        id: 0,
        name: '',
        address: '',
        imagePath: '',
    },
    menus: [],
    reviews: [],
    carts: [],
});

const totalPrice = ref(0);

const loadStore = async id => {
    const res = await getStore(id);

    if (res === undefined || res.data.resultStatus !== 200) {
        alert('조회 실패');
        router.push({ path: '/' });
        return;
    } else if (res.data.resultStatus !== 200) {
        alert(res.data.resultMessage);
        router.push({ path: '/' });
        return;
    }

    state.store = res.data.resultData;
    loadFavorite(id);
}

const loadFavorite = async id => {
    const res = await getFavorite(id);

    if (res === undefined || res.data.resultStatus !== 200) {
        alert('조회 실패');
        return;
    }

    state.store.favorite = res.data.resultData !== null ? true : false;
    loadMenus(id);
}

const loadMenus = async id => {
    const res = await getOneMenu(id);

    if (res === undefined) {
        alert('조회 실패');
        return;
    } else if (res.data.resultStatus !== 200) {
        alert(res.data.resultMessage);
        return;
    }

    state.menus = res.data.resultData;
    loadReviews(id);
}

const loadReviews = async id => {
    const res = await getReviewsByStoreId(id);

    if (res === undefined || res.data.resultStatus !== 200) {
        alert('조회 실패');
        return;
    }

    state.reviews = res.data.resultData;
    loadCarts(id);
}

const loadCarts = async id => {
    // 수정 예정 수정 예정 수정 예정
    const res = await removeCart();

    if (res === undefined || res.data.resultStatus !== 200) {
        //alert(res.data.resultMessage);
        return;
    }
    // 수정 예정 수정 예정 수정 예정
}

const toggleFavorite = async id => {
    const res = state.store.favorite ? await deleteFavorite(id) : await addFavorite({ storeId: id });

    if (res === undefined || res.data.resultStatus !== 200) {
        alert('수정 실패');
        return;
    }

    state.store.favorite = !state.store.favorite;
}

const addCart = item => {
    item.quantity = 1;
    state.carts.push(item);
    calculateTotal();
}

const decreaseQuantity = async idx => {
    if (state.carts[idx].quantity > 1) {
        const params = {
            cartId: state.carts[idx].id,
            quantity: state.carts[idx].quantity - 1
        }

        const res = await updateQuantity(params);

        if (res === undefined) {
            alert('수정 실패');
            return;
        } else if (res.data.resultStatus !== 200) {
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

    if (res === undefined) {
        alert('수정 실패');
        return;
    } else if (res.data.resultStatus !== 200) {
        alert(res.data.resultMessage);
        return;
    }

    state.carts[idx].quantity++;
    calculateTotal();
}

const deleteCart = async cartId => {
    const res = await removeItem(cartId);

    if (res === undefined || res.data.resultStatus !== 200) {
        alert('삭제 실패');
        return;
    }

    if (res.data.resultData === 1) {
        const deleteIdx = state.carts.findIndex(item => item.id === cartId);
        if (deleteIdx > -1) {
            state.carts.splice(deleteIdx, 1);
            calculateTotal();
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

const toOrder = () => {
    if (!account.state.loggedIn) {
        alert('로그인 후 주문이 가능합니다.');
        return;
    } else if (state.carts.length < 1) {
        alert('메뉴를 선택해주세요.');
        return;
    }

    carts.state.items = state.carts;
    router.push({ path: `/stores/${route.params.id}/order` });
}

onMounted(() => {
    const storeId = route.params.id;

    loadStore(storeId);
});
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 p-3">
                <div class="row border rounded p-3 mb-3">
                    <div class="col-6 col-md-4 mb-4">
                        <div class="store-image border rounded h-100">
                            이것은 가게의 이미지다
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-4">
                        <h3>{{ state.store.name }}</h3>
                        <p>최소 주문 금액 15,000원</p>
                        <p>배달료 0원 ~ 3,000원</p>
                        <span>⭐ 4.5(983) <span class="favorite" @click="toggleFavorite(state.store.id)">{{ state.store.favorite ? '❤️' : '♡' }}</span> 927</span>
                    </div>
                    <div class="col-12 col-md-4">
                        <div id="map" class="border rounded mb-2">
                            이것은 지도다
                        </div>
                        <span>{{ state.store.address }}</span>
                    </div>
                </div>

                <div class="menu-title rounded pt-2 ps-3">
                    <h3 class="mb-1">메뉴</h3>
                </div>
                <div class="pt-2 mb-3">
                    <div v-if="state.menus.length > 0">
                        <div v-for="item in state.menus" :key="item.id">
                            <Menu :item="item" @addCart="addCart" />
                        </div>
                    </div>
                    <div v-else>
                        메뉴 준비중입니다.
                    </div>
                </div>
                <div class="review-title pt-2 ps-3">
                    <h3 class="mb-1">리뷰</h3>
                </div>
                <div class="pt-2 mb-3">
                    <div v-if="state.reviews.length > 0">
                        <div v-for="item in state.reviews" :key="item.id">
                            <Review :item="item" />
                        </div>
                    </div>
                    <div v-else>
                        등록된 리뷰가 없습니다.
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-4 d-flex flex-column p-3">
                <div class="row border rounded p-4 mb-2">
                    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span>주문표</span>
                        <span>삭제</span>
                    </div>
                    <div v-if="state.carts.length > 0">
                        <div v-for="(item, idx) in state.carts" :key="item.id">
                            <div class="p-2" :class="{'border-top': idx !== 0}">
                                <div class="d-flex justify-content-between mb-2">
                                    <span>{{ item.name }}</span>
                                    <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <button type="button" class="btn btn-basic btn-quantity" @click="decreaseQuantity(idx)">-</button>
                                        <span class="p-3">{{ item.quantity }}</span>
                                        <button type="button" class="btn btn-basic btn-quantity" @click="increaseQuantity(idx)">+</button>
                                    </div>
                                    <div>
                                        <button type="button" class="btn btn-basic btn-submit" @click="deleteCart(item.id)">메뉴 취소</button>
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
                <button type="button" @click="toOrder()" class="btn btn-basic btn-submit">주문하기</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@font-face {
    font-family: 'BMJUA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

#map {
    height: 125px;
}

.favorite {
    cursor: pointer;
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

.menu-title {
    border: 1px solid #ff6666;
    font-family: 'BMJUA';
    letter-spacing: 1px;

    h3 {
        color: #ff6666;
    }
}

.review-title {
    border-bottom: 2px solid #000;
    font-family: 'BMJUA';
    letter-spacing: 1px;
}
</style>
