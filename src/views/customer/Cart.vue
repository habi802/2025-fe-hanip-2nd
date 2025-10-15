<script setup>
import { reactive, onMounted, computed, ref, toRaw } from "vue";
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

import { getOption } from "@/services/menuService";
import { getOptions } from "@/services/cartService";
import { getMenus } from "@/services/menuService";
import Menu from "@/components/customer/CartMenus.vue";

import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';




const router = useRouter();
const account = useAccountStore();

const state = reactive({
  items: [],
  reviews: [],
  reviewNum: 0,
  favorites: [],
  store: {},
  reviewLeng: [],
});

// 장바구니 목록 불러오는 함수
const load = async () => {
  if (!account.state.loggedIn) return;
  const res = await getItem();
  if (res === undefined || res.status !== 200 || res.data.resultStatus !== 200)
    return;

  state.items = res.data.resultData || [];



  await Promise.all(
    state.items.map(async (item) => {
      try {
        const optionRes = await getOption(item.menuId); // 메뉴 아이디로 옵션 조회 API 호출
        // 옵션이 있으면 true, 없으면 false
        item.hasOptions = optionRes.data.resultData.options.length > 0;
      } catch (err) {
        console.error(`메뉴 옵션 조회 실패: ${item.menuId}`, err);
        item.hasOptions = false;
      }
    })
  );




  fetchStoreDetails();
};

// 가게 정보 불러오는 함수(가 맞겠지? 최초로 쓴 사람만 알고 있다..)
const storeMap = reactive({});

const fetchStoreDetails = async () => {
  const storeId = state.items[0].storeId;
  getStoreMenu(storeId);

  const review = await getReviewsByStoreId(storeId, {
    rowPerPage: 10,
    page: 1,
  });
  state.reviewLeng = review.data.resultData;
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

  calculateTotal();

};



onMounted(async () => {
  load();
  cartMenu();
});

const goToLogin = () => router.push("/login");
const goToMain = () => router.push("/");
const goToOrder = (items) => {
  if (items.length === 0) {
    showModal("주문한 메뉴가 없습니다.")
    return;
  }

  router.push(`/stores/${items}/order`);
};

// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);

// 장바구니 총 금액 계산하는 함수
const calculateTotal = () => {
  let _totalPrice = 0;

  state.items.forEach((item) => {
    _totalPrice += item.price;
  });

  totalPrice.value = _totalPrice;

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





// 신규 함수

// 수량 증가/감소
const increaseQty = async (item) => {
  // 메뉴 표시 가격

  if (item.quantity < 100) {
    await plusQuantity(item.id);

    item.quantity += 1;
    //item    
    item.price = item.oneMenuPrice
      * item.quantity;
    calculateTotal();
  }
  emit("update-items", item.value);

};

const decreaseQty = async (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
    //item.amount = item.price * item.quantity;
    item.price = item.oneMenuPrice
      * item.quantity;
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

// 모달용
import OptionModalModify from "@/components/modal/OptionModalModify.vue";

const optionModal = ref(null);



const menu = reactive({
  item: {
    menuId: Number,
    name: String,
    price: Number,
    comment: String,
    imagePath: String,
    options: [],
    quantity: 0
  }
});

const openOptionModal = async (item) => {

  const res = await getOption(item.menuId);

  menu.item.options = res.data.resultData.options;

  optionModal.value.setMenuData(menu.item.options)
  const modalElement = optionModal.value.$el;
  const modal = new bootstrap.Modal(modalElement);

  const optionRes = await getOptions(item.id)

  const info = optionRes.data.resultData;

  selectOption.info.menuId = item.menuId;
  selectOption.info.optionId = info.optionId;
  selectOption.info.quantity = item.quantity;
  selectOption.info.cartId = item.id;

  optionModal.value.setSelectData(selectOption.info);
  modal.show();

};


// 내가 선택한거 담기용

const selectOption = reactive({
  info: {
    menuId: 0,
    optionId: [],
    quantity: 0,
    cartId: 0,
  }
})

const store = reactive({
  menus: [],
  newMenus: [],
  deleteMenus: [],
  finalMenus: []
})

// 가게 메뉴 조회
const getStoreMenu = async (storeId) => {
  const res = await getMenus(storeId);
  store.menus = res.data.resultData;
  if (store.menus.length <= 0) {
    let timeoutId;
    const redirectHome = () => {
      clearTimeout(timeoutId);
      router.push("/");
    };
    timeoutId = setTimeout(() => {
      redirectHome();
    }, 2000);
    setTimeout(async () => {
      const alret = await alertResolveModal.value.showModal("가게의 메뉴가 없습니다.");

      if (alret) {
        router.push("/")
      }
    }, 150);

  }
}

// 다른메뉴 전용으로 만듬
const recMenu = reactive({
  items: [],
  menus: [],
  newMenus: [],
  deleteMenus: [],
  finalMenus: []
})


const cartMenu = async () => {
  const res2 = await getItem();

  recMenu.items = res2.data.resultData || [];
  const res = await getMenus(recMenu.items[0].storeId);
  recMenu.menus = res.data.resultData;

  const menuIds = recMenu.items.map(item => item.menuId);
  const setMenuId = new Set(menuIds);
  const delId = [...setMenuId];
  recMenu.deleteMenus = delId;


  const allMenus = computed(() => {
    const random = recMenu.menus.flatMap(item => item.menus.map(menu => toRaw(menu)))
    for (let i = random.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [random[i], random[j]] = [random[j], random[i]];
    }
    return random;
  }
  );


  recMenu.newMenus = allMenus;

  const rawArray = toRaw(recMenu.deleteMenus);



  const filteredMenus = recMenu.newMenus.filter(menu => {
    const menuId = Number(menu.menuId);
    // 메뉴 숨김 품절처리 
    return (
      !rawArray.includes(menuId) &&
      menu.isHide !== 0 &&
      menu.isSoldOut !== 0
    );
  });
  recMenu.finalMenus = filteredMenus;
  console.log("왜 안 사라져", recMenu.finalMenus)

}

</script>

<template>
  <div class="big-box"></div>
  <div class="order-header">
    <h2 class="header-text">장바구니</h2>
    <div class="steps-box">

      <div class="order-steps">
        <span>01 음식 선택</span> ›
        <span class="current">02 장바구니</span> ›
        <span>03 주문/결제</span> ›
        <span>04 주문완료</span>
      </div>
    </div>
    <div class="header-box">

      <div class="header-divider"></div>
    </div>
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
  <div class="cart-box" v-else>
    <!-- 음식점 가게 카드 -->
    <div class="store-layout">
      <!-- 가게 대표 카드 -->
      <!-- <div class="store-card" v-if="groupedItems.length > 0"> -->

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
                  <div class="item-infos">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-price">{{ (item.price ?? 0).toLocaleString() }}원</div>
                  </div>


                  <div v-for="value in item.options" :key="value.optionId" class="options-box">
                    <div class="menu-option-row">

                      <!-- 부모 옵션 이름 -->
                      <div class="option-name">{{ value.comment }}</div>
                      <!-- 자식 옵션명과 가격을 한 쌍으로 묶기 -->
                      <div v-for="child in value.children" :key="child.optionId"
                        style="display: flex; gap: 4px; align-items: center;" class="child-box">

                        <div class="child-option">{{ child.comment }}</div>
                        <div class="child-price">{{ (child.price ?? 0).toLocaleString() }}원</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div class="options-box">
                <div class="btns">
                  <div @click="decreaseQty(item)" class="quantity-box">
                    <div class="quantity-text-m">–</div>
                  </div>
                  <div class="quantity">{{ item.quantity }}</div>
                  <div @click="increaseQty(item)" class="quantity-box">
                    <div class="quantity-text-p">+</div>
                  </div>
                </div>
                <div class="option-box">
                  <div v-if="item.hasOptions" class="option-modify" @click="openOptionModal(item)">옵션 변경
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
      <div class="rigth-box">
        <div class="store-card" v-if="state.items.length > 0">
          <img class="thumbnail" :src="imgSrc" @error="e => e.target.src = defaultImage" />
          <div class="store-content">
            <h3 class="store-name">{{ state.store.name }}</h3>
            <div class="store-meta">
              <div class="rating">
                <div class="star">★</div>
                <div v-if="state.reviewNum !== 'NaN'">
                  <span class="score">{{ Number(state.store.rating).toFixed(1) }}</span>
                  <span class="count">({{ (state.reviewLeng?.length || 0) }})</span>
                </div>
                <div v-else>
                  <div class="score-box">
                    <div class="score"> 0</div>
                    <div class="count">(0)</div>

                  </div>
                </div>
              </div>
              <div class="likes">
                <div class="hart">♥</div>
                <span class="like-count">{{ state.store.favorites }}</span>
              </div>
            </div>

            <div class="store-info">
              <p class="store-minAmount" :class="{ minAomunt: totalPrice < state.store.minAmount }">
                최소 주문 금액
                {{ state.store.minAmount.toLocaleString() || '10,000' }}원
              </p>
              <p>
                배달료
                {{ (state.store.minDeliveryFee ?? 0).toLocaleString() || "3,000" }}원
                ~ {{ (state.store.maxDeliveryFee ?? 0).toLocaleString() }}원
              </p>
            </div>
          </div>
        </div>

        <div class="groupContainer">
          <div class="hn-btn-white" :class="{ minAmount: state.store.minAmount > totalPrice }"
            @click="goToOrder(state.store.id)">주문하기</div>
        </div>
      </div>
    </div>
    <!-- 메뉴 카드용! -->
    <div v-if="recMenu.finalMenus.length >= 3">
      <div class="menus-title-box">
        <div class="menus-title">함께 먹는 메뉴로 어떠신가요?</div>
      </div>

      <div class="menus-big-box">
        <div class="menus-box">
          <swiper :slidesPerView="recMenu.finalMenus.length > 5 ? 5 : recMenu.finalMenus.length - 1"
            :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]" :speed="1000" :spaceBetween="0"
            :resistance="false" :resistanceRatio="0" :observer="true" :observe-parents="true" :loop="true">
            <swiper-slide v-for="menu in recMenu.finalMenus" :key="menu.id"
              :class="{ hide: menu.isSoldOut === 0 || menu.isHide === 0 }">
              <Menu @cartAdded="load" :item="menu"></Menu>
            </swiper-slide>

          </swiper>
        </div>
      </div>
    </div>
    <div v-else>

    </div>

    <div class="buttom"></div>
  </div>

  <option-modal-modify ref="optionModal" @cart-updated="load"></option-modal-modify>
</template>

<style lang="scss" scoped>
* {
  font-family: "Pretendard-Regular";
  user-select: none;
  -webkit-user-drag: none;
}

@font-face {
  font-family: "YFavorite";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/YOnepickTTF-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
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
    width: 1140px;
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
  width: 1140px;
  height: 400px;
  margin: 0 auto 40px auto; // 가운데 정렬 및 여백
}

.groupContainer {
  display: flex;
  justify-content: center;
  margin-top: 38px;
  gap: 20px;
  margin-bottom: 30px;
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
  max-width: 1140px;
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
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 20px;
  border-radius: 10px;
  overflow: hidden; // 내부 요소 넘칠 경우 숨김

  .thumbnail {
    // 사진
    width: 326px; // 썸네일 가로 꽉 차게
    height: 223px;
    // height: 10%; // 썸네일 고정 높이
    border-radius: 10px;
    object-fit: cover; // 이미지 비율 유지하며 채우기
  }

  .store-content {

    .store-name {
      font-size: 25px;
      font-weight: 200;

      color: #000;
      text-align: center;
      margin: 22px 0px;
    }

    .store-meta {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 50px;

      .rating,
      .likes {
        width: 50px;
        display: flex;
        align-items: center;
        color: #797979;
      }

      .score {
        font-size: 1.2em;
        font-weight: bold; // 별점 숫자 굵게
        color: #6c6c6c; // 짙은 회색
      }

      .count {
        color: #797979;
        font-size: 18px;
        text-align: center;
        letter-spacing: 2px;
        margin-left: 5px;
      }
    }

    .store-info {
      color: #797979;
      font-size: 18px;
      text-align: center;
    }
  }
}

.store-minAmount {
  color: #888;
}

.minAomunt {
  color: #ff6666;
}

.store-box {
  // 각 음식점별 장바구니 박스
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 830px;
  min-height: 556px;
  padding: 20px;
  border: 1px solid #ccc;
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
  // display: flex;
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
  padding: 10px 130px;
  font-size: 1.8em;
  border: 1px solid;

  &:hover {
    background-color: inherit;
    color: #ff6666;
  }
}


.cart-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 200px;
  margin-bottom: 10px;

}

.total {
  font-size: 1.5em;
}

.menu-border {
  border: 1px #ccc solid;
  margin-bottom: 20px;
}

.btns {
  width: 100px;
  display: flex;
  gap: 10px;
  font-weight: 400;
  align-items: center;
  justify-content: space-between;
}

.quantity {
  font-size: 1.3em;
  font-weight: 500;
}

.menu-option-box {
  display: flex;
  color: #ccc;
}

.options-box {
  display: flex;
  justify-content: space-between;
}

.quanyity-box {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.option-modify {
  text-align: center;
  font-size: 1em;
  padding: 2px 8px;
  border: #ccc 1px solid;
  border-radius: 5px;
  color: #ccc;
}

.options-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-infos {
  display: flex;
}

.menu-option-row {
  color: #ccc;
  display: flex;
  justify-content: space-between;
}

.child-box {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.minAmount {
  border: 1px #888 solid;
  color: #888;
  opacity: 0.4;
  pointer-events: none;
}

.header-text {
  margin-top: 45px;
  font-size: 1.89em;
}

.order-header {
  position: relative;
  margin-bottom: 36px;
  text-align: center;
}

.steps-box {
  display: flex;
  width: 80%;
  justify-content: end;
}



.order-steps {
  right: 0;
  margin-top: 20px;
  font-size: 16px;
  color: #6b6b6b;
}

.order-steps .current {
  color: #ff6666;
  font-weight: 700;
}

.header-box {
  display: flex;
  justify-content: center;
}

.header-divider {

  margin-top: 18px;
  height: 2px;
  background: #000000;
  width: 60%;
}

.rigth-box {
  display: flex;
  flex-direction: column;

}

p {
  margin: 5px;
}

.menu-box {
  min-height: 400px;
  max-height: 400px;
  padding: 10px;
  overflow-y: scroll;
  padding-right: 20px;
}

.menu-box::-webkit-scrollbar {
  width: 10px;
}

.menu-box::-webkit-scrollbar-track {
  background: #ffeeee;
  border-radius: 10px;
}

.menu-box::-webkit-scrollbar-thumb {
  background: #ffb7b7;
  border-radius: 10px;
}

.menu-box::-webkit-scrollbar-button {
  display: none;
}

.menus-title {
  width: 60%;
  font-size: 1.4em;
  font-weight: 400;
  letter-spacing: 2px;
}

.menus-big-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menus-box {
  width: 60%;
  display: flex;
  justify-content: flex-start;

}

.menus-small-box {
  display: flex;
}

.hide {
  display: none;
}

.buttom {
  margin-bottom: 200px;
}

.menus-title-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.min {
  width: 20%;
}

.star {
  padding: 0px 3px 0px 0px;
  font-family: "BMJUA";
  font-size: 1.8em;
  color: #FAC729;
}

.hart {
  font-family: "YFavorite";
  font-size: 1.45em;
  color: red;
}

.like-count {
  font-size: 1.2em;
  margin-left: 5px;
}

.option-name {
  width: 150px;
  height: auto;
}
</style>