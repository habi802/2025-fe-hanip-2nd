<script setup>
import OrderListCard from "@/components/owner/OrderListCard.vue";
import { computed, ref, reactive, inject, onMounted, watch } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import {
  deleteOrder,
  getOrderByDate,
  getOwnerOrder2,
} from "@/services/orderService";
import { useAccountStore, useOwnerStore } from "@/stores/account";
import OrderDetails from "@/components/owner/orderInfo/OrderDetails.vue";
import OrderStatus from "@/components/owner/orderInfo/OrderStatus.vue";
import OrderedMenu from "@/components/owner/orderInfo/OrderedMenu.vue";
import PaymentDetails from "@/components/owner/orderInfo/PaymentDetails.vue";

const owner = useOwnerStore();
const orderStore = useOrderStore();
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

onMounted(async () => {
  await fetchOrders();
});

const fetchOrders = async () => {
  console.log("storeId: ", data.store_id);
  const res = await getOrderByDate(data);
  if (res.status !== 200) {
    showAlert("데이터 조회에 실패하였습니다.");
    return;
  }
  orderStore.orders = res.data.resultData;
  console.log("데이타: ", res.data.resultData);
};

// 페이징
const changePage = async (pageNum) => {
  data.page = pageNum;
  await fetchOrders();
};

// 주문 내역으로 스크롤
const orderDetail = ref(null);

const state = reactive({
  selectOrder: null,
});

const handleSelectOrder = async (orderId) => {
  console.log("선택된 주문:", orderId);
  const res = await getOwnerOrder2(orderId);
  state.selectOrder = res.data.resultData;
  selectedOrder.value = orderId;
  selectedOrder.value = res.data.resultData;

  // 스크롤
  if (orderDetail.value) {
    orderDetail.value.scrollIntoView({ behavior: "smooth" });
  }
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

// 가게 아이디
const storeId = owner.state.storeData.id;

// 날짜 조회
const selectedLabel = ref("");

// 날짜 식
const today = new Date();
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const data = reactive({
  store_id: storeId,
  start_date: null,
  end_date: null,
  page: 1,
  row_per_page: 5,
  search_type: "all",
  keyword: "",
});

// 검색
const handleSearch = async () => {
  data.page = 1;
  await fetchOrders();
};

const selectRange = async (range) => {
  let start;
  let end = new Date(); // 오늘 날짜

  switch (range) {
    case "1d":
      selectedLabel.value = "오늘";
      start = new Date();
      start.setHours(0, 0, 0, 0); // 오늘 0시
      end = new Date(start);
      end.setDate(start.getDate() + 1); // 내일 0시까지
      break;

    case "7d":
      selectedLabel.value = "최근 1주일";
      start = new Date();
      start.setDate(start.getDate() - 7);
      break;

    case "1m":
      selectedLabel.value = "최근 1개월";
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      break;

    case "all":
      selectedLabel.value = "전체";
      start = null;
      end = null;
      break;
  }

  data.store_id = storeId;
  data.start_date = start ? formatDate(start) : null;
  data.end_date = end ? formatDate(end) : null;

  console.log("Data: ", data);
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
  <div
    style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1055;
    "
  >
    <div
      v-for="(alert, index) in alerts"
      :key="alert.id"
      :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']"
      role="alert"
      style="margin-bottom: 10px; min-width: 300px; max-width: 600px"
    >
      {{ alert.message }}
      <button
        type="button"
        class="btn-close"
        @click="removeAlert(alert.id)"
      ></button>
    </div>
  </div>
  <!-- alert 끝 -->

  <div class="wrap">
    <div class="section-left">
      <div class="orders-header">
        <!-- 조회기간설정 카드 -->
        <div class="date-option dropdown">
          <button
            class="date-filter"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
          >
            <img
              src="/src/imgs/owner/Icon_조회기간설정2.svg"
              alt="캘린더아이콘"
            />
            <span>{{ selectedLabel ? selectedLabel : "조회 기간 선택" }}</span>
            <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" />
          </button>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton"
          >
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
        </div>
        <!-- 조회기간설정카드 끝-->
        <!-- 검색바 -->

        <div class="search white-card">
          <select class="select_bar" v-model="data.search_type">
            <option value="all">전체</option>
            <option value="userName">고객명</option>
            <option value="phone">전화번호</option>
            <option value="address">주소</option>
          </select>
          <input
            v-model="data.keyword"
            type="text"
            placeholder="검색어 입력"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch">
            <img src="/src/imgs/search_icon.png" alt="검색아이콘" />
          </button>
        </div>
      </div>
      <!-- orders-header 끝  -->

      <div class="order-list-wrap scrollbar">
        <!-- 주문 리스트 -->
        <div v-if="orderStore.isLoading" class="loading"></div>
        <div
          class="empty-text mt-5 text-center d-flex flex-column"
          style="min-height: 260px"
          v-else-if="orderStore.orders.length === 0"
        >
          <img
            src="@/imgs/owner/owner-service7.png"
            alt="빈 상태 이미지"
            class="empty-img"
          />
          <br />
          <div>주문이 없습니다.</div>
        </div>

        <!-- 주문 없음 -->
        <div v-else-if="0">주문이 없습니다.</div>
        <order-list-card
          v-for="order in orderStore.orders"
          :key="order.orderId"
          :order="order"
          :cancel="order.status === '06'"
          @selectOrder="handleSelectOrder"
          style="cursor: pointer"
        />
        <!-- <order-list-card  v-for="order in visibleOrders" :key="order.id" :order="order" style="cursor: pointer" @selectOrder="handleSelectOrder(order)"/> -->
      </div>
      <!--order-list 끝-->

      <!-- 페이지네이션 -->
      <div class="pagination-min">
        <button
          class="pg-btn"
          @click="changePage(data.page - 1)"
          :disabled="data.page <= 1"
        >
          이전
        </button>
        <span class="pg-badge">{{ data.page }}</span>
        <button class="pg-btn" @click="changePage(data.page + 1)">다음</button>
      </div>
      <!--pagenation 끝-->
    </div>
    <!-- section-left 끝-->

    <div class="section-right">
      <div class="orders-wrap white-card">
        <div class="orders-detail">
          <!-- 주문정보 -->
          <OrderDetails :order="state.selectOrder" />
          <!-- 주문상세 -->
          <OrderedMenu :order="state.selectOrder" />
          <!-- 주문현황 -->
          <OrderStatus :order="state.selectOrder" />
          <!-- 결제내역 -->
          <PaymentDetails :order="state.selectOrder" />
        </div>
        <!-- orders-detail 끝-->
        <!-- <button class="btn" @click="deleteOrderOne">
          <img
            class="trash-icon"
            src="/src/imgs/owner/Icon_휴지통.svg"
            alt="휴지통"
          />
        </button> -->
      </div>
      <!-- orders-wrap 끝-->
    </div>
    <!-- section-left 끝-->
  </div>
  <!-- wrap 끝 -->
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

.select_bar {
  border: none; /* 테두리 제거 */
  outline: none; /* 포커스 테두리 제거 */
  background: transparent;
  font-size: 14px;
  color: #333;
  padding: 0 5px;
  height: 100%;
  cursor: pointer;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search input:focus {
  outline: none;
  border-color: #ddd; // 그대로 유지
}

.wrap {
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;

  // 섹션왼쪽 : 조회기간필터, 검색, 주문리스트
  .section-left {
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
    .search {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 8px;

      button {
        height: 100%;
        background-color: #fff;

        img {
          height: 50%;
        }
      }
      input {
        flex: 1; /* 남는 공간 다 차지 */
        border: none;
        outline: none;
        font-size: 14px;
        padding: 0 8px;
      }
    }
    .order-list-wrap {
      width: 100%;
      height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: start;
    }
    .pagenation {
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 18px;
    }
  }

  //섹션오른쪽 : 주문상세내역
  .section-right {
    width: 50%;
    height: 100%;
    max-width: 800px;
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
        justify-content: left;

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
    } //orders-wrap 끝
  } //section-right 끝
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

.empty-img {
  width: 250px;
  opacity: 0.6;
}

.empty-text {
  font-size: 20px;
  font-weight: 500;
  color: #9c9c9c;
}

.pagination-min {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pg-btn {
  height: 32px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: #fff;
  color: #333;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: #fafafa;
  }
  &:active {
    background: #f2f2f2;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid rgba(255, 107, 107, 0.3);
    outline-offset: 2px;
  }
}

.pg-badge {
  min-width: 50px;
  height: 28px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #ff6b6b;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
}
</style>
