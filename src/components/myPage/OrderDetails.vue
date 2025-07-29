<!-- 주문내역 전체 화면 -->

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import OrderAndReview from './OrderAndReview.vue';
import { getOrder, deleteOrder } from '@/services/orderService'
import { getReviewsByStoreId } from '@/services/reviewServices';
import { useRouter } from 'vue-router';
import { getStore } from '@/services/storeService';
import { useCartStore } from '@/stores/cart';
import { addItem } from '@/services/cartService';

//라우터
const router = useRouter();

// state
const state = reactive({
  orders: [],
})
//
const user = reactive({
  name: "하드 코딩",
  orders: 0,
  cupon: 0,
  point: 0,
});

// onMounted
onMounted(async() => {
  await findorder();
  console.log("dfdf: ", cartStore.state.items )
})

// 주문 목록 조회
const findorder = async () => {
  const res = await getOrder();
  console.log(res.data.resultData);
  state.orders = res.data.resultData;
}

// 리뷰 목록 조회
const findReview = async (storeId) => {
  const res = await getReviewsByStoreId(storeId);
  console.log("review", res.data.resultData);
}

//
let on = ref(true);

const boardBtn = () => {
  on.value = !on.value;
  console.log(on.value);
};

// 리뷰 별점
const selected = ref(0);
const stars = [1, 2, 3, 4, 5];

const selectStar = (index) => {
  selected.value = index + 1;
}

// 주문 삭제
const deleteOrderOne = async (orderId) => {
  try {
    await deleteOrder(orderId);
    state.orders = state.orders.filter(order => order.id !== orderId);
  } catch (e) {
    console.error("삭제 실패", e);
  }
}

// 주문 목록
const filteredOrders = computed(() => state.orders.filter(order => order.isdeleted !== 0));

// 재주문
const cartStore = useCartStore();

const reorder = async (menus) => {
  console.log("menus: ", menus.orderGetList)
  const addMenus = menus.orderGetList.map(menu => ({
    id: menu.menuId,
    name: menu.name,
    price: menu.price,
    quantity: menu.quantity,
    storeId: menu.storeId,
  }));

  const cartItems = cartStore.state.items;
  if (cartItems.length > 0 && cartItems[0].id !== addMenus[0].id) {
    alert("다른 가게의 메뉴가 이미 장바구니에 있습니다. 장바구니를 비워주세요.");
    return;
  }

  cartStore.addMenus(addMenus);

  for(let i = 0; i < menus.orderGetList.length; i++) {
    console.log(menus.orderGetList[i].menuId)
    const res = await addItem (menus.orderGetList[i].menuId);
    console.log(res.data.resultData)
  }
  router.push("/cart");
}
</script>

<template>
  <div class="all-box">
    <div class="box">
      <!-- 상단 페이지 -->
      <!-- <div class="userboard">
        <div class="userLeft">
          <img class="userImg" src="/src/imgs/userImg.png" />
          <div class="user">
            <div>{{ user.name }}님 &nbsp; 반가워요!</div>
            <div class="smalluser">
              <span class="ip">한입</span>
              <span class="rank">등급</span>
            </div>
          </div>
        </div> -->
      <!-- 보더 오른쪽 -->
      <!-- <div class="userright">
          <div class="right">
            <div>총 주문 수</div>
            <div class="num">{{ user.orders }}</div>
          </div>
          <div class="right">
            <div>쿠폰</div>
            <div class="num">{{ user.cupon }}</div>
          </div>
          <div class="right">
            <div>포인트</div>
            <div class="num">{{ user.point }}</div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="board-box">





      <!-- 하단 주문 내역 -->

      <div class="orderList">
        <div>
          <div class="ordertext">주문 내역</div>
          <div class="solid"></div>
        </div>
      </div>
      <div v-for="order in filteredOrders" :key="order.id" style="margin-bottom: 10px;">
        <order-and-review :order="order" @delete-order="deleteOrderOne" @reorder="reorder"/>
      </div>
    </div>

    <!-- 미리보기 용 -->
    <!-- <order-and-review></order-and-review>
    <div :style="{ height: on ? '315px' : '750px' }" class="bigBoard">
      <div class="board">
        <div class="boardLeft">
          <div class="imgBox">
            <img class="img" src="/src/imgs/recStore_1.png" />
          </div>
          <div class="textBox">
            <div>오십계</div>
          </div>
        </div>
        <div class="boardRight">
          <div class="title">주문내역</div>
          <div class="menuBox">
            <div class="menu">
              <div class="name">간장치킨</div>
              <div class="num">1개</div>
              <div class="price">15,000원</div>
            </div>
            <div class="menu">
              <div class="name">메뉴가 아무리 길어도 문제 없다</div>
              <div class="num">1개</div>
              <div class="price">1,150,000원</div>
            </div>
            <div class="menu">
              <div class="name">뿌링클</div>
              <div class="num">1개</div>
              <div class="price">25,000원</div>
            </div>
            <div class="amount">
              <div class="amountText">총 결제 금액</div>
              <div class="amountNum">1,190,000원</div>
            </div>
          </div>
          <div @click="reviewButton" class="btn btn-primary">
            {{ on ? '리뷰 남기기' : '리뷰 저장하기' }}
          </div>
        </div>
        <div class="remove">
          <img class="removeImg" src="/src/imgs/remove.png" />
        </div>
      </div> -->

    <!-- 리뷰 박스 -->
    <!-- <div class="reviewBigBox">
      <div class="reviewBox">
        <div class="reviewimgBox">
          <img class="reviewImg" src="/src/imgs/chicken.png" />
        </div>
        <div class="reviewBoxLeft">
          <div class="nameBox">
            <div class="leftName">서하빈</div>
            <div id="starFill" v-for="(star, index) in stars" :key="index" :class="{ 'filled': index < selected }"
              @click="selectStar(index)">
              ★
            </div>
            <div>
              <input type="file" id="imgOne" class="" accept="image/*" @change="" />
              <div>
              </div>
            </div>
          </div>
          <div class="leftBox">
            <textarea class="inputBox" placeholder="리뷰를 입력해주세요" />
          </div>
        </div>
      </div>

    </div> 
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff');
}

* {
  font-family: 'BMJUA';
}


.all-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  font-family: 'BMJUA';

  // 
  .orderList {

    font-weight: 800;
    text-align: center;

    .ordertext {
      font-size: 25px;
      margin-top: 20px;
    }


    .solid {
      width: 1470px;
      border: 1px #000 solid;
      margin: 50px 0 80px 0;
    }
  }

}

.box {
  display: flex;
  justify-content: center;
  font-family: 'Pretendard-Regular';
  width: 1400px;

  font-size: 1.4em;
  letter-spacing: -1.5px;
  margin-top: 70px;

}

.btn {
  font-family: 'BMJUA';
  font-size: 1em;
  text-align: center;
  background-color: #fff;
  color: #ff6666;
  width: 520px;
  height: 40px;
  outline: none;
  box-shadow: none;
  border: #ff6666 2px solid;
  margin-left: 125px;
  margin-top: 10px;
  border-radius: 8px;

  &:active {
    background-color: #ff6666;
    border: #ff6666 2px solid;
  }
}

.bigBoard {
  width: 1080px;
  height: 315px;
  border: #6c6c6c 3px solid;
  border-radius: 25px;
  margin-top: 40px;
  overflow: clip;

  .board {
    display: flex;
    width: 100%;
    height: 300px;
    justify-content: space-between;
    overflow: clip;

    .boardLeft {
      .imgBox {
        width: 260px;
        height: 170px;
        margin-left: 40px;
        margin-top: 35px;
        border: #6c6c6c 1px solid;
        border-radius: 20px;
        overflow: hidden;

        .img {
          width: 300px;
        }
      }

      .textBox {
        font-family: 'BMJUA';
        font-size: 1.5em;
        margin-left: 40px;
        margin-top: 10px;
      }
    }

    .boardRight {
      width: 720px;
      height: 300px;
      margin-top: 30px;
      font-family: 'BMJUA';
      font-size: 1.3em;
      margin-left: 30px;

      .menu {
        display: flex;
        justify-content: space-between;
        font-family: 'BMJUA';
        margin-top: 10px;

        .name {
          width: 250px;
          text-align: left;
        }

        .num {
          width: 100px;
          margin-left: 125px;
          text-align: right;
        }

        .price {
          width: 120px;
          margin-right: 50px;
          text-align: right;
        }
      }

      .amount {
        display: flex;
        justify-content: right;
        text-align: right;
        letter-spacing: 2px;
        margin-right: 48px;
        margin-top: 10px;

        .amountText {
          margin-right: 10px;
        }
      }
    }
  }

  .removeImg {
    width: 20px;
    margin-right: 35px;
    margin-top: 20px;
    cursor: pointer;
  }

  .reviewBigBox {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 400px;
    margin-top: 20px;

    .reviewBox {
      display: flex;
      width: 90%;
      height: 330px;
      margin-top: 20px;
      background-color: #fff;
      border: #6C6C6C 3px solid;
      border-radius: 30px;
    }

    .reviewimgBox {
      width: 270px;
      height: 270px;
      overflow: hidden;
      border-radius: 20px;
      margin-top: 25px;
      margin-left: 30px;

    }

    .reviewBoxLeft {
      font-family: 'BMJUA';
      font-size: 1.3em;
      margin-left: 30px;
      margin-top: 45px;

      .nameBox {
        display: flex;

        .leftName {
          margin-left: 10px;
          margin-right: 10px;
          letter-spacing: 1px;
        }
      }

      .leftBox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 500px;
        height: 200px;
        border-radius: 30px;
        border: #6C6C6C 3px solid;
        overflow: hidden;

      }

      .inputBox {
        font-family: 'Pretendard-Regular';
        width: 400px;
        height: 150px;
        border: none;
        resize: none;

        &:focus {
          border: none;
          outline: none;
        }
      }
    }
  }
}

#starFill {
  color: darkgray;
  margin-left: 2px;
  cursor: pointer;
}

.stars {
  font-size: 30px;
}

.filled {
  color: yellow !important;
}

#imgOne {
  font-family: 'Pretendard-Regular';
  font-size: 0.6em;
  margin-left: 10px;
  margin-bottom: 10px;
}

.board-box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 1500px;
}


// 상단 유저 보더


.userboard {
  display: flex;
  align-items: center;
  //
  justify-content: space-around;
  width: 1120px;
  height: 228px;
  border-radius: 25px;
  border: #000 solid 1px;

  .userLeft {
    display: flex;
    align-items: center;
    font-size: 15px;
    margin-left: 30px;

    .userImg {
      width: 20%;
      height: 20%;
      margin-left: 60px;
    }

    .user {
      font-family: "BMJUA";
      font-size: 1.5em;
      letter-spacing: 1px;
      margin-left: 32px;
      margin-top: 14px;

      .smalluser {
        font-size: 0.7em;
        letter-spacing: 1px;

        .ip {
          margin-left: 5px;
          color: #ff6666;
        }

        .rank {
          margin-left: 5px;
        }
      }
    }
  }

  .userright {
    display: flex;
    gap: 150px;
    margin-left: 150px;
  }

  .right {
    text-align: center;
    font-family: "BMJUA";
    font-size: 20px;
    margin-top: 20px;
    margin-left: -170px;
    width: 250px;

    .num {
      margin-top: 10px;
      font-size: 1.3em;
    }
  }
}
</style>