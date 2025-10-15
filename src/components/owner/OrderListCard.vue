<script setup>
import { ref } from 'vue';
const props = defineProps({
  cancel: { type: Boolean, default: false },
  order: { type: Object, required: true }
  //Object,
});
const emit = defineEmits(["selectOrder"]);

// 포맷
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${
    ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
  })`;
};

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
  <div class="order-card pb-3" @click="emit('selectOrder', order.orderId)">
    <div class="order-content" :class="{'cancel' : cancel}"  >
      <div>
        <span v-if="cancel" style="font-size: 12px; font-weight: 700;">취소된주문</span>
        <span>주문번호</span>
        <span class="order-num">{{order.orderId}}</span>
      </div>
      <div>
        <span>{{formatDate(order.createdAt)}}</span>
        <span class="order-time">{{formatTime(order.createdAt)}}</span>
      </div>
      <div>
        <span>{{ order.userName }}</span>
        <span class="order-address">{{ order.address }} </span>
      </div>
      <div>
        <span>총합계</span>
        <span class="order-account">{{Number(order.amount ?? 0).toLocaleString()}} 원</span>
      </div>
    </div><!--order-content 끝-->
  </div><!-- order-card 끝-->

  <!-- <div v-if="order.status === 'CANCELED'" class="orders-list2-wrap2 pb-4">
    <div
      class="orders-list shadow"
      v-if="order"
      @click="emit('selectOrder', order)"
    >
      <div>
        <span style="font-weight: 800; color: #ff4e4e">취소된 주문</span>
        <span>주문번호</span>
        <span class="order-num">01-00-0-{{ order.id }}</span>
      </div>
      <div>
        <span>{{ order.userName }} 님</span>
        <span class="order-address">{{ order.address }}</span>
      </div>
      <div>
        <span>{{ formatDate(order.updated) }}</span>
        <span class="order-time">{{
          new Date(order.updated).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        }}</span>
      </div>
      <div>
        <span>총합계</span>
        <span class="order-account"
          >{{ order.amount.toLocaleString() }} 원</span
        >
      </div>
    </div>
  </div>

  <div v-else class="orders-list-wrap pb-4">
    <div
      class="orders-list shadow"
      v-if="order"
      @click="emit('selectOrder', order)"
    >
      <div>
        <span>주문번호</span>
        <span class="order-num">01-00-0-{{ order.id }}</span>
      </div>
      <div>
        <span>{{ order.userName }} 님</span>
        <span class="order-address">{{ order.address }}</span>
      </div>
      <div>
        <span>{{ formatDate(order.updated) }}</span>
        <span class="order-time">{{
          new Date(order.updated).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        }}</span>
      </div>
      <div>
        <span>총합계</span>
        <span class="order-account"
          >{{ order.amount.toLocaleString() }} 원</span
        >
      </div>
    </div>
  </div> -->

</template>

<style scoped lang="scss">
.order-card {
  width: 100%;
  .order-content {
    width: 100%;
    height: 130px;
    background-color: #fff;
    border-radius: var(--card-lg-radius);
    box-shadow: var(--card-shadow);
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-width: 0;
      height: 100%;
      span:first-child {
        display: block;
        font-size: 18px;
        font-weight: 100;
      }
      .order-num {
        font-size: 20px;
        color:var(--grey2);
      }
      .order-time {
        font-size: 30px;
      }
      .order-address {
        display: inline-block;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 18px;
      }
      .order-account {
        color: #ff8989;
        font-size: 30px;
        font-weight: 700;
      }
    }
  }
  .order-content:hover {
    background-color: #ff8989!important;
    span {
      color: #fff!important;
    }
  }
  
  .cancel{
    background-color: var(--grey1) !important;
    span{
    color: var(--grey2) !important;
    }
    
  }
  .cancel:hover{
    background-color: var(--grey2) !important;
    span{
      color: var(--grey1) !important;
    }
  }
}


</style>
