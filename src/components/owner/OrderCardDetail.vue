<script setup>
import { modifyStatus } from '@/services/orderService';

const props = defineProps({
  order: Object,
});

console.log(props.order);

const accepct = async() => {
  const body = {
    orderId: props.order.id,
    status: "PREPARING",
  }
  const res = await modifyStatus(body);
  if(res.status !== 200) {
    alert("에러");
    return;
  }
}
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
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.cancel-btn {
  background: white;
  border: 1px solid #f66463;
  color: #f66463;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.accept-btn {
  background: #f66463;
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
}
</style>
