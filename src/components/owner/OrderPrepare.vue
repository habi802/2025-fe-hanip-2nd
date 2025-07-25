<script setup>
import { onMounted, reactive, computed, ref, inject } from "vue";
import OrderDeliveryDetail from "./OrderPrePareDetail.vue";
import { useOrderStore } from "@/stores/orderStore";

// 피니아
const orderStore = useOrderStore();

// ref 더보기
const visibleCount = ref(4);
const visibleOrders = computed(() => {
  return [...orderStore.preparingList]  // 배열 복사
    .reverse()                          // 최신 순으로 역순 정렬
    .slice(0, visibleCount.value);      // 앞에서 N개만 보여줌
});

// 가게 활성화 여부
const isOpen = inject("isOpen");
</script>

<template>
  <div class="d-flex mb-5">
    <div class="card shadow p-5 w-100" style="max-width: 450px">
      <div class="fs-2 fw-bold text-center mb-3">음식준비</div>

      <div v-if="!isOpen" class="text-center text-danger fw-bold">
        🚫 영업 중단! 주문 받기를 중단했습니다.
      </div>

      <template v-else>
        <div
          v-if="orderStore.preparingList.length === 0"
          class="text-center text-muted"
        >
          현재 들어온 주문이 없습니다.
        </div>

        <template v-else>
          <OrderDeliveryDetail
            class="mb-3"
            v-for="order in visibleOrders"
            :key="order.id"
            :order="order"
          />

          <div
            v-if="visibleCount < orderStore.preparingList.length"
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
