<script setup>
import { computed, ref, reactive, onMounted, inject } from "vue";
import { useOwnerStore, useUserInfo } from "@/stores/account";
import { useReviewStore } from "@/stores/review";
import defaultUserProfile from "@/imgs/owner/user_profile.jpg";

//유저정보 가져오기
const userInfo = useUserInfo();
//가게정보가져오기
const ownerStore = useOwnerStore();
// 리뷰 데이터 가져오기
const reviewStore = useReviewStore();

// 더보기
const visibleCount = ref(6);
const visibleReview = computed(() => {
  return reviewStore.reviews.slice(0, visibleCount.value);
});
const loadMore = () => {
  visibleCount.value += 6;
};

const userId = computed(() => userInfo.userId);
const storeId = computed(() => ownerStore.storeId);

defineProps({
  reviews: Array,
});

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
    console.error("스토어 아이디가 없습니다.");
  }
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
  ownerComment.value = review.ownerComment || ""; // 기존 댓글 있으면 세팅
  const modal = new bootstrap.Modal(addReviewModal.value);
  modal.show();
};

// 사장이 단 댓글 삭제
const ownerReviewDelete = async (review) => {
  const confirmed = confirm("정말 사장 댓글을 삭제하시겠습니까?");
  if (!confirmed) return;

  const success = await reviewStore.saveOwnerComment({
    reviewId: review.id,
    ownerComment: "",
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
  <div v-if="visibleReview?.length > 0" class="review-box-wrap">
    <div
      class="review-box shadow"
      v-for="review in visibleReview"
      :key="review.id"
    >
      <div class="profile">
        <div class="profile-circle">
          <img
            :src="imgSrc"
            @error="(e) => (e.target.src = defaultUserProfile)"
            alt="프로필"
          />
        </div>
        <div class="profile-username">
          <span>{{ review.userName }}</span>
          <span>{{ formatDateTime(review.created) }}</span>
        </div>
        <div class="orderMenu">
          <!-- 메뉴 연동하기 -->
          <p>{{ review.menuName }}</p>
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
              <span class="score-text">{{ review.rating }}</span>
            </div>
          </div>
          <p class="line-clamp-2">{{ review.comment }}</p>
        </div>
        <div
          class="comment-wrap"
          v-if="review.ownerComment != null && review.ownerComment != ''"
        >
          <span>사장님 답글</span>
          <p class="line-clamp-2">{{ review.ownerComment }}</p>
        </div>
      </div>
      <div class="btn-wrap">
        <button class="btn btn-delete" @click="ownerReviewDelete(review)">
          댓글 삭제
        </button>
        <button class="btn btn-comment" @click="openAddReviewModal(review)">
          댓글 작성
        </button>
      </div>
    </div>
  </div>
  <div v-else class="review-box-wrap text-center py-4">
    <p class="text-muted">아직 등록된 리뷰가 없습니다.</p>
  </div>
  <div class="d-flex justify-content-center mt-3">
    <button
      v-if="visibleReview.length > 0 && visibleCount < reviews.length"
      @click="loadMore"
      class="btn btn-secondary btn-review"
    >
      더보기
    </button>
  </div>

  <!-- 부트스트랩 모달 -->
  <Teleport to="body">
    <div class="modal fade" ref="addReviewModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content" style="padding: 20px 30px 20px 20px">
          <div
            class="modal-header"
            style="display: flex; justify-content: space-between"
          >
            <h5 class="modal-title" style="font-weight: 700">답글 달기</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <span style="margin-left: 10px"> 고객 리뷰 </span>
            <br />
            <p class="form-control-customer">{{ selectedReview?.comment }}</p>
            <br />

            <span style="margin-left: 10px">사장님 답글</span>
            <br />
            <textarea
              class="form-control"
              v-model="ownerComment"
              placeholder="답글을 입력하세요. 고객과의 소통은 매출상승의 지름길입니다!"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn delete-btn" data-bs-dismiss="modal">취소</button>
            <button class="btn accept-btn" @click="submitReview">등록</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
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
  background-color: #e8e8e8;
  font-family: "Pretendard", sans-serif;
  width: 1501px;
  transform: translateX(13px);
  padding-bottom: 70px;
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
    justify-content: space-between;
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

  .review-box-wrap {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(420px, 420px));
    padding-top: 15px;
    gap: 120px;

    .review-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      border-radius: 15px;
      padding: 30px 40px;
      font-size: 14px;
      .profile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;

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
        justify-content: space-around;
        margin-top: 20px;
        width: 100%;
      }
      .btn {
        border-radius: 15px;
        border: #ff6666 solid;
        color: #ff6666;
        height: 55px;
        width: 145px;
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

.delete-btn {
  background: #a3a3a3;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
  transition: background-color 0.3s, color 0.3s;
}

.delete-btn:hover {
  background: #838383;
}
.delete-btn:active {
  background: #696969;
}

.modal-body {
  span {
    color: #ff6666;
    font-weight: 700;
    font-size: 16pt;
  }

  p {
    border: #797979 solid 2px;
    min-height: 200px;
    border-radius: 10px;
    padding: 12px;
    box-sizing: border-box;
    white-space: pre-wrap; /* 줄바꿈과 공백 유지 + 자동 줄바꿈 허용 */
    word-wrap: break-word; /* 긴 단어도 줄바꿈 허용 */
    overflow-wrap: break-word; /* 최신 속성: 긴 단어 강제 줄바꿈 */
    overflow: hidden; /* 스크롤 제거 */
  }

  textarea {
    height: 200px;
    border: #797979 solid 2px;
    border-radius: 10px;
    overflow-y: auto;
    resize: vertical; /* 크기 조절은 세로만 (원하면 제거 가능) */
    overflow: auto; /* 자동 스크롤 */
    padding-right: 12px; /* 스크롤과 글자 간격 확보 */
    box-sizing: border-box; /* 패딩 포함한 너비 계산 */
  }
  textarea::-webkit-scrollbar-track {
    background: transparent !important; /* 트랙 배경 제거 */
    margin: 2px 0; /* 위아래 여백 줘서 둥근 모서리 맞춤 */
    border-radius: 10px; /* 트랙도 둥글게 */
  }
  textarea::-webkit-scrollbar {
    width: 6px; /* 스크롤바 너비 */
    background: transparent; /* 스크롤 영역 자체도 투명하게 */
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #aaa; /* 스크롤바 색상 */
    border-radius: 10px; /* 둥글게 */
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background: #888; /* 호버 시 조금 진하게 */
  }
}
</style>
