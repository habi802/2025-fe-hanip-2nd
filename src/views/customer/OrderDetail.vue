<script setup>
import { onMounted, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { getOwnerOrder2 } from "@/services/orderService";

import defaultImage from "@/imgs/owner/haniplogo_sample2.png";

const route = useRoute();

const state = reactive({
    order: {},
});

const baseUrl = import.meta.env.VITE_BASE_URL;

// 가게 이미지
const storeImage = computed(() => {
    return state.order && state.order.storeImg && state.order.storeImg !== null
        ? `${baseUrl}/images/store/${state.order.storeId}/${state.order.storeImg}`
        : defaultImage;
});

onMounted(async () => {
    const res = await getOwnerOrder2(route.params.id);
    if (res !== undefined && res.status === 200) {
        console.log(res.data.resultData);
        state.order = res.data.resultData;
    }
});

// 주문 상태 확인
const status = computed(() => {
    switch (state.order?.status) {
        case "ORDERED":
            return { width: "3%", backgroundColor: "#FF6666" };
        case "PAID":
            return { width: "33%", backgroundColor: "#FF6666" };
        case "PREPARING":
            return { width: "82%", backgroundColor: "#FF6666" };
        case "DELIVERING":
            return { width: "185%", backgroundColor: "#FF6666" };
        case "COMPLETED":
            return { width: "100000%", backgroundColor: "#FF6666" };
    }
});

// 결제 수단
const getPayment = computed(() => {
    switch (state.order?.payment) {
        case 'NONE':
            return '-';
        case 'KAKAO_PAY':
            return '카카오페이';
        case 'NAVER_PAY':
            return '네이버페이';
    }
});
</script>

<template>
    <div class="order-wrapper">
        <div class="order-header">
            <h2>주문상세</h2>
            <div class="solid"></div>
        </div>

        <div class="container">
            <div class="mb-4">
                <h4 class="mb-3">주문 내역</h4>
                <div class="border rounded p-5">
                    <div class="store-name">{{ state.order.storeName }}</div>
                    <div class="order-box">
                        <div class="store-info col-4">
                            <div class="store-image">
                                <img class="storeImg" :src="storeImage" @error="(e) => (e.target.src = defaultImage)" />
                            </div>
                        </div>
                        <div class="order-info">
                            <div v-for="(menu, idx) in state.order.menuItems" :key="menu.menuId">
                                <div class="pt-3">
                                    <div class="d-flex justify-content-between mb-2">
                                        <div class="row">
                                            <span class="item-name">{{ menu.name }}</span>
                                        </div>
                                        <span>{{ menu.quantity }}개</span>
                                        <span class="item-price">{{ (menu.price * menu.quantity).toLocaleString() }}원</span>
                                    </div>
                                </div>
                                <template v-if="menu.options">
                                    <div v-for="option in menu.options" :key="option.optionId">
                                        <template v-if="option.children">
                                            <div class="item-option" v-if="option.children" v-for="(child, idx) in option.children" :key="child.optionId">
                                                <div class="item-option-comment">
                                                    <span v-if="idx === 0">{{ option.comment }}</span>
                                                </div>
                                                <div class="item-option-child">
                                                    <div class="d-flex justify-content-between">
                                                        <span>{{ child.comment }}</span>
                                                        <span>{{ child.price?.toLocaleString() }}원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                            
                            <!-- <div class="text-delivery">
                                <span>배달료</span>
                                <span>2,000원</span>
                            </div> -->

                            <div class="text-end pt-3">
                                <span>총 결제 금액 </span>
                                <span>{{ state.order.amount?.toLocaleString() }}원</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <h4 class="mb-3">주문 처리 현황</h4>
                <div class="border rounded p-5">
                    <div class="d-flex justify-content-between mb-2">
                        <div class="flex-fill">결제준비</div>
                        <div class="flex-fill">결제완료</div>
                        <div class="flex-fill">음식준비중</div>
                        <div class="flex-fill">배달중</div>
                        <div class="flex-fill">배달완료</div>
                    </div>
                    <div class="progress" style="height: 8px">
                        <div class="progress-bar" role="progressbar" :style="status"></div>
                        <div class="progress-bar" role="progressbar" style="width: 100%; background-color: #FFEADD"></div>
                    </div>
                </div>
            </div>

            <!-- <div class="mb-4">
                <h4 class="mb-3">주문 정보</h4>
                <div class="border rounded p-5">

                </div>
            </div> -->

            <div class="mb-4">
                <h4 class="mb-3">결재 내역</h4>
                <div class="border rounded p-5">
                    <div class="row mb-3">
                        <div class="col-3 text-muted">결제일시</div>
                        <div class="col">{{ state.order.payment !== 'NONE' ? '2025년 9월 21일 19:34:00' : '-' }}</div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-3 text-muted">결제 수단</div>
                        <div class="col">{{ getPayment }}</div>
                    </div>
                    <div class="row">
                        <div class="col-3 text-muted">결제 금액</div>
                        <div class="col">{{ state.order.payment !== 'NONE' ? state.order.amount?.toLocaleString() + '원' : '-' }}</div>
                    </div>
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

    h2 {
        margin: 0;
        font-size: 30px;
        font-weight: 500;
        padding-top: 6px;
    }
}

.order-steps {
    position: absolute;
    right: 0;
    top: 70px;
    font-size: 16px;
    color: #6b6b6b;

    .current {
        color: #ff6666;
        font-weight: 700;
    }
}

.solid {
    margin-top: 70px;
    height: 2px;
    background: #000000;
}

.container {
    max-width: 1060px;
}

.store-name {
    font-family: "BMJUA";
    font-size: 26px;
}

.order-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: 20px;

    .store-image {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        width: 260px;
        height: 200px;
        overflow: hidden;

        .storeImg {
            width: 260px;
            height: auto;
        }
    }
}

.item-name {
    font-size: 20px;
    width: 200px;
}

.item-price {
    font-size: 20px;
    width: 100px;
    text-align: end;
}

.item-option {
    color: #ccc;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
}

.item-option-comment {
    width: 53%;
}

.item-option-child {
    width: 47%;
}

.order-info {
    width: 80% !important;
    font-size: 18px;
}

.text-delivery {
    display: flex;
    justify-content: space-between;
    border: none !important;
    font-size: 16px;
    padding: 7px 0;
}

.text-end {
    display: flex;
    justify-content: space-between;
    border: none !important;
    font-size: 22px;
    padding: 7px 0;
}

.for {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 50px;
}

.store-info {
    display: flex;
}

.mb-4 {
    h4 {
        font-family: "BMJUA";
    }

    .status {
        font-family: "BMJUA";
    }
}
</style>
