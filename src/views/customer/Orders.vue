<script setup>
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

import { reactive, ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getOrder, deleteOrderInCustomer } from '@/services/orderService';
import { addItem, getItem, removeCart } from '@/services/cartService';
import FlatPickr from "vue-flatpickr-component";
import OrderCard from '@/components/customer/OrderCard.vue';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import ReviewModal from '@/components/modal/ReviewModal.vue';

const router = useRouter();

const today = new Date();
const lastWeek = new Date();
const month1 = new Date();
const month3 = new Date();
lastWeek.setDate(today.getDate() - 7);
month1.setMonth(today.getMonth() - 1);
month3.setMonth(today.getMonth() - 3);

let defaultForm = {
    searchText: '',
    dateType: 'WEEK',
    startDate: lastWeek.toISOString().slice(0, 10),
    endDate: today.toISOString().slice(0, 10),
}

const state = reactive({
    orders: [],
    form: { ...defaultForm },
    page: 1,
    rowPerPage: 10,
    isFinish: false,
    isLoading: false,
});

// 날짜 입력칸 설정
const startDateConfig = {
    locale: Korean,
    dateFormat: 'Y-m-d',
    onChange: (date) => {
        // 선택한 시작일이 종료일보다 크면 자동으로 종료일을 시작일로 입력
        if (date[0] && state.form.endDate) {
            if (date[0] > new Date(state.form.endDate)) {
                state.form.endDate = date[0];
            }
        }
    }
}
const endDateConfig = {
    locale: Korean,
    dateFormat: 'Y-m-d',
    onChange: (date) => {
        // 선택한 종료일이 시작일보다 작으면 자동으로 시작일을 종료일로 입력
        if (date[0] && state.form.startDate) {
            if (date[0] < new Date(state.form.startDate)) {
                state.form.startDate = date[0];
            }
        }
    }
}

// 주문 조회
const getOrderList = async () => {
    state.isLoading = true;

    const res = await getOrder({
        searchText: state.form.searchText,
        startDate: state.form.startDate,
        endDate: state.form.endDate,
        page: state.page,
        rowPerPage: state.rowPerPage
    });

    if (res !== undefined && res.status === 200) {
        state.orders.push(...res.data.resultData);

        if (res.data.resultData.length < state.rowPerPage) {
            state.isFinish = true;
        } else {
            state.page = state.page + state.rowPerPage;
        }

        defaultForm = state.form;
    }

    state.isLoading = false;
};

// 스크롤 이벤트 감지(더보기를 실행할 건지 판단하기 위함)
const handleScroll = () => {
    if (state.isFinish || state.isLoading || parseInt(window.innerHeight + window.scrollY) + 300 <= window.document.documentElement.offsetHeight) {
        return;
    }

    getOrderList();
};

onMounted(() => {
    getOrderList();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const selectDateVisible = ref(false);

// 날짜 타입 변경 시 날짜를 변경하거나 날짜를 선택하는 칸을 보이게 함
watch(() => state.form.dateType, dateType => {
    switch (dateType.toUpperCase()) {
        case 'WEEK':
            state.form.startDate = lastWeek.toISOString().slice(0, 10);
            state.form.endDate = today.toISOString().slice(0, 10);
            selectDateVisible.value = false;
            break;
        case 'MONTH1':
            state.form.startDate = month1.toISOString().slice(0, 10);
            state.form.endDate = today.toISOString().slice(0, 10);
            selectDateVisible.value = false;
            break;
        case 'MONTH3':
            state.form.startDate = month3.toISOString().slice(0, 10);
            state.form.endDate = today.toISOString().slice(0, 10);
            selectDateVisible.value = false;
            break;
        default:
            selectDateVisible.value = true;
            break;
    }
});

// 날짜 변경 시 주문 목록과 페이지를 처음 상태로 되돌리고 주문 조회 함수 실행
watch(() => [state.form.startDate, state.form.endDate], () => {
    state.orders = [];
    state.page = 1;
    state.isFinish = false;
    getOrderList();
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

// 주문 삭제
const removeOrder = async order => {
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

// 화면 상단 이동
const arrow = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};


//리뷰용
const reviewModal = ref(null);

const openModal = (orderId, storeName, menuItems, getReview) => {


    states.orderOne.orderId = orderId;
    states.orderOne.storeName = storeName;
    states.orderOne.menuItems = menuItems
    states.orderOne.getReview = getReview;

    reviewModal.value.setMenuData(states.orderOne)
    const modalElement = reviewModal.value.$el;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    setTimeout(() => {
        if (reviewModal.value.swiperInstance) {
            reviewModal.value.swiperInstance.update(); // 기존 Swiper 업데이트
        }
    }, 50);
};

const states = reactive({
    orders: [],
    orderOne: {
        orderId: 0,
        storeName: "",
        getReview: 0,
        menuItems: []
    }
});


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
                    <input type="text" v-model="state.form.searchText" class="search-input"
                        placeholder="검색: 주문한 메뉴나 가게명으로 찾아볼 수 있어요" />
                </div>
                <button class="btn-search"
                    @click="state.orders = []; state.page = 1; state.isFinish = false; getOrderList();">검색</button>
            </div>

            <div class="sort-options">
                <input type="radio" id="week" v-model="state.form.dateType" value="WEEK">
                <label for="week">일주일</label>
                <span class="divider">|</span>
                <input type="radio" id="month1" v-model="state.form.dateType" value="MONTH1">
                <label for="month1">1개월</label>
                <span class="divider">|</span>
                <input type="radio" id="month3" v-model="state.form.dateType" value="MONTH3">
                <label for="month3">3개월</label>
                <span class="divider">|</span>
                <input type="radio" id="custom" v-model="state.form.dateType" value="SELECT_DATE">
                <label for="custom">기간 선택</label>
            </div>

            <div v-show="selectDateVisible" class="select-date">
                <FlatPickr class="select-date-input" v-model="state.form.startDate" :config="startDateConfig" />
                ~
                <FlatPickr class="select-date-input" v-model="state.form.endDate" :config="endDateConfig" />
            </div>

            <template v-if="state.orders.length > 0">
                <OrderCard v-for="order in state.orders" :key="order.orderId" :order="order" @delete-order="removeOrder"
                    @re-order="reOrder" @review="openModal" />
            </template>
            <template v-else>
                <div class="no-data">주문 내역이 없습니다.</div>
            </template>
        </div>
    </div>

    <ConfirmModal ref="confirmModalRef" />
    <ReviewModal ref="reviewModal"></ReviewModal>

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
    color: #6B6B6B;
}

.solid {
    margin-top: 70px;
    height: 2px;
    background: #000;
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
            border: 2px solid #FF6666;
            border-radius: 20px;
            text-align: center;

            &::placeholder {
                color: #FF6666;
            }
        }
    }

    .btn-search {
        height: 60px;
        width: 200px;
        background-color: #FF6666;
        color: #FFF;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background-color: darken(#FF6666, 5%);
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
    color: #FF7B7B;
}

.sort-options span {
    cursor: pointer;
}

.sort-options input[type="radio"] {
    display: none;
}

.sort-options input[type="radio"]:checked+label {
    color: #FF4C4C;
    font-weight: bold;
}

.sort-options .divider {
    color: #FFA5A5;
}

.sort-options .active {
    color: #FF4C4C;
}

.select-date {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    font-size: 18px;
    color: #FF7B7B;

    .select-date-input {
        border: 2px solid #FF6666;
        border-radius: 10px;
        text-align: center;
        color: #FF6666;
    }
}

.no-data {
    margin: 1rem 0;
    font-size: 22px;
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

<style lang="scss">
.flatpickr-day.selected {
    background-color: #FF6666;
    border-color: #FF7B7B;

    &:hover {
        background-color: #FF4C4C;
        border-color: #FF7B7B;
    }
}

.flatpickr-day.prevMonthDay.selected {
    background-color: #FF8989;
    border-color: #FF7B7B;
}

.flatpickr-day.nextMonthDay.selected {
    background-color: #FF8989;
    border-color: #FF7B7B;
}
</style>
