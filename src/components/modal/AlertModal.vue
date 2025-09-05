<script setup>
import { defineExpose } from 'vue';
import { Modal } from 'bootstrap';

const showModal = message => {
    // 모달 생성
    const modalElement = document.querySelector('#alertModal');
    if (!modalElement) return;

    const modalBody = document.querySelector('#alertModalBody');
    if (modalBody) modalBody.textContent = message;

    const modal = new Modal(modalElement);
    modal.show();

    // 모달 버튼 색상 변경
    const modalButton = document.querySelector('.modal-footer .btn');
    if (modalButton) {
        modalButton.style.backgroundColor = '#FF6666';  // 빨간색으로 변경
        modalButton.style.color = '#fff';  // 글씨 색상 흰색
    }
};

// showModal을 외부에서 호출할 수 있도록 expose
defineExpose({
    showModal
});
</script>

<template>

</template>

<style scoped>

</style>