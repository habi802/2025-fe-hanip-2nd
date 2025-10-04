<script setup>
import { defineExpose, ref, watch } from 'vue';



const show = ref(false);
const body = ref('');

defineExpose({
    showModal(message) {
        body.value = message;
        show.value = true;
        document.body.style.overflow = "hidden";
        return new Promise(resolve => {
            resolvePromise = resolve
        });
    }
});

let resolvePromise;

const confirm = () => {
    resolvePromise(true);
    show.value = false;
    document.body.style.overflow = "";
};

const cancel = () => {
    resolvePromise(false);
    show.value = false;
    document.body.style.overflow = "";
};

// 배경 누르면 스크롤 되는 거 방지용
watch(show, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : '';
});
</script>

<template>
    <b-modal v-model="show" title="알림" centered :no-close-on-backdrop="true" :no-close-on-esc="true">
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