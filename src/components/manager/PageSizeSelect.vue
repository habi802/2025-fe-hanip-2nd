<script setup>
import { ref, defineEmits } from 'vue';

const pageSizeOptions = [
    { value: 10, text: '10개씩 보기' },
    { value: 30, text: '30개씩 보기' },
    { value: 50, text: '50개씩 보기' }
]
const selectedPageSizeOption = ref(pageSizeOptions[0].value);

// 페이지 사이즈 선택 시 부모 컴포넌트로 선택된 페이지 사이즈의 value를 전달
const emit = defineEmits(['changePageSize']);

const changePageSize = () => {
    emit('changePageSize', selectedPageSizeOption.value);
};
</script>

<template>
    <b-form-select size="sm" class="w-auto d-inline-block"
    :options="pageSizeOptions" v-model="selectedPageSizeOption" @update:model-value="changePageSize"></b-form-select>
</template>

<style scoped>

</style>