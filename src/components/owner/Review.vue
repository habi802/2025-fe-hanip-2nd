<script setup>
import { computed, ref , reactive, onMounted, inject } from 'vue';
import { useOwnerStore, useUserInfo } from '@/stores/account'
import { useReviewStore } from '@/stores/review';
import defaultUserProfile from "@/imgs/owner/user_profile.jpg"

//상단 : 어서오세요! OOO사장님~~
const userInfo = useUserInfo();
//가게정보가져오기 
const ownerStore = useOwnerStore();
// 리뷰 데이터 가져오기
const reviewStore = useReviewStore();


const userName = computed(() => userInfo.userName);
const userId = computed(() => userInfo.userId);
const storeId = computed(() => ownerStore.storeId);

onMounted(async () => {
    
    // 1. 유저 정보 먼저 불러오기
    await userInfo.fetchStore();
    console.log("유저정보: ", userId.value);

    // storeId가 존재하는 경우에만 리뷰를 가져오기
    await ownerStore.fetchStoreInfo();
    console.log("스토어 아이디:", storeId.value);

    if (storeId.value) {
    // 리뷰 데이터를 가져오는 메서드 호출
    await reviewStore.fetchReviews(storeId.value);
    console.log("리뷰 데이터 구조:", reviewStore.reviews);
    } else {
    console.error('스토어 아이디가 없습니다.');
    }
});


//리뷰별표시
const averageScore = computed(() => {
  const reviews = reviewStore.reviews;
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
});
console.log("별점평균 : " , averageScore);
const ratingToPercent = computed(() => averageScore.value * 20); // 4.5 -> 90%

// 별 아이콘 컴포넌트 정의
const StarIcon = {
    template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="star-icon">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
    `
}



// 날짜 관련
const showDatePicker = ref(false);
const startDate = ref('2025-07-01');
const endDate = ref('2025-08-01');

const formattedDateRange = computed(() => {
  if (!startDate.value || !endDate.value) return '';
  const format = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };
  return `${format(startDate.value)} ~ ${format(endDate.value)}`;
});

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};


//----------사장 댓글 다는 부분------------
// 선택된 리뷰 저장용
const selectedReview = ref(null);

//댓글 상태
const ownerComment = ref(""); 

//-댓글 달 모달창-
const addReviewModal = ref(null);
const newdReview = reactive({
    comment: "",
});

// 모달 창 열기
const openAddReviewModal = (review) => {
  selectedReview.value = review;
  ownerComment.value = review.ownerComment || "";  // 기존 댓글 있으면 세팅
  const modal = new bootstrap.Modal(addReviewModal.value);
  modal.show();
};

// 사장이 단 댓글 삭제
const ownerReviewDelete = async (review) => {
    const confirmed = confirm("정말 사장 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    const success = await reviewStore.saveOwnerComment({
        reviewId: review.id,
        ownerComment: ""
    });

    if (!success) {
        alert("삭제 실패!");
        return;
    }

    alert("삭제되었습니다!");
};

// 등록하기
const submitReview = async () => {
  if (!selectedReview.value) return;

  const payload = {
    reviewId: selectedReview.value.id,
    ownerComment: ownerComment.value,
  };

  try {
    // 백엔드에 PATCH 또는 POST 요청 보내기
    await reviewStore.saveOwnerComment(payload);

    // 로컬 상태도 업데이트
    selectedReview.value.ownerComment = ownerComment.value;

    const modal = bootstrap.Modal.getInstance(addReviewModal.value);
    modal.hide();
    } catch (e) {
    console.error("댓글 저장 실패", e);
    }
};


// 유저 프로필 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
    return reviewStore.reviews && reviewStore.reviews.imagePath && reviewStore.reviews.imagePath !== 'null'
    ? `/pic/store-profile/${reviewStore.reviews.id}/${reviewStore.reviews.imagePath}`
    : defaultUserProfile;
})

// 유저 프로필 경로
const img = "`/pic/user-profile/${review.id}/${review.imagePath}`";

// 전체 리뷰 수
const totalReviewCount = computed(() => reviewStore.reviews.length);

// 평균 리뷰
const avgReview = computed(() => {
if (!reviewStore.reviews.length) return 0;

const sum = reviewStore.reviews.reduce((acc, review) => acc + review.rating, 0);
return (sum / reviewStore.reviews.length).toFixed(1);
});

// 날짜
const formatDateTime = (isoStr) => {
    return new Date(isoStr).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    });
};

// 사장 대표자 이름
const ownerName = inject("ownerName", "");
</script>

<template>
<div class="wrap" > 
    <div>
        <div class="owner-title1">리뷰 통계</div>
        <span class="owner-title2">어서오세요! {{ ownerName }} 사장님, 관리자 페이지에 다시 오신것을 환영합니다</span>
        
        <!-- 전체 토탈 카드 -->
        <div class="total-wrap">
            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ totalReviewCount }}</span>
                    <span>전체 리뷰 수</span>
                </div>
            </div>
            
            <div class="total-box">
                <div class="circle"></div>
                <div>
                    <span>{{ avgReview }}</span>
                    <span>평균 별점</span>
                </div>
            </div>
        </div>
    </div>



    
    <div class="review-header">
        <div>
            <div class="owner-title1">리뷰 내역</div>
            <div class="owner-title2">전체 리뷰 내역입니다.</div>
        </div>
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
    <div class="review-box-wrap">
        <div class="review-box shadow"  v-for="(review, index) in reviewStore.reviews" :key="index">
            <div class="profile">
                <div class="profile-circle">
                    <img :src="imgSrc" @error="e => e.target.src = defaultUserProfile" alt="프로필"/>
                </div>
                <div>
                    <span>{{  review.userName }}</span>
                    <span>{{  formatDateTime(review.created) }}</span> 
                </div>
            </div>
                <p>{{  review.comment }}</p>    

            <!-- 별점표시 -->
            <div class="review-score">
                <div class="star-ratings">
                    <!-- 채워진 별 -->
                    <div class="star-ratings-fill" :style="{ width: review.rating * 20 + '%' }">
                        <svg v-for="n in 5" :key="'fill' + n" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.22 9.402c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.975z"/>
                        </svg>
                    </div>

                    <!-- 기본 별 -->
                    <div class="star-ratings-base">
                        <svg v-for="n in 5" :key="'base' + n" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 
                            1 0 00.95.69h4.184c.969 0 1.371 1.24.588 
                            1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 
                            3.975c.3.921-.755 1.688-1.54 
                            1.118l-3.39-2.46a1 1 0 00-1.175 
                            0l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975a1 
                            1 0 00-.364-1.118L2.22 9.402c-.783-.57-.38-1.81.588-1.81h4.184a1 
                            1 0 00.95-.69l1.286-3.975z"/>
                        </svg>
                    </div>
                </div>
                <span class="score-text">{{ review.rating }}</span>
            </div>

            <div class="btn-wrap">
                <button class="btn btn-delete" @click = "ownerReviewDelete(review)" >리뷰 삭제</button>
                <button class="btn btn-comment" @click="openAddReviewModal(review)">댓글 작성</button>
            </div>
        </div>
    </div>


        <!-- 부트스트랩 모달 -->
    <div class="modal fade" ref="addReviewModal" tabindex="-1">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">답글 달기</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
            ></button>
            </div>
            <div class="modal-body">
            <textarea class="form-control"   v-model="ownerComment"  placeholder="답글을 입력하세요. 고객과의 소통은 매출상승의 지름길입니다!"  ></textarea>
            </div>
            <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal"> 취소</button>
            <button class="btn btn-comment" @click="submitReview">등록</button>
            </div>
        </div>
        </div>
    </div>

</div>


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
    width: 1501px;
    transform: translateX(13px);
    padding-bottom: 70px;
    .total-wrap{
        display: flex;
        gap : 50px;
        margin-top: 15px;
        margin-bottom: 40px;
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
        justify-content: space-between;
        margin-bottom: 10px;
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
        padding: 15px 15px ;
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

    .review-box-wrap{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(422px, 1fr));
        padding-top: 15px;
        gap: 20px;

        .review-box{
            background-color: #fff;
            border-radius: 15px;
            padding: 30px;
            font-size: 14px;
            .profile{
                align-items: center;
                display: flex;
                margin-bottom: 25px;
                .profile-circle{
                    background-color: #a3a3a3;
                    border-radius: 100%;
                    width: 48px;
                    height: 48px;
                }
                .profile-circle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }
                div:nth-of-type(2) {margin-left: 20px;}
                div:nth-of-type(2) > span{
                    display: block;
                    align-items: center;
                }
                span:nth-of-type(1){font-size: 24px;}
                    span:nth-of-type(2){
                        font-size: 15px;
                        color: #a3a3a3;
                    }
            }
            .btn-wrap{
                display: flex;
                justify-content: space-around;
                margin-top: 20px;
                width: 100%;

            }
            .btn{
                border-radius: 15px;
                border: #ff6666 solid;
                color: #ff6666;
                height: 55px;
                width: 145px;
            }
            .btn:hover{
                background-color:#ff6666;
                color: #fff;
            }
        }
    }
    
    
    .review-score{
        display: flex;
        align-items: center; /* 수직 정렬 가운데로 */
        gap: 8px;            /* 별과 숫자 간격 */
    }
    
    .star-ratings {
        position: relative;
        display: inline-block;
        width: 120px; /* 너비를 고정하면 퍼센트 연산이 더 정확 */
        height: 24px;
    }

    .star-ratings-base,
    .star-ratings-fill {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 100%;
    }

    .star-ratings-base {
        color: #dcdcdc;
        z-index: 0;
    }

    .star-ratings-fill {
        color: gold;
        overflow: hidden;
        z-index: 1;
    }

    .star-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
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

//   부트스트랩 모달 커스텀
.modal-header {

}

}

</style>