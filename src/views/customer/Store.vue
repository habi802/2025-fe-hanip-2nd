<script setup>
import { onMounted,onBeforeUnmount, reactive, ref, computed,watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getMenus } from "@/services/menuService";
import { getReviewsByStoreId, getOwnerCommentList } from "@/services/reviewServices";
import { getFavorite, addFavorite, deleteFavorite } from "@/services/favoriteService";
import { useAccountStore } from "@/stores/account";
import Menu from "@/components/customer/Menu.vue";
import Review from "@/components/customer/Review.vue";
import AlertResolveModal from "@/components/modal/AlertResolveModal.vue";
import NoneStore from '/src/imgs/foods.png';
import { getStoreId } from "@/services/storeService";

//모달
const alertResolveModal = ref(null);

const route = useRoute();
const router = useRouter();
const account = useAccountStore();

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
  reviewLeng: [],
  // 사장 코멘트 갯수
  ownerCommentNum: 0,
  myFavorite: 0  
});

onMounted(() => {
  const storeId = route.params.id;
  currentPage.value = 1;     
  noMoreReviews.value = false;
  getStoreInfo(storeId);
  getStoreMenu(storeId);
  loadFavorite(storeId)
  loadReviews(storeId, true);
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});


// 지도를 보여주는 함수
let lat = 37.5665;
let lon = 126.9780;
const showMap = address => {
  const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(lat, lon),
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
      lat = result.x;
      lon = result.y;

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
    return;
  }
  const res = await getFavorite(id);
  if (res.data.resultStatus == 200) {
    console.log("찜 조회 성공", res.data.resultData)
    state.myFavorite = res.data.resultData.on;
  }
  if (res === undefined || res.data.resultStatus !== 200) {
    return;
  }
  state.store.favorite = res.data.resultData !== null ? true : false;
};

//인피니티용
const currentPage = ref(1);
const reviewsPerPage = ref(3);
const isLoading = ref(false);
const noMoreReviews = ref(false);

// 가게 리뷰 조회 함수
const loadReviews = async (id, isInitial = false) => {
  isLoading.value = true;

  //전체 리뷰 조회용!
  const revieLeng = await getReviewsByStoreId(id, {
    rowPerPage: 1000,
    page: 1,
  });

  state.store.revieLeng = revieLeng.data.resultData.length
  const res = await getReviewsByStoreId(id, {
    rowPerPage: reviewsPerPage.value,
    page: currentPage.value,
  });
  if (res.status === 200) {
    const newReviews = res.data.resultData;

    if (newReviews.length === 0) {
      noMoreReviews.value = true;
    } else {
      if (isInitial) {
        state.reviews = newReviews;
      } else {
        state.reviews.push(...newReviews);
      }
      currentPage.value += 1;
    }
  
  // 리뷰 총점 구하기
  let ratingNumCal = 0;
  for (let i = 0; i < state.reviews.length; i++) {
    ratingNumCal += state.reviews[i].rating;
  }
  
  const count = (ratingNumCal / state.reviews.length).toFixed(1)
  state.reviewNum = count
  
  let commentNum = "";
  let comLeng = 0;
  
  for (let i = 0; i < state.reviews.length; i++) {
    commentNum = state.reviews[i].ownerComment
    if (typeof commentNum === "string" && commentNum !== null && commentNum !== "") {
      comLeng += 1;
    }
    state.ownerCommentNum = comLeng;
  };
}
 isLoading.value = false;
};


//스크롤 감지
  const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

if (scrollTop + windowHeight >= fullHeight - 400 && !isLoading.value && !noMoreReviews.value) { 
  loadReviews(route.params.id, false);
}
};


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


const baseUrl = ref(import.meta.env.VITE_BASE_URL);

const banerImgSrc = computed(() => {
  return store.storeInfo && store.storeInfo?.bannerPath && store.storeInfo?.bannerPath !== 'null'
    ? `${baseUrl.value}/images/store/${store.storeInfo.id}/${store.storeInfo?.bannerPath}`
    : NoneStore;
})

// 위로 가기
const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};




const store = reactive({
  storeInfo: Object,
  menus: [],
  menuOption: [],
  reveiw: [],
  openTime: null,
  closeTime: null,
  ownerComment: [],
  todayReviewCount: 0,
  myFavorite: 0
})

// 가게 정보 조회
const getStoreInfo = async (id) => {

  const res = await getStoreId(id);
  store.storeInfo = res.data.resultData;

  if (store.storeInfo === null || store.storeInfo === undefined) {
    setTimeout(async () => {
  const alret = await alertResolveModal.value.showModal("잘못된 접근입니다.");
      if (alret) {
        router.push("/")
      }
    }, 150);

  }
  const addressTest = `${store.storeInfo.address} ${store.storeInfo.addressDetail}`;

  showMap(addressTest);

  const openTime = store.storeInfo.openTime;
  const slideOpenTime = openTime.substring(0, 5);
  store.openTime = slideOpenTime;

  const closeTime = store.storeInfo.closeTime;
  const slideCloseTime = closeTime.substring(0, 5);
  store.closeTime = slideCloseTime

  const ownerCommentList = await getOwnerCommentList(id);
  store.ownerComment = ownerCommentList.data.resultData;

  const today = new Date();
  const todayString = today.toLocaleDateString("sv-SE");

  // 오늘 작성한 리뷰 개수 계산
  const todayReviewCount = state.reviews.filter(r => {
    const reviewDate = r.createdAt.split(' ')[0];
    return reviewDate === todayString;
  }).length;
  store.todayReviewCount = todayReviewCount;
}


// 찜 추가, 삭제 토글
const toggleFavorite = async (id) => {

  if (state.myFavorite === 0) {
    await addFavorite({ storeId: id });
    state.myFavorite === 1;
    loadFavorite(id);
    store.storeInfo.favorites += 1
  }

  if (state.myFavorite === 1) {
    await deleteFavorite(id)
    state.myFavorite === 0;
    loadFavorite(id);
    store.storeInfo.favorites -= 1
  }

}

// 가게 메뉴 조회
const getStoreMenu = async (storeId) => {
  const res = await getMenus(storeId);
  store.menus = res.data.resultData;
  console.log("메뉴 정보", store.menus);

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

//이게 가게에서 해줘야하는게 맞을지...
const sortedMenus = computed(() => {
  //메뉴 타입 순서대로 정렬
  const order = ["단품", "세트", "사이드", "음료수"];
  const sorted = store.menus.slice().sort((a, b) => {
    return order.indexOf(a.menuType) - order.indexOf(b.menuType);
  });

  // 전체 하이드인 메뉴 없애기
  const filtered = sorted
    .map(group => {
      return {
        menuType: group.menuType,
        menus: group.menus.filter(menu => menu.isHide === 1),
      };
    })
    .filter(group => group.menus.length > 0);

  return filtered;
});
// 꼭 하단에 위치.

watch(sortedMenus, (newVal) => {
  if (newVal.length === 0) {
        setTimeout(async () => {
  const alret = await alertResolveModal.value.showModal("판매하는 메뉴가 없습니다.");
      if (alret) {
        router.push("/")
      }
    }, 150);
  }
});



</script>

<template>
  <div class="storeImg">
    <img class="big-img" :src="banerImgSrc" @error="e => e.target.src = NoneStore" />
  </div>
  <div class="container">
    <div class="store-title-box">
      <div class="store-name">
        {{ store.storeInfo.name }}
      </div>
      <div class="title-box">
        <div class="title-info">
          <span>
            <div class="star">★</div>
          </span>
          <span class="star-num">
            {{ store.storeInfo.rating }}
          </span>
          <!-- 이거 수정 -->
          <span class="text-color review-length star-num">( {{ state.store.revieLeng }} )</span>
          <span>
            <div class="favorite" @click="toggleFavorite(store.storeInfo.id)">{{ state.myFavorite === 1 ? "♥" : "♡"
            }}</div>
          </span>
          <span class="favorite-num">
            {{ store.storeInfo.favorites ? store.storeInfo.favorites + 0 : store.storeInfo.favorites + 0 }}
          </span>
        </div>
      </div>
      <!-- new title bottom -->
      <div class="title-bottom-box">
        <!-- 가게 맵이 뜨는 왼쪽 박스 -->
        <div class="one-info-map">
          <div id="map" class="map-box"></div>
          <span class="address-text">{{ store.storeInfo.address }} {{ store.storeInfo.addressDetail }}</span>
        </div>
        <div class="two-info-store">
          <!-- 중간의 가게 정보에 대한 박스 -->
          <div class="store-info">
            <div class="name">
              <div class="text-color">상호명</div>
              <div>{{ store.storeInfo.name }}</div>
            </div>
            <!-- 하드코딩 -->
            <div class="open-time">
              <div class="text-color">운영시간</div>
              <div>{{ store.openTime }} ~ {{ store.closeTime }}</div>
            </div>
            <div class="close-day">
              <div class="text-color">휴무일</div>
              <div>매주 {{ store.storeInfo.closedDay }}</div>
            </div>
            <div class="phone">
              <div class="text-color">전화번호</div>
              <div>{{ store.storeInfo.businessNumber }}</div>
            </div>
            <div class="min-amount">
              <div class="text-color">최소 주문 금액</div>
              <div>{{ (store.storeInfo.minAmount ?? 0).toLocaleString() }}원 이상</div>
            </div>
            <!-- 가게 소개 -->
            <div class="comment-title">
              <div class="text-color">가게 소개</div>
              <hr>
              </hr>
              <div class="comment">
                {{ store.storeInfo.comment }}
              </div>
            </div>
            <div class="delivery-fee">
              <div class="fee-text text-color">배달료</div>
              <hr>
              </hr>
              <div class="amount">
                <div class="text-color">
                  기본
                </div>
                <div>
                  {{ (store.storeInfo.minDeliveryFee ?? 0).toLocaleString() }}원 이상
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 오른쪽 가게 정보 디테일 박스 -->
        <div class="three-info-detail">
          <div class="store-info-detail">
            <div class="statistics">
              <div class="text-color">
                가계 통계
              </div>
              <hr>
              </hr>
              <div class="statistics-info">
                <div> 전체 리뷰 수 {{ state.store.revieLeng }}</div>
                <div>찜 {{ store.storeInfo.favorites }}
                </div>
              </div>
              <div class="event">
                <div class="text-color">이벤트 알림</div>
                <hr>
                </hr>
                <div class="event-text" style="white-space: pre-line;">
                  {{ store.storeInfo.eventComment }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 상단 컨테이너용 -->
    <div class="top">
      <div class="row">
        <div class="button">
          <!-- 메뉴 보기 버튼  -->
          <div :style="{ color: menubtn ? '#ff6666' : '#CCCCCC' }" class="menu-title rounded pt-2 ps-3">
            <h3 @click="menubutton" class="mb-1">메뉴보기</h3>
          </div>
          <!-- 리뷰보기 버튼 -->
          <div :style="{ color: reviewbtn ? '#ff6666' : '#CCCCCC' }" class="review-title pt-2 ps-3">
            <h3 @click="reviewbutton" class="mb-1">리뷰보기</h3>
          </div>
        </div>
        <!-- 중앙 정렬용 div -->
        <div class="bigBox">
          <div class="detailBox">
            <div v-if="menubtn" class="pt-2 mb-3">
              <div v-for="item in sortedMenus" :key="item.id">
                <div class="menu-division">
                  <div class="division-text">{{ item.menuType }}</div>
                </div>
                <div v-for="menus in item.menus" :key="menus.id">
                  <Menu :key="item.menuId" :item="menus"></Menu>
                </div>
              </div>
            </div>
            <!-- 리뷰보기 리스트 -->
            <div>
              <div v-if="reviewbtn" class="pt-2 mb-3">
                <!-- 총 가게 평점 -->
                <div class="review-point">
                  <div class="review-box">
                    <div class="review-data">
                      <div>
                        <!-- <div class="review-text">가게 전체 평점</div> -->
                        <span class="star" v-for="n in Math.floor(store.storeInfo.rating || 0)" :key="n"
                          v-if="store.storeInfo.rating && store.storeInfo.rating > 0">
                          <span class="review-star">★</span>
                        </span>
                        <span class= v-else>
                          <span class="no-star">★★★★★</span>
                        </span>
                        <div class="review-num ">{{ isNaN(store.storeInfo.rating) ? 0 : store.storeInfo.rating }}</div>
                      </div>
                      <!-- 오른쪽 텍스트 -->
                      <div class="left-box">
                        <div>
                          <span>
                            총 리뷰 수
                          </span>
                          <span class="count-num"> {{ state.reviews.length }}개</span>
                        </div>
                        <!-- 하드코딩 -->
                        <div>
                          <span>오늘 새로 달린 리뷰</span>
                          <span class="count-num">{{ store.todayReviewCount }}개 </span>
                        </div>
                        <div>
                          <span>사장님 댓글</span>
                          <span class="count-num"> {{ store.ownerComment.length }}개</span>
                        </div>
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
                <div v-else class="d-flex mt-5 justify-content-center align-items-center w-100"
                  style="font-size: 40px; flex-direction: column;"> 등록된 리뷰가 없습니다.
                  <img src="/src/imgs/owner/owner-service5.png" alt="리뷰없엉">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />


  <!--  공용 모달창 -->
  <alertResolveModal ref="alertResolveModal"></alertResolveModal>

</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'YFavorite';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/YOnepickTTF-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Binggre';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Binggrae.woff') format('woff');
  font-weight: normal;
  font-display: swap;
}

.arrow {
  position: sticky;
  width: 2.8%;
  bottom: 100px;
  left: 93%;
  z-index: 999;
  margin-bottom: 100px;

  &:hover {
    opacity: 80%;
  }
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

.top {
  font-family: "BMJUA";
  font-size: 18px;
  margin-top: 50px;
}

.container {
  margin-top: 70px;
  width: 78%;
}


.favorite {
  font-family: 'YFavorite';
  font-size: 1.25em;
  color: red;
  width: 20px;
  margin-bottom: 2px;
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
  border-bottom: 2px solid #797979;
  width: 1460px;
  gap: 56px;
  font-size: 30px;
}

.mb-1 {
  font-family: 'Pretendard-Regular';
  font-weight: 600;
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
  margin-top: 20px;
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



.delete-order {
  text-align: end;
  width: 100%;
}

.review-box {
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #FF6666;
}

.star {
  font-family: "BMJUA";
  font-size: 30px;
  color: #FAC729;
}
.no-star{
    font-family: "BMJUA";
    font-size: 1.5em;
  color: #ccc;
  
}

.left-box {
  font-family: "BMJUA";
  text-align: start;
  font-size: 1em;
  margin-bottom: 10px;
}

.modal {
  font-family: 'Pretendard-Regular';
  font-weight: 800;

}

.modal-title {
  font-family: 'Pretendard-Regular';
  font-weight: 800;
}

.img-one {
  display: flex;
  justify-content: center;
  align-items: center;

  .storeImg {
    width: 270px;
  }
}

.starImg {
  width: 30px;
  padding: 3px;
}

.restar {
  width: 20px;
  margin-bottom: 3px;
}

#order {
  font-family: "BMJUA" !important;
  margin-top: -15px;
}


#orderBtn {
  margin-top: 20px;
  margin-left: -12px;
  font-size: 25px;
  width: 470px;
}


// 새로 만든 css 

.big-img {
  width: 100%;
  height: 330px;
  object-fit: cover;
}

.store-title-box {
  font-family: "BMJUA";
  font-size: 2.1em;
  text-align: center;
  margin-top: -20px;
}

.store-name {
  font-family: "BMJUA";
}

.star {
  font-family: 'Binggre';
  font-size: 1.3em;
  color: #FAC729;
  width: 20px;
}

.star-num {
  font-family: "BMJUA";

}

.favorite-num {
  width: 10px;
  font-family: "BMJUA";

}

.title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5em;
}

.title-info {
  display: flex;
  align-items: center;

  justify-content: space-between;
  width: 150px;
}

.review-length {
  margin-left: -10px;
}

// [title-bottom-box] 제목 하단 정보 박스
.title-bottom-box {
  font-family: 'Pretendard-Regular';
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

// [title-bottom-box] 왼쪽 박스
.one-info-map {
  width: 500px;
  text-align: start;
}

.map-box {
  height: 350px;
  border: #797979 1px solid;
  border-radius: 10px;
}

.address-text {
  font-size: 0.5em;
}

// [title-bottom-box] 중간 박스
.text-color {
  color: #797979;
}

.two-info-store {
  width: 300px;
}

.store-info {
  font-size: 0.5em;
}

.name {
  display: flex;
  justify-content: space-between;
  padding: 3px;
}

.open-time {
  display: flex;
  justify-content: space-between;
  padding: 3px;
}

.close-day {
  display: flex;
  justify-content: space-between;
  padding: 3px;
}

.phone {
  display: flex;
  justify-content: space-between;
  padding: 3px;
}

.min-amount {
  display: flex;
  justify-content: space-between;
  padding: 3px;
}

.comment-title {
  text-align: start;
  margin-top: 20px;
  padding: 3px;
}

hr {
  margin-top: 5px;
}

.comment {
  margin-top: -10px;
  text-align: start;
}

.fee-text {
  text-align: start;
  margin-top: 10px;
}

.amount {
  display: flex;
  justify-content: space-between;
}

// [title-bottom-box] 오른쪽 박스
.store-info-detail {
  width: 300px;
  text-align: start;
}

.statistics {
  font-size: 0.5em;
}

.event {
  margin-top: 55px;
}

// [menu-division] 메뉴 구분 박스
.menu-division {
  border: #FF6666 1px solid;
  border-radius: 10px;
  padding: 10px 20px 10px 20px;
  margin-top: 20px;
}

.division-text {
  font-family: "BMJUA";
  color: #FF6666;
  font-size: 1.2em;
}

.count-num {
  padding: 10px;
  color: #FF6666;
}

.review-star {
  font-family: "BMJUA";
  font-size: 1em;
  color: #FAC729;
}
</style>
