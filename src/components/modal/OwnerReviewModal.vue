<script setup>
import { ref, watch, computed } from "vue";
import defaultUserProfile from "@/imgs/owner/user_profile.jpg";

// 부모로부터 받는 props
const props = defineProps({
  review: Object, // 선택된 리뷰 정보 (작성자, 메뉴, 이미지, 댓글 등)
  modelValue: String, // 사장님 답글 입력값 (v-model)
  show: Boolean, // 모달 열림 상태
});

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
            <div class="review-image" v-if="review?.image">
              <img :src="review.image" alt="리뷰 이미지" />
            </div>
          </div>

          <!-- 우측: 주문 메뉴, 고객 리뷰, 사장 답글 -->
          <div class="right-side">
            <!-- 주문 메뉴 -->
            <div class="menu-box">
              <span>주문 메뉴</span>
              <p>{{ review?.menu }}</p>
            </div>

            <!-- 고객 리뷰 -->
            <div class="review-text">
              <span>고객 리뷰</span>
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

        <!-- 하단 버튼: 취소 / 등록 -->
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
  width: 600px;
  max-width: 95%;
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

  .left-side,
  .right-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .review-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid #797979;
  }

  .menu-box,
  .review-text,
  .owner-comment-box {
    span {
      color: #ff6666;
      font-weight: 700;
      font-size: 14pt;
    }
    p {
      border-radius: 10px;
      padding: 10px;
      min-height: 60px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    textarea {
      width: 100%;
      height: 120px;
      border: 1px solid #797979;
      border-radius: 10px;
      padding: 10px;
      resize: vertical;
    }
  }
}

// 하단 버튼 영역
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

//등록 버튼
.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
}

// 취소 버튼
.delete-btn {
  background: #a3a3a3;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
}
</style>
