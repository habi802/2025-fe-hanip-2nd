<script setup>
import ReviewModal from '../modal/ReviewModal.vue';
import { ref } from 'vue';

const reviewModal = ref(null);

const openModal = () => {
    const modalElement = reviewModal.value.$el;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};
</script>

<template>
    <div class="btn" @click="openModal">asfasfasfafs </div>
    <ReviewModal ref="reviewModal"></ReviewModal>
</template>

<style scoped></style>