<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getStore, getStoreList } from "@/services/storeService";
import { getOneMenu } from "@/services/menuService";
import { getReviewsByStoreId } from "@/services/reviewServices";
import { getFavorite, addFavorite, deleteFavorite } from "@/services/favoriteService";
import { updateQuantity, removeItem, removeCart } from "@/services/cartService";
import { useAccountStore } from "@/stores/account";
import { useCartStore } from "@/stores/cart";
import Menu from "@/components/Menu.vue";
import Review from "@/components/Review.vue";
import { useFavoriteStore } from "@/stores/favoriteStore";
import defaultImage from '@/imgs/owner/owner-service3.png';

// 하트 이미지
import lovet from '@/imgs/loveFull.png';
import lovef from '@/imgs/loveBoard.png'


const favoriteStore = useFavoriteStore();

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
  // 가게 전체 정보
  storeInfo: [],
  // 리뷰 총점
  reviewNum: 0,
  // 사장 코멘트 갯수
  ownerCommentNum: 0,
});


// 장바구니 총 금액 표시하기 위한 변수
const totalPrice = ref(0);

// 가게 상세 조회하는 함수
const loadStore = async (id) => {
  const res = await getStore(id);

  // 가게 상세 조회 실패 시(API에 알 수 없는 오류가 발생하거나 가게 테이블에 없는 데이터를 조회하려고 할 경우) 홈으로 돌아감
  // 주소창에 입력해서 강제로 들어가는 것을 방지하기 위함
  if (res === undefined || res.data.resultStatus !== 200) {
    const modal = new bootstrap.Modal(document.getElementById("storeF"));
    modal.show();
    router.push({ path: "/" });
    return;
  }

  state.store = res.data.resultData;
  console.log("state", state.store);
  
  showMap(state.store.address);

  //
  const storeInfo = await getStoreList({ searchText: state.store.name });

  // console.log("storeInfo", storeInfo);

  state.storeInfo = storeInfo.data.resultData;
  // console.log("storeInfo :", state.storeInfo[0]);
  // console.log("storeId:", state.store.id);

  // 조회 성공 시 가게 찜 추가 여부 조회 함수 호출
  loadFavorite(id);
};

// 지도를 보여주는 함수
const showMap = address => {
  const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5665, 126.9780),
    zoom: 15,
  });

  naver.maps.Service.geocode(
    { query: address },
    function (status, response) {
      if (status !== naver.maps.Service.Status.OK) {
        console.log('address: 주소를 찾을 수 없습니다.');
      }
      
      const result = response.v2.addresses[0];
      if (result.total === 0) {
        console.log('address: 검색 결과가 없습니다.');
      }

      const point = new naver.maps.LatLng(result.y, result.x);

      map.setCenter(point);

      new naver.maps.Marker({
        map: map,
        position: point
      });
    }
  );
};

// 고객 유저가 가게를 찜 목록에 추가했는지 조회하는 함수
const loadFavorite = async (id) => {
  if (!account.state.loggedIn) {
    state.store.favorite = true;
    loadMenus(id);
    return;
  }
  const res = await getFavorite(id);

  if (res === undefined || res.data.resultStatus !== 200) {
    const modal = new bootstrap.Modal(document.getElementById("storeF"));
    modal.show();
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
    const modal = new bootstrap.Modal(document.getElementById("storeF"));
    modal.show();
    return;
  } else if (res.data.resultStatus !== 200) {
    // alert(res.data.resultMessage);
    const modal = new bootstrap.Modal(document.getElementById("storeF"));
    modal.show();
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
    const modal = new bootstrap.Modal(document.getElementById("storeF"));
    modal.show();
    return;
  }

  state.reviews = res.data.resultData;
  // 리뷰 총점 구하기
  let ratingNumCal = 0;
  // console.log("state.reviews: ", state.reviews);
  for (let i = 0; i < state.reviews.length; i++) {
    ratingNumCal += state.reviews[i].rating;
  }
  const count = (ratingNumCal / state.reviews.length).toFixed(1)
  // console.log("ratingNumCal", ratingNumCal);

  state.reviewNum = count
  // 사장 코멘트 갯수
  // console.log("owner", state.reviews[0].ownerComment);
  let commentNum = "";
  let comLeng = 0;
  for (let i = 0; i < state.reviews.length; i++) {

    commentNum = state.reviews[i].ownerComment
    // console.log("commentNum", commentNum)
    // console.log("comLeng", comLeng)
    if (typeof commentNum === "string" && commentNum !== null && commentNum !== "") {
      comLeng += 1;

    }
    state.ownerCommentNum = comLeng;
  }
  // console.log("comLeng: ", comLeng);

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
  if (account.state.loggedIn) {
    const storeId = Number(id);

    console.log('[찜 토글 시도]', storeId);

    const res = state.store.favorite
      ? await deleteFavorite(storeId)
      : await addFavorite({ storeId });

    if (res === undefined || res.data.resultStatus !== 200) {
      // alert("찜 상태 변경 실패");
      const modal = new bootstrap.Modal(document.getElementById("faiF"));
      modal.show();
      return;
    }

    state.store.favorite = !state.store.favorite;

    // Pinia store에도 업데이트
    favoriteStore.toggleFavorite(storeId);
    console.log('찜 상태 저장됨:', favoriteStore.state.storeIds);
  }
  loadReviews(id);
  loadStore(id);
};

// 장바구니 추가 함수(Menu.vue 컴포넌트에서 받아옴)
const addCart = (newItem) => {
  const existIdx = state.carts.findIndex(item => item.menuId === newItem.menuId);

  if (existIdx !== -1) {
    increaseQuantity(existIdx);
  } else {
    newItem.quantity = 1;
    state.carts.push(newItem);
    calculateTotal();
  }
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
      const modal = new bootstrap.Modal(document.getElementById("putF"));
      modal.show();
      return;
    } else if (res.data.resultStatus !== 200) {
      // alert(res.data.resultMessage);
      const modal = new bootstrap.Modal(document.getElementById("putF"));
      modal.show();
      return;
    }

    state.carts[idx].quantity--;
    calculateTotal();
  } else if (state.carts[idx].quantity == 1) {
    deleteItem(state.carts[idx].id);
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
    const modal = new bootstrap.Modal(document.getElementById("putF"));
    modal.show();
    return;
  } else if (res.data.resultStatus !== 200) {
    // alert(res.data.resultMessage);
    const modal = new bootstrap.Modal(document.getElementById("putF"));
    modal.show();
    return;
  }

  state.carts[idx].quantity++;
  calculateTotal();
};

// 장바구니 삭제 함수
const deleteItem = async (cartId) => {
  const res = await removeItem(cartId);

  if (res === undefined || res.data.resultStatus !== 200) {
    const modal = new bootstrap.Modal(document.getElementById("delF"));
    modal.show();
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

// 장바구니 전체 삭제 함수
const deleteCart = async () => {
  if (state.carts.length > 0) {
    const res = await removeCart();

    if (res === undefined) {
      const modal = new bootstrap.Modal(document.getElementById("delF"));
      modal.show();
      return;
    } else if (res.data.resultStatus === 401) {
      // alert(res.data.resultMessage);
      const modal = new bootstrap.Modal(document.getElementById("delF"));
      modal.show();
      return;
    }

    state.carts = [];
    calculateTotal();
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
    const modal = new bootstrap.Modal(document.getElementById("loginF"));
    modal.show();
    return;
  } else if (state.carts.length < 1) {
    const modal = new bootstrap.Modal(document.getElementById("orderF"));
    modal.show();
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



// 가게 이미지가 없을 시 대체 이미지 나타내기
// const imgSrc = computed(() => {
//   return props.stores && props.stores.imagePath && props.stores.imagePath !== 'null'
//   ? `/pic/store-profile/${props.stores.storeId}/${props.stores.imagePath}`
//   : defaultImage;
// })

// 가게 이미지
// const storeImg = `/pic/store-profile/${state.store.id}/${state.storeInfo[0]?.imagePath}`;/

const imgSrc = computed(() => {

  return state.store && state.store?.imagePath && state.store?.imagePath !== 'null'
    ? `/pic/store-profile/${state.store.id}/${state.store?.imagePath}`
    : defaultImage;

})

// 더보기
const visibleCount = ref(3);
const visibleReview = computed(() => {
  return state.reviews
    .slice(0, visibleCount.value);
});
const loadMore = () => {
  visibleCount.value += 5;
};

// 위로 가기
const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="container">
    <!-- 상단 컨테이너용 -->
    <div class="top">
      <div class="row">
        <div id="store" class="col-12 col-md-8 p-3">
          <div id="store-box" class="row border rounded-4 p-3 mb-3">
            <div class="col-6 col-md-4 mb-4">
              <div class="store-image border rounded h-100">
                <div class="img-one">
                  <!-- <img class="sImg" :src="imgSrc" @error="e => e.target.src = defaultImage" /> -->
                  <img class="storeImg" :src="imgSrc" @error="e => e.target.src = defaultImage" />
                </div>
              </div>
            </div>
            <div class="col-6 col-md-4 mb-4">
              <h3>{{ state.store.name }}</h3>
              <p>최소 주문 금액 15,000원</p>
              <p>배달료 0원 ~ 3,000원</p>
              <span><img class="restar" src="/src/imgs/starBoard.png"/> {{ state.reviewNum !== 'NaN' ? state.reviewNum : 0 }}({{ state.reviews.length }})
                <img class="favorite" @click="toggleFavorite(state.store.id)" :src="state.store.favorite ? lovet : lovef"/>
                {{ state.storeInfo[0]?.favorites }}</span>
            </div>
            <div class="col-12 col-md-4 pt-4">
              <div id="map" class="border rounded mb-2"></div>
              <span class="addressText">{{ state.store.address }}</span>
            </div>
          </div>

          <!-- 주문표 부분 -->
          <div id="order" class="col-12 col-md-4 d-flex flex-column p-3">
            <div class="row border rounded p-4 mb-2">
              <div class="order-title">장바구니</div>
              <div class="store-name">{{ state.store.name }}</div>
              <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                <div class="delete-order">
                  <img class="removeImg" src="/src/imgs/remove.png" @click="deleteCart()" />
                </div>
              </div>
              <div v-if="state.carts.length > 0">
                <div v-for="(item, idx) in state.carts" :key="item.id">
                  <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                    <div class="d-flex justify-content-between mb-2">
                      <span>{{ item.name }}</span>
                      <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <div>
                        <button type="button" class="btn btn-basic btn-quantity" @click="decreaseQuantity(idx)">
                          -
                        </button>
                        <span class="p-3">{{ item.quantity }}</span>
                        <button type="button" class="btn btn-basic btn-quantity" @click="increaseQuantity(idx)">
                          +
                        </button>
                      </div>
                      <div>
                        <button type="button" class="btn btn-basic btn-submit" @click="deleteItem(item.id)">
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
            <button id="orderBtn" type="button" @click="toOrder()" class="btn btn-basic btn-submit">
              주문하기
            </button>
          </div>
        </div>

        <div class="button">
          <!-- 메뉴 보기 버튼  -->
          <div :style="{ color: menubtn ? '#ff6666' : '#000' }" class="menu-title rounded pt-2 ps-3">
            <h3 @click="menubutton" class="mb-1">메뉴보기</h3>
          </div>

          <!-- 리뷰보기 버튼 -->
          <div :style="{ color: reviewbtn ? '#ff6666' : '#000' }" class="review-title pt-2 ps-3">
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
                        <span class="star" v-for="n in Math.floor(state.reviewNum || 0)" :key="n"
                        v-if="state.reviewNum && state.reviewNum > 0">
                        <img class="starImg" src="/src/imgs/starBoard.png"/>
                        </span>
                        <div class="review-num">{{ isNaN(state.reviewNum) ? 0 : state.reviewNum }}</div>
                      </div>
                      <!-- 오른쪽 텍스트 -->
                      <div class="left-box">
                        <div>총 리뷰 수 {{ state.reviews.length }}개</div>
                        <div>사장님 댓글 {{ state.ownerCommentNum }}개</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 리뷰 리스트 조회 -->
                <div v-if="state.reviews.length > 0">
                  <div v-for="item in visibleReview" :key="item.id">
                    <Review :item="item" />
                  </div>
                </div>
                <div 
                v-else
                class="d-flex mt-5 justify-content-center align-items-center w-100" 
                style="font-size: 40px; flex-direction: column;"
                > 등록된 리뷰가 없습니다.
                <img src="/src/imgs/owner/owner-service5.png" alt="리뷰없엉">
              </div>
                <div class="d-flex justify-content-center">
                  <button v-if="visibleReview.length > 0 && visibleCount < state.reviews.length"
                    @click="loadMore"
                    class="btn btn-secondary btn-review">
                    더보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
  
  <!-- 메뉴 없이 주문하면.. -->
  <div class="modal fade" id="orderF" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">경고</h5>
        </div>
        <div class="modal-body">메뉴를 추가해주세요</div>
        <div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>


  <!-- 로그인이 안 되어 있으면.. -->
  <div class="modal fade" id="loginF" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">경고</h5>
        </div>
        <div class="modal-body">로그인이 필요합니다</div>
        <div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>
  <!-- 조회 실패 -->
  <div class="modal fade" id="storeF" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">경고</h5>
        </div>
        <div class="modal-body">조회에 실패하였습니다</div>
        <div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>
  <!--  수정 실패 -->
  <div class="modal fade" id="putF" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">경고</h5>
        </div>
        <div class="modal-body">수정에 실패하였습니다</div>
        <div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>
  <!-- 삭제 실패 -->
  <div class="modal fade" id="delF" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">경고</h5>
        </div>
        <div class="modal-body">삭제에 실패하였습니다</div>
        <div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
				</div>
			</div>
		</div>
	</div>
    <!-- 찜 실패 -->
    <div class="modal fade" id="faiF" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">경고</h5>
				</div>
				<div class="modal-body">찜 하기에 실패하였습니다</div>
				<div class="modal-footer">
          <a class="btn" id="modalY" href="#" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>

  <!--  -->
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

.arrow {
  position: sticky;
  width: 3.8%;
  bottom: 100px;
  left: 93%;
  z-index: 999;
  margin-bottom: 70px;
}

// 버튼
.btn-review {
  width: 250px;
  font-size: 30px;
  height: 50px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  background: #f66463;
}
.btn-review:hover {
  background: #d44b4a;
}
.btn-review:active {
  background: #b23837;
}

.top{
  font-family: "BMJUA";
}

.container {
  margin-top: 70px;
}

#map {
  height: 180px;
}

.favorite {
width: 20px;
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

.removeImg {
  width: 20px;
  cursor: pointer;
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
  height: 303px;
}

.store-image {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px !important;
  width: 246px;
  height: 183px !important;
  overflow: hidden;
  background-color: #f5f5f5;
  margin-top: 20px;
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
  font-weight: 500;
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

.review-data {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 10px;


}

.review-num {
  font-family: "BMJUA";
  font-size: 50px;
  margin-top: -10px;
}

.star {
  font-family: "BMJUA";
  font-size: 30px;
  color: #FAC729;
  
}

.left-box {
  font-family: "BMJUA";
  text-align: start;
  font-size: 19px;
  margin-bottom: 10px;
}

.modal {
  top: 7%;
}

.img-one {
  display: flex;
  justify-content: center;
  align-items: center;

  .storeImg {
    width: 270px;
  }
}
.starImg{
  width: 30px;
  padding: 3px;
}
.restar{
  width: 20px;
}
#order{
  font-family: "BMJUA" !important;
  margin-top: -15px;
}
.addressText{
  text-align: center;
  margin-left: 25px;
}
#orderBtn{
  margin-top: 20px;
  margin-left: -12px;
  font-size: 25px;
  width: 470px;
}
</style>
