<script setup>
import OrderCard from "@/components/owner/OrderCard.vue";
import OrderDelivery from "@/components/owner/OrderDelivery.vue";
import OrderPrepare from "@/components/owner/OrderPrepare.vue";
</script>

<template>
  <div class="owner-title1">대시보드</div>
  <div class="owner-title2">
    어서오세요! {{}} 사장님, 관리자 페이지에 다시 오신 것을 환영합니다!
  </div>

  <div class="padding">
    <div class="d-flex">
      <div style="flex: 1">
        <OrderCard />
      </div>
      <div style="flex: 1">
        <OrderPrepare />
      </div>
      <div style="flex: 1">
        <OrderDelivery />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>