<script setup>
import { modifyStatus } from "@/services/orderService";
import { useOrderStore } from "@/stores/orderStore";

const orderStore = useOrderStore();

const props = defineProps({
  order: Object,
});

console.log("deliveryRes", props.order);

const orderComplete = async () => {
  const body = {
    orderId: props.order.id,
    status: "COMPLETED",
  };
  const res = await modifyStatus(body);
  if (res.status !== 200) {
    alert("에러");
    return;
  }

  // 상태 업데이트
  await orderStore.fetchOrders(props.order.storeId);
};

// 날짜 파싱
const formatDateTime = (isoStr) => {
  const date = new Date(isoStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${min}`;
};
</script>

<template>
  <div class="order-card shadow">
    <div class="order-info">
      <div>닉네임: {{ order.userName }}</div>
      <div>주소: {{ order.address }}</div>
      <div v-for="(menu, index) in order.menus" :key="index">
        메뉴: {{ menu.name }} | 수량: {{ menu.quantity }}
      </div>
      <div>총 가격: {{ order.amount.toLocaleString() }}원</div>
      <div class="text-black-50">{{ formatDateTime(order.updated) }}</div>
    </div>
    <!-- 임시 완료 버튼 -->
    <div class="d-flex justify-content-center mt-3">
      <button class="complete-btn" @click="orderComplete">완료</button>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
}

.order-info,
.order-menu {
  display: inline-block;
  vertical-align: top;
}

.order-info {
  width: 90%;
  font-weight: 500;
  line-height: 2;
}

.order-menu {
  width: 55%;
  text-align: right;
  line-height: 2;
}

.order-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.complete-btn {
  background: #3978ff;
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
  width: 130px;
  transition: background-color 0.3s, color 0.3s;
}

.complete-btn:hover {
  background: #3d57c7;
}
.acomplete-btn:active {
  background: #b23837;
}
</style>
