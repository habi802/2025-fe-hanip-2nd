<script setup>
import { computed, ref, inject } from "vue";
import DeatailOrderCard from "./OrderCardDetail.vue";
import { useOrderStore } from "@/stores/orderStore";

// 피니아
const orderStore = useOrderStore();

// ref 더보기
const visibleCount = ref(4);
const visibleOrders = computed(() => {
  return orderStore.orderedList.slice(0, visibleCount.value);
});

// 가게 활성화 여부
const isOpen = inject("isOpen");
</script>

<template>
  <div class="d-flex mb-5">
    <div class="card shadow p-5 w-100" style="max-width: 450px">
      <div class="fs-2 fw-bold text-center mb-3">주문대기</div>

      <div v-if="!isOpen" class="text-center text-danger fw-bold">
        🚫 영업 중단! 주문 받기를 중단했습니다.
      </div>

      <template v-else>
        <div
          v-if="orderStore.orderedList.length === 0"
          class="text-center text-muted"
        >
          현재 들어온 주문이 없습니다.
        </div>

        <template v-else>
          <DeatailOrderCard
            class="mb-3"
            v-for="order in visibleOrders"
            :key="order.id"
            :order="order"
          />

          <div
            v-if="visibleCount < orderStore.orderedList.length"
            class="text-center mt-3"
          >
            <button
              class="btn btn-outline-secondary"
              @click="visibleCount += 4"
            >
              더보기
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
