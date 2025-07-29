<script setup>
import { reactive, onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getItem, removeItem } from "@/services/cartService";
import { useAccountStore } from "@/stores/account";
import { getStore } from "@/services/storeService";
import { useCartStore } from "@/stores/cart";
import { getReviewsByStoreId } from "@/services/reviewServices";
import { getFavoriteList } from "@/services/favoriteService";
// 에러 이미지
import defaultImage from '@/imgs/owner/owner-service3.png';

const cartStore = useCartStore();

const router = useRouter();
const account = useAccountStore();

const state = reactive({
  items: cartStore.state.items,
  reviews: [],
  reviewNum: 0,
  favorites: [],
  store: {},
});

const storeMap = reactive({});

const fetchStoreDetails = async () => {
  const storeIds = [...new Set(state.items.map(item => item.storeId))];
  for (const storeId of storeIds) {
    if (!storeMap[storeId]) {
      const res = await getStore(storeId);
      // 리뷰 찾을려고 추기작성
      const rev = await getReviewsByStoreId(storeIds);
      if (rev?.status === 200 && rev.data?.resultStatus === 200) {
        state.reviews = rev.data.resultData;
      }
      // 찜하기 찾을려고 추가 작성
      const ref = await getFavoriteList(storeId);
      if (ref?.status === 200 && ref.data?.resultStatus === 200) {
        state.favorites = ref.data.resultData;
        console.log("fav", state.favorites);
      }

      if (res?.status === 200 && res.data?.resultStatus === 200) {
        storeMap[storeId] = res.data.resultData;
        state.store = res.data.resultData;
      }
    }
  }
};


// 가게 리뷰 조회 함수
const loadReviews = () => {

  console.log("reviews", state.reviews)
  // 리뷰 총점 구하기
  let ratingNumCal = 0;
  console.log("state.reviews: ", state.reviews);
  for (let i = 0; i < state.reviews.length; i++) {
    ratingNumCal += state.reviews[i].rating;
  }
  const count = (ratingNumCal / state.reviews.length).toFixed(1)
  // console.log("ratingNumCal", ratingNumCal);

  state.reviewNum = count


  // console.log("comLeng: ", comLeng);

  // 조회 성공 시 장바구니 조회 함수 호출

};



const loggedIn = computed(() => account.state.loggedIn);

onMounted(async () => {
  await load();
  await fetchStoreDetails();
  loadReviews();
  console.log("item", state.items[0])
});

const load = async () => {
  if (!loggedIn.value) return;
  const res = await getItem();
  if (res === undefined || res.status !== 200 || res.data.resultStatus !== 200)
    return;

  state.items = res.data.resultData || [];
};

const remove = async (cartId) => {
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) return;
  load();
  cartStore.clearCart()
};

const increaseQty = (item) => {
  item.quantity++;
};

const decreaseQty = (item) => {
  if (item.quantity > 1) item.quantity--;
};

const totalPrice = computed(() =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const goToLogin = () => router.push("/login");
const goToMain = () => router.push("/");

const goToOrder = (group) => {
  if (!group || !group.items || group.items.length === 0) {
    alert("주문할 메뉴가 없습니다.");
    return;
  }

  const orderItems = group.items.map((item) => ({
    id: item.id,
    menuId: item.menuId || item.menu_id || item.id,
    quantity: item.quantity,
    price: item.price,
    name: item.name,
    imagePath: item.image_path,
  }));

  localStorage.setItem("orderItems", JSON.stringify(orderItems));
  router.push(`/stores/${group.items[0].storeId}/order`);
};

const groupedItems = computed(() => {
  const groups = {};
  for (const item of state.items) {
    if (!groups[item.storeName]) {
      groups[item.storeName] = {
        storeId: item.storeId,
        storeName: item.storeName,
        storeNotice: item.storeNotice,
        items: [],
      };
    }
    groups[item.storeName].items.push(item);
  }
  return Object.values(groups);
});

// 총가격
const grandTotalPrice = computed(() => {
  return groupedItems.value.reduce((groupSum, group) => {
    return (
      groupSum +
      group.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  }, 0);
});

// 가게 이미지
const imgSrc = computed(() => {

  return state.store.id && state.store.imagePath && state.store.imagePath !== 'null'
    ? `/pic/store-profile/${state.store.id}/${state.store.imagePath}`
    : defaultImage;

})
// 메뉴 이미지

const menuIgmSrc = computed(()=>{

  return state.items[0]?.menuId && state.items[0]?.imagePath && state.items[0]?.imagePath !== 'null'
    ? `/pic/store-profile/${state.items[0]?.menuId}/${state.items[0]?.imagePath}`
    : defaultImage;  
})


</script>

<template>
  <div class="cart-empty-wrapper">
    <div class="top-row">
      <div class="header-row">
        <div class="title-wrap">
          <img class="back-icon" alt="뒤로가기" src="/src/imgs/cartimgs/arrowios.svg" />
          <div class="div29">장바구니</div>
        </div>
      </div>
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
  </div>

  <!-- 1. 로그인 안 했고 장바구니 비었을 때 -->
  <div v-if="!loggedIn && state.items.length === 0">
    <div class="div18">장바구니에 담은 음식이 없습니다.</div>
    <div class="groupContainer">
      <div class="div19" @click="goToMain">음식 담으러 가기</div>
    </div>
  </div>

  <!-- 2. 비로그인 상태로 장바구니 담겼을떄  -->
  <div v-else-if="!loggedIn" class="unlogin">
    <div class="store-layout">
      <div class="store-card">
        <img class="thumbnail" src="@/imgs/chicken.png" />
        <div class="store-content">
          <h3 class="store-name">가게이름</h3>

          <div class="store-meta">
            <div class="rating">
              <img id="icon" src="/src/imgs/star.png" alt="별점" />
              <span class="score">{{ state.reviewNum ? state.reviewNum : '0' }}</span>
              <span class="count">({{ state.reviewNum.length ? state.reviewNum.length : '0' }})</span>
            </div>
            <div class="likes">
              <img id="icon" src="/src/imgs/love.png" alt="찜" />
              <span class="like-count">{{ state.favorites.length }}</span>
            </div>
          </div>

          <div class="store-info">
            <p>최소 주문 금액 10,000원</p>
            <p>배달료 0원 ~ 3,000원</p>
          </div>
        </div>
      </div>
      <div v-for="group in groupedItems" :key="group.storeName" class="store-box">
        <!-- 가게 음식 정보 -->
        <div class="store-info">
          <p class="store-name">{{ group.storeName }}</p>
          <p class="store-sub">{{ group.storeNotice }}</p>
        </div>
        <!-- 장바구니 음식 리스트 -->
        <div v-for="item in group.items" :key="item.id" class="cart-item">
          <img :src="item.image_path" alt="음식 이미지" style="width: 60px; height: 60px" />
          <div class="item-content">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-comment"></p>
            <div class="qty-box">
              <!-- ❌ 수량이 1일 때는 X버튼으로 삭제 -->
              <button v-if="item.quantity === 1" @click="remove(item.id)"
                :class="{ 'delete-button': true, danger: true }">
                x
              </button>

              <!-- ➖ 수량이 2 이상일 때는 수량 감소 -->
              <button v-else @click="decreaseQty(item)" class="qty-button">
                -
              </button>

              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">+</button>
            </div>
            >
            <p class="item-price">
              {{ (item.price * item.quantity).toLocaleString() }}원
            </p>
            <!-- <button @click="remove(item.id)">X</button> -->
          </div>
        </div>
        <!-- 각 그룹마다 주문 버튼 배치 -->
        <div class="cart-footer">
          <p class="total">총 결제 금액:</p>
          <p class="total">{{ grandTotalPrice.toLocaleString() }}원</p>
        </div>
      </div>
    </div>
    <!-- 주문하기 버튼 -->
    <div class="groupContainer">
      <div class="div19" @click="goToOrder(group)">로그인후 주문하기</div>
    </div>
  </div>

  <!-- 3. 로그인 했고 장바구니 비었을 때 -->
  <div v-else-if="state.items.length === 0">
    <div class="div18">장바구니에 담은 음식이 없습니다.</div>
    <div class="groupContainer">
      <div class="rectangleWrapper">
        <div class="groupItem" />
      </div>
      <div class="div19" @click="goToMain">음식 담으러 가기</div>
    </div>
  </div>

  <!-- 4. 로그인 후 장바구니에 음식 있음 -->
  <div v-else>
    <!-- 음식점 가게 카드 -->
    <div class="store-layout">
      <!-- 가게 대표 카드 -->
      <div class="store-card" v-if="groupedItems.length > 0">
        <img class="thumbnail" :src="menuIgmSrc" @error="e => e.target.src = defaultImage" />
        <!-- <img :src='`/pic/store-profile/${state.store.id}/${state.store.imagePath}` '/> -->
        <div class="store-content">
          <h3 class="store-name">
            {{ storeMap[groupedItems[0].storeId]?.name || groupedItems[0].storeName }}
          </h3>

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
              {{ storeMap[groupedItems[0].storeId]?.minOrderAmount?.toLocaleString() || '10,000' }}원
            </p>
            <p>
              배달료
              {{ storeMap[groupedItems[0].storeId]?.deliveryFeeRange || '0원 ~ 3,000원' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 그룹 반복 렌더링 -->
      <div v-for="group in groupedItems" :key="group.storeName" class="store-box">
        <!-- 가게 음식 정보 -->
        <div class="store-info">
          <p class="store-name">{{ group.storeName }}</p>
          <p class="store-sub">{{ group.storeNotice }}</p>
        </div>

        <!-- 장바구니 음식 리스트 -->
        <div v-for="item in group.items" :key="item.id" class="cart-item">
          <img  :src="imgSrc" @error="e => e.target.src = defaultImage" />
          <div class="item-content">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-comment"></p>
            <div class="qty-box">
              <button v-if="item.quantity === 1" @click="remove(item.id)"
                :class="{ 'delete-button': true, danger: true }">
                x
              </button>
              <button v-else @click="decreaseQty(item)" class="qty-button">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">+</button>
            </div>
            <p class="item-price">
              {{ (item.price * item.quantity).toLocaleString() }}원
            </p>
          </div>
        </div>

        <!-- 총 금액 표시만 -->
        <div class="cart-footer">
          <p class="total">총 결제 금액:</p>
          <p class="total">
            {{group.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}}원
          </p>
        </div>
      </div>
    </div>

    <div class="groupContainer">
      <div class="div19" @click="goToOrder(groupedItems[0])">주문하기</div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
@font-face {
  // 배민 주아체
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
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
  font-family: "BMJUA";
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
.step-horizontal {
  // 01 음식선택 > 02 장바구니 > 03 주문/결제 > 04 주문 완료
  font-family: "BMJUA";
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  .step-text.current {
    // 02 장바구니
    color: #ff6666;
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

.div19 {
  // 음식 담으러 가기 버튼
  width: 400px;
  height: 80px;
  border: 2px solid #ff6666;
  color: #ff6666;
  background-color: #fff;
  border-radius: 8px;
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
    background-color: #ffe5e5;
  }
}

// 박스 정렬
.store-layout {
  max-width: 1251px;
  margin: 40px auto 0 auto; // 전체 가운데 정렬
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: nowrap; // 줄바꿈 방지
}

// 음식점 가게 카드
.store-card {
  width: 368px; // 카드 전체 너비
  border: 1px solid #d7d7d7;
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
      font-family: "BMJUA";
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
  width: 830px;
  height: 553px;
  margin: 0 auto 0px 50px;
  padding: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background-color: #fff;
  display: flex;
  flex-direction: column; // 세로 정렬

  .store-info {
    // 음식점 정보 영역 (이름, 공지사항)
    margin-bottom: 20px;
  }

  .cart-footer {
    // 총금액 구역박스
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    text-align: right;

    .total {
      // 총 금액
      font-family: "BMJUA";
      font-size: 30px;
      margin-right: 40px;
    }
  }
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
    font-family: "BMJUA";
    font-size: 20px;
    font-weight: 600;
    flex: 1;
    margin-bottom: 8px;
    margin-left: 24px;
  }

  .item-comment {
    // 메뉴 설명글
    font-family: "Pretendard-Regular";
    color-scheme: #a9a9a9;
    font-size: 15px;
  }

  .item-price {
    // 메뉴 가격
    font-family: "BMJUA";
    font-size: 20px;
    margin-bottom: -0.5px;
    margin-left: 70px;
  }

  button {
    font-weight: bold;
    cursor: pointer;
  }
}

.qty-box {
  // 수량 조절 박스
  font-family: "Pretendard-Regular";
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: center;
  justify-content: center;

  button {
    // 수량버튼
    width: 25px;
    height: 25px;

    // 테두리 및 배경 설정
    border: 1px solid #999;
    border-radius: 6px;
    background-color: #fff;
    color: #000;

    // 가운데 정렬 및 클릭 커서 설정
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    // 숫자 표시 박스 크기 설정
    width: 32px;
    height: 32px;

    // 텍스트 정렬 설정
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
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

</style>

