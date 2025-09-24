<script setup>
import { onMounted, ref } from "vue";
import { getOrderDelivery , patchDeliveryCompleted } from "@/services/riderService";

const order = ref({})
onMounted(async ()=>{

  await fetchOrders();

  try {
    const res = await getOrderDelivery();
    order.value = res.data.resultData ?? {}; // 안전하게 데이터 할당
    console.log("order:", order.value);
  } catch (e) {
    console.error("주문 정보 로드 실패:", e);
  }
});


//주문정보 불러오기
const fetchOrders = async() => {
  try {
    const res = await getOrderDelivery();
    order.value = res.data.resultData ?? {};
    console.log("로드된 주문: ", order.value);

    // 새로운 주문이 로드되면 isCallAccepted는 false여야 다음 콜 수락이 가능함
    isCallAccepted.value = false;
    isFoodPickedUp.value = false;
    isDeliveryCompleted.value = false;

    // 만약 주문이 바로 없으면 "현재 대기 중인 주문이 없습니다" 등으로 표시 가능
    if (Object.keys(order.value).length === 0) {
        console.log("현재 대기 중인 새로운 주문이 없습니다.");
    }
  }catch (e) {
    console.error("주문 정보 로드 실패:", e);
    order.value = {}; // 실패 시에도 초기화 유지
    isCallAccepted.value = false; // 에러 시에도 상태 초기화
    isFoodPickedUp.value = false;
    isDeliveryCompleted.value = false;
  }
}


//콜 수락 버튼
const isCallAccepted = ref(false);
const handleAcceptCall = () => {
  if (!isCallAccepted.value && Object.keys(order.value).length > 0) { // 주문이 있을 때만 수락 가능
    isCallAccepted.value = true;
    console.log("콜이 수락되었습니다! 주문:", order.value.id);
  } else if (Object.keys(order.value).length === 0) {
    console.log("현재 대기 중인 주문이 없습니다.");
  } else {
    console.log("이미 콜을 수락했습니다.");
  }
};

//음식 픽업 버튼
const isFoodPickedUp = ref(false);
const handleFoodPickup = () => {
  if (isCallAccepted.value && !isFoodPickedUp.value) { // 콜이 수락되었고 아직 픽업 전일 때
    isFoodPickedUp.value = true;
    console.log("음식을 픽업했습니다! 주문:", order.value.id);
  } else {
    console.log("픽업 조건이 충족되지 않았거나 이미 픽업했습니다.");
  }
};

//배달완료 버튼
const isDeliveryCompleted = ref(false);
const handleCompleteDelivery = async () => {
  if (isFoodPickedUp.value && !isDeliveryCompleted.value) {
    // 먼저 UI 상태부터 업데이트 (통신 전에)
    isDeliveryCompleted.value = true;
    
    await patchDeliveryCompleted(order.value.id);

    // 잠깐 배달완료 메시지 보여주기 (선택사항)
    setTimeout(() => {
      // 3. 모든 상태 초기화해서 대기 화면으로 돌아가기
      isCallAccepted.value = false;
      isFoodPickedUp.value = false;
      isDeliveryCompleted.value = false;
      order.value = {}; // 주문 정보도 초기화
      
      // 4. 여기서 통신은 안 하고 그냥 "대기중" 상태로만 UI 변경
      console.log("대기 화면으로 전환 완료!");
    }, 1000); // 1초 후 초기화 (너무 빨리 바뀌면 사용자가 못 볼 수 있으니까)
  }
  


};



</script>

<template>
  <div class="rider-container">
    <!-- 상단 로고 -->
    <header class="rider-header">
      <img src="@/imgs/rider.png" alt="rider logo" class="logo" />
    </header>

    <main class="rider-main">

      <section class="pickup">
        <h4 class="box-title">음식픽업</h4>
        <div class="info-box" :class="{'active-box' :  isCallAccepted && !isFoodPickedUp }">
          <p class="store-name">{{ order.storeName || "배달대기중" }}</p>
          <p class="store-addr">
            {{ order.storeAddress || "" }}
          </p>
        </div>
      </section>

      <div class="arrow">&gt;</div>

      <section class="customer">
        <h4 class="box-title">고객주소</h4>
        <div class="info-box" :class="{'active-box' : isFoodPickedUp }">
          <p>
            {{ order.address || "" }}
          </p>
        </div>
      </section>

      <aside v-if="isCallAccepted && Object.keys(order).length > 0" class="order-info">
        <ul>
          <li><strong>주문번호</strong> <span> 00-{{ order.id || "" }}</span></li>
          <li><strong>메뉴</strong> <span>{{ order.menu || "" }}</span></li>
          <li><strong>결제금액</strong> <span>{{ order.amount ? order.amount.toLocaleString() : "" }}</span></li>
          <li><strong>요청사항</strong> <span>{{ order.riderRequest || "" }}</span></li>
        </ul>
      </aside>

    </main>

    <footer class="rider-footer">
      <button v-if="Object.keys(order).length > 0 && !isCallAccepted" class="pickup-btn" @click="handleAcceptCall">콜 수락</button>
      <button v-if="isCallAccepted && !isFoodPickedUp" class="pickup-btn" @click="handleFoodPickup">음식 픽업</button>
      <button v-if="isFoodPickedUp && !isDeliveryCompleted" class="pickup-btn" @click="handleCompleteDelivery">배달 완료</button>
    </footer>

    <!-- 배달 완료 시 보여줄 메시지 -->
    <p v-if="isDeliveryCompleted && !isCallAccepted" class="completed-message">배달 완료! 다음 주문을 기다리는 중...</p>
  </div>

  
</template>

<style scoped>
body {
  background: #ffffff;
  margin: 0;
  height: 100vh;
}

.rider-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: "Noto Sans KR", sans-serif;
}

.rider-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #f8f8f8;
  height: 142px;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;
}

.rider-header .logo {
  width: 201.78px;   
  height: 108px;     
  object-fit: contain;
  margin-bottom: 10px;
}

.rider-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.rider-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  padding: 20px;
}

.box-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
}

.info-box {
  width: 500px;
  height: 300px;
  padding: 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
  text-align: center;
  font-size: 16px;
  border: 2px solid #ff6868;
  box-sizing: border-box;
  font-weight: bold;
}

.active-box {
  background: #ff6868;
  color: #fff;
}

.store-name {
  font-size: 32px;
}

.store-addr {
  font-size: 16px;
  margin-top: 10px;
}

.arrow {
  font-size: 60px;
  color: #ff6868;
  align-self: center;
}

.order-info {
  width: 300px;
  padding: 20px;
  margin-top: 50px;
}

.order-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-info li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  color: #000;
  line-height: 26px;
}

.order-info ul li + li {
  margin-top: 10px;
}

.rider-footer {
  text-align: center;
  background: #f8f8f8;
  height: 200px;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pickup-btn {
  background: #ffffff;
  border: 2px solid #ff6868;
  color: #ff6868;
  font-size: 20px;
  font-weight: bold;
  padding: 18px 60px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.pickup-btn:hover {
  background: #ff6868;
  color: #ffffff;
}
</style>
