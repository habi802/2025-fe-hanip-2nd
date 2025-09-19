<script setup>
import { ref } from 'vue';
import defaultImage from '@/imgs/owner/owner-service3.png'


import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';





// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
    selected.value = index + 1;
};
</script>

<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="header">
                    <div class="header-text">리뷰수정</div>
                </div>
                <hr>
                </hr>

                <div class="store-name">동성로 떡볶이</div>

                <div class="body-top">
                    <div class="stars-box">
                        <div id="star-fill" v-for="(star, index) in stars" :key="index"
                            :class="{ filled: index < selected }" @click="selectStar(index)">
                            ★
                        </div>
                    </div>
                    <div class="text-num"> n점</div>
                </div>

                <div class="box-body-img-box">

                    <swiper :slides-per-view="3" :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
                        :speed="1000" :space-between="170" :resistance="false" :resistance-ratio="0"
                        :allowSlidePrev="false">
                        <swiper-slide>
                            <div class="review-image border">
                                <img class="reviewImg" src="/src/imgs/pasta.png" alt="이미지" />
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="review-image border">
                                <img class="reviewImg" src="/src/imgs/pasta.png" alt="이미지" />
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="review-image border">
                                <img class="reviewImg" src="/src/imgs/pasta.png" alt="이미지" />
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="review-image border">
                                <img class="reviewImg" src="/src/imgs/pasta.png" alt="이미지" />
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="review-image border">
                                <img class="reviewImg" src="/src/imgs/pasta.png" alt="이미지" />
                            </div>
                        </swiper-slide>
                    </swiper>



                </div>
                <div class="body-bottom">
                    <textarea class="review-text" spellcheck="false" placeholder="리뷰를 작성해주세요"></textarea>


                </div>

                <div class="menu-box">
                    <div class="menu-title">주문메뉴</div>
                </div>
                <div class="menus">
                    <!-- 메뉴들 v-for -->
                    <span class="menu-name">메뉴명1</span>
                    <span class="menu-name">메뉴명2</span>
                    <span class="menu-name">얼큰한 닭도리탕</span>
                    <span class="menu-name">안얼큰한 곱도리탕</span>
                    <span class="menu-name">안 얼큰한 닭도리탕</span>

                </div>

                <div class="footer">
                    <div class="footer-btn">
                        <button type="button" class="hn-btn-gray" data-bs-dismiss="modal">돌아가기</button>
                        <button type="button" class="hn-btn-gray">리뷰등록</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@font-face {
    font-family: 'Binggre';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Binggrae.woff') format('woff');
    font-weight: normal;
    font-display: swap;
}

.modal-content {
    padding: 30px;
}

.header {
    display: flex;
    justify-content: center;
    font-size: 1.5em;
    font-weight: 300;
    margin-bottom: 10px;
}

.body-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.store-name {
    font-size: 1.5em;
    font-weight: 600;
    margin-top: 20px;
}

.stars-box {
    display: flex;
    justify-content: center;
}

#star-fill {
    font-family: 'Binggre';
    font-size: 3em;
    color: #ccc;
    margin-left: 2px;
    letter-spacing: 7px;
    cursor: pointer;
}

.text-num {
    font-size: 1.8em;
    letter-spacing: 7px;
}

.filled {
    color: #FFF464 !important;
}



.review-image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;

    .reviewImg {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.body-bottom {
    margin-top: 10px;
    width: 100%;
    min-height: 200px;
    border: #ccc 1px solid;
    border-radius: 5px;
}

.review-text {
    border: none;
    width: 100%;
    min-height: 200px;
    padding: 20px;
    outline: none;
    resize: none;
}

.menu-title {
    font-size: 1em;
    font-weight: 600;
    padding: 30px 0px 10px 0px;
}

.menu-name {
    padding: 0px 30px 0px 0px;
    color: #888;
}

.footer {
    display: flex;
    justify-content: center;
    width: 100%;
}

.footer-btn {
    display: flex;
    justify-content: space-around;
    padding: 15px;
    width: 80%;
    margin-top: 40px;
}

.hn-btn-gray {
    padding: 10px 40px 10px 40px;
}
</style>