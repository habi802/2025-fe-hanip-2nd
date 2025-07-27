<script setup>
import OrderListCard from "./OrderListCard.vue";
import { computed, ref, reactive, onMounted } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import { deleteOrder } from "@/services/orderService";
import { useOwnerStore } from "@/stores/account";

const orderStore = useOrderStore();
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

  <div class="wrap">
    <div>
      <h2>주문 상세</h2>
      <span style="color: #838383"
        >어서오세요! {{}}사장님 관리자 페이지에 다시 오신것을 환영합니다!</span
      >

      <!-- 상단 집계 카드 -->
      <div class="total-wrap">
        <div class="total-box">
          <div class="circle"></div>
          <div>
            <span>{{ totalOrderCount || "0" }}</span>
            <span>전체 주문 수</span>
            <div class="change-rate">
              <span class="icon-up">↑</span><span>4% (최근 30일)</span>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="circle"></div>
          <div>
            <span>{{ totalCompelteOrderCount || "0" }}</span>
            <span>전체 배달 수</span>
            <div class="change-rate">
              <span class="icon-up">↑</span><span>4% (최근 30일)</span>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="circle"></div>
          <div>
            <span>{{ totalCanceledOrderCount || "0" }}</span>
            <span>취소된 주문</span>
            <div class="change-rate">
              <span class="icon-down">↓</span><span>25% (최근 30일)</span>
            </div>
          </div>
        </div>

        <div class="total-box">
          <div class="circle"></div>
          <div>
            <span>{{ totalSales.toLocaleString() || "--" }}만</span>
            <span>총 매출</span>
            <div class="change-rate">
              <span class="icon-down">↓</span><span>12% (최근 30일)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 주문내역 -->
    <div>
      <div class="orders-header">
        <div>
          <h2>주문 내역</h2>
          <span style="color: #838383">최근 한달간의 주문 내역만 보입니다</span>
        </div>

        <!-- 조회기간설정 카드 -->
        <div class="date-filter" style="cursor: pointer" ref="orderDetail">
          <img
            src="/src/imgs/owner/Icon_조회기간설정.svg"
            alt="캘린더아이콘"
            title="캘린더아이콘"
          />
          <div>
            <span style="font-size: 20px">조회 기간 설정</span>
            <span style="font-size: 13px; color: #838383; font-weight: 200"
              >2025.07.01 ~ 2025.08.01</span
            >
          </div>
          <img
            src="/src/imgs/owner/Icon_목록단추.svg"
            alt="목록단추"
            title="목록단추"
          />
        </div>
      </div>
    </div>

    <div class="orders-wrap">
      <!-- 주문 리스트 -->
      <div v-if="orderStore.orders.length === 0" class="loading"></div>
      <div class="justify-content-center">
        <order-list-card
          v-for="order in visibleOrders"
          :key="order.id"
          :order="order"
          style="cursor: pointer"
          @selectOrder="handleSelectOrder(order)"
        />
        <!-- 더보기 -->
        <button
          class="btn btn-secondary"
          v-if="visibleCount < nonOrderedOrders.length"
          @click="loadMore"
          style="
            font-size: 1.5rem;
            padding: 1rem 2rem;
            justify-content: center;
            width: 754px;
          "
        >
          더보기
        </button>
      </div>
      <div class="orders-detail shadow">
        <!-- 주문정보 -->
        <section>
          <h3>주문 정보</h3>
          <table class="info-table">
            <tbody>
              <tr>
                <th>고객명</th>
                <td>{{ selectedOrder?.userName || "--" }}</td>
              </tr>
              <tr>
                <th>전화</th>
                <td>{{ selectedOrder?.phone || "--" }}</td>
              </tr>
              <tr>
                <th>주소</th>
                <td>{{ selectedOrder?.address || "--" }}</td>
              </tr>
              <tr>
                <th>특이사항</th>
                <td>{{ selectedOrder?.storeRequest || "--" }}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <!-- 주문상세 -->
        <section>
          <h3>주문 상세</h3>
          <table class="menu-table">
            <thead>
              <tr>
                <th>메뉴명</th>
                <th>옵션</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="!selectedOrder?.menus || selectedOrder.menus.length === 0"
              >
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>
              <tr
                v-for="(menu, index) in selectedOrder?.menus || []"
                :key="menu.id || index"
              >
                <td>{{ menu.name }}</td>
                <td>{{ menu.option || "--" }}</td>
                <td>{{ menu.quantity }}</td>
                <td>{{ menu.price.toLocaleString() }}원</td>
              </tr>
            </tbody>
          </table>
        </section>
        <!-- 주문현황 -->
        <section>
          <h3>주문 현황</h3>
          <table class="menu-table">
            <thead>
              <tr>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ statusText }}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <!-- 결제내역 -->
        <section>
          <h3>결제 내역</h3>

          <table class="info-table">
            <tbody>
              <tr>
                <th>결제일시</th>
                <td>{{ formatDateTime(selectedOrder?.updated) || "--" }}</td>
              </tr>
              <tr>
                <th>결제수단</th>
                <td>{{ selectedOrder?.payment || "--" }}</td>
              </tr>
              <tr>
                <th>결제금액</th>
                <td>{{ selectedOrder?.amount.toLocaleString() || "--" }}원</td>
              </tr>
              <tr>
                <th>할인내역</th>
                <td>없음</td>
              </tr>
            </tbody>
          </table>
        </section>
        <button class="btn" @click="deleteOrderOne">
          <img
            class="trash-icon"
            src="/src/imgs/owner/Icon_휴지통.svg"
            alt="휴지통"
          />
        </button>
      </div>
    </div>
  </div>
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
  max-width: 1400px;
  background-color: #e8e8e8;
  font-family: "Pretendard", sans-serif;
  width: 1575px;
  overflow: auto;
  padding: 10px;

  // 상단 집계 카드
  .total-wrap {
    display: flex;
    gap: 30px;
    margin-top: 20px;
    margin-bottom: 40px;
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
      height: 137px;
      width: 337px;
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

  // 주문내역 시작
  // 주문내역 제목영역
  .orders-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .date-filter {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 2px 2px 5px 1px #c6c6c6;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 295px;
    height: 75px;
    padding: 15px 15px;
    div {
      span {
        display: block;
        margin-right: 10px;
        line-height: 1.5;
      }
    }
    img:last-child {
      width: 24px;
      height: 24px;
    }
  }

  // 주문내역 - 주문 리스트영역 (왼쪽)
  .orders-wrap {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 25px;
    .orders-list-wrap {
      width: 45%;
      .orders-list {
        background-color: #fff;
        border-radius: 15px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 82vh;
        height: 130px;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100%;
          span:first-child {
            display: block;
            font-size: 20px;
          }
          .order-num {
            font-size: 20px;
            color: #838383;
          }
          .order-address {
            font-size: 20px;
          }
          .order-time {
            font-size: 30px;
          }
          .order-account {
            color: #ff8989;
            font-size: 30px;
            font-weight: 700;
          }
        }
      }
    }
    .orders-list:hover {
      background-color: #ff8989;
      span {
        color: #fff !important;
      }
    }

    // 주문내역 - 주문상세조회 (오른쪽)
    .orders-detail {
      font-family: "Pretendard", sans-serif;
      width: 800px;
      max-width: 595px;
      height: 1000px;
      background-color: #fff;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      section {
        width: 90%;
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
      margin-bottom: 40px;
      transition: 0.2s;
    }
  }
  //주문내역 끝
}

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
