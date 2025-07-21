<script setup>
import { getOrder } from "@/services/storeService";
import { onMounted, reactive, computed, ref, inject } from "vue";
import OrderDeliveryDetail from "./OrderDeliveryDetail.vue";

// ref
const visibleCount = ref(4);

const visibleOrders = computed(() => {
  return deliveringList.value.slice(0, visibleCount.value);
});

// 양방향 배열
const state = reactive({
  form: [],
});

// 화면에 띄우기
onMounted(async () => {
  const res = await getOrder();
  state.form = res.data.resultData;
});

// 배열에서 상태 거르기
const deliveringList = computed(() =>
  state.form.filter((o) => o.status === "DELIVERING")
);

const isOpen = inject("isOpen");
</script>

<template>
  <div class="d-flex mb-5">
    <div class="card shadow p-5 w-100" style="max-width: 450px">
      <div class="fs-2 fw-bold text-center mb-3">배달대기</div>

      <div v-if="!isOpen" class="text-center text-danger fw-bold">
        🚫 영업 중단! 주문 받기를 중단했습니다.
      </div>

      <template v-else>
        <div v-if="deliveringList.length === 0" class="text-center text-muted">
          현재 들어온 주문이 없습니다.
        </div>

        <template v-else>
          <OrderDeliveryDetail
            class="mb-3"
            v-for="order in deliveringList"
            :key="order.id"
            :order="order"
          />

          <div
            v-if="visibleCount < deliveringList.length"
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
