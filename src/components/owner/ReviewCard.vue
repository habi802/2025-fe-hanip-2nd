<script setup>
import { computed, ref, reactive, onMounted, inject } from "vue";
import { useOwnerStore, useUserInfo } from "@/stores/account";
import { useReviewStore } from "@/stores/review";
import defaultUserProfile from "@/imgs/owner/user_profile.jpg";
import OwnerReviewModal from "../modal/OwnerReviewModal.vue";

//유저정보 가져오기
const userInfo = useUserInfo();
//가게정보가져오기
const ownerStore = useOwnerStore();
// 리뷰 데이터 가져오기
const reviewStore = useReviewStore();

const userId = computed(() => userInfo.userId);
const storeId = computed(() => ownerStore.storeId);

const props = defineProps({
  reviews: Array,
});
console.log( "프롭" , props.reviews )

//프롭정보 갱신 감시
watch(
  () => props.reviews,
  (newVal) => {
    console.log("프롭 변경됨:", newVal)
  },
  { immediate: true }
)


// 더보기
// const visibleCount = ref(6);
// const visibleReview = computed(() => {
//   return reviewStore.reviews.slice(0, visibleCount.value);
// });
// const loadMore = () => {
//   visibleCount.value += 6;
// };




onMounted(async () => {
  // // 1. 유저 정보 먼저 불러오기
  // await userInfo.fetchStore();
  // console.log("유저정보: ", userId.value);

  // // storeId가 존재하는 경우에만 리뷰를 가져오기
  // await ownerStore.fetchStoreInfo();
  // console.log("스토어 아이디:", storeId.value);

  // if (storeId.value) {
  //   // 리뷰 데이터를 가져오는 메서드 호출
  //   await reviewStore.fetchReviews(storeId.value);
  //   console.log("리뷰 데이터 구조:", reviewStore.reviews);
  // } else {
  //   console.error("스토어 아이디가 없습니다.");
  // }
});

//리뷰별표시
const averageScore = computed(() => {
  const reviews = reviewStore.reviews;
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
});
console.log("별점평균 : ", averageScore);
const ratingToPercent = computed(() => averageScore.value * 20); // 4.5 -> 90%

// 별 아이콘 컴포넌트 정의
const StarIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="star-icon">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
    `,
};
//---------- 페이지네이션 ------------

// 페이지네이션 관련
const currentPage = ref(1); // 현재 페이지
const pageSize = 6; // 페이지당 리뷰 개수

const totalPages = computed(() => {
  return Math.ceil(reviewStore.reviews.length / pageSize);
});

// 현재 페이지에 맞는 리뷰 목록
const pagedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return reviewStore.reviews.slice(start, end);
});

// 페이지네이션 숫자 계산
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

//----------사장 댓글 다는 부분------------
// 모달
const ownerReviewModalRef = ref(null);

// 모달 입력값 (v-model로 연결됨)
const replyComment = ref("");

// 선택된 리뷰 저장용
const selectedReview = ref(null);

//댓글 상태
const ownerComment = ref("");

// 모달 열림 상태
const isModalOpen = ref(false);

//-댓글 달 모달창-
const addReviewModal = ref(null);
const newdReview = reactive({
  comment: "",
});

// 모달 열기
const openAddReviewModal = (review) => {
  selectedReview.value = review;
  ownerComment.value = review.ownerComment || "";
  const modal = new bootstrap.Modal(addReviewModal.value);
  modal.show();
};

// 모달 닫기
const handleClose = () => {
  selectedReview.value = null;
  replyComment.value = "";
  isModalOpen.value = false; // 모달 닫기
};

// 모달에서 submit 처리
const handleSubmit = async () => {
  if (!selectedReview.value) return;
  try {
    await reviewStore.saveOwnerComment({
      reviewId: selectedReview.value.id,
      ownerComment: replyComment.value,
    });
    selectedReview.value.ownerComment = replyComment.value;
    alert("댓글이 등록되었습니다.");
  } catch (e) {
    console.error("댓글 저장 실패", e);
  }
};

const submitReview = async () => {
  if (!selectedReview.value) return;

  const payload = {
    reviewId: selectedReview.value.id,
    ownerComment: ownerComment.value,
  };

  try {
    await reviewStore.saveOwnerComment(payload);
    selectedReview.value.ownerComment = ownerComment.value;
  } catch (e) {
    console.error("댓글 저장 실패", e);
  }
};

// 유저 프로필 없을 시 대체 이미지 나타내기
const imgSrc = computed(() => {
  return reviewStore.reviews &&
    reviewStore.reviews.imagePath &&
    reviewStore.reviews.imagePath !== "null"
    ? `/pic/store-profile/${reviewStore.reviews.id}/${reviewStore.reviews.imagePath}`
    : defaultUserProfile;
});

// 유저 프로필 경로
const img = "`/pic/user-profile/${review.id}/${review.imagePath}`";

// 리뷰카드 날짜
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
</script>

<template>
  <!-- 리뷰카드  -->
  <div v-if="pagedReviews?.length > 0" class="review-box-wrap">
    <div class="review-box shadow" v-for="review in pagedReviews" :key="review.id">
      <div class="profile">
        <div class="profile-circle">
          <img
            :src="imgSrc"
            @error="(e) => (e.target.src = defaultUserProfile)"
            alt="프로필"
          />
        </div>
        <div class="profile-username">
          <span> review.userName ||  "-" </span>
          <span> formatDateTime(review.created) ||  "-" </span>
        </div>
        <div class="orderMenu">
          <!-- 메뉴 연동하기 -->
          <p> review.menuName ||  "-" </p>
          <!-- 리뷰말고 메뉴로 바꿔야함 -->
          <!-- <span v-if="review.reviews.menuName.length > 1"> 외 {{ review.reviews.menuName.length - 1 }} 건 </span> -->
        </div>
      </div>

      <div class="comment">
        <div class="comment-wrap">
          <div>
            <span>고객님 리뷰</span>
            <!-- 별점표시 -->
            <div class="review-score">
              <div class="star-ratings">
                <!-- 채워진 별 -->
                <div
                  class="star-ratings-fill"
                  :style="{ width: review.rating * 20 + '%' }"
                >
                  <svg
                    v-for="n in 5"
                    :key="'fill' + n"
                    class="star-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.22 9.402c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.975z"
                    />
                  </svg>
                </div>

                <!-- 기본 별 -->
                <div class="star-ratings-base">
                  <svg
                    v-for="n in 5"
                    :key="'base' + n"
                    class="star-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 
                                    1 0 00.95.69h4.184c.969 0 1.371 1.24.588 
                                    1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 
                                    3.975c.3.921-.755 1.688-1.54 
                                    1.118l-3.39-2.46a1 1 0 00-1.175 
                                    0l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975a1 
                                    1 0 00-.364-1.118L2.22 9.402c-.783-.57-.38-1.81.588-1.81h4.184a1 
                                    1 0 00.95-.69l1.286-3.975z"
                    />
                  </svg>
                </div>
              </div>
              <span class="score-text">{{ review.rating ||  "-" }}</span>
            </div>
          </div>
          <p class="line-clamp-2">{{ review.comment ||  "-" }}</p>
        </div>
        <div
          class="comment-wrap"
          v-if="review.ownerComment != null && review.ownerComment != ''"
        >
          <span>사장님 답글</span>
          <p class="line-clamp-2">{{ review.ownerComment ||  "-" }}</p>
        </div>
      </div>
      <div class="btn-wrap">
        <button
          class="btn btn-comment"
          @click="
            () => {
              selectedReview = review;
              replyComment = review.ownerComment || '';
              isModalOpen = true;
            }
          "
        >
          댓글 작성
        </button>
      </div>
    </div>
  </div>
  <div v-else class="review-box-wrap text-center py-4">
    <p class="text-muted">아직 등록된 리뷰가 없습니다.</p>
  </div>
  <div class="d-flex justify-content-center mt-3">
    <div
      v-for="n in 6 - pagedReviews.length"
      :key="'empty-' + n"
      class="review-box shadow empty-card"
      v-if="pagedReviews.length < 6"
    ></div>
  </div>

  <!-- 페이지네이션 버튼 -->
  <div class="pagination d-flex justify-content-center mt-4 align-items-center gap-3">
    <!-- 이전 버튼 -->
    <span
      class="page-arrow"
      @click="goToPage(currentPage - 1)"
      :class="{ disabled: currentPage === 1 }"
    >
      &lt;
    </span>

    <!-- 숫자 버튼 -->
    <span
      v-for="page in pageNumbers"
      :key="page"
      class="page-number"
      :class="{ active: currentPage === page }"
      @click="goToPage(page)"
    >
      {{ page ||  "-"}}
    </span>

    <!-- 다음 버튼 -->
    <span
      class="page-arrow"
      @click="goToPage(currentPage + 1)"
      :class="{ disabled: currentPage === totalPages }"
    >
      &gt;
    </span>
  </div>

  <!-- 모달 컴포넌트 -->
  <OwnerReviewModal :review="selectedReview" v-model:show="isModalOpen" v-model="replyComment" @submit="handleSubmit" />

</template>

<style lang="scss" scoped>
body, html, .wrap {
  min-height: 100vh; /* 항상 화면 크기 이상 */
}
// 버튼
.btn-review {
  width: 400px;
  height: 50px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}

.owner-title1 {
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 2px;
}

.owner-title2 {
  color: #686868;
}

.wrap {
  display: flex;
  background-color: #e8e8e8;
  font-family: "Pretendard", sans-serif;
  max-width: 1500px;
  min-height: 100vh;
  width: 100%;
  transform: translateX(13px);
  padding-bottom: 120px;

  .total-wrap {
    display: flex;
    gap: 50px;
    margin-top: 15px;
    margin-bottom: 40px;
    .circle {
      background-color: #ff6666;
      border-radius: 100%;
      width: 85px;
      height: 85px;
      margin-left: 65px;
      margin-right: 30px;
    }
    .total-box {
      align-items: center;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 2px 2px 5px 1px #c6c6c6;
      display: flex;
      height: 137px;
      width: 337px;
      :last-child {
        display: block;
      }
      span:nth-of-type(1) {
        line-height: 1;
        font-size: 40px;
        font-weight: 800;
      }
    }
  }

  .review-header {
    display: flex;
    // justify-content: space-between;
    margin-bottom: 10px;
  }

  .date-filter {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 2px 2px 5px 1px #c6c6c6;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 295px;
    height: 75px;
    padding: 15px 15px;
    div {
      span {
        display: block;
        margin-right: 10px;
        line-height: 1.5;
      }
    }
    img:last-child {
      width: 24px;
      height: 24px;
    }
  }
  // 리뷰 카드 여백조절
  .review-box-wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding-top: 15px;
    gap: 25px;
    // 리뷰 카드
    .review-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 15px;
      padding: 30px 40px;
      font-size: 14px;
      width: 100%;
      max-width: 470px;
      .profile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;

        .profile-circle {
          background-color: #a3a3a3;
          border-radius: 100%;
          width: 48px;
          height: 48px;
        }
        .profile-username {
          margin-right: 45px;
        }
        .profile-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        div:nth-of-type(2) {
          margin-left: 20px;
        }
        div:nth-of-type(2) > span {
          display: block;
          align-items: center;
        }
        span:nth-of-type(1) {
          font-size: 24px;
        }
        span:nth-of-type(2) {
          font-size: 15px;
          color: #a3a3a3;
        }
      }

      .comment-wrap {
        div {
          display: flex;
          span {
            margin-right: 20px;
          }
        }
        span {
          font-weight: 700;
          color: #ff6666;
        }
      }
      p {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 두 줄로 제한
        -webkit-box-orient: vertical; // 수직 방향 설정
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word; // 긴 단어도 줄바꿈되게
        max-width: 100%; // 너비 제한
      }

      .btn-wrap {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        width: 100%;
      }
      .btn {
        border-radius: 15px;
        border: #ff6666 1px solid;
        color: #ff6666;
        height: 50px;
        max-width: 150px;
        width: 100%;
      }
      .btn:hover {
        background-color: #ff6666;
        color: #fff;
      }
    }
  }

  .review-score {
    display: flex;
    align-items: center; /* 수직 정렬 가운데로 */
    gap: 8px; /* 별과 숫자 간격 */
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
}

.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
  transition: background-color 0.3s, color 0.3s;
}

.accept-btn:hover {
  background: #d44b4a;
}
.accept-btn:active {
  background: #b23837;
}

// 페이지네이션
.pagination {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #e8e8e8;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 1000;

  .page-number {
    cursor: pointer;
    padding: 2px 4px;
    color: #000;
    transition: color 0.3s, border-bottom 0.3s;

    &.active {
      color: #ff6666;
      border-bottom: 2px solid #ff6666;
      font-weight: 600;
      margin-bottom: -1px;
    }

    &:hover {
      color: #ff6666;
    }
  }

  .page-arrow {
    cursor: pointer;
    color: #000;
    padding: 0 10px;
    font-weight: bold;

    &.disabled {
      cursor: not-allowed;
      color: #797979;
    }

    &:hover:not(.disabled) {
      color: #ff6666;
    }
  }
}
// 빈 리뷰 카드
.empty-card {
  visibility: hidden; // 내용은 안 보이지만 자리 확보
  min-height: 394px; // 실제 카드 높이와 동일
  border-radius: 15px; // 기존 카드 모양과 맞춤
}
</style>
