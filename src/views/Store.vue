<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getStore } from "@/services/storeService";
import { getOneMenu } from "@/services/menuService";
import { getReviewsByStoreId } from "@/services/reviewServices";
import {
  getFavorite,
  addFavorite,
  deleteFavorite,
} from "@/services/favoriteService";
import { updateQuantity, removeItem, removeCart } from "@/services/cartService";
import { useAccountStore } from "@/stores/account";
import { useCartStore } from "@/stores/cart";
import Menu from "@/components/Menu.vue";
import Review from "@/components/Review.vue";

const route = useRoute();
const router = useRouter();

const account = useAccountStore();
const carts = useCartStore();

const state = reactive({
  // 가게 정보
  store: {},
  // 가게 메뉴 정보
  menus: [],
  // 가게 리뷰 정보
  reviews: [],
  // 고객 장바구니 정보
  carts: [],
});

// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);

// 가게 상세 조회하는 함수
const loadStore = async (id) => {
  const res = await getStore(id);

  // 가게 상세 조회 실패 시(API에 알 수 없는 오류가 발생하거나 가게 테이블에 없는 데이터를 조회하려고 할 경우) 홈으로 돌아감
  // 주소창에 입력해서 강제로 들어가는 것을 방지하기 위함
  if (res === undefined || res.data.resultStatus !== 200) {
    alert("조회 실패");
    router.push({ path: "/" });
    return;
  } else if (res.data.resultStatus !== 200) {
    alert(res.data.resultMessage);
    router.push({ path: "/" });
    return;
  }

  state.store = res.data.resultData;

  // 조회 성공 시 가게 찜 추가 여부 조회 함수 호출
  loadFavorite(id);
};

// 고객 유저가 가게를 찜 목록에 추가했는지 조회하는 함수
const loadFavorite = async (id) => {
  const res = await getFavorite(id);

  if (res === undefined || res.data.resultStatus !== 200) {
    alert("조회 실패");
    return;
  }

  state.store.favorite = res.data.resultData !== null ? true : false;
  // 조회 성공 시 가게 메뉴 조회 함수 호출
  loadMenus(id);
};

// 가게 메뉴 조회하는 함수
const loadMenus = async (id) => {
  const res = await getOneMenu(id);

  if (res === undefined) {
    alert("조회 실패");
    return;
  } else if (res.data.resultStatus !== 200) {
    alert(res.data.resultMessage);
    return;
  }
  state.menus = res.data.resultData;
  // 조회 성공 시 가게 리뷰 조회 함수 호출
  loadReviews(id);
};

// 가게 리뷰 조회 함수
const loadReviews = async (id) => {
  const res = await getReviewsByStoreId(id);

  if (res === undefined || res.data.resultStatus !== 200) {
    alert("조회 실패");
    return;
  }

  state.reviews = res.data.resultData;
  // 조회 성공 시 장바구니 조회 함수 호출
  loadCarts(id);
};

// 고객 유저 장바구니 조회
const loadCarts = async (id) => {
  // 원래 다른 가게 메뉴를 장바구니에 추가했는지 여부까지 조회해야 하지만
  // 그걸 구현할 시간이 없어 일단 장바구니 데이터 삭제하게 해놨음..
  const res = await removeCart();

  if (res === undefined || res.data.resultStatus !== 200) {
    //alert(res.data.resultMessage);
    return;
  }
};

// 찜 목록 추가/삭제 함수
const toggleFavorite = async (id) => {
  const res = state.store.favorite
    ? await deleteFavorite(id)
    : await addFavorite({ storeId: id });

  if (res === undefined || res.data.resultStatus !== 200) {
    alert("수정 실패");
    return;
  }

  state.store.favorite = !state.store.favorite;
};

// 장바구니 추가 함수(Menu.vue 컴포넌트에서 받아옴)
const addCart = (item) => {
  item.quantity = 1;
  state.carts.push(item);
  calculateTotal();
};

// 장바구니 메뉴 개수 감소시키는 함수
const decreaseQuantity = async (idx) => {
  if (state.carts[idx].quantity > 1) {
    const params = {
      cartId: state.carts[idx].id,
      quantity: state.carts[idx].quantity - 1,
    };

    // 메뉴 개수 수정하는 API 함수 호출
    const res = await updateQuantity(params);

    if (res === undefined) {
      alert("수정 실패");
      return;
    } else if (res.data.resultStatus !== 200) {
      alert(res.data.resultMessage);
      return;
    }

    state.carts[idx].quantity--;
    calculateTotal();
  }
};

// 장바구니 메뉴 개수 증가시키는 함수
const increaseQuantity = async (idx) => {
  const params = {
    cartId: state.carts[idx].id,
    quantity: state.carts[idx].quantity + 1,
  };

  // 메뉴 개수 수정하는 API 함수 호출
  const res = await updateQuantity(params);

  if (res === undefined) {
    alert("수정 실패");
    return;
  } else if (res.data.resultStatus !== 200) {
    alert(res.data.resultMessage);
    return;
  }

  state.carts[idx].quantity++;
  calculateTotal();
};

// 장바구니 삭제 함수
const deleteCart = async (cartId) => {
  const res = await removeItem(cartId);

  if (res === undefined || res.data.resultStatus !== 200) {
    alert("삭제 실패");
    return;
  }

  if (res.data.resultData === 1) {
    const deleteIdx = state.carts.findIndex((item) => item.id === cartId);
    if (deleteIdx > -1) {
      state.carts.splice(deleteIdx, 1);
      calculateTotal();
    }
  }
};

// 장바구니 총 금액 계산하는 함수
const calculateTotal = () => {
  totalPrice.value = 0;

  state.carts.forEach((item) => {
    const price = item.price * item.quantity;
    totalPrice.value += price;
  });
};

// 주문 확인 화면으로 넘어가는 함수
const toOrder = () => {
  if (!account.state.loggedIn) {
    alert("로그인 후 주문이 가능합니다.");
    return;
  } else if (state.carts.length < 1) {
    alert("메뉴를 선택해주세요.");
    return;
  }

  carts.state.items = state.carts;
  router.push({ path: `/stores/${route.params.id}/order` });
};

onMounted(() => {
  const storeId = route.params.id;

  loadStore(storeId);
});

// 메뉴랑 리뷰보기 v-if 설정 함수

// 불린 값
let menubtn = ref(true);
let reviewbtn = ref(false);

// 버튼 함수
const menubutton = () => {
  menubtn.value = true;
  reviewbtn.value = false;
};
const reviewbutton = () => {
  menubtn.value = false;
  reviewbtn.value = true;
};

//

// 가게 이미지
// const img = `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`

// 가게 이미지가 없을 시 대체 이미지 나타내기
// const imgSrc = computed(() => {
//   return props.stores && props.stores.imagePath && props.stores.imagePath !== 'null'
//   ? `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`
//   : defaultImage;
// })
</script>

<template>
  <div class="container">
    <!-- 상단 컨테이너용 -->
    <div class="top">
      <div class="row">
        <div id="store" class="col-12 col-md-8 p-3">
          <div id="store-box" class="row border rounded p-3 mb-3">
            <div class="col-6 col-md-4 mb-4">
              <div class="store-image border rounded h-100">
                <div class="img-one">
                  <!-- <img class="sImg" :src="imgSrc" @error="e => e.target.src = defaultImage" /> -->
                </div>
              </div>
            </div>
            <div class="col-6 col-md-4 mb-4">
              <h3>{{ state.store.name }}</h3>
              <p>최소 주문 금액 15,000원</p>
              <p>배달료 0원 ~ 3,000원</p>
              <span
                >⭐ 4.5(983)
                <span
                  class="favorite"
                  @click="toggleFavorite(state.store.id)"
                  >{{ state.store.favorite ? "❤️" : "♡" }}</span
                >
                927</span
              >
            </div>
            <div class="col-12 col-md-4">
              <div id="map" class="border rounded mb-2">
                지도 이미지 / 2차 구현
              </div>
              <span>{{ state.store.address }}</span>
            </div>
          </div>

          <!-- 주문표 부분 -->
          <div id="order" class="col-12 col-md-4 d-flex flex-column p-3">
            <div class="row border rounded p-4 mb-2">
              <div class="order-title">장바구니</div>
              <div class="store-name">{{ state.store.name }}</div>
              <div
                class="d-flex justify-content-between border-bottom pb-2 mb-2"
              >
                <div class="delete-order">삭제</div>
              </div>
              <div v-if="state.carts.length > 0">
                <div v-for="(item, idx) in state.carts" :key="item.id">
                  <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                    <div class="d-flex justify-content-between mb-2">
                      <span>{{ item.name }}</span>
                      <span
                        >{{
                          (item.price * item.quantity).toLocaleString()
                        }}원</span
                      >
                    </div>
                    <div class="d-flex justify-content-between">
                      <div>
                        <button
                          type="button"
                          class="btn btn-basic btn-quantity"
                          @click="decreaseQuantity(idx)"
                        >
                          -
                        </button>
                        <span class="p-3">{{ item.quantity }}</span>
                        <button
                          type="button"
                          class="btn btn-basic btn-quantity"
                          @click="increaseQuantity(idx)"
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-basic btn-submit"
                          @click="deleteCart(item.id)"
                        >
                          메뉴 취소
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>메뉴를 선택해주세요.</div>
              <div class="text-end border-top pt-2 mt-2">
                {{ totalPrice.toLocaleString() }}원
              </div>
            </div>
            <button
              type="button"
              @click="toOrder()"
              class="btn btn-basic btn-submit"
            >
              주문하기
            </button>
          </div>
        </div>

        <div class="button">
          <!-- 메뉴 보기 버튼  -->
          <div
            :style="{ color: menubtn ? '#ff6666' : '#000' }"
            class="menu-title rounded pt-2 ps-3"
          >
            <h3 @click="menubutton" class="mb-1">메뉴보기</h3>
          </div>

          <!-- 리뷰보기 버튼 -->
          <div
            :style="{ color: reviewbtn ? '#ff6666' : '#000' }"
            class="review-title pt-2 ps-3"
          >
            <h3 @click="reviewbutton" class="mb-1">리뷰보기</h3>
          </div>
        </div>

        <!-- 중앙 정렬용 div -->
        <div class="bigBox">
          <div class="detailBox">
            <!-- 메뉴보기 리스트 -->
            <div v-if="menubtn" class="pt-2 mb-3">
              <div v-if="state.menus.length > 0">
                <div v-for="item in state.menus" :key="item.id">
                  <Menu :item="item" @addCart="addCart" />
                </div>
              </div>
              <div v-else>메뉴 준비중입니다.</div>
            </div>

            <!-- 리뷰보기 리스트 -->

            
            <div>
                <div v-if="reviewbtn" class="pt-2 mb-3">

                  <!-- 총 가게 평점 -->
                  <div class="review-point">
                    <div class="review-box">
                      <div class="review-text">총 가게 평점</div>
                      <div class="review-data">
                          <!-- 왼쪽 별/점수 -->
                        <div>
                          <div class="star">★★★★★</div>
                          <div class="review-num">4.0</div>
                        </div>
                        <!-- 오른쪽 텍스트 -->
                        <div class="left-box">
                          <div>총 리뷰 수 100개</div>
                          <div>오늘 새로 달린 리뷰 10개</div>
                          <div>사장님 댓글 5개</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 리뷰 리스트 조회 -->
                <div v-if="state.reviews.length > 0">
                  <div v-for="item in state.reviews" :key="item.id">
                    <Review :item="item" />
                  </div>
                </div>
                <div v-else>등록된 리뷰가 없습니다.</div>
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
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

#map {
  height: 125px;
}

.favorite {
  cursor: pointer;
}

.btn-basic {
  background-color: white;
  border-width: 1px;
  border-style: solid;
  font-family: "BMJUA";
  letter-spacing: 1px;
  line-height: 1.2;

  &.btn-submit {
    border-color: #ff6666;
    color: #ff6666;
  }

  &.btn-quantity {
    border-color: #000;
    color: #000;
  }

  &:hover {
    background-color: #ffe5e5;
  }
}

.button {
  display: flex;
  border-bottom: 2px solid #000;
  width: 1460px;
  gap: 56px;
  font-size: 30px;
}
.menu-title {
  //   border: 1px solid #ff6666;
  font-family: "BMJUA";
  letter-spacing: 1px;
  cursor: pointer;

  h3 {
    // color: #ff6666;
  }
}

.review-title {
  //   border-bottom: 2px solid #000;
  font-family: "BMJUA";
  letter-spacing: 1px;
  cursor: pointer;
}

.bigBox {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 120px;
  margin-top: 81px;
}
.detailBox {
  width: 860px;
}
.top {
  display: flex;
  justify-content: space-between;
}
#store {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
#store-box {
  display: flex;
  align-items: center;
  width: 860px;
  height: 270px;
}
.store-image {
  border-radius: 20px !important;
  width: 246px !important;
  height: 183px !important;
  overflow: hidden;
  .img-one {
    width: 250px;
  }
}
.order-title {
  font-family: "BMJUA";
  font-size: 24px;
}
.store-name {
  font-family: "BMJUA";
  font-size: 24px;
  font-weight: 800;
  color: #ff6666;
}
.delete-order {
  text-align: end;
  width: 100%;
}
.review-box {
  border: 1px #797979 solid;
  border-radius: 10px;
  width: 860px;
  height: 208px;
  text-align: center;
  padding: 20px;
  font-family: "BMJUA";
  font-size: 25px;

}
.review-data{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap:40px;
    margin-top: 10px;
    margin-left: 30px;

}
.review-num {
    font-family: "BMJUA";
    font-size: 50px;
    margin-top: -10px;
}
.star{
    font-family: "BMJUA";
    font-size: 30px;
}
.left-box{
      font-family: "BMJUA";
    text-align: start;
    font-size: 19px;
    margin-bottom: 10px;
}
</style>
