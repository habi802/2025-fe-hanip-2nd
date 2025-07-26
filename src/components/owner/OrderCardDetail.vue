<script setup>
import { modifyStatus } from "@/services/orderService";
import { useOrderStore } from "@/stores/orderStore";

const orderStore = useOrderStore();
const props = defineProps({
  order: Object,
});

console.log(props.order);

const accepct = async () => {
  const body = {
    orderId: props.order.id,
    status: "PREPARING",
  };
  const res = await modifyStatus(body);
  if (res.status !== 200) {
    alert("에러");
    return;
  }

  // 상태 업데이트
  await orderStore.fetchOrders(props.order.storeId);
};

const cancel = async () => {
  const body = {
    orderId: props.order.id,
    status: "CANCELED",
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
  return new Date(isoStr).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
      <div class="text-black-50">{{ formatDateTime(order.created) }}</div>
    </div>

    <div class="order-menu"></div>

    <div class="order-actions">
      <button class="cancel-btn" @click="cancel">주문 취소</button>
      <button class="accept-btn" @click="accepct">주문 수락</button>
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
  justify-content: center;
  /* margin-top: 20px; */
  display: flex;
  gap: 20px;
}

.cancel-btn {
  background: white;
  border: 1px solid #f66463;
  color: #f66463;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.cancel-btn:hover {
  background: #eeeeee;
}

.cancel-btn:active {
  background: #afafaf;
}

.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.accept-btn:hover {
  background: #d44b4a;
}
.accept-btn:active {
  background: #b23837;
}
</style>
