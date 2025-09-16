<script setup>
import { defineExpose, ref } from 'vue';

const show = ref(false);

// defineExpose: 부모 컴포넌트에서 (ref로 된 변수 이름).value.(defineExpose에서 실행될 함수 이름) 형태로 호출했을 때 실행됨
defineExpose({
    open() {
        show.value = true;
    },
    hide() {
        show.value = false;
    }
});
</script>

<template>
    <b-modal v-model="show" hide-header hide-footer static centered size="sm">
        <div class="d-flex align-items-center">
            <div class="me-3">
                <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div>잠시만 기다려주세요...</div>
        </div>
    </b-modal>
</template>

<style scoped>

</style>