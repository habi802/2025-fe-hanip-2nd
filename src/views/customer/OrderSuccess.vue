<script setup>
import { onMounted, reactive, computed, watch } from "vue";
import { getStoreList } from "@/services/storeService";
import { getOwnerOrder2 } from "@/services/orderService";
import { useRoute } from "vue-router";

const route = useRoute();

import Randomstore from "@/components/customer/RandomStore.vue";
import defaultImage from "@/imgs/owner/haniplogo_sample2.png";

const state = reactive({
  order: {},
  stores: [],
  form: {
    category: "",
    searchText: "",
    sortColumn: "",
    sortOrder: "",
    page: 1,
    size: 8,
  },
});

const baseUrl = import.meta.env.VITE_BASE_URL;

// 가게 이미지
const storeImage = computed(() => {
  return state.order && state.order.storeImg && state.order.storeImg !== null
    ? `${baseUrl}/images/store/${state.order.storeId}/${state.order.storeImg}`
    : defaultImage;
});

onMounted(async () => {
  // 라우터가 처음 로드됐을 때
  naverPay();

  // 쿼리가 나중에 들어오는 경우 대비
  watch(
    () => route.query,
    (newQuery) => {
      if (newQuery.routeOrderId && newQuery.paymentId) {
        console.log("쿼리 감지용", newQuery);
        naverPay();
      }
    },
    { immediate: true } // 처음에도 바로 실행
  );

  if (route.query.routeOrderId) {
    const orderId = parseInt(route.query.routeOrderId);
    const res = await getOwnerOrder2(orderId);
    if (res !== undefined && res.status === 200) {
      state.order = res.data.resultData;

      // 가게 목록을 가져온 뒤, 가게 목록을 무작위로 섞는다.
      const storeRes = await getStoreList(state.form);
      if (storeRes !== undefined && storeRes.status === 200) {
        state.stores = storeRes.data.resultData;
      }
    }
  }
});

const naverPay = async () => {
  if (route.query.routeOrderId && route.query.paymentId) {
    console.log("쿼리 들어옴", route.query);

    const orderId = parseInt(route.query.routeOrderId);
    const paymentId = route.query.paymentId;

    if (orderId || paymentId) {
      const payreq = {
        paymentId: route.query.paymentId,
      };

      console.log("orderId", orderId);
      console.log("paymentId", paymentId);

      const tid = await naverGetCid(orderId, payreq);
      console.log("cid 주입 완료", tid);
      window.location.href = window.location.pathname;
    }
  } else {
    console.log("쿼리 안 옴");
  }
};

// 주문 상태 확인
const status = computed(() => {
  switch (state.order?.status) {
    case "ORDERED":
      return { width: "3%", backgroundColor: "#FF6666" };
    case "PAID":
      return { width: "33%", backgroundColor: "#FF6666" };
    case "PREPARING":
      return { width: "82%", backgroundColor: "#FF6666" };
    case "DELIVERING":
      return { width: "185%", backgroundColor: "#FF6666" };
    case "COMPLETED":
      return { width: "100000%", backgroundColor: "#FF6666" };
  }
});

// 가게 목록 무작위로 섞기
const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};
// 셔플 3개 섞은거
const shuffledStores = computed(() => {
  return shuffle(state.stores).slice(0, 3);
});
</script>

<template>
  <div class="order-wrapper">
    <div class="order-header">
      <h2>주문완료</h2>
      <div class="order-steps">
        <span>01 음식 선택</span> > <span>02 장바구니</span> >
        <span>03 주문/결제</span> >
        <span class="current">04 주문완료</span>
      </div>
      <div class="solid"></div>
    </div>

    <div class="container">
      <div class="mb-4">
        <div class="title">주문 내역</div>
        <div class="border rounded p-5">
          <div class="store-name">{{ state.order.storeName }}</div>
          <div class="order-box">
            <div class="store-info col-4">
              <div class="store-image">
                <img
                  class="storeImg"
                  :src="storeImage"
                  @error="(e) => (e.target.src = defaultImage)"
                />
              </div>
            </div>
            <div class="order-info">
              <div
                v-for="(menu, idx) in state.order.menuItems"
                :key="menu.menuId"
              >
                <div class="pt-3">
                  <div class="d-flex justify-content-between mb-2">
                    <div class="row">
                      <span class="item-name">{{ menu.name }}</span>
                    </div>
                    <span>{{ menu.quantity }}개</span>
                    <span class="item-price"
                      >{{
                        (menu.price * menu.quantity).toLocaleString()
                      }}원</span
                    >
                  </div>
                </div>
                <template v-if="menu.options">
                  <div v-for="option in menu.options" :key="option.optionId">
                    <template v-if="option.children">
                      <div
                        class="item-option"
                        v-if="option.children"
                        v-for="(child, idx) in option.children"
                        :key="child.optionId"
                      >
                        <div class="item-option-comment">
                          <div class="item-option-name" v-if="idx === 0">
                            {{ option.comment }}
                          </div>
                        </div>
                        <div class="item-option-child-comment">
                          <span class="option-name">{{ child.comment }}</span>
                        </div>
                        <div class="item-option-child-price">
                          <span>{{ child.price?.toLocaleString() }}원</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>

              <!-- <div class="text-delivery">
                                <span>배달료</span>
                                <span>2,000원</span>
                            </div> -->

              <div class="text-end pt-3 total-text">
                <span>총 결제 금액 </span>
                <span>{{ state.order.amount?.toLocaleString() }}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="title">주문 처리 현황</div>
        <div class="border rounded p-5">
          <div class="d-flex justify-content-between mb-2">
            <div>결제준비</div>
            <div>결제완료</div>
            <div>음식준비중</div>
            <div>배달중</div>
            <div>배달완료</div>
          </div>
          <div class="progress" style="height: 8px">
            <div class="progress-bar" role="progressbar" :style="status"></div>
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 100%; background-color: #ffeadd"
            ></div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="title">다른 가게 주문</div>
        <div>
          <div class="big-Box">
            <div class="for">
              <div v-for="store in shuffledStores" :key="store.id">
                <Randomstore class="board" :store="store" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}

* {
  font-family: "Pretendard-Regular";
  box-sizing: border-box;
}

.title {
  font-size: 1.5em;
  font-weight: 600;
  padding: 0px 0px 10px 0px;
}

.order-wrapper {
  max-width: 1180px;
  margin: 40px auto;
  padding: 0 18px 80px;
  color: #222;
}

.order-header {
  position: relative;
  margin-bottom: 36px;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 30px;
    font-weight: 500;
    padding-top: 6px;
  }
}

.order-steps {
  position: absolute;
  right: 0;
  top: 70px;
  font-size: 16px;
  color: #6b6b6b;

  .current {
    color: #ff6666;
    font-weight: 700;
  }
}

.solid {
  margin-top: 70px;
  height: 2px;
  background: #000000;
}

.container {
  max-width: 1060px;
}

.box {
  padding: 40px !important;
  border-radius: 25px;
}

.order-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 20px;

  .store-image {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    width: 260px;
    height: 200px;
    overflow: hidden;

    .storeImg {
      width: 260px;
      height: auto;
    }
  }
}

.item-name {
  font-size: 20px;
  width: 200px;
}

.item-price {
  font-size: 20px;
  width: 100px;
  text-align: end;
}

.item-option {
  color: #ccc;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}

.item-option-name {
  width: 175px;
}

.item-option-child-comment {
  text-align: center;
  width: 100px;
}

.item-option-child-price {
  text-align: end;
  width: 100px;
}

.option-name {
  width: 100px;
}

// 주문처리현황
.text {
  display: flex;
  font-size: 25px;
  text-align: center;
}

.store-name {
  font-size: 1.5em;
  width: 170px;
  text-align: start;
  font-weight: 400;
  margin-top: -20px;
  margin-bottom: 10px;
}

.order-info {
  width: 80% !important;
  font-size: 18px;
}

.text-delivery {
  display: flex;
  justify-content: space-between;
  border: none !important;
  font-size: 16px;
  padding: 7px 0;
}

.text-end {
  display: flex;
  justify-content: space-between;
  border: none !important;
  font-size: 22px;
  padding: 7px 0;
}

.for {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 50px;
}

.store-info {
  display: flex;
}

.mb-4 {
  h4 {
    font-family: "BMJUA";
  }

  .status {
    font-family: "BMJUA";
  }
}

.total-text {
  font-weight: 600;
}
</style>
