<script setup>
import { computed, ref , reactive, onMounted, inject } from 'vue';
import { useOwnerStore, useUserInfo } from '@/stores/account'
import { useReviewStore } from '@/stores/review';
import defaultUserProfile from "@/imgs/owner/user_profile.jpg"
import ReviewCard from '@/components/owner/ReviewCard.vue';
import { getReviewsByStoreId } from '@/services/reviewServices';

//가게정보가져오기 
const ownerStore = useOwnerStore();

// 리뷰 데이터 가져오기
// const reviewStore = useReviewStore();

const params = reactive({
    page : 1,
    rowPerPage : 6
})


const reviews = ref([])

const fetchReviews = async () => {
    try {
        const response = await getReviewsByStoreId(ownerStore.state.storeId, params);
        const ScoreResponse = await getReviewScoreByStoreId(ownerStore.state.storeId,{ "뭐넣어야하노" : "??"})
        reviews.value = response.data.resultData;
        console.log("통신결과:", reviews.value);
        console.log("별점결과 :", ScoreResponse);
    } catch (error) {
        console.error("리뷰 조회 에러:", error);
    }
};

//페이지네이션 total-lows
const row = 100;


// onMounted(async () => {
    
    // // 1. 유저 정보 먼저 불러오기
    // await userInfo.fetchStore();
    // console.log("유저정보: ", userId.value);

    // // storeId가 존재하는 경우에만 리뷰를 가져오기
    // await ownerStore.fetchStoreInfo();
    // console.log("스토어 아이디:", storeId.value);

    // if (storeId.value) {
    // // 리뷰 데이터를 가져오는 메서드 호출
    // await reviewStore.fetchReviews(storeId.value);
    // console.log("리뷰 데이터 구조:", reviewStore.reviews);
    // } else {
    // console.error('스토어 아이디가 없습니다.');
    // }

// });


// 전체 리뷰 수
const totalReviewCount = computed(() => reviews.length);

// 평균 리뷰 별점
// const avgReview = computed(() => {
// if (!reviewStore.reviews.length) return 0;

// const sum = reviewStore.reviews.reduce((acc, review) => acc + review.rating, 0);
// return (sum / reviewStore.reviews.length).toFixed(1);
// });

onMounted(()=> {
    fetchReviews();
})

</script>

<template>

    <div class="wrap" > 
        <div>
            <!-- 전체 토탈 카드 -->
            <div class="total-wrap">
                <div class="total-box">
                    <div class="circle"></div>
                    <div>
                        <span>{{ totalReviewCount || 0 }} </span>
                        <span>전체 리뷰 수</span>
                    </div>
                </div>
                
                <div class="total-box">
                    <div class="circle"></div>
                    <div>
                        <span>avgReview || 0 </span>
                        <span>평균 별점</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="review-header">
            <!-- 조회기간설정 카드 -->
            <div class="date-filter">
                <img src="/src/imgs/owner/Icon_조회기간설정.svg" alt="캘린더아이콘" title="캘린더아이콘">
                <div>
                    <span style="font-size: 20px;">조회 기간 설정</span>
                    <span style="font-size: 13px; color: #838383; font-weight: 200;">2025.07.01 ~ 2025.08.01</span>
                </div>
                <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" title="달력 열기" style="cursor: pointer;" @click="toggleDatePicker" />
                
                <!-- 달력 영역 -->
                <div v-if="showDatePicker" class="date-picker-popup">
                    <label>
                        시작일 <input type="date" v-model="startDate" />
                    </label>
                    <label>
                        종료일 <input type="date" v-model="endDate" />
                    </label>
                </div>
            </div>
        </div>

        <!-- 리뷰카드  -->
        <ReviewCard v-if="reviews.length" :reviews="reviews" />
    </div>

    <b-pagination v-model="params.page" :total-rows="row" :per-page="params.rowPerPage" aria-controls="my-table"></b-pagination>


</template>

<style lang="scss" scoped>
.owner-title1 {
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 2px;
}

.owner-title2 {
  color: #686868;
}

.wrap{
    background-color: #e8e8e8;
    font-family: 'Pretendard', sans-serif;
    width: 1500px;
    transform: translateX(13px);
    padding-bottom: 70px;
    .total-wrap{
        display: flex;
        gap : 50px;
        margin-top: 15px;
        margin-bottom: -65px;
        .circle{
            background-color: #ff6666;
            border-radius: 100%;
            width: 85px;
            height: 85px;
            margin-left: 65px;
            margin-right: 30px; 
        }
        .total-box{
            align-items: center;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 2px 2px 5px 1px  #c6c6c6;
            display: flex;
            height: 137px;
            width: 337px;
            :last-child{ display: block; }
            span:nth-of-type(1){
                line-height: 1;
                font-size: 40px;
                font-weight: 800;
            }
        }
    }

    .review-header{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        margin-right: 45px;
    }

    .date-filter{
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 2px 2px 5px 1px  #c6c6c6;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 295px;
        height: 75px;
        padding: 15px 15px;

        div{
            span{
                display: block;
                margin-right: 10px;
                line-height: 1.5;
            }
        }
        img:last-child{
            width: 24px;
            height: 24px;
        }
    }
}

.date-filter {
  position: relative;

  .date-picker-popup {
    position: absolute;
    width: 100%;
    top: 93%;
    right: 0;
    z-index: 10;
    background: #fff;
    padding: 15px;
    margin-top: 8px;
    border-radius: 15px;
    box-shadow: 2px 2px 5px #ccc;
    display: flex;
    gap: 10px;
    justify-content: center;
    width: max-content;

    label {
      display: flex;
      flex-direction: column;
      font-size: 13px;
    }

    input[type="date"] {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  }


}

</style>