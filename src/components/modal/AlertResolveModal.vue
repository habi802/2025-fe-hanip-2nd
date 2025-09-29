<script setup>
import { defineExpose, ref } from 'vue';

// const isVisible = ref(false); 
// const message = ref('');     
// const callback = ref(null);   

// Confirm 모달을 보여주는 함수
// const showModal = (msg) => {
//   message.value = msg;  
//   isVisible.value = true;

//   return new Promise((resolve) => {
//     callback.value = resolve; 
//   });
// };

// // 확인 버튼 클릭 시
// const onConfirm = () => {
//     isVisible.value = false; 
//     if (callback.value) callback.value(true); 
// };

// // 취소 버튼 클릭 시
// const onCancel = () => {
//     isVisible.value = false; 
//     if (callback.value) callback.value(false); 
// };

// 모달 창 떳을 때 화면 어둡게 하는 함수
// watch(isVisible, (newVal) => {
//   const backdrop = document.querySelector('.modal-backdrop');
//   if (newVal) {
//     // 배경 추가
//     const backdropElement = document.createElement('div');
//     backdropElement.classList.add('modal-backdrop', 'fade', 'show');
//     document.body.appendChild(backdropElement);
//   } else {
//     // 배경 제거
//     if (backdrop) document.body.removeChild(backdrop);
//   }
// });

const show = ref(false);
const body = ref('');

defineExpose({
    showModal(message) {
        body.value = message;
        show.value = true;

        return new Promise(resolve => {
            resolvePromise = resolve
        });
    }
});

let resolvePromise;

const confirm = () => {
    resolvePromise(true);
    show.value = false;
};

const cancel = () => {
    resolvePromise(false);
    show.value = false;
};

const hide = () => {
    if (resolvePromise) {
        resolvePromise(false);
    }
    resolvePromise = null;

    show.value = false;
};
</script>

<template>
    <b-modal v-model="show" @hide="hide" title="알림" centered>
        {{ body }}

        <!-- footer 커스텀 -->
        <template #footer>
            <button class="btn btn-custom" @click="confirm">확인</button>
        </template>
    </b-modal>

    <!-- <div v-if="isVisible" class="modal fade show" aria-labelledby="confirmModal" >
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
    </div> -->
</template>

<style lang="scss" scoped>
.btn-custom {
    background-color: #FF6666;
    color: #fff;

    &:hover {
        background-color: #ED5F5F;
    }

    &:active {
        color: #fff;
    }
}

/* .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5); 
}*/
// .modal.fade.show {
//   display: block;
//   top: 1%;
//   opacity: 1;
// } 
// .btn{
//   background-color:#fff;
//   color: black;
//   border: none;
// }
// .btn:active{
//   background-color: #fff;
//   border: #000 1px solid;
// }</style>