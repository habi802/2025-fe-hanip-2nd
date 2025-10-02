<script setup>
import OrderDetails from '@/components/owner/orderInfo/OrderDetails.vue'
import OrderedMenu from '@/components/owner/orderInfo/OrderedMenu.vue'
import PaymentDetails from '@/components/owner/orderInfo/PaymentDetails.vue'

defineProps({
  order: { type: Object, default: () => ({}) },
  tableHeight: { type: String, default: "1000px" },
});

defineEmits(["close", "accept", "cancel", "assign"]);
</script>

<template>
  <div class="gray-box" @click.self="$emit('close')"></div>
  <div class="modal-wrap white-card">
    <div class="modal-title">
      <span>주문상세</span>
      <span style="color: var(--grey1); font-size: 16px;">
        {{ order.orderId }} (주문번호)
      </span>
      <hr />
    </div>

    <div class="modal-contents">
      <div class="op d-flex flex-column">
        <OrderDetails :order="order" />
        <PaymentDetails :order="order" />
      </div>
      <OrderedMenu :order="order" tableHeight="400px" />
    </div>

    <div class="btn-wrap">
      <!-- 상태 02: 결제 완료 -->
      <template v-if="order.status === 'PAID'">
        <button class="owner-btn-cancel" @click="$emit('cancel', order), $emit('close')">
          주문 거절
        </button>
        <button class="owner-btn-white" @click="$emit('accept', order), $emit('close')">
          주문 수락
        </button>
        <button class="owner-btn-white" @click="$emit('close')">
          확인
        </button>
      </template>

      <!-- 상태 03: 음식준비중 -->
      <template v-else-if="order.status === 'PREPARING'">
        <button class="owner-btn-white" @click="$emit('assign', order), $emit('close')">
          배차하기
        </button>
        <button class="owner-btn-white" @click="$emit('close')">
          확인
        </button>
      </template>

      <!-- 상태 04, 05: 배달중 / 배달완료 -->
      <template v-else-if="['DELIVERED','COMPLETED'].includes(order.status)">
        <button class="owner-btn-white" @click="$emit('close')">
          확인
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gray-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99;
}
.modal-wrap {
  position: fixed;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .modal-title {
    width: 100%;
    text-align: start;
    font-size: 24px;
  }

  .modal-contents {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 50px;
    flex: 1; // 남는 공간 다 채우기
    div {
      justify-content: space-between;
    }
  }

  .btn-wrap {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }
}
</style>
