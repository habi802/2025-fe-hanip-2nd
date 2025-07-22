<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getStore } from '@/services/storeService';
import Menu from '@/components/Menu.vue';
import Review from '@/components/Review.vue';

const route = useRoute();

const state = reactive({
    store: {
        id: 0,
        name: '',
        address: '',
        imagePath: '',
    },
    menus: [],
    reviews: [],
    carts: [
        {
            id: 1,
            name: '떡볶이',
            quantity: 1,
            price: 15000,
        },
        {
            id: 2,
            name: '곱도리탕',
            quantity: 1,
            price: 20000,
        }
    ],
});

const loadStore = async id => {
    const res = await getStore(id);

    if (res === undefined || res.data.resultStatus !== 200) {
        alert('조회 실패');
        return;
    }

    state.store = res.data.resultData; 
}

const loadMenus = async id => {
    // const res = await getStore(id);

    // if (res === undefined || res.data.resultStatus !== 200) {
    //     alert('조회 실패');
    //     return;
    // }

    // state.menus = res.data.resultData;
    state.menus = [
        {
            id: 1,
            name: '빅맥',
            comment: '맛있는 맥도날드 햄버거!',
            price: 20000,
            imagePath: ''
        },
        {
            id: 2,
            name: '밀크쉐이크',
            comment: '감자튀김을 찍어 드셔 보세요!',
            price: 6000,
            imagePath: ''
        }
    ];
}

const loadReviews = async id => {
    // const res = await getStore(id);

    // if (res === undefined || res.data.resultStatus !== 200) {
    //     alert('조회 실패');
    //     return;
    // }

    // state.reviews = res.data.resultData;
    state.reviews = [
        {
            name: '로날드',
            rating: 5.0,
            comment: '정말 맛있는 햄버거예요!',
            imagePath: '',
            ownerComment: '',
            created: '2025-07-20 20:44:37'
        },
        {
            name: '켄터키 후라이드',
            rating: 2.5,
            comment: '별롭니다.',
            imagePath: '',
            ownerComment: '저런.. 유감이네요ㅠ',
            created: '2025-07-21 12:31:04'
        }
    ];
}

const computedTotalPrice = computed(() => {
    const price = 20000;
    return price.toLocaleString() + '원';
});

onMounted(async () => {
    const storeId = route.params.id;

    loadStore(storeId);
    loadMenus(storeId);
    loadReviews(storeId);
});
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 p-4">
                <div class="row border rounded p-3">
                    <div class="col-6 col-md-4 mb-4">
                        <div class="store-image border rounded h-100">
                            이것은 가게의 이미지다
                        </div>
                    </div>
                    <div class="col-6 col-md-4 mb-4">
                        <h3>{{ state.store.name }}</h3>
                        <p>최소 주문 금액 15,000원</p>
                        <p>배달료 0원 ~ 3,000원</p>
                        <span>★ 4.5(983) ♥ 927</span>
                    </div>
                    <div class="col-12 col-md-4">
                        <div id="map" class="border rounded mb-2">
                            이것은 지도다
                        </div>
                        <span>{{ state.store.address }}</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4 p-4 d-flex flex-column">
                <div class="row border rounded p-4 mb-2">
                    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span>주문표</span>
                        <span>삭제</span>
                    </div>
                    <div v-if="state.carts.length > 0">
                        <div v-for="item in state.carts" :key="item.id">
                            <div class="d-flex justify-content-between mb-2">
                                <span>{{ item.name }}</span>
                                <span>{{ item.price.toLocaleString() }}원</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <span>{{ item.quantity }}</span>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-basic">메뉴 취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        메뉴를 선택해주세요.
                    </div>
                    <div class="text-end border-top pt-2 mt-2">
                        {{ computedTotalPrice }}
                    </div>
                </div>
                <button type="button" class="btn btn-basic">주문하기</button>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8">
                <div class="menu-title rounded pt-2 ps-3">
                    <h3 class="mb-1">메뉴</h3>
                </div>
                <div class="pt-2 mb-3">
                    <div v-if="state.menus.length > 0">
                        <div v-for="item in state.menus" :key="item.id">
                            <Menu :item="item" />
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
        </div>
    </div>
</template>

<style scoped>
@font-face {
    font-family: 'BMJUA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

#map {
    height: 125px;
}

.btn-basic {
    background-color: white;
    color: #ff6666;
    border: 1px solid #ff6666;
    font-family: 'BMJUA';
    letter-spacing: 1px;

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