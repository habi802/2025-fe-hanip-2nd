<script setup>
import { getOrder } from '@/services/storeService';
import { onMounted, reactive } from 'vue';
import DeatailOrderCard from './DeatailOrderCard.vue';

const orederList = async () => {
    const res = await getOrder();
    console.log("res: ", res);
    state.form = res.data.resultData;
}

// 양방향 배열
const state = reactive({
    form: []
})

// 화면에 띄우기
onMounted(async () => {
    await orederList()
})

  </script>

<template>
<div class="container-fluid d-flex mb-5">
    <div class="card shadow p-5 w-100" style="max-width: 500px">
        <div class="fs-2 fw-bold text-center mb-3">주문대기</div>
        <DeatailOrderCard 
        class="mb-3"
        v-for="order in state.form" 
        :key="order.id" 
        :order="order" 
        />
    </div>
</div>
</template>
  
  
  
  <style scoped>

  </style>