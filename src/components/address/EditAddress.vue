<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean, // 모달 표시 여부
  address: Object, // 수정할 주소 데이터
});

const emits = defineEmits(["close", "save"]);

// 로컬 상태 (수정용)
const form = ref({ ...props.address });

watch(
  () => props.address,
  (newVal) => {
    form.value = { ...newVal };
  },
  { immediate: true }
);

const handleSave = () => {
  emits("save", form.value);
  emits("close");
};
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>주소 수정</h2>
      <input v-model="form.title" placeholder="주소 제목" />
      <div class="postcode-wrapper">
        <input class="postcode-input" v-model="form.postcode" placeholder="우편번호" />
        <button class="location-btn">주소 검색</button>
      </div>
      <input v-model="form.address" placeholder="주소" />
      <input v-model="form.address_detail" placeholder="상세 주소" />
      <span
        >입력된 공동 현관 비밀 번호는 원활한 배달을 위해 필요한 정보로, 배달을 진행하는
        라이더와 사장님께만 전달됩니다.</span
      >
      <div class="modal-actions">
        <button class="cancle-btn" @click="$emit('close')">취소</button>
        <button class="save-btn" @click="handleSave">저장</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); // 뒷배경 회색 + 비활성화 느낌
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  h2 {
    text-align: center;
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    width: 850px;
    height: 1000px;
    flex-direction: column;
    align-items: center;
    input {
      width: 700px;
      height: 60px;
      border: 1px solid #797979;
      margin-bottom: 20px;
      border-radius: 8px;
      padding: 15px 15px;
    }
    .location-btn {
      width: 130px;
      height: 60px;
      background-color: white;
      color: #ff6666;
      border: 1.5px solid #ff6666;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background-color: #ffe6e6;
      }
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      gap: 10px;

      .cancle-btn {
        width: 320px;
        height: 70px;
        background-color: #ff6666;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background-color: darken(#ff6666, 5%);
        }
      }

      .save-btn {
        width: 320px;
        height: 70px;
        background-color: white;
        color: #ff6666;
        border: 1.5px solid #ff6666;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background-color: #ffe6e6;
        }
      }
    }
  }
  span {
    width: 700px;
    color: #bcbcbc;
    font-weight: 600;
    font-size: 20px;
  }
}
.postcode-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  .postcode-input {
    width: 200px; // 원하는 너비로 설정
    height: 60px;
    border: 1px solid #797979;
    border-radius: 8px;
    padding: 15px;
  }

  .location-btn {
    width: 130px;
    height: 60px;
    background-color: white;
    color: #ff6666;
    border: 1.5px solid #ff6666;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background-color: #ffe6e6;
    }
  }
}
</style>
