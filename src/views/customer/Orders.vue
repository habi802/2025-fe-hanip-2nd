<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getOrder, deleteOrderInCustomer } from '@/services/orderService';
import { addItem, getItem, removeCart } from '@/services/cartService';
import OrderAndReview from '@/components/customer/order/OrderCard.vue';
import ReviewModal from '@/components/customer/order/ReviewModal.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';

const router = useRouter();

const state = reactive({
    orders: [],
});

onMounted(async () => {
    const res = await getOrder({ page: 1, rowPerPage: 10 });
    if (res !== undefined && res.status === 200) {
        state.orders = res.data.resultData;
        console.log(state.orders);
    }
});

const confirmModalRef = ref(null);

// 재주문하기
const reOrder = async menus => {
    let confirmCartRemove = false;

    const cartRes = await getItem();
    if (cartRes !== undefined && cartRes.status === 200) {
        const carts = cartRes.data.resultData;
        if (carts !== null && carts.length > 0) {
            const isConfirmed = await confirmModalRef.value.showModal('이미 장바구니에 메뉴가 담겨져 있습니다. 장바구니를 비우고 선택한 메뉴를 장바구니에 담으시겠습니까?');
            if (isConfirmed) {
                confirmCartRemove = true;
            }
        } else {
            confirmCartRemove = true;
        }

        if (confirmCartRemove) {
            const cartRemoveRes = await removeCart();
            if (cartRemoveRes !== undefined && cartRemoveRes.status === 200) {
                // 선택한 주문 내역의 메뉴가 장바구니에 다 담긴 후에 장바구니로 이동
                const promises = menus.map(menu => {
                    const optionId = [];
                    
                    menu.options.forEach(option => {
                        optionId.push(option.optionId);
                        optionId.push(option.children[0].optionId);
                    });

                    const params = {
                        menuId: menu.menuId,
                        optionId,
                        quantity: menu.quantity,
                    };

                    return addItem(params);
                });

                await Promise.all(promises);

                router.push({ path: '/cart' });
            }
        }
    }
};

// 리뷰 등록 및 수정 모달 창 열기
const reviewModalRef = ref(null);

const editReview = id => {
    reviewModalRef.value.openReview(id);
};

// 주문 삭제
const removeOrder = async order => {
    console.log(order);

    const isConfirmed = await confirmModalRef.value.showModal('주문 내역을 삭제하시겠습니까?');
    if (isConfirmed) {
        const res = await deleteOrderInCustomer(order.orderId);
        if (res !== undefined && res.status === 200) {
            const deleteIdx = state.orders.findIndex(item => item.orderId === order.orderId);
            if (deleteIdx > -1) {
                state.orders.splice(deleteIdx, 1);
            }
        }
    }
};

// 더보기 처리
// const allBoxHeight = ref(1570);
// const length = ref(state.orders.length);
// const heightY = () => {
//   allBoxHeight.value += 890;
// };

const visibleCount = ref(3);
const showMore = () => {
    visibleCount.value += 2;
};

const visibleCards = computed(() => {
    return state.orders.slice(0, visibleCount.value);
});

// 화면 상단 이동
const arrow = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
</script>

<template>
    <div class="order-wrapper">
        <div class="order-header">
            <div>
                <h2>주문 내역</h2>
                <div class="order-notice">주문 변경 시 해당 가게나 고객 센터로 문의 바랍니다.</div>
                <div class="solid"></div>
            </div>
        </div>

        <div class="container">
            <div class="search-wrapper">
                <div class="search-bar">
                    <img class="search-icon" src="/src/imgs/fluent_search.png" alt="검색" />
                    <input type="text" class="search-input" placeholder="검색: 주문한 메뉴나 가게명으로 찾아볼 수 있어요" />
                </div>
                <button class="btn-search">검색</button>
            </div>

            <div class="sort-options">
                <input type="radio" id="week" name="date" checked>
                <label for="week">일주일</label>
                <span class="divider">|</span>
                <input type="radio" id="month1" name="date">
                <label for="month1">1개월</label>
                <span class="divider">|</span>
                <input type="radio" id="month3" name="date">
                <label for="month3">3개월</label>
                <span class="divider">|</span>
                <input type="radio" id="custom" name="date">
                <label for="custom">기간 선택</label>
            </div>

            <order-and-review v-for="order in state.orders" :key="order.orderId" :order="order"
                @delete-order="removeOrder" @edit-order="editReview" @re-order="reOrder" />

            <div v-if="state.orders.length > 0">
                <div id="btnB" v-if="visibleCount < state.orders.length" class="btn" @click="showMore">더보기</div>
            </div>
        </div>
    </div>

    <ReviewModal ref="ReviewModalRef" />

    <ConfirmModal ref="confirmModalRef" />

    <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
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

    h2 {
        margin: 0;
        font-size: 30px;
        font-weight: 500;
        padding-top: 6px;
    }
}

.order-notice {
    position: absolute;
    right: 0;
    top: 70px;
    font-size: 16px;
    color: #6b6b6b;
}

.solid {
    margin-top: 70px;
    height: 2px;
    background: #000000;
}

.container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;

    .search-bar {
        width: 100%;
        margin-right: 20px;

        .search-icon {
            position: absolute;
            left: 30px;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 30px;
            pointer-events: none;
        }

        .search-input {
            width: 100%;
            height: 60px;
            padding: 0.75rem 1rem 0.75rem 50px;
            border: 2px solid #ff6666;
            border-radius: 20px;
            text-align: center;

            &::placeholder {
                color: #ff6666;
            }
        }
    }

    .btn-search {
        height: 60px;
        width: 200px;
        background-color: #ff6666;
        color: #fff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: darken(#ff6666, 5%);
        }
    }
}

.sort-options {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    font-size: 18px;
    color: #ff7b7b;
}

.sort-options span {
    cursor: pointer;
}

.sort-options input[type="radio"] {
    display: none;
}

.sort-options input[type="radio"]:checked + label {
color: #ff4c4c;
font-weight: bold;
}

.sort-options .divider {
    color: #ffa5a5;
}

.sort-options .active {
    color: #ff4c4c;
}

.btn-t {
    font-family: 'BMJUA';
    font-size: 1em;
    text-align: center;
    background-color: #fff;
    color: #ff6666;
    width: 520px;
    height: 40px;
    outline: none;
    box-shadow: none;
    border: #ff6666 2px solid;
    margin-left: 125px;
    margin-top: 10px;
    border-radius: 8px;

    &:active {
        background-color: #ff6666;
        border: #ff6666 2px solid;
    }
}

.arrow {
    position: sticky;
    width: 3.8%;
    bottom: 100px;
    left: 93%;
    z-index: 999;
    margin-bottom: 100px;

    &:hover {
        opacity: 80%;
    }
}
</style>
