<script setup>
import OrderCard from "@/components/owner/OrderCard.vue";
import OrderDelivery from "@/components/owner/OrderDelivery.vue";
import OrderPrepare from "@/components/owner/OrderPrepare.vue";
import { useOrderStore } from "@/stores/orderStore";
import { inject } from "vue";

const orderStore = useOrderStore();

const ownerName = inject("ownerName", "");
</script>

<template>
  <div class="owner-title1">대시보드</div>
  <div class="owner-title2">
    어서오세요! {{ ownerName }} 사장님, 관리자 페이지에 다시 오신 것을
    환영합니다!
  </div>

  <div class="padding">
    <div class="d-flex gap-5">
      <div style="width: 400px">
        <OrderCard :orders="orderStore.orderedList" />
      </div>
      <div style="width: 400px">
        <OrderPrepare :orders="orderStore.preparingList" />
      </div>
      <div style="width: 400px">
        <OrderDelivery :orders="orderStore.deliveringList" />
      </div>
    </div>
  </div>
</template>

<style>
.owner-title1 {
  font-size: 30px;
  font-weight: bold;
  padding-left: 12px;
  padding-bottom: 2px;
}

.owner-title2 {
  padding-left: 12px;
  padding-bottom: 10px;
  color: #686868;
}

.padding {
  padding-left: 12px;
}

body {
  font-family: "Noto Sans KR", sans-serif;
}
</style>
