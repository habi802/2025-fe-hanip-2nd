<script setup>
import OrderDetails from '@/components/owner/orderInfo/OrderDetails.vue'
import OrderStatus from '@/components/owner/orderInfo/OrderStatus.vue'
import OrderedMenu from '@/components/owner/orderInfo/OrderedMenu.vue'
import PaymentDetails from '@/components/owner/orderInfo/PaymentDetails.vue'

//defineEmits(['close'])

</script>
<template>
  <!-- @click="$emit('row-click', { id: n, time: '17:12' }) -->
  <div class="gray-box" @click.self="$emit('close')">
  </div>
  <div class="modal-wrap white-card">
    <div class="modal-title">
      <span>주문상세</span>
      <span style="color: var(--grey1); font-size: 16px;">　002-000-0000 (주문번호(임시))</span>
      <hr>
    </div>
    <div class="modal-contents">
      <div class="op d-flex flex-column">
        <OrderDetails></OrderDetails> 
        <PaymentDetails></PaymentDetails>
      </div>
      <OrderedMenu></OrderedMenu>
    </div>
    <div class="btn-wrap">
      <button class="owner-btn-cancel">주문 거절</button>
      <button class="owner-btn-white">주문 수락</button>
      <button class="owner-btn-white">확인</button>
    </div>
  </div><!-- modal-wrap 끝-->
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

  .modal-title{
    width: 100%;
    text-align: start;
    font-size: 24px;
    
  }

  .modal-contents{
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 50px;
    flex: 1;  // 남는 공간 다 채우기
    div{
      justify-content: space-between;
    }
  }

  .btn-wrap{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }
}
</style>