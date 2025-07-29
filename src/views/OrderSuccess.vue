<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getStore, getStoreList } from "@/services/storeService";
import { useAccountStore } from "@/stores/account";
import { useCartStore } from "@/stores/cart";
import { getOwnerOrder2 } from "@/services/orderService";
import defaultImage from "@/imgs/owner/haniplogo_sample2.png";
import Randomstore from "@/components/RandomStore.vue";

const route = useRoute();
const router = useRouter();

const account = useAccountStore();
const cart = useCartStore();

const state = reactive({
  store: {},
  carts: [],
  order: [],
  //   랜덤 스토어
  random: [],
  totalPriceF: 0,
});

const totalPrice = ref(0);

// 가게 이미지
const imgSrc = computed(() => {
  return state.store &&
    state.store.imagePath &&
    state.store.imagePath !== "null"
    ? `/pic/store-profile/${state.store.id}/${state.store.imagePath}`
    : defaultImage;
});

onMounted(async () => {
  if (!account.state.loggedIn) {
    alert("이용할 수 없습니다.");
    router.push({ path: "/" });
    return;
  }

  // 넘어온 쿼리가 있다면 ?
  if (route.query.id > 0) {
    const ress = await getStore(route.params.id);
    state.store = ress.data.resultData;
    const res = await getOwnerOrder2(route.query.id);
    state.order = res.data.resultData;
    console.log("res.ingo", state.order);
    console.log("total", totalPrice.value);
    randomList();
    calculateTotal();
    status();
  } else {
    const res = await getStore(route.params.id);
    state.store = res.data.resultData;
    state.carts = cart.state.items;
    calculateTotal();
    randomList();
  }

  if (res === undefined ) {
    alert("조회 실패");
    router.push({ path: "/" });
    return;
  } else if (res.data.resultStatus !== 200) {
    alert(res.data.resultMessage);
    router.push({ path: "/" });
    return;
  }

  //   console.log("orderId", state.store);
});
//   랜덤 스토어용 값 가져오기
const randomList = async (params) => {
  const random = await getStoreList(params);
  console.log("random", random.data.resultData);
  state.random = random.data.resultData;
};

const order = async (stoid) => {
  const res = await getOwnerOrder(stoid);
  console.log("resrorder", res);
};

const calculateTotal = () => {
  if (route.query.id > 0) {
    state.order.forEach((item) => {
      const price = item.price * item.quantity;
      totalPrice.value += price;
    });
  } else {
    state.carts.forEach((item) => {
      const price = item.price * item.quantity;
      totalPrice.value += price;
    });
  }
};
//  주문 상세, 주문 상태 확인
const status = computed(() => {
  switch (state.order[0]?.status) {
    // 준비확인
    case "ORDERED":
      return { width: "37%", backgroundColor: "#FF6666" };
    // 음식준비중
    case "PREPARING":
      return { width: "105%", backgroundColor: "#FF6666" };
    // 배달중
    case "DELIVERING":
      return { width: "295%", backgroundColor: "#FF6666" };
    // 배달완료
    case "COMPLETED":
      return { width: " 200000%", backgroundColor: "#FF6666" };
    case "CANCELED":
      return { width: "1%", backgroundColor: "#FF6666" };
  }
});

// 랜덤 돌리기
const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};
const randomThreeStores = computed(() => {
  return shuffle(state.random).slice(0, 3);
});
</script>

<template>
  <div class="cart-empty-wrapper">
    <div class="top-row">
      <div class="header-row">
        <div class="div29">주문완료</div>
      </div>
      <div class="step-horizontal">
        <span class="step-text">01 음식선택</span>
        <span class="arrow"
          ><img src="/src/imgs/cartimgs/arrow-back.png"
        /></span>
        <span class="step-text">02 장바구니</span>
        <span class="arrow"
          ><img src="/src/imgs/cartimgs/arrow-back.png"
        /></span>
        <span class="step-text">03 주문/결제</span>
        <span class="arrow"
          ><img src="/src/imgs/cartimgs/arrow-back.png"
        /></span>
        <span class="step-text current">04 주문완료</span>
      </div>
    </div>

    <div class="container">
      <div id="box" class="border rounded p-3 mb-4">
        <div>
          <div class="text">
            <span>주문내역</span>
            <div class="store-name">{{ state.store.name }}</div>
          </div>
        </div>
        <div id="img-big-box" class="">
          <div class="col-4">
            <div class="store-image">
              <img
                class="storeImg"
                :src="imgSrc"
                @error="(e) => (e.target.src = defaultImage)"
              />
            </div>
          </div>
          <div id="leftBoard">
            <!-- 주문 상세를 통해 넘어왔을 때  -->
            <div v-if="state.order.length > 0">
              <div v-for="(item, idx) in state.order" :key="item.id">
                <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                  <div class="d-flex justify-content-between mb-2">
                    <div class="row">
                      <span>{{ item.menuName }}</span>
                      <span>　</span>
                    </div>
                    <span>{{ item.quantity }}개</span>
                    <span
                      >{{
                        (item.price * item.quantity).toLocaleString()
                      }}원</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- 아닐때 -->
            <div v-if="state.carts.length > 0">
              <div v-for="(item, idx) in state.carts" :key="item.id">
                <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                  <div class="d-flex justify-content-between mb-2">
                    <div class="row">
                      <span>{{ item.name }}</span>
                      <span>　</span>
                    </div>
                    <span>{{ item.quantity }}개</span>
                    <span
                      >{{
                        (item.price * item.quantity).toLocaleString()
                      }}원</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- <span class="small-text">배달료</span> -->

            <!-- 주문 상세로 들어왔을 때  -->
            <div v-if="route.query.id > 0">
              <div class="text-end">
                <span>총 결제 금액 </span>
                <span>{{ totalPrice.toLocaleString() }}원</span>
              </div>
            </div>
            <!-- 아닐 때 -->
            <div v-else>
              <div class="text-end">
                <span>총 결제 금액 </span>
                <span>{{ totalPrice.toLocaleString() }}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="mb-3">주문 처리 현황</h4>
        <div class="border rounded p-5">
          <!-- 주문 상세로 들어왔을 때 -->
          <div v-if="route.query.id > 0">
            <div class="d-flex justify-content-between mb-2">
              <div>주문취소</div>
              <div>주문확인중</div>
              <div>음식준비중</div>
              <div>배달중</div>
              <div>배달완료</div>
            </div>
            <div class="progress" style="height: 8px">
              <div
                class="progress-bar"
                role="progressbar"
                :style="status"
              ></div>
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 100%; background-color: #ffeadd"
              ></div>
            </div>
          </div>
          <!-- 아닐때 -->
          <div v-else>
            <div class="d-flex justify-content-between mb-2">
              <div class="flex-fill">주문취소</div>
              <div class="flex-fill">주문확인중</div>
              <div class="flex-fill">음식준비중</div>
              <div class="flex-fill">배달중</div>
              <div class="flex-fill">배달완료</div>
            </div>
            <div class="progress" style="height: 8px">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 31%; background-color: #ff6666"
              ></div>
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 100%; background-color: #ffeadd"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!--  -->
      <!--  -->

      <!--  -->
      <div id="random-box">
        <h4 class="mb-3">다른 가게 주문하기</h4>
        <div >
<!--  -->
          <div class="for">
            <!--  -->
            <div
              v-for="(item, index) in randomThreeStores"
              :key="item.id"
            >
              <Randomstore :stores="item" />
            </div>
            <!-- <div class="col-12 col-md-4">
                <div id="imgBigBox" class="card h-100 shadow-sm">
                  <div id="imgBox" class="card-img-top">이것은 가게의 이미지다</div>
                  <div class="card-body">
                    <h6 class="card-title">도리식 닭도리탕</h6>
                    <p class="mb-1 text-muted">배달비 0원 ~ 3000원</p>
                    <p class="mb-2 text-muted">최소 주문 금액 10,000원</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="small">⭐ 4.8 (96건) &nbsp;&nbsp; ❤️ 927</div>
                      <button class="btn btn-outline-danger btn-sm">
                        자세히보기
                      </button>
                    </div>
                  </div>
                </div>
              </div> -->
            <!--  -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  -->
</template>

<style lang="scss" scoped>
* {
  font-family: "BMJUA";
}

@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: 600;
  font-style: normal;
}

.cart-empty-wrapper {
  max-width: 1024px;
  margin: 50px auto;
  padding: 20px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  column-gap: 100px;
  margin-bottom: 60px;
}

.header-row {
  display: flex;
  align-items: center;
}

.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.div29 {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

.step-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
  padding-left: 200px;
  white-space: nowrap;
}

.arrow img {
  width: 12px;
  height: auto;
}

.step-text.current {
  font-size: 18px;
  font-weight: bold;
  color: #ff6666;
}

.arrow {
  font-size: 16px;
}

#img-big-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  border-radius: 20px;

  .store-image {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    width: 250px;
    height: 180px;
    overflow: hidden;
    .storeImg{
        width: 260px;
    }
  }
}

.box {
  display: flex;
  justify-content: center;
}

#box {
  padding: 40px !important;
}

.text {
  display: flex;
  font-family: "BMJUA";
  font-size: 25px;
  text-align: end;

  .store-name {
    width: 170px;
    text-align: end;
  }
}

#leftBoard {
  width: 80% !important;
  font-size: 18px;
}

.text-end {
  display: flex;
  justify-content: space-between;
  border: none !important;
  font-size: 20px;
  padding: 7px;
}

.small-text {
  font-size: 15px;
  margin-left: 10px;
}

.div29 {
  font-size: 30px;
  margin-left: 10px;
}
.for{
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;
}
</style>
