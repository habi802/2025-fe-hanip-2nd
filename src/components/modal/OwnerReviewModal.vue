<script setup>
import { ref, watch, computed } from "vue";
import defaultUserProfile from "@/imgs/owner/user_profile.jpg";
import defaultImage from "@/imgs/owner/owner-service3.png";

// 부모로부터 받는 props
const props = defineProps({
  review: Object, // 선택된 리뷰 정보 (작성자, 메뉴, 이미지, 댓글 등)
  modelValue: String, // 사장님 답글 입력값 (v-model)
  show: Boolean, // 모달 열림 상태
});
// 임시 테스트용 이미지 배열 - 스와이프 기능 확인용
const mockImages = [
  "https://via.placeholder.com/300x300?text=Image+1",
  "https://via.placeholder.com/300x300?text=Image+2",
  "https://via.placeholder.com/300x300?text=Image+3",
];

// 이벤트 emit
const emit = defineEmits(["update:modelValue", "update:show", "submit"]);

// 답글 입력 필드 로컬 상태
const localComment = ref(props.modelValue);

// 부모로부터 전달된 modelValue가 바뀌면 localComment 업데이트
watch(
  () => props.modelValue,
  (val) => (localComment.value = val)
);
// localComment가 바뀌면 부모에 업데이트
watch(localComment, (val) => emit("update:modelValue", val));

// 답글 등록 후 모달 닫기
const handleSubmit = () => {
  emit("submit");
  emit("update:show", false);
};

// 프로필 이미지 (없으면 기본 이미지)
const profileImage = computed(() => props.review?.userProfile || defaultUserProfile);

// 날짜 포맷 함수 (yyyy-mm-dd hh:mm)
const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
};

// dayjs로 "몇 분 전" 표시
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

// 리뷰 작성 시간 기준 상대시간 표시
const timeAgo = computed(() => {
  if (!props.review || !props.review.created) return "";
  return dayjs(props.review.created).fromNow();
});
// 없는 이미지 경로
const displayImage = computed(() => {
  return props.review?.image || defaultImage;
});
</script>

<template>
  <Teleport to="body">
    <!-- 모달 전체 백드롭 -->
    <div v-if="show" class="modal-backdrop">
      <div class="modal-content">
        <!-- 헤더: 작성자 프로필과 닫기 버튼 -->
        <div class="modal-header">
          <div class="profile-box">
            <img :src="profileImage" alt="프로필" />
            <div class="profile-info">
              <p>{{ review?.userName }}</p>
              <!-- 작성자 이름 -->
              <span>{{ timeAgo }}</span>
              <!-- 작성 시간 -->
            </div>
          </div>
          <button @click="$emit('update:show', false)">X</button>
        </div>

        <!-- 본문: 좌측 리뷰 이미지 / 우측 주문 및 댓글 -->
        <div class="modal-body">
          <!-- 좌측: 리뷰 이미지 -->
          <div class="left-side">
            <div class="review-image">
              <img :src="displayImage" alt="리뷰 이미지" />
          <!-- 주문 메뉴 -->
          <div class="menu-box">
            <p>{{ review.menuName }}</p>
          </div>
            </div>
          </div>

          <!-- 우측: 주문 메뉴, 고객 리뷰, 사장 답글 -->
          <div class="right-side">
            <!-- 고객 리뷰 -->
            <div class="review-text">
              <span>고객님 리뷰</span>
              <!-- 별점표시 -->
              <div class="review-score-wrapper">
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
                  <span class="star-score">{{ review.rating }}</span>
                </div>
              </div>
              <p>{{ review?.comment }}</p>
            </div>

            <!-- 사장님 답글 입력 -->
            <div class="owner-comment-box">
              <span>사장님 답글</span>
              <textarea
                v-model="localComment"
                placeholder="답글을 입력하세요. 고객과의 소통은 매출상승의 지름길입니다!"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 하단 등록 버튼 -->
        <div class="modal-footer">
          <button class="delete-btn" @click="$emit('update:show', false)">취소</button>
          <button class="accept-btn" @click="handleSubmit">등록</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
//모달 백드롭
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

// 모달 내용 박스
.modal-content {
  background: #fff;
  border-radius: 15px;
  padding: 20px 30px;
  width: 100%;
  max-width: 830px;
}

// 헤더: 프로필 영역
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .profile-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 30px;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #c8c8c8;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      p {
        margin-bottom: -2px;
        color: #797979;
      }
      span {
        font-size: 14px;
        font-weight: 500;
        color: #d9d9d9;
      }
    }
  }
}

//본문: 좌우 레이아웃
.modal-body {
  display: flex;
  gap: 20px;
  margin-top: 15px;

  .left-side{
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .right-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
// 리뷰이미지
  .review-image img {
    width: 100%;
    max-width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 10px;
  }
.menu-box {
  margin-top: 20px;
  margin-bottom: -40px;
  p{
    font-size: 14px;
    font-weight: 300;
  }
}
  .review-text,
  .owner-comment-box {
    display: flex; // 💡 텍스트와 별점 가로 정렬
    gap: 10px;
    flex-wrap: wrap; //  줄바꿈 허용

    span {
      color: #ff6666;
      font-weight: 400;
      font-size: 14pt;
    }
    p {
      color: #000;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    textarea {
      width: 100%;
      height: 140px;
      border: 1px solid #797979;
      border-radius: 10px;
      padding: 10px;
    }
    // 별 위치
    .review-score {
      display: flex;
      align-items: center;
      gap: 8px;
      .star-ratings {
        position: relative;
        width: 120px; /* 너비를 고정하면 퍼센트 연산이 더 정확 */
        height: 24px;
      }

      .star-ratings-base,
      .star-ratings-fill {
        position: absolute;
        top: 0;
        left: 0;
        display: inline;
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
      .star-score {
        color: #000;
        margin-top: 2px;
      }
    }
  }
}

// 하단 버튼 영역
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 15px;
}

//등록 버튼
.accept-btn {
  background: #fff;
  border: #ff6666 1px solid;
  color: #ff6666;
  border-radius: 8px;
  font-size: 18px;
  width: 150px;
  height: 40px;
}

// 취소 버튼
.delete-btn {
  background: #fff;
  border: #797979 1px solid;
  color: #797979;
  border-radius: 8px;
  font-size: 18px;
  width: 150px;
  height: 40px;
}
</style>
