<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { reactive, onMounted, nextTick, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStoreList } from '@/services/storeService';
import StoreList from '@/components/customer/StoreList.vue';

const route = useRoute();
const router = useRouter();

const state = reactive({
    stores: [],
});
const stores = ref([]);

// 쿼리에서 검색어 추출
const query = ref(route.query.search_text || '');
const result = ref([]);

const searchText = async (search_text) => {
    try {
        const params = { search_text };
        const res = await getStoreList({ page: 0, size: 10 });

        result.value = res.data.resultData || [];
        state.stores = result.value;
    } catch (error) {
        console.error('에러 발생:', error);
        result.value = [];
        state.stores = [];
    }
};

const name = reactive({
    text: '전체',
});

onMounted(() => {
    searchText(query.value);
    nextTick(() => {
        if (query.value) {
            name.text = query.value;
        }
        const text = router.currentRoute.value.query.section;
        switch (text) {
            case 'korean':
                searchKoreanFood();
                break;
            case 'china':
                searchChina();
                break;
            case 'japan':
                searchJapanese();
                break;
            case 'pasta':
                searchWesternFood();
                break;
            case 'cafe':
                searchDessert();
                break;
            case 'snack':
                searchSnackFood();
                break;
            case 'fast':
                searchFastFood();
                break;
            case 'asian':
                searchAsian();
                break;
            case 'chicken':
                searchChick();
                break;
            case 'pizza':
                searchPizza();
                break;
            case 'night':
                searchLateNight();
                break;
            default:
                if (query.value) {
                    return;
                }
                findAll({});
        }
    });
});

// 카테고리 필터
// 전체 찾기
const searchAll = () => {
    findAll();
    name.text = '전체';
};
// 한식 찾기
const searchKoreanFood = () => {
    const searchCategory = {
        category: '한식',
    };
    name.text = '한식';
    findAll(searchCategory);
};
// 중식 찾기
const searchChina = () => {
    const searchCategory = {
        category: '중식',
    };
    name.text = '중식';
    findAll(searchCategory);
};
// 일식 찾기
const searchJapanese = () => {
    const searchCategory = {
        category: '일식',
    };
    name.text = '일식';
    findAll(searchCategory);
};
// 양식 찾기
const searchWesternFood = () => {
    const searchCategory = {
        category: '양식',
    };
    name.text = '양식';
    findAll(searchCategory);
};
// 디저트 찾기
const searchDessert = () => {
    const searchCategory = {
        category: '카페',
    };
    name.text = '카페/디저트';
    findAll(searchCategory);
};
// 분식 찾기
const searchSnackFood = () => {
    const searchCategory = {
        category: '분식',
    };
    name.text = '분식';
    findAll(searchCategory);
};
// 패스트푸드 찾기
const searchFastFood = () => {
    const searchCategory = {
        category: '패스트푸드',
    };
    name.text = '패스트푸드';
    findAll(searchCategory);
};
// 아시안 푸드 찾기
const searchAsian = () => {
    const searchCategory = {
        category: '아시안',
    };
    name.text = '아시안';
    findAll(searchCategory);
};
// 치킨 찾기
const searchChick = () => {
    const searchCategory = {
        category: '치킨',
    };
    name.text = '치킨';
    findAll(searchCategory);
};
// 피자 찾기
const searchPizza = () => {
    const searchCategory = {
        category: '피자',
    };
    name.text = '피자';
    findAll(searchCategory);
};
// 야식 찾기
const searchLateNight = () => {
    const searchCategory = {
        category: '야식',
    };
    name.text = '야식';
    findAll(searchCategory);
};

const findAll = async (params) => {
    const res = await getStoreList(params);
    state.stores = res.data.resultData || [];
};

const sortKey = ref('');
const sortOrder = ref('asc');

function setSort(key) {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
}

const arrow = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// 검색
const search = ref('');

const caLink = async () => {
    const res = await getStoreList({ searchText: search.value });
    state.stores = res.data.resultData;
    name.text = search.value;
};

</script>

<template>
    <div class="categorys">
        <div class="categorySwipe">
            <div class="swiperLeft">
                <img class="left" src="/src/imgs/NavigationLeft.png" />
            </div>
            <swiper :navigation="{ nextEl: '.swiperRight', prevEl: '.swiperLeft' }" :slides-per-view="6"
                :modules="[ Navigation, Pagination, Scrollbar, A11y, Autoplay ]" :speed="100" :loop="true">
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchAll" id="cImg" src="/src/imgs/allImg.png" alt="allImg" />
                    </div>
                    <div id="cName">전체</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchKoreanFood" id="cImg" src="/src/imgs/koreanfood.png" alt="koreanImg" />
                    </div>
                    <div id="cName">한식</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchChina" id="cImg" src="/src/imgs/jjajangmyeon.png" alt="ChinaImg" />
                    </div>
                    <div id="cName">중식</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchJapanese" id="cImg" src="/src/imgs/porkcutlet.png" alt="japanese" />
                    </div>
                    <div id="cName">일식</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchWesternFood" id="cImg" src="/src/imgs/pasta.png" alt="westernFood" />
                    </div>
                    <div id="cName">양식</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchDessert" id="cImg" src="/src/imgs/dessert.png" alt="dessert" />
                    </div>
                    <div id="cName">카페/디저트</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchSnackFood" id="cImg" src="/src/imgs/tteokbokki.png" alt="snackFood" />
                    </div>
                    <div id="cName">분식</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchFastFood" id="cImg" src="/src/imgs/hamburger.png" alt="fastFood" />
                    </div>
                    <div id="cName">패스트푸드</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchAsian" id="cImg" src="/src/imgs/nd.png" alt="asian" />
                    </div>
                    <div id="cName">아시안</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchChick" id="cImg" src="/src/imgs/chicken.png" alt="chick" />
                    </div>
                    <div id="cName">치킨</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchPizza" id="cImg" src="/src/imgs/pizza.png" alt="pizza" />
                    </div>
                    <div id="cName">피자</div>
                </swiper-slide>
                <swiper-slide>
                    <div class="imgBox">
                        <img @click="searchLateNight" id="cImg" src="/src/imgs/pigfeet.png" alt="lateNight" />
                    </div>
                    <div id="cName">야식</div>
                </swiper-slide>
            </swiper>
            <div class="swiperRight">
                <img class="right" src="/src/imgs/NavigationRight.png" />
            </div>
        </div>
    </div>
    <div class="searchBar">
        <input v-model="search" @keyup.enter="caLink" type="text" id="title" class="searchBox"
            placeholder="찾는 맛집 이름,메뉴가 무엇인가요?" />
        <img @click="caLink" class="searchImg" src="/src//imgs/fluent_search.png" />
    </div>
    <div class="sort-options">
        <span :class="{ active: sortKey === 'price' }" @click="setSort('price')">주문 금액 순</span>
        <span class="divider">|</span>
        <span class="sort-item" :class="{ active: sortKey === 'rating' }" @click="setSort('rating')">
            <span>별점순</span>
            <span class="arrow" aria-hidden="true">{{ sortKey === 'rating' ? (sortOrder === 'asc' ? '▲' : '▼') : '' }}</span>
        </span>
        <span class="divider">|</span>
        <span :class="{ active: sortKey === 'review' }" @click="setSort('review')">리뷰순</span>
    </div>
    <div class="card-list">
        <div class="card" v-for="store in stores" :key="store.id">
            <div class="card-img-wrapper">
                <img :src="store.imageUrl" alt="가게 이미지" class="card-img" />
                <div v-if="!store.isOpen" class="closed-overlay">영업 준비중 입니다</div>
            </div>

            <div class="card-body">
                <h3 class="card-title">{{ store.name }}</h3>
                <div class="card-meta">
                    <span class="rating">⭐ {{ store.rating }}</span>
                    <span class="review">({{ store.reviewCount }})</span>
                    <span class="like">❤️ {{ store.likeCount }}</span>
                </div>

                <p class="delivery">
                    배달료 {{ store.deliveryFeeMin }}원 ~ {{ store.deliveryFeeMax }}원
                </p>
                <p class="min-order">
                    최소 주문 금액 {{ formatPrice(store.minOrderPrice) }}원
                </p>

                <button class="detail-btn">자세히보기</button>
            </div>
        </div>
    </div>
    <div class="guideBox">
        <div class="position-relative" v-if="state.stores.length === 0">
            <img src="/src/imgs/owner/owner-service2.png" style="position: absolute; transform: translateX(540px)" />
        </div>
        <div v-for="store in state.stores" :key="store.storeId">
            <StoreList :stores="store" />
        </div>
    </div>

    <div class="footer"></div>
    <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
</template>

<style lang="scss" scoped>
@font-face {
    font-family: 'BMJUA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

* {
    font-family: 'BMJUA';
    letter-spacing: 1px;
}

.text {
    text-align: center;
    margin-top: 70px;
    font-size: 2.5em;
    color: #ff6666;
}

.categorys {
    display: flex;
    justify-content: center;
    margin-top: 60px;
    text-align: center;

    .categorySwipe {
        display: flex;
        justify-content: center;
        width: 1200px;

        .swiper-slide {
            width: 125px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .imgBox {
            width: 125px;
            border-radius: 50%;
            overflow: hidden;
        }

        #cImg {
            cursor: pointer;
            // width: 220px;
            width: 125px;
            object-fit: cover; // 이미지가 비율 유지
            border-radius: 50%;
            transition: transform 0.3s ease-in-out;

            &:hover {
                transform: scale(1.2); // 확대비율
            }
        }

        // 카테고리 이름
        #cName {
            font-size: 24px;
            padding-top: 10px;
            margin-left: -5px;
            font-weight: 400;
        }

        .left {
            width: 17px;
            height: 28px;
            margin-top: 50px;
            margin-right: 50px;
            border-radius: 5px;
        }

        .right {
            width: 17px;
            height: 28px;
            margin-top: 50px;
            margin-left: 50px;
            border-radius: 5px;
        }
    }
}

.line {
    width: 1280px;
    margin: 0 auto;
    margin-top: 30px;
}

.guideBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: 80px 10px;
    width: 1480px;
    height: 100%;
    margin: 0 auto;
    margin-top: 100px;
    background-color: #fff;
}

.footer {
    margin-bottom: 300px;
}

.imgBox {
    width: 125px;
    border-radius: 50%;
    overflow: hidden;
}

.arrow {
    position: sticky;
    width: 2.8%;
    bottom: 100px;
    left: 93%;
    z-index: 999;
    margin-bottom: 100px;

    &:hover {
        opacity: 80%;
    }
}

// 반응형
@media (max-width: 650px) {
    .searchBar {
        display: none;
    }
}

// 검색
.searchBar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px auto 0;
    padding: 0 20px;
    width: 600px;
    height: 70px;
    border: 3px solid #ff6666;
    border-radius: 50px;
    position: relative;
    background-color: white;

    input {
        padding-left: 43px;
    }

    input:focus {
        outline: none;
        box-shadow: none;
    }

    .searchImg {
        width: 30px;
        position: relative;
        right: 35px;
        bottom: 2px;
        cursor: pointer;
    }

    .searchBox {
        flex: 1;
        height: 100%;
        border: none;
        border-radius: 50px;
        padding-left: 20px;
        font-size: 1em;
        color: #333;
    }

    .searchBox::placeholder {
        color: #fcaeae;
    }
}

.searchBar::placeholder {
    color: #ff6666;
}

.searchBar::-moz-focus-inner {
    outline: none;
    box-shadow: none;
}

.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    width: 1200px;
    margin: 0 auto;
}

.card {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-img-wrapper {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.closed-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
}

.card-body {
    padding: 12px;
}

.card-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
}

.card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    margin-bottom: 6px;
}

.card-meta .like {
    color: red;
}

.delivery,
.min-order {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
}

.detail-btn {
    width: 100%;
    background: #ff6b6b;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 0;
    font-size: 14px;
    cursor: pointer;
}

.detail-btn:hover {
    background: #ff4c4c;
}

.sort-options {
    max-width: 1200px;
    margin: 20px auto;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-end;
    font-size: 18px;
    color: #ff7b7b;
}

.sort-options span {
    cursor: pointer;
}

.sort-options .divider {
    color: #ffa5a5;
}

.sort-options .active {
    font-weight: bold;
    color: #ff4c4c;
}

.sort-options .active::after {
    font-size: 10px;
    margin-left: 4px;
}
</style>
