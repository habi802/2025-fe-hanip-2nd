<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import defaultImage from '@/imgs/owner/owner-service3.png'

import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { saveReview } from '@/services/reviewServices';
import { getReviewOne } from '@/services/reviewServices';
import { putReview } from '@/services/reviewServices';




// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
    selected.value = index + 1;

    review.rating = selected.value;
    sandReview.value.rating = selected.value;
};

//한번 리셋
const resetModal = () => {
    sandReview.value = { orderId: 0, rating: 0, comment: "" };
    review.rating = 0;
    review.getReview = 0;
    files.image = [];
    selected.value = 0;
};

//데이터 넘겨받기
const setMenuData = (data) => {
    resetModal();
    review.orderId = data.orderId;
    review.storeName = data.storeName;
    review.menuItems = data.menuItems;
    review.getReview = data.getReview;
    console.log("데이터 뭐 넘어왔나요", data);
    console.log("모달에 오더아이디 잘 받아왔는지", review.orderId);
    console.log("모달에 스토어이름 잘 받아왔는지", review.storeName);
    console.log("모달에 메뉴들 잘 받아왔는지", review.menuItems);
    console.log("모달에 리뷰 잘 받아왔는지", review.getReview);
    sandReview.value.orderId = data.orderId;

    if (data.getReview > 0) {
        getReviewInfo(data.orderId);
    }
}

defineExpose({ setMenuData })


// 리뷰 있으면 받을거
const getReviewInfo = async (id) => {
    files.image = [];
    const res = await getReviewOne(id);

    const reviewInfo = res.data.resultData;
    console.log("적어놓은 리뷰 정보", reviewInfo);

    review.rating = reviewInfo.rating;
    selected.value = reviewInfo.rating;
    sandReview.value.comment = reviewInfo.comment;
    review.reviewId = reviewInfo.id;
    sandReview.value.rating = reviewInfo.rating;


    reviewInfo.pic.forEach(fileName => {
        files.image.push({
            file: null,
            preview: `${baseUrl.value}/images/Review/${reviewInfo.id}/${fileName}`
        })
    })
    console.log("원래 있던 사진들어갔나요?", files.image)

}

const baseUrl = ref(import.meta.env.VITE_BASE_URL);




// 리뷰 담는요옹
const files = reactive({
    image: []
})



const review = reactive({
    reviewId: 0,
    orderId: 0,
    storeName: "",
    rating: 0,
    comment: "",
    getReview: 0,
    menuItems: []
})

const sandReview = ref({
    orderId: 0,
    rating: 0,
    comment: "",
})

const emit = defineEmits(['reviewSaved']);

// 리뷰 보내는 formData
const sendFormData = async () => {


    // 리뷰를 수정하는 거라면!
    if (review.getReview > 0) {

        const formData = new FormData();

        for (const file of files.image) {
            if (file.file) {
                formData.append("pic", file.file);
            } else if (file.preview) {
                // 서버 사진 URL -> Blob -> File
                const res = await fetch(file.preview);
                const blob = await res.blob();
                const fileName = file.preview.split("/").pop();
                formData.append("pic", new File([blob], fileName, { type: blob.type }));
            }
        }

        formData.append("req", new Blob([JSON.stringify(sandReview.value)], { type: "application/json" }));

        console.log("이미지 뭐 들어가있니?", files.image)
        const res = await putReview(formData);
        console.log("수정용 호출!")
        window.location.reload();
        emit('reviewSaved', res);
        return;
    }





    const formData = new FormData();

    files.image.forEach(file => {
        if (file.file) {
            formData.append("pic", file.file);
        }
    })

    formData.append("req", new Blob([JSON.stringify(sandReview.value)], { type: "application/json" }));

    console.log("보내기 전에 체크하기", sandReview.value);

    const res = await saveReview(formData);
    window.location.reload();
    emit('reviewSaved', res);
}


//한글 단위로 쪼개기
const getJamoLength = (text) => {
    if (!text) return 0;
    return text.normalize('NFD').length;
};
// 단위 감지용
const currentLength = computed(() => getJamoLength(sandReview.comment));

const checkLength = (e) => {
    const text = e.target.value || ''; // undefined 방지
    let count = 0;
    let newText = '';

    for (const char of text) {
        const jamoCount = char.normalize('NFD').length;
        if (count + jamoCount > 200) break;
        count += jamoCount;
        newText += char;
    }

    e.target.value = newText;
    sandReview.comment = newText;
};

//가려진 인풋 이벤트 열게 해주는 것
const fileInput = ref(null);

const fileUpload = () => {
    fileInput.value.click();
}
const onFileChange = (e) => {

    const selectedFiles = Array.from(e.target.files);

    const currentCount = files.image.length;
    const newCount = selectedFiles.length;

    if (currentCount + newCount > 5) {
        const availableSlots = 5 - currentCount;
        selectedFiles.splice(availableSlots);
    }

    selectedFiles.forEach(file => {
        files.image.push({
            file,
            preview: URL.createObjectURL(file)
        })
    })

    console.log("사진 잘 들어가는지?", files.image)
};

//이미지 삭제
const removeImage = (index) => {

    files.image.splice(index, 1);
};

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

                <div class="top">
                    <img class="store-icon" src="/src/imgs/storeIcon.png"></img>
                    <div class="store-name">{{ review.storeName }}</div>
                </div>

                <div class="body-top">
                    <div class="stars-box">
                        <div id="star-fill" v-for="(star, index) in stars" :key="index"
                            :class="{ filled: index < selected }" @click="selectStar(index)">
                            ★
                        </div>
                    </div>
                </div>

                <div class="box-body-img-box">

                    <div v-if="files.image.length < 5" class="plus-img-box" @click="fileUpload">

                        <div> <input ref="fileInput" type="file" accept="image/*" multiple @change="onFileChange"
                                style="display: none;" />
                        </div>
                        <div class="file-plus">
                            <img class="cameraImg" src="/src/imgs/camera.png"></img>
                        </div>
                    </div>
                    <div class="war">이미지는 5개 까지만 추가 가능합니다.</div>
                    <swiper :slidesPerView="2" :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
                        :speed="1000" :spaceBetween="-10" :resistance="false" :resistanceRatio="0" :observer="true"
                        :observe-parents="true">

                        <swiper-slide v-for="(img, index) in files.image" :key="index">
                            <div>
                                <div class="review-image border">
                                    <img class="reviewImg " :src="img.preview" alt="preview" />
                                </div>
                                <div class="delete" @click="removeImage(index)">X</div>
                            </div>
                        </swiper-slide>
                    </swiper>

                </div>
                <div class="body-bottom">
                    <textarea class="review-text" v-model="sandReview.comment" spellcheck="false"
                        placeholder="리뷰를 작성해주세요" @input="checkLength"></textarea>
                </div>
                <div class="font-length">{{ getJamoLength(sandReview.comment) }}/200자</div>
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
                        <button type="button" class="hn-btn-gray"
                            :class="{ noneClick: sandReview.comment.trim() === '' }" data-bs-dismiss="modal"
                            @click="sendFormData">{{ review.getReview > 0 ? "리뷰수정" : "리뷰등록" }}</button>
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

@font-face {
    font-family: 'Suit';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Thin.woff2') format('woff2');
    font-weight: 100;
    font-display: swap;
}

.swiper {
    margin-top: 10px;
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

.top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.store-icon {
    width: 30px;
    height: 30px;
    opacity: 30%;
}

.store-name {

    font-size: 1.5em;
    font-weight: 400;

}

.stars-box {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

#star-fill {
    font-family: 'Binggre';
    font-size: 2.5em;
    color: #ccc;
    margin-left: 2px;
    letter-spacing: 7px;
    cursor: pointer;
}

.text-num {
    font-size: 1.5em;
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
    font-size: 3em;
    font-weight: 100;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    border: #ccc 2px solid;
    color: #ccc;
}

.file-plus {
    display: flex;
    justify-content: center;
    align-items: center;
}

.cameraImg {
    width: 30px;
    opacity: 30%;
}

.war {
    margin-top: 10px;
    color: #ccc;
    font-size: 0.8em;
}

.delete {
    font-family: 'Suit';
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 6px;
    border: 1px #888 solid;
    top: 0px;
    left: 165px;
    top: 5px;
    cursor: pointer;
    background-color: #fff;
    color: #888;
    z-index: 99;
}

.noneClick {
    pointer-events: none;
}

.font-length {
    display: flex;
    justify-content: end;
    margin-top: 10px;
}
</style>