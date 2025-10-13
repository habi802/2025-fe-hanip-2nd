<script setup>
import { computed, ref , reactive, onMounted, inject, watch } from 'vue';
import { useOwnerStore, useUserInfo } from '@/stores/account'
import { useReviewStore } from '@/stores/review';
import defaultUserProfile from "@/imgs/owner/user_profile.jpg"
import ReviewCard from '@/components/owner/ReviewCard.vue';
import { getReviewsByStoreId  } from '@/services/reviewServices.js';
import { getReviewsAllByStoreId2 } from '@/services/reviewServices.js';
import ReviewDateFilter from '@/components/owner/ReviewDateFilter.vue';

//가게정보가져오기 
const ownerStore = useOwnerStore();

const params = reactive({
    page : 1,
    rowPerPage : 6
})

const reviews = ref([])
const allReview = ref([])
const fetchReviews = async () => {
    try {        
        const allReviewRes = await getReviewsAllByStoreId2(ownerStore.state.storeId);
        allReview.value = allReviewRes.data.resultData
        console.log("전체리뷰", allReview)
        
        const prams = { rowPerPage: 300, page: 1, };
        const response = await getReviewsByStoreId(ownerStore.state.storeId, params);
        reviews.value = response.data.resultData;
        console.log("통신결과:", reviews.value);

    } catch (error) {
        console.error("리뷰 조회 에러:", error);
    }
};

//페이지네이션 total-lows 
const row = computed(()=> allReview.value.length || 1 ) ;

// 감시: 페이지네이션 값 변경 시 be자료호출
watch(() => [params.page, params.rowPerPage], fetchReviews, { immediate: true });


// onMounted(async () => {
//     if (storeId.value) {
//     // 리뷰 데이터를 가져오는 메서드 호출
//     await reviewStore.fetchReviews(storeId.value);
//     console.log("리뷰 데이터 구조:", reviewStore.reviews);
//     } else {
//     console.error('스토어 아이디가 없습니다.');
//     }
// });


// 전체 리뷰 수
const totalReviewCount = computed(() => allReview.value.length);

//리뷰별표시
// const averageScore = computed(() => {
//   const reviews = reviewStore.reviews;
//   if (!reviews || reviews.length === 0) return 0;
//   const total = reviews.reduce((sum, review) => sum + review.rating, 0);
//   return (total / reviews.length).toFixed(1);
// });
// console.log("별점평균 : ", averageScore);
// const ratingToPercent = computed(() => averageScore.value * 20); // 4.5 -> 90%

// 평균 리뷰 별점
const avgReview = computed(() => {
if (!allReview.value.length) return 0;

const sum = allReview.value.reduce((acc, review) => acc + review.rating, 0);
return (sum / allReview.value.length).toFixed(1);
});

onMounted(async()=> {
    fetchReviews();

})



// 별 아이콘 컴포넌트 정의
const StarIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="star-icon">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
    `,
};


</script>

<template>
    <template v-if="reviews && reviews.length > 0">
        <div class="wrap" > 
                <!-- 조회기간설정 카드 :추후 구현 -->
                <ReviewDateFilter></ReviewDateFilter>
                <!-- 전체 토탈 카드 -->
                <div class="total-wrap">
                    <div class="white-card total-box">
                        <span>전체 리뷰 수</span>
                        <span>{{ totalReviewCount || 0 }} </span>
                    </div>
                    <div class="white-card total-box">
                        <span>평균 별점</span>
                        <span>{{avgReview || 0}} </span>
                    </div>
                </div>
            <!-- 리뷰카드  -->
            <div class="review-wrap">
                <ReviewCard v-if="reviews.length"  :key="params.page"  :reviews="reviews" />
            </div>
        </div>

        <b-pagination v-model="params.page" :total-rows="row" :per-page="params.rowPerPage" aria-controls="my-table"></b-pagination>
    </template>

    <template v-else >
        <div style="height: 100%; display:flex; justify-content:center; align-items:center">
        등록된 리뷰가 없습니다.
        </div>
    </template>

</template>
<style lang="scss" scoped>
.wrap{
    width: 95%;
    display: flex;
    flex-direction: column;
    gap : 20px;

    .total-wrap{
        display: flex;
        gap : 20px;
        margin-bottom: 20px;
        .total-box{
            width: 280px;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            :last-child{
                display: flex;
                gap: 20px ;
                align-items: center;
            }
            span:nth-of-type(2){
                line-height: 1;
                font-size: 40px;
                font-weight: 800;
            }
        }
    }

    .review-wrap{
        min-height: 75vh;
    }
}



</style>