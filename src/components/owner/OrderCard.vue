<script setup>
import { ref } from "vue";
import DashboardOrderDetail from "@/components/modal/DashboardOrderDetail.vue";

const props = defineProps({
  title: String,
  orders: { type: Array, default: () => [] },
});

const isModalOpen = ref(false);
const selectedRow = ref(null);

const onRowClick = (rowData) => {
  selectedRow.value = rowData;
  isModalOpen.value = true;
  console.log("주문 클릭:", rowData);
};

const emit = defineEmits(["accept", "cancel", "assign"]);

// 주문 상태
const onAccept = (order) => {
  emit("accept", order.orderId);
};
const onCancel = (order) => {
  emit("cancel", order.orderId);
};
const onAssign = (order) => {
  emit("assign", order.orderId);
};

// 시간 포맷터
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
</script>

<template>
  <div class="main-grid">
    <!-- 주문리스트 왼쪽 타이틀 카드 -->
    <div class="white-card status-title">
      {{ props.title }}
    </div>

    <!-- 주문 리스트 -->
    <div class="order-list white-card">
      <!-- 리스트 헤더 -->
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
        <!-- 주문이 없을 때 -->
        <div
          v-if="!props.orders || props.orders.length === 0"
          class="empty-row"
        >
          주문이 없습니다.
        </div>

        <!-- 주문이 있을 때 -->
        <div
          v-else
          class="grid-table underline"
          v-for="(order, index) in props.orders.slice(0, 4)"
          :key="index"
          role="button"
          tabindex="0"
          @click="onRowClick(order)"
        >
          <div>{{ order.orderId || "-" }}</div>
          <div>{{ formatTime(order.createdAt) || "00:00" }}</div>
          <div>{{ order.elapsed || "0분" }}</div>
          <div class="address">
            {{ order.address || "-" }}<br />{{ order.addressDetail || "-" }}
          </div>
          <div>
            {{ order.menuItems[0]?.name || "-" }} 외
            {{ order.menuItems.length }}건
          </div>
          <div>{{ order.amount ? order.amount.toLocaleString() : "-" }}원</div>
          <div>
            <!-- 상태별 버튼 -->
            <template v-if="order.status === '02'">
              <button class="owner-btn-white" @click.stop="onAccept(order)">
                주문 수락
              </button>
              <button class="owner-btn-cancel" @click.stop="onCancel(order)">
                주문 취소
              </button>
            </template>

            <template v-else-if="order.status === '03'">
              <button class="owner-btn-white" @click.stop="onAssign(order)">
                배차하기
              </button>
            </template>

            <template v-else-if="order.status === '04'">
              <div class="rider-info">
                <div>{{ order.riderName || "배달 중" }}</div>
              </div>
            </template>

            <template v-else>
              <span>-</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 주문 상세 모달 -->
  <DashboardOrderDetail
    v-if="isModalOpen"
    :order="selectedRow"
    @close="isModalOpen = false"
  />
</template>

<style scoped lang="scss">
.white-card {
  padding: 0;
}

.main-grid {
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

.order-list {
  display: flex;
  flex-direction: column;
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
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
  flex: 0 0 auto;
  background: #f5f7fa;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 15px 15px 0 0;
  text-align: center;
  z-index: 1;
}

.underline {
  border-bottom: 1px solid #e5e7eb;
  color: #333;
}

.address {
  display: flex;
  justify-content: center;
  text-align: left;
}

.grid-body {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.empty-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.rider-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  color: #333;
}

.owner-btn-white {
  margin-right: 8px;
}
</style>
