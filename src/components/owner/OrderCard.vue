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
  <div class="d-flex">
    <div class="white-card">
      <div class="card-title" style="max-width: 100px; padding: auto 0;  font-weight: 700; text-align: center; line-height: 1; font-size: 40px;">
        <span > 주문대기 </span>
      </div>
    </div>

    <!-- 주문 리스트 테이블 -->
    <div class="order-list white-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문시간</th>
              <th>경과</th>
              <th>주소</th>
              <th>메뉴</th>
              <th>결제금액</th>
              <th>주문상태</th>
            </tr>
          </thead>
          <div class="table-body">
            <tbody>
              <tr v-for="n in 4" :key="n">
                <td>000{{ n }}</td>
                <td>17:12</td>
                <td>3분</td>
                <td>대구 달서구 야외음악당로 20길 49,<br>205동 203호</td>
                <td>황금올리브 외 4건</td>
                <td>23,500원</td>
                <td><button class="hn-btn-white">배차하기</button></td>
              </tr>
            </tbody>
          </div>
        </table>
      </div>
    </div>
  </div>
    <!-- <div v-if="!isOpen" class="text-center text-danger fw-bold">
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
    </template> -->

</template>

<style scoped lang="scss">
.d-flex {
  display: flex;
  gap: 5px; /* 주문대기 카드와 표 사이 여백 */
}

.card-title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: auto;
}

.card-title {
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  font-size: 40px;
}

.order-list {
  flex: 1;
  padding: 0;
}

/* 테이블 전체를 감싸는 스크롤 영역 */
.table-wrapper {
  max-height: 240px; /* 3줄 높이만큼 */
  overflow: hidden;
  border-radius: 12px; /* 모서리 둥글게 */
  border: 1px solid #e5e7eb;
  //box-sizing: border-box;
}

/* 테이블 */
table {
  border-collapse: collapse;
}

thead {
  background-color: #f5f7fa;
  position: sticky;
  top: 0; /* 스크롤해도 헤더 고정 */
  z-index: 1;
}

th,
td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #333;
}

th {
  font-weight: 600;
  color: #555;
}

td {
  vertical-align: middle;
}

td.address {
  text-align: left;
}

.order-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 16px;
    text-align: center;
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
  }

  thead {
    background: #f5f7fa;
    font-weight: 600;
    color: #555;
  }
}

/* 스크롤 영역 */
.table-body {
  max-height: 240px; /* 3줄 정도 보이도록 */
  overflow-y: auto;
}

/* ===== 스크롤바 커스텀 ===== */
.table-body::-webkit-scrollbar {
  width: 10px; /* 얇게 */
}

.table-body::-webkit-scrollbar-track {
  background: transparent; /* 배경 없애기 */
  margin-top: 10px;  /* 위에서 살짝 떨어진 위치부터 시작 */
  margin-bottom: 10px; /* 아래도 여유 */
}

.table-body::-webkit-scrollbar-thumb {
  background-color: #c4c4c4; /* 연회색 */
  border-radius: 9999px; /* 완전 둥글게 */
  border: 2px solid transparent; /* 가운데만 보이도록 */
  background-clip: content-box; /* 라인 느낌 */
}

.table-body::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0; /* hover 시 진해짐 */
}
</style>
