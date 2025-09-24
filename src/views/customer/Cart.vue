<script setup>
import { reactive, onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getItem, removeItem, updateQuantity } from "@/services/cartService";
import { useAccountStore } from "@/stores/account";
import { getStore } from "@/services/storeService";
//import { useCartStore } from "@/stores/cart";
import { getReviewsByStoreId } from "@/services/reviewServices";
import { getFavoriteList } from "@/services/favoriteService";
// 에러 이미지
import defaultImage from '@/imgs/owner/owner-service3.png';

import { plusQuantity, minusQuantity } from "@/services/cartService";

//const cartStore = useCartStore();

const router = useRouter();
const account = useAccountStore();

const state = reactive({
  items: [],
  reviews: [],
  reviewNum: 0,
  favorites: [],
  store: {},
});

// 장바구니 목록 불러오는 함수
const load = async () => {
  if (!account.state.loggedIn) return;
  const res = await getItem();
  if (res === undefined || res.status !== 200 || res.data.resultStatus !== 200)
    return;

  state.items = res.data.resultData || [];

  fetchStoreDetails();
};

// 가게 정보 불러오는 함수(가 맞겠지? 최초로 쓴 사람만 알고 있다..)
const storeMap = reactive({});
const fetchStoreDetails = async () => {
  const storeId = state.items[0].storeId;

  if (!storeMap[storeId]) {
    const res = await getStore(storeId);

    // 리뷰 찾을려고 추기작성
    const rev = await getReviewsByStoreId(storeId);
    if (rev?.status === 200 && rev.data?.resultStatus === 200) {
      state.reviews = rev.data.resultData;
    }
    // 찜하기 찾을려고 추가 작성
    const ref = await getFavoriteList(storeId);
    if (ref?.status === 200 && ref.data?.resultStatus === 200) {
      state.favorites = ref.data.resultData;
    }

    if (res?.status === 200 && res.data?.resultStatus === 200) {
      storeMap[storeId] = res.data.resultData;
      state.store = res.data.resultData;
    }
  }

  loadReviews();
};

// 가게 평균 별점 및 리뷰 수를 보여주기 위한 함수
const loadReviews = () => {
  // 리뷰 총점 구하기
  let ratingNumCal = 0;

  for (let i = 0; i < state.reviews.length; i++) {
    ratingNumCal += state.reviews[i].rating;
  }
  const count = (ratingNumCal / state.reviews.length).toFixed(1);

  state.reviewNum = count;

  calculateTotal();
};

onMounted(() => {
  load();
});

const goToLogin = () => router.push("/login");
const goToMain = () => router.push("/");
const goToOrder = (items) => {
  if (items.length === 0) {
    showModal("주문한 메뉴가 없습니다.")
    return;
  }

  const orderItems = group.items.map((item) => ({
    id: item.id,
    menuId: item.menuId,
    quantity: item.quantity,
    price: item.price,
    name: item.name,
    imagePath: item.image_path,
  }));

  localStorage.setItem("orderItems", JSON.stringify(orderItems));
  router.push(`/stores/${items[0].storeId}/order`);
};



// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);







// 장바구니 총 금액 계산하는 함수
const calculateTotal = () => {
  totalPrice.value = 0;

  state.items.forEach((item) => {
    const price = item.price * item.quantity;
    totalPrice.value += price;
    console.log("이거 왜이렇게 비싸", item.price)
  });

};



// 가게 이미지
const imgSrc = computed(() => {
  return state.store.id && state.store.imagePath && state.store.imagePath !== 'null'
    ? `${baseUrl.value}/images/store/${state.store.id}/${state.store.imagePath}`
    : defaultImage;
})

const previewImage = ref(defaultImage);
const baseUrl = ref(import.meta.env.VITE_BASE_URL);

// 메뉴 이미지
const menuIgmSrc = (item) => {
  if (previewImage.value && previewImage.value !== defaultImage) {
    return previewImage.value;
  }
  if (item?.imagePath && item.imagePath !== "null") {
    return `${baseUrl.value}/images/store/${state.store.id}/menu/${item.menuId}/${item.imagePath}`;
  }
  return defaultImage;
};

// const menuIgmSrc = computed(() => {
//   if (previewImage.value && previewImage.value !== defaultImage) {
//     return previewImage.value;
//   }
//   if (props.menu?.imagePath && props.menu.imagePath !== "null") {
//     return `${baseUrl.value}/images/store/${state.store.id}/menu/${items?.menuId}/${items?.imagePath}`;
//   }
//   return defaultImage;
// });






// 신규 함수

// 수량 증가/감소
const increaseQty = async (item) => {

  if (item.quantity < 100) {
    item.quantity += 1;
    await plusQuantity(item.id);
    calculateTotal();
  }
  emit("update-items", item.value);

};
const decreaseQty = async (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
    await minusQuantity(item.id);
    calculateTotal();
  } else {
    // 수량 1이고 - 클릭하면 삭제
    await removeItem(item.id);
    const idx = state.items.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      state.items.splice(idx, 1); // 배열에서 제거 -> 반응성 보장
    }
    calculateTotal();
  }
  emit("update-items", item.value);
};


</script>

<template>
  <div class="section-header">
    <div class="section-title">
      <div class="text-top">장바구니</div>
      <div class="step-horizontal">
        <span class="step-text">01 음식선택</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png" /></span>
        <span class="step-text current">02 장바구니</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png" /></span>
        <span class="step-text">03 주문/결제</span>
        <span class="arrow"><img src="/src/imgs/cartimgs/arrow-back.png" /></span>
        <span class="step-text">04 주문완료</span>
      </div>
    </div>
    <div class="solid"></div>
  </div>

  <!-- 1. 로그인 안 했고 장바구니 비었을 때 -->
  <div v-if="!account.state.loggedIn && state.items.length === 0">
    <div class="div18">장바구니에 담은 음식이 없습니다.</div>
    <div class="groupContainer">
      <div class="div19" @click="goToLogin">로그인 하러 가기</div>
    </div>
  </div>

  <!-- 2. 로그인 했고 장바구니 비었을 때 -->
  <div v-else-if="state.items.length === 0">
    <div class="div18">장바구니에 담은 음식이 없습니다.</div>
    <div class="groupContainer">
      <div class="rectangleWrapper">
        <div class="groupItem" />
      </div>
      <div class="div19" @click="goToMain">음식 담으러 가기</div>
    </div>
  </div>

  <!-- 3. 로그인 후 장바구니에 음식 있음 -->
  <div v-else>
    <!-- 음식점 가게 카드 -->
    <div class="store-layout">
      <!-- 가게 대표 카드 -->
      <!-- <div class="store-card" v-if="groupedItems.length > 0"> -->
      <div class="store-card" v-if="state.items.length > 0">
        <img class="thumbnail" :src="imgSrc" @error="e => e.target.src = defaultImage" />
        <div class="store-content">
          <h3 class="store-name">{{ state.store.name }}</h3>
          <div class="store-meta">
            <div class="rating">
              <img id="icon" src="/src/imgs/star.png" alt="별점" />
              <div v-if="state.reviewNum !== 'NaN'">
                <span class="score">{{ state.reviewNum ? state.reviewNum : '0' }}</span>
                <span class="count">({{ state.reviewNum.length ? state.reviewNum.length : '0' }})</span>
              </div>
              <div v-else>
                <span class="score"> 0</span>
                <span class="count">(0)</span>
              </div>
            </div>
            <div class="likes">
              <img id="icon" src="/src/imgs/love.png" alt="찜" />
              <span class="like-count">{{ state.favorites.length }}</span>
            </div>
          </div>

          <div class="store-info">
            <p>
              최소 주문 금액
              {{ storeMap[state.items[0].storeId]?.minOrderAmount?.toLocaleString() || '10,000' }}원
            </p>
            <p>
              배달료
              {{ storeMap[state.items[0].storeId]?.deliveryFeeRange || '0원 ~ 3,000원' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 오른쪽 박스 -->
      <div class="store-box">

        <!-- 오른쪽  -->
        <!-- 장바구니 음식 리스트 -->

        <div class="menu-box">

          <div v-for="(item, idx) in state.items" :key="item.id">
            <div class="cart-item">
              <img :src="menuIgmSrc(item)" @error="e => e.target.src = defaultImage" />
              <div class="item-content">
                <div class="menu-info-option">
                  <div class="item-name">{{ item.name }}</div>
                  <div v-for="value in item.options" :key="value.id" class="options-box">
                    <div class="menu-option-box">
                      <div class="option-name">{{ value.comment }}</div>
                      <div class="option-name">{{ value.children[0]?.comment }}</div>
                    </div>
                    <div class="option-price-box">
                      <div class="option-price">{{ (value.children[0]?.price ?? 0).toLocaleString() }}원</div>
                    </div>
                  </div>
                </div>
                <div class="btns">
                  <div @click="decreaseQty(item)" class="quantity-box">
                    <div class="quantity-text-m">–</div>
                  </div>
                  <div class="quantity">{{ item.quantity }}</div>
                  <div @click="increaseQty(item)" class="quantity-box">
                    <div class="quantity-text-p">+</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="menu-border"></div>
          </div>
        </div>

        <!-- 총 금액 표시만 -->
        <div>
          <div class="total-border"></div>
          <div class="cart-footer">
            <div class="total">총 결제 금액:</div>
            <div class="total">{{ totalPrice.toLocaleString() }}원</div>
          </div>
        </div>
      </div>
    </div>

    <div class="groupContainer">
      <div class="hn-btn-white" @click="goToOrder(state.items)">주문하기</div>
    </div>
  </div>

  <!--  -->
  <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">알림</h5>
        </div>
        <div class="modal-body" id="alertModalBody">내용</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: "Pretendard-Regular";
}

@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}


//섹션 헤더영역
.section-header {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  font-weight: 300;
  text-align: center;
  margin-top: 95px;
  font-size: 25px;

  .section-title {
    width: 1470px;
    display: flex;
    justify-content: space-between;
    /* 왼쪽과 오른쪽 끝 정렬 */
    align-items: center;
    position: relative;
    margin: 5px 0;

    .text-top {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #6c6c6c;
    }

    // 01 음식선택 > 02 장바구니 > 03 주문/결제 > 04 주문 완료
    .step-horizontal {
      color: #6c6c6c;
      width: 100%;
      display: flex;
      justify-content: right;
      align-items: center;
      gap: 8px;
      font-size: 16px;

      .step-text.current {
        // 02 장바구니
        color: #ff6666;
      }
    }
  }

  .solid {
    width: 1470px;
    border: 1px #6c6c6c solid;
    margin: 50px 0 80px;
  }
}



.cart-empty-wrapper {
  max-width: 1024px;
  margin: 50px auto 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 80px;
}

.title-wrap {
  // < 장바구니
  display: flex;
  align-items: center;

  .back-icon {
    // <
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .div29 {
    // 장바구니
    font-size: 50px;
  }
}



.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0px;
}

.back-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.div29 {
  font-size: 28px;
  font-weight: bold;
}

.step-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
}

.step-text.current {
  color: #ff6666;
  font-size: 16px;
}

.arrow img {
  width: 12px;
  height: auto;
}

.login-cart {
  font-size: 16px;
  margin-bottom: 50px;
  text-align: center;
  color: #555;
}

.div18 {
  font-size: 32px;
  margin-bottom: 50px;
  text-align: center;
  color: #555;
  // 텍스트를 수평 및 수직 중앙 정렬
  display: flex; // 내부 정렬을 위한 flex 사용
  justify-content: center; // 가로 중앙 정렬
  align-items: center; // 세로 중앙 정렬
  // 박스 형태 추가
  border: 1px solid #d7d7d7;
  background-color: #fff;
  padding: 40px;
  border-radius: 25px;
  width: 1250px;
  height: 400px;
  margin: 0 auto 40px auto; // 가운데 정렬 및 여백
}

.groupContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
  margin-bottom: 200px;
}

.div-login {
  border: 2px solid #ff6666;
  color: #ff6666;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 40px;
}


// 음식 담으러 가기 버튼
.div19 {
  width: 400px;
  height: 80px;
  border: 2px solid #ff6666;
  color: #ff6666;
  background-color: #fff;
  border-radius: 15px;
  font-size: 32px;
  margin-bottom: 80px;
  margin-top: 80px;
  cursor: pointer;

  // 글자 수직 정렬
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:hover {
    background-color: #ff6666;
    color: #fff;
  }
}

// 박스 정렬
.store-layout {
  max-width: 1200px;
  margin: auto; // 전체 가운데 정렬
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  flex-wrap: nowrap; // 줄바꿈 방지
}


// 음식점 가게 카드
.store-card {
  width: 368px; // 카드 전체 너비
  border: 2px solid #ccc;
  border-radius: 25px;
  overflow: hidden; // 내부 요소 넘칠 경우 숨김
  cursor: pointer;

  .thumbnail {
    // 사진
    width: 370px; // 썸네일 가로 꽉 차게
    height: 325px; // 썸네일 고정 높이
    object-fit: cover; // 이미지 비율 유지하며 채우기
  }

  .store-content {
    padding: 20px; // 내부 여백


    .store-name {
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #000;
      text-align: center;
    }

    .store-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      margin: 20px 25%;

      .rating,
      .likes {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      img {
        // 별, 하트 아이콘
        width: 20px;
        height: 20px;
      }

      .score {
        font-weight: bold; // 별점 숫자 굵게
        color: #6c6c6c; // 짙은 회색
      }

      .count {
        color: #797979;
        font-size: 18px;
        text-align: center;
      }
    }

    .store-info {
      color: #797979;
      font-size: 18px;
      margin-bottom: 20px;
      text-align: center;
    }
  }
}

.store-box {
  // 각 음식점별 장바구니 박스
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 830px;
  min-height: 556px;
  padding: 50px;
  border: 2px solid #ccc;
  border-radius: 15px;
  background-color: #fff;


}

.store-name {
  font-size: 20px;
  font-weight: bold;
}

.store-sub {
  font-size: 14px;
  color: #888;
}

.cart-item {
  // 메뉴
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
  flex-wrap: wrap;

  img {
    // 장바구니 이미지
    width: 100px;
    height: 100px;
    border-radius: 15px;
    object-fit: cover;
  }
}

.item-content {
  // 메뉴 박스
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex: 1;

  .item-name {
    // 메뉴 이름
    font-size: 20px;
    font-weight: 600;
    flex: 1;
    margin-bottom: 8px;
  }

  .item-comment {
    // 메뉴 설명글
    font-family: "Pretendard-Regular";
    color-scheme: #a9a9a9;
    font-size: 15px;
  }

  .item-price {
    // 메뉴 가격
    font-size: 20px;
    margin-bottom: -0.5px;
    margin-left: 70px;
  }

  button {
    font-weight: bold;
    cursor: pointer;
  }
}



.delete-button {
  cursor: pointer;
  border: none;
  background-color: #fff; // 기본 색
  border-radius: 4px;
  color: #000;

  &:hover {
    background-color: #ffe5e5;
  }

  &.danger {
    color: #ff6666;
    border: 1px solid #ff6666;
  }
}

//신규

.hn-btn-white {
  margin-top: 80px;
  margin-bottom: 100px;
  padding: 10px 200px 10px 200px;
  font-size: 1.8em;
}


.cart-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 200px;

}

.total {
  font-size: 1.5em;
}

.menu-border {
  border: 1px #ccc solid;
  margin-bottom: 20px;
}

.btns {
  display: flex;
  gap: 20px;
  font-weight: 400;
  align-items: center;
}

.quantity {
  font-size: 1.3em;
  font-weight: 500;
}

.menu-info-option {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.menu-option-box {
  display: flex;
  color: #ccc;
}

.options-box {
  display: flex;
  justify-content: space-between;
}
</style>
