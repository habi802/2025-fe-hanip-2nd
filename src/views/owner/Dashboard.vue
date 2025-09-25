<script setup>
import OrderCard from "@/components/owner/OrderCard.vue";
import OrderDelivery from "@/components/owner/OrderDelivery.vue";
import OrderPrepare from "@/components/owner/OrderPrepare.vue";
import { useOwnerStore } from "@/stores/account";
import { useOrderStore } from "@/stores/orderStore";
import { inject, computed, onMounted, onUnmounted, ref, reactive, watch } from "vue";
import { patchIsOpen } from "@/services/storeService";
import { patchPreparingOrder, patchDeliveredOrder, patchCanceledOrder } from '@/services/orderService';

const ownerStore = useOwnerStore();
const orderStore = useOrderStore();

// SSE 
let eventSource = null;

function connectSSE(storeId) {
  eventSource = new EventSource(`http://localhost:8080/api/sse/order/${storeId}`);

  eventSource.addEventListener("connect", (e) => {
    console.log("연결 성공:", e.data);
  });

  eventSource.addEventListener("order", async (e) => {
    console.log("새로운 주문:", e.data);
    const storeId = ownerStore.state.storeData.id;
    await Promise.all([
      orderStore.fetchPaidOrders(storeId)
  ]);
});

  eventSource.onerror = (err) => {
    console.error("SSE 에러 발생:", err);
    // 연결이 끊겼을 수 있으니 재연결 시도
    setTimeout(() => {
      console.log("SSE 재연결 시도...");
      connectSSE(storeId);
    }, 3000);
  };
}

// mounted 시 실행
onMounted(() => {
  connectSSE(ownerStore.state.storeData?.id);
});


// 가게 ID 변경 감시
watch(
  () => ownerStore.state.storeData?.id,
  async (storeId) => {
    if (!storeId) return;
    await Promise.all([
      orderStore.fetchPaidOrders(storeId),
      orderStore.fetchPreparingOrders(storeId),
      orderStore.fetchDeliveredOrders(storeId),
    ]);
  },
  { immediate: true }
);

const hasOrders = computed(() =>
  orderStore.paidOrders.length > 0 ||
  orderStore.preparingOrders.length > 0 ||
  orderStore.deliveredOrders.length > 0
);


// 주문 차트
 const today = new Date();

const isSameDayKST = (date1, date2) => {
  const d1 = new Date(date1.getTime() + 9 * 60 * 60 * 1000); // UTC → KST
   const d2 = new Date(date2.getTime() + 9 * 60 * 60 * 1000);
   return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);
 };

// 오늘 주문 수
// const totalOrderCount = computed(() => {
//   return orderStore.orders.filter((order) =>
//   isSameDayKST(new Date(order.created), new Date())
// ).length;
//});

// 오늘 배달 수
// const totalDeliveryCount = computed(() => {
//   return orderStore.completedList.filter((order) =>
//   isSameDayKST(new Date(order.created), new Date())
// ).length;
// });

// 오늘 취소된 주문 수
// const totalCanceledCount = computed(() => {
//   return orderStore.canceledList.filter((order) =>
//   isSameDayKST(new Date(order.created), new Date())
// ).length;
// });

// 오늘 매출 수
// const totalPrice = computed(() => {
//   return orderStore.completedList
//   .filter((order) => isSameDayKST(new Date(order.created), new Date()))
//   .reduce((sum, order) => sum + Math.round((order.amount || 0) / 10000), 0);
// });


// 시계
const currentDate = ref('');
const date = () => {
  const now = new Date();
  
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const day = dayNames[now.getDay()];

  currentDate.value = `${month}월 ${date}일 (${day})`;
};

const hours = ref("");
const minutes = ref("");
const seconds = ref("");
const showColon = ref(true);

const updateClock = () => {
  const now = new Date();
  hours.value = now.getHours().toString().padStart(2, "0");
  minutes.value = now.getMinutes().toString().padStart(2, "0");
  seconds.value = now.getSeconds().toString().padStart(2, "0");
  showColon.value = !showColon.value; // 콜론 깜빡이게
};

onMounted( async () => {
  date();
  updateClock();
  const timer = setInterval(updateClock, 1000);
  onUnmounted(() => clearInterval(timer));
});

//영업중/정비중 버튼
const isOpen = computed(() => ownerStore.state.storeData.isOpen);
const toggleStoreStatus = async () => {
  if (confirm(isOpen.value ? "영업을 중단하시겠습니까?" : "영업을 시작하시겠습니까?")) {
    const res = await patchIsOpen(ownerStore.state.storeData.id);
    if (res && res.status === 200) {
      ownerStore.setIsOpen();
    }
  }
};

// 주문 상태 변경
const handleAccept = async (orderId) => {
  console.log("주문 수락:", orderId);
  await patchPreparingOrder(orderId);
  const storeId = ownerStore.state.storeData.id;
  await Promise.all([
    orderStore.fetchPaidOrders(storeId),
    orderStore.fetchPreparingOrders(storeId),
  ]);
};

const handleCancel = async (orderId) => {
  console.log("주문 취소:", orderId);
  await patchCanceledOrder(orderId)
  const storeId = ownerStore.state.storeData.id;
  await Promise.all([
    orderStore.fetchPaidOrders(storeId),
  ]);
};

const handleAssign = async (orderId) => {
  console.log("배차하기:", orderId);
  await patchDeliveredOrder(orderId);
  const storeId = ownerStore.state.storeData.id;
  await Promise.all([
    orderStore.fetchPreparingOrders(storeId),
    orderStore.fetchDeliveredOrders(storeId),
  ]);
  // await apiAssign(orderId);
  // await fetchDeliveredOrders();
};
</script>

<template>
  <div class="wrap">
    <div class="total-wrap" > 
      <div class="datetime white-card text-center" style="grid-row: span 2;">
        <span class="font-xlg"> {{ currentDate }} </span>
        <transition name="fade">
          <div class="font-xlg">
            {{ hours }}<span :class="{ blink: showColon }">:</span>{{ minutes }}<span :class="{ blink: showColon }">:</span>{{ seconds }}
          </div>
        </transition>
      </div>
      <div class="total-box white-card">
          <span class="total-title font-nomal">오늘 주문 수</span>
          <span class="font-xxlg">{{ totalOrderCount || "0"}}</span>
      </div>
      <div class="total-box white-card">
          <span class="total-title font-nomal">오늘 배달 수</span>
          <span class="font-xxlg">{{ totalDeliveryCount || "0" }}</span>
      </div>
      <div class="total-box white-card">
          <span class="total-title font-nomal">취소된 주문</span>
          <span class="font-xxlg">{{ totalCanceledCount || "0" }}</span>
      </div>
      <div class="total-box white-card">
          <span class="total-title font-nomal">총 매출</span>
          <span class="font-xxlg">{{ totalPrice || "0" }}만</span>
      </div>
      <button class="green-btn font-xxlg" style="grid-column: span 2;" 
      :class="['font-xxlg', isOpen ? 'green-btn' : 'darkred-btn']"  @click="toggleStoreStatus">{{ isOpen ? '영업 중' : '정비 중' }}</button>
      <RouterLink to="/owner/orders" class="total-box whitepink-btn"> <span class="font-xxlg">주문관리</span> </RouterLink>
      <RouterLink to="/owner/status" class="total-box whitepink-btn"> <span class="font-xxlg">가게상태</span> </RouterLink>
    </div>
    <div v-if="!isOpen" class="text-center text-danger fw-bold">
        🚫 영업 중단! 주문 받기를 중단했습니다.
    </div>
    <div v-if="hasOrders" class="order-status d-flex flex-column gap-2" style="margin-bottom: 10px; ">
      <OrderCard title="주문대기" 
      :orders="orderStore.paidOrders"
      @accept="handleAccept"
      @cancel="handleCancel"
      @assign="handleAssign"/>
      <OrderCard title="조리대기" 
      :orders="orderStore.preparingOrders"
      @accept="handleAccept"
      @cancel="handleCancel"
      @assign="handleAssign"/>
      <OrderCard title="배달현황" 
      :orders="orderStore.deliveredOrders"
      @accept="handleAccept"
      @cancel="handleCancel"
      @assign="handleAssign"/>
    </div>
    <div v-else>
    주문정보 로딩 중...
    </div>
  </div>
</template>

<style scoped lang="scss">

/* 상단 8개 카드 */
.total-wrap {
  font-family: "Pretendard", sans-serif;
  margin-top: 5px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 한 줄에 4개 */
  gap: 15px; /* 카드 사이 간격 */

  //시계
  .datetime{
    width: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;     
    height: 100%;
    gap: 1rem; 
    
    .blink {
    opacity: 0;
    transition: opacity 0.3s;
    }
  }
  .total-box {
    //width: 280px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .total-title {
      color: #c6c6c6;
    }
  }
}
</style>
