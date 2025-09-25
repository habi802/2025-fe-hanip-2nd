<script setup>
import OrderListCard from "@/components/owner/OrderListCard.vue";
import { computed, ref, reactive, inject } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { deleteOrder, getOrderByDate } from "@/services/orderService";
import { useAccountStore, useOwnerStore } from "@/stores/account";
import OrderDetails from '@/components/owner/orderInfo/OrderDetails.vue'
import OrderStatus from '@/components/owner/orderInfo/OrderStatus.vue'
import OrderedMenu from '@/components/owner/orderInfo/OrderedMenu.vue'
import PaymentDetails from '@/components/owner/orderInfo/PaymentDetails.vue'



const orderStore = useOrderStore();
const user = useAccountStore();
const nonOrderedOrders = computed(() => orderStore.nonOrderedList);
const selectedOrder = ref(null);

// 부트스트랩 alert
let alertId = 0;

const alerts = reactive([]);

const showAlert = (message, type = "alert-danger") => {
  const id = ++alertId;
  const newAlert = { id, message, type };
  alerts.push(newAlert);

  // 자동 삭제 (3초 뒤)
  setTimeout(() => {
    removeAlert(id);
  }, 3000);
};

const removeAlert = (id) => {
  const index = alerts.findIndex((a) => a.id === id);
  if (index !== -1) alerts.splice(index, 1);
};

// 전체 주문 수
const totalOrderCount = computed(() => nonOrderedOrders.value.length);

// 전체 배달 수
const totalCompelteOrderCount = computed(
  () =>
    nonOrderedOrders.value.filter(
      (order) => order.status?.trim().toUpperCase() === "COMPLETED"
    ).length
);

// 취소된 주문
const totalCanceledOrderCount = computed(
  () =>
    nonOrderedOrders.value.filter((order) => order.status === "CANCELED").length
);

// 전체 매출
const totalSales = computed(() =>
  nonOrderedOrders.value
    .filter((order) => order.status?.trim().toUpperCase() === "COMPLETED")
    .reduce((sum, order) => sum + Math.round((order.amount || 0) / 10000), 0)
);

// 주문 내역으로 스크롤
const orderDetail = ref(null);

const handleSelectOrder = (order) => {
  console.log("선택된 주문:", order);
  selectedOrder.value = order;

  // 스크롤
  if (orderDetail.value) {
    orderDetail.value.scrollIntoView({ behavior: "smooth" });
  }
};

// 삭제
const deleteOrderOne = async () => {
  if (!["COMPLETED", "CANCELED"].includes(selectedOrder.value?.status)) {
    showAlert("진행 중인 주문은 삭제하실 수 없습니다.");
    return;
  }

  // 삭제 로직
  const res = await deleteOrder(selectedOrder.value?.id);
  console.log("res: ", res.data.resultData);
  if (res.status !== 200) {
    showAlert("에러");
    return;
  }
  showAlert("정상적으로 삭제됐습니다.", "alert-success");
  const owner = useOwnerStore();
  if (!owner.storeId) {
    await owner.fetchStoreInfo();
  }
  await orderStore.fetchOrders(owner.storeId);

  selectedOrder.value = null;
};

// 배달 상태 치환
const statusText = computed(() => {
  if (!selectedOrder.value || !selectedOrder.value.status) return "상태 없음";
  switch (selectedOrder.value.status) {
    case "PREPARING":
      return "음식준비중";
    case "DELIVERING":
      return "배달중";
    case "CANCELED":
      return "취소됨";
    case "COMPLETED":
      return "완료됨";
    default:
      return "기타 상태";
  }
});

// 더보기
const visibleCount = ref(5);
const visibleOrders = computed(() => {
  return nonOrderedOrders.value
    .filter((order) => order.isDeleted !== 1)
    .slice(0, visibleCount.value);
});
const loadMore = () => {
  visibleCount.value += 5;
};

// 날짜
const formatDateTime = (isoStr) => {
  return new Date(isoStr).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 사장 대표자 이름
const ownerName = inject("ownerName", "");

// 가게 아이디
const storeId = inject("storeId", "");

// 날짜 조회
const selectedLabel = ref('');

// 날짜 식
const today = new Date();
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const data = reactive({
  storeId: "",
  startDate: "",
  endDate: "",
});

const selectRange = async (range) => {
  const end = new Date();
  end.setDate(end.getDate() + 1);
  let start;
  switch (range) {
    // Todo : 하루조회기간도 만들어서 이걸 디폴트로..!
    case "1d":
      selectedLabel.value = "오늘";
      console.log("추후작업")
      break;
    case "7d":
      selectedLabel.value = "최근 1주일";
      start = new Date();
      start.setDate(end.getDate() - 7);
      data.storeId = storeId?.value;
      data.startDate = formatDate(start);
      data.endDate = formatDate(end);
      break;
    case "1m":
      selectedLabel.value = "최근 1개월";
      start = new Date();
      start.setMonth(end.getMonth() - 1);
      data.storeId = storeId?.value;
      data.startDate = formatDate(start);
      data.endDate = formatDate(end);
      break;
    case "all":
      selectedLabel.value = "전체";
      selectedLabel.value = "전체";
      data.storeId = storeId?.value;
      data.startDate = null;
      data.endDate = null;
      break;
  }
  // console.log("res.data.resultData: ",data.storeId)
  const res = await getOrderByDate(data);
  console.log("res.data.resultData: ", res.data.resultData);
  if (res.status !== 200) {
    showAlert("데이터 조회에 실패하였습니다.");
    return;
  }
  if (res.status === 403) {
    showAlert("데이터 조회 권한이 없습니다.");
    return;
  }
  orderStore.orders = res.data.resultData;
};
</script>

<template>
  <!-- alert -->
  <div style=" position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1055; " >
    <div  v-for="(alert, index) in alerts" :key="alert.id" :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']"
      role="alert" style="margin-bottom: 10px; min-width: 300px; max-width: 600px" >
      {{ alert.message }}
      <button  type="button" class="btn-close" @click="removeAlert(alert.id)" ></button>
    </div>
  </div>
  <!-- alert 끝 -->

  <div class="wrap">
    <div class="section-left">
      <div class="orders-header">
        <!-- 조회기간설정 카드 -->
        <div class="date-option dropdown " ref="orderDetail">
          <button class="date-filter" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" >
            <img src="/src/imgs/owner/Icon_조회기간설정2.svg" alt="캘린더아이콘" />
            <span>{{selectedLabel ? selectedLabel : '조회 기간 선택'}}</span>
            <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" >
            <li>
              <button class="dropdown-item" @click="selectRange('1d')">
                오늘
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="selectRange('7d')">
                최근 1주일
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="selectRange('1m')">
                최근 1개월
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="selectRange('all')">
                전체
              </button>
            </li>
          </ul>
        </div><!-- 조회기간설정카드 끝-->
        <!-- 검색바 -->
        <div class="search white-card">
          <input type="text" placeholder="검색">
          <button><img src="/src/imgs/search_icon.png" alt="검색아이콘"></button>
        </div>
      </div><!-- orders-header 끝  -->
      
      <div class="order-list-wrap scrollbar">
        <!-- 주문 리스트 -->
        <div v-if="orderStore.orders?.length === 0" class="loading"></div>
        <!-- 주문 없음 -->
        <div v-else-if="orderStore.nonOrderedList.length === 0">  주문이 없습니다. </div>
          <order-list-card v-else></order-list-card>
          <order-list-card :cancel="true"></order-list-card>
          <order-list-card></order-list-card>
          <!-- <order-list-card  v-for="order in visibleOrders" :key="order.id" :order="order" style="cursor: pointer" @selectOrder="handleSelectOrder(order)"/> -->
        </div><!--order-list 끝-->

        <div class="pagenation">
          <span>< 1, 2, 3, 4, 5 ></span>
          <!-- <button class="btn btn-secondary d-block" v-if="visibleCount < nonOrderedOrders.length" @click="loadMore"
          style=" font-size: 1.5rem; padding: 1rem 2rem; width: 100%; max-width: 755px; " >
          더보기
          </button> -->
      </div><!--pagenation 끝-->
    </div><!-- section-left 끝-->

    <div class="section-right">
      <div class="orders-wrap white-card">
        <div class="orders-detail">
          <!-- 주문정보 -->
          <OrderDetails></OrderDetails>
          <!-- 주문상세 -->
          <OrderedMenu style="height: 300px;"></OrderedMenu>
          <!-- 주문현황 -->
            <section style="height: 300px;">
              <OrderStatus></OrderStatus>
            </section>
          <!-- 결제내역 -->
          <PaymentDetails></PaymentDetails>
        </div><!-- orders-detail 끝-->
        <!-- <button class="btn" @click="deleteOrderOne">
          <img
            class="trash-icon"
            src="/src/imgs/owner/Icon_휴지통.svg"
            alt="휴지통"
          />
        </button> -->
      </div><!-- orders-wrap 끝-->
    </div><!-- section-left 끝-->
  </div><!-- wrap 끝 -->
</template>

<style scoped lang="scss">
// 로딩
.loading {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #ff8989;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 30px auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.wrap {
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;

  // 섹션왼쪽 : 조회기간필터, 검색, 주문리스트
  .section-left{
    width: 50%;
    height: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    .orders-header {
      display: flex;
      align-items: center;
      gap: 10px;
      .date-filter {
        width: 300px;
        height: 50px;
        background-color: #fff;
        border-radius: var(--card-lg-radius);
        box-shadow: var(--card-shadow);
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px 15px;
        span {
          display: block;
          width: 100%;
          font-size: 1.2rem;
          text-align: left;
          padding-left: 10%;
            }
        img:last-child {
          transform: translateY(-1px);
        }
      }
    }
    .search{
      width: 100%;
      height: 50px;
      display: flex;  
      align-items: center; 
      padding: 0 20px;
      button{
        height: 100%;
        background-color: #fff;
        img{
          height: 50%;
        }
      }
      input{
        width: 100%;
        border: none;
        border-radius: 0;
      }
    }
    .order-list-wrap{
      width: 100%;
      height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: start;
      overflow: auto;
      overflow-x: hidden;
    }
    .pagenation{
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 18px;
    }
    
  }

  //섹션오른쪽 : 주문상세내역
  .section-right{
    width: 50%;
    height: 100%;
    max-width: 800px;
    overflow: auto;
      // 주문상세내역    
      .orders-wrap {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: 20px;
        
      .orders-detail {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content:left;

        section {
          width: 95%;
        }
        h3 {
          font-size: 20px;
          margin-top: 20px;
          color: #ff8989;
        }
        // 기본 테이블
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th,
        td {
          text-align: center;
          padding: 10px 12px;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          font-size: 15px;
        }
        th {
          background-color: #f7f7f7;
          text-align: center;
          width: 120px;
          color: #555;
        }
        //주문상세섹션 세부조정
        .menu-table {
          th {
            background-color: #f0f0f0;
            color: #222;
          }
          td:nth-child(4) {
            text-align: center;
            font-weight: 600;
            padding-right: 20px;
          }
          tr td:first-child {
            font-weight: 500;
          }
          tr td:first-child::before {
            content: "";
          }
        }
      }
      .trash-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 1%;
        transition: 0.2s;
      }
    }//orders-wrap 끝
  }//section-right 끝


} //wrap 끝

/* alert 에니메이션 */
.fade.show {
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>
