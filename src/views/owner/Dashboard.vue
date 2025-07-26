<script setup>
import OrderCard from "@/components/owner/OrderCard.vue";
import OrderDelivery from "@/components/owner/OrderDelivery.vue";
import OrderPrepare from "@/components/owner/OrderPrepare.vue";
import { useOrderStore } from "@/stores/orderStore";
import { inject, computed } from "vue";

const orderStore = useOrderStore();

// 오늘 주문 수
const today = new Date();

const formatYMD = (date) => {
  return date.toISOString().slice(0, 10); // '2025-07-25'
};
const totalOrderCount = computed(() => {
  const todayStr = formatYMD(today);
  return orderStore.orders
  .filter(order => formatYMD(new Date(order.created)) === todayStr)
  .length;
});

// 오늘 배달 수
const totalDeliveryCount = computed(() => {
  const todayStr = formatYMD(today);
  return orderStore.completedList
  .filter(order => formatYMD(new Date(order.created)) === todayStr)
  .length;
});

// 오늘 매출 수
const totalPrice = computed(() => {
  const todayStr = formatYMD(today);
  return orderStore.completedList
  .filter(order => formatYMD(new Date(order.created)) === todayStr)
  .reduce((sum, order) => sum + Math.round((order.amount || 0) / 10000), 0)
});

// 사장 대표자 이름
const ownerName = inject("ownerName", "");
</script>

<template>
  <div class="owner-title1">대시보드</div>
  <div class="owner-title2">
    어서오세요! {{ ownerName }} 사장님, 관리자 페이지에 다시 오신 것을
    환영합니다!
  </div>

 <div class="total-wrap">
        <div class="total-box">
          <div @click="b" class="circle"></div>
          <div>
            <span>{{ totalOrderCount }}</span>
            <span>오늘 주문 수</span>
            <div class="change-rate">
              <span class="icon-up">↑</span><span>4%</span>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="circle"></div>
          <div>
            <span>{{ totalDeliveryCount }}</span>
            <span>오늘 배달 수</span>
            <div class="change-rate">
              <span class="icon-up">↑</span><span>4%</span>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="circle"></div>
          <div>
            <span>{{ totalPrice }}만</span>
            <span>총 매출</span>
            <div class="change-rate">
              <span class="icon-down">↓</span><span>12%</span>
            </div>
          </div>
        </div>
      </div>
   

  <div class="padding">
    <div class="d-flex board">
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

<style scoped lang="scss">
.board {
  gap: 83px;
  font-family: "Pretendard", sans-serif;
}

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

/* 차트 */

.total-wrap {
  font-family: "Pretendard", sans-serif;
    display: flex;
    padding-left: 13px;
    gap: 85px;
    margin-top: 5px;
    margin-bottom: 20px;
    .circle {
      background-color: #ff6666;
      border-radius: 100%;
      width: 85px;
      height: 85px;
      margin-left: 65px;
      margin-right: 30px;
    }
    .total-box {
      align-items: center;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 2px 2px 5px 1px #c6c6c6;
      display: flex;
      height: 150px;
      width: 398px;
      :last-child {
        display: block;
      }
      span {
        display: block;
      }
      span:nth-of-type(1) {
        line-height: 1;
        font-size: 40px;
        font-weight: 800;
      }
      span:nth-of-type(3) {
        color: #c6c6c6;
      }

      .change-rate {
        display: flex;
        align-items: center;
        gap: 5px;
        .icon-up {
          width: 16px;
          height: 16px;
          background-color: #e0f9f1;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 10px !important;
          font-weight: 800;
          color: #00a389;
        }
        .icon-down {
          width: 16px;
          height: 16px;
          background-color: #ffe7e7;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 10px !important;
          font-weight: 800;
          color: #ff5b5b;
        }
        span {
          color: #c6c6c6;
          font-size: 12px;
        }
      }
    }
  }

</style>
