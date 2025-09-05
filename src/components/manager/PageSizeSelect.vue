<script setup>
import { ref } from 'vue';

const pageSizeOptions = [
    { value: 10, text: '10개씩 보기' },
    { value: 30, text: '30개씩 보기' },
    { value: 50, text: '50개씩 보기' }
]
const selectedPageSizeOption = ref(pageSizeOptions[0].value);
</script>

<template>
    <b-form-select size="sm" class="w-auto d-inline-block" :options="pageSizeOptions" v-model="selectedPageSizeOption"></b-form-select>
</template>

<style scoped>

</style>