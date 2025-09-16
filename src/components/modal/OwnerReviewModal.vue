<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  review: Object, // 선택된 리뷰
  modelValue: String, // v-model로 답글 입력값
  show: Boolean, // 모달 열림 상태
});

const emit = defineEmits(["update:modelValue", "update:show", "submit"]);

const localComment = ref(props.modelValue);

// 부모에서 modelValue가 바뀌면 반영
watch(
  () => props.modelValue,
  (val) => (localComment.value = val)
);

// localComment가 바뀌면 부모로 업데이트
watch(localComment, (val) => emit("update:modelValue", val));

// 등록 버튼 클릭
const handleSubmit = () => {
  emit("submit");
  emit("update:show", false); // 모달 닫기
};
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h5>답글 달기</h5>
          <button @click="$emit('update:show', false)">X</button>
        </div>
        <div class="modal-body">
          <span>고객 리뷰</span>
          <p class="form-control-customer">{{ review?.comment }}</p>
          <span>사장님 답글</span>
          <textarea
            v-model="localComment"
            placeholder="답글을 입력하세요. 고객과의 소통은 매출상승의 지름길입니다!"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="delete-btn" @click="$emit('update:show', false)">취소</button>
          <button class="accept-btn" @click="handleSubmit">등록</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 15px;
  padding: 20px 30px 20px 20px;
  width: 500px;
  max-width: 95%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 10px;
  span {
    color: #ff6666;
    font-weight: 700;
    font-size: 16pt;
  }
  p.form-control-customer {
    border: #797979 solid 2px;
    min-height: 100px;
    border-radius: 10px;
    padding: 12px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
  }
  textarea {
    width: 100%;
    height: 200px;
    border: #797979 solid 2px;
    border-radius: 10px;
    padding: 12px;
    resize: vertical;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 18px;
  width: 68px;
  height: 42px;
}

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
