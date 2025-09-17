<script setup>
import { ref,watch  } from 'vue';

const isVisible = ref(false); 
const message = ref('');
const callback = ref(null);   


// Confirm 모달을 보여주는 함수
const showModal = (msg) => {
  message.value = msg;  
  isVisible.value = true;

  return new Promise((resolve) => {
    callback.value = resolve; 
  });
};

// 확인 버튼 클릭 시
const onConfirm = () => {
  isVisible.value = false; 
  if (callback.value) callback.value(true); 
};

// 취소 버튼 클릭 시
const onCancel = () => {
  isVisible.value = false; 
  if (callback.value) callback.value(false); 
};

defineExpose({
  showModal,onConfirm,onCancel
});

// 모달 창 떳을 때 화면 어둡게 하는 함수
watch(isVisible, (newVal) => {
  const backdrop = document.querySelector('.modal-backdrop');
  if (newVal) {
    // 배경 추가
    const backdropElement = document.createElement('div');
    backdropElement.classList.add('modal-backdrop', 'fade', 'show');
    document.body.appendChild(backdropElement);
  } else {
    // 배경 제거
    if (backdrop) document.body.removeChild(backdrop);
  }
});
</script>

<template>
  <div v-if="isVisible" class="modal fade show" aria-labelledby="confirmModal" >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">확인</h5>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="onCancel">취소</button>
          <button type="button" class="btn btn-danger" @click="onConfirm">확인</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
/* .modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5); 

}*/
.modal.fade.show {
  display: block;
  top: 1%;
  opacity: 1;
} 
.btn{
  background-color:#fff;
  color: black;
  border: none;
}
.btn:active{
  background-color: #fff;
  border: #000 1px solid;
}
</style>