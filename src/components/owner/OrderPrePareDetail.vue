<script setup>
import { modifyStatus } from "@/services/orderService";
import { useOrderStore } from "@/stores/orderStore";

const orderStore = useOrderStore();
const props = defineProps({
  order: Object,
});

console.log(props.order);

const dlivery = async () => {
  const body = {
    orderId: props.order.id,
    status: "DELIVERING",
  };
  const res = await modifyStatus(body);
  if (res.status !== 200) {
    alert("에러");
    return;
  }

  await orderStore.fetchOrders(props.order.storeId);
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
    </div>

    <div class="order-actions justify-content-center">
      <button class="accept-btn" @click="dlivery">배달 배차</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
  width: 130px;
  transition: background-color 0.3s, color 0.3s;
}

.accept-btn:hover {
  background: #d44b4a;
}
.accept-btn:active {
  background: #b23837;
}
</style>
