<script setup>
import { ref, reactive } from 'vue';
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

    review.rating = selected.value;
};

//데이터 넘겨받기
const setMenuData = (data) => {
    review.orderId = data.orderId;
    review.storeName = data.storeName;
    review.menuItems = data.menuItems;
    console.log("데이터 뭐 넘어왔나요", data);
    console.log("모달에 오더아이디 잘 받아왔는지", review.orderId);
    console.log("모달에 스토어이름 잘 받아왔는지", review.storeName);
    console.log("모달에 메뉴들 잘 받아왔는지", review.menuItems);
    sandReview.orderId = data.orderId;
}

defineExpose({ setMenuData })

// 리뷰 담는요옹
const files = reactive({
    image: []
})


const filesPlus = () => {

}

const review = reactive({
    orderId: 0,
    storeName: "",
    rating: 0,
    comment: "",
    menuItems: []
})

const sandReview = reactive({
    orderId: 0,
    rating: 0,
    comment: "",
})

// 리뷰 보내는 formData
const sendFormData = async () => {
    const formData = new FormData();

    files.image.forEach(file => {
        formData.append("pic", file);
    })

    formData.append("req", new Blob([JSON.stringify(sandReview)], { type: "application/json" }));

    console.log("보내기 전에 체크하기", sandReview);
}



</script>

<template>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="header">
                    <div class="header-text">리뷰</div>
                </div>
                <hr>
                </hr>

                <div class="store-name">{{ review.storeName }}</div>

                <div class="body-top">
                    <div class="stars-box">
                        <div id="star-fill" v-for="(star, index) in stars" :key="index"
                            :class="{ filled: index < selected }" @click="selectStar(index)">
                            ★
                        </div>
                    </div>
                    <div class="text-num"> {{ review.rating }}</div>
                </div>

                <div class="box-body-img-box">

                    <swiper :slidesPerView="3" :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
                        :speed="1000" :spaceBetween="170" :resistance="false" :resistanceRatio="0" :observer="true"
                        :observe-parents="true">
                        <swiper-slide>
                            <div>
                                <div v-if="files.image.length < 6" class="plus-img-box" @click="filesPlus">
                                    <div>
                                        +
                                    </div>
                                </div>
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
                        <swiper-slide>
                            <div class="review-image border">
                                <img class="reviewImg" src="/src/imgs/pasta.png" alt="이미지" />
                            </div>
                        </swiper-slide>
                    </swiper>



                </div>
                <div class="body-bottom">
                    <textarea class="review-text" v-modle="sandReview.comment" spellcheck="false"
                        placeholder="리뷰를 작성해주세요"></textarea>


                </div>

                <div class="menu-box">
                    <div class="menu-title">주문메뉴</div>
                </div>
                <div class="menus">
                    <!-- 메뉴들 v-for -->
                    <span class="menu-vfor" v-for="value in review.menuItems" :key="value.id">
                        <span class="menu-name">{{ value.menuName }}</span>
                    </span>

                </div>

                <div class="footer">
                    <div class="footer-btn">
                        <button type="button" class="hn-btn-gray" data-bs-dismiss="modal">돌아가기</button>
                        <button type="button" class="hn-btn-gray" @click="sendFormData">리뷰등록</button>
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

.swiper {
    width: 100%;
    height: auto;
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

.plus-img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4em;
    font-weight: 100;
    border-radius: 10px;
    width: 200px;
    height: 200px;
    border: #ccc 2px solid;
    color: #ccc;
}
</style>