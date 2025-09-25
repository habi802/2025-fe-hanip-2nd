<script setup>
import { computed, ref, inject, onMounted } from "vue";
import DeatailOrderCard from "./OrderCardDetail.vue";
import { useOrderStore } from "@/stores/orderStore";
import DashboardOrderDetail from "@/components/modal/DashboardOrderDetail.vue"


const props = defineProps({
  title: String,
  orders: Object
})
console.log("🥵props.orders : ",props.orders)



// // ref 더보기
// const visibleCount = ref(4);
// const visibleOrders = computed(() => {
//   return orderStore.orderedList.slice(0, visibleCount.value);
// });

// 가게 활성화 여부
// const isOpen = inject("isOpen");


// 주문리스트 클릭이벤트 발생 함수
const isModalOpen = ref(false);
const selectedRow = ref(null);
const onRowClick = (rowData)=>{
  console.log("오예에");
  //selectedRow.value = rowData;
  isModalOpen.value = true;
   console.log(isModalOpen.value);
}



</script>

<template>
  <div class="main-grid">
    <!-- 주문리스트 왼쪽 타이틀 카드 -->
    <div class="white-card status-title">
        {{ props.title }}
    </div>

    <!-- 주문 리스트 -->
    <div class="order-list white-card ">
      <!-- 리스트 컬럼 -->
      <div class="grid-table t-header">
        <div>주문번호</div>
        <div>주문시간</div>
        <div>경과</div>
        <div>주소</div>
        <div>메뉴</div>
        <div>결제금액</div>
        <div>주문상태</div>
      </div>

      <div class="grid-body scrollbar">
        <div class="grid-table underline " v-for="(order, index) in props.orders.slice(0, 4)" :key="index" role="button" tabindex="0"  @click="onRowClick()">
          <div>{{ order.orderId || "-" }}</div>
          <div>00-00-00</div>
          <div>0분</div>
          <div class="address">
            {{order.address || "-" }}<br />{{order.addressDetail || "-" }}
          </div>
          <div>{{order.menuItems[0].name || "-" }}외 {{order.menuItems.length}}건</div>
          <div>{{order.amount ? order.amount.toLocaleString() : "-" }}원</div>
          <div>
            <!-- TODO : 각 상태마다 버튼 다르게하기 -->
            <!-- 행 클릭과 내부 버튼 클릭을 분리: 내부 버튼 클릭시 부모 클릭 중단 -->
            <button class="owner-btn-white" @click.stop="onAssign()">배차하기</button>
          </div>
        </div><!-- grid-table 끝-->
      </div><!-- grid-body 끝-->
    </div><!-- order-list 끝-->
  </div><!-- main-grid 끝-->
  <dashboard-order-detail  v-if="isModalOpen" :data="selectedRow" @close="isModalOpen = false"></dashboard-order-detail> 
</template>

<style scoped lang="scss">
.white-card{
  padding: 0;
}
.main-grid {
  /* 주문리스트 컬럼 정의: 테이블 헤더와 데이터 행이 동일한 값을 참조하도록 CSS 변수로 정의 */
  --cols: 100px 100px 80px 1.5fr 1fr 120px 280px;
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.status-title {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0px 40px;
  min-width: 180px;
  font-weight: 700;
  font-size: 40px;
  line-height: 1.2;
}

/* ====== Grid Table ====== */
.grid-table {
  display: grid;
  grid-template-columns: var(--cols);
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 14px;
  text-align: center;
}

.t-header {
  background: #f5f7fa;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 15px 15px 0 0;
  text-align: center;
}

.underline {
  border-bottom: 1px solid #e5e7eb;
  color: #333;
}

/* 주소는 왼쪽 정렬 */
.address {
  display: flex;
  justify-content: center;
  text-align: left;
}

.grid-body {
  max-height: 220px; /* 3줄 정도 보이도록 */
  overflow-y: auto;
  overflow-x: auto;
}

</style>
