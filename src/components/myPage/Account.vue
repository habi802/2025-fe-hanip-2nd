<script setup>
import { ref, onMounted, nextTick } from 'vue';
// myPage 컴포넌트 임포트
import OrderDetails from './OrderDetails.vue';
import Information from './Information.vue';
import Payment from './Payment.vue';
import Favorites from './Favorites.vue';
import AccountMain from './AccountMain.vue';
import router from '@/router';

// 컴포넌트 v-if 처리
let main = ref(true);
let OrderDetail = ref(false);
let inf = ref(false);
// let pay = ref(false);
let favor = ref(false);


// 주문내역, 마이페이지 라우터 확인
onMounted(() => {
  nextTick(() => {
    const text = router.currentRoute.value.query.section;
    if (text === 'order') {
      orderClick();
    } else {
      mainClick();
    }
  });
});
//

const mainClick = () => {
  OrderDetail.value = false;
  inf.value = false;
  // pay.value = false;
  favor.value = false;

  main.value = true;
};

const orderClick = () => {
  OrderDetail.value = true;
  inf.value = false;
  // pay.value = false;
  favor.value = false;

  main.value = false;
};

const infClick = () => {
  OrderDetail.value = false;
  inf.value = true;
  // pay.value = false;
  favor.value = false;

  main.value = false;
};
const payClick = () => {
  OrderDetail.value = false;
  inf.value = false;
  // pay.value = true;
  favor.value = false;

  main.value = false;
};

const favorClick = () => {
  OrderDetail.value = false;
  inf.value = false;
  // pay.value = false;
  favor.value = true;

  main.value = false;
};



//
const myAccount = ['주문내역', '정보수정', '즐겨찾기', '고객센터'];
</script>

<template>
  <div class="accountBox">
    <div class="accountBoard">
      <div class="mainText" @click="mainClick">마이페이지</div>
      <div>
        <div class="smallText" @click="orderClick">{{ myAccount[0] }}</div>
        <div class="smallText" @click="infClick">{{ myAccount[1] }}</div>
        <!-- <div class="smallText" @click="payClick">{{ myAccount[2] }}</div> -->
        <div class="smallText" @click="favorClick">{{ myAccount[2] }}</div>
        <div class="smallText">{{ myAccount[3] }}</div>
      </div>
    </div>
    <div class="components">
      <div v-if="OrderDetail">
        <order-details></order-details>
      </div>
      <div v-if="inf">
        <Information></Information>
      </div>
      <!-- <div v-if="pay">
        <Payment></Payment>
      </div> -->
      <div v-if="favor">
        <Favorites></Favorites>
      </div>
      <!-- <div v-if="ct">
        <customerCt></customerCt>
      </div> -->
      <div v-if="main">
        <AccountMain></AccountMain>
      </div>
    </div>
  </div>
  <footer></footer>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

.accountBox {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -40px;

  .mainText {
    font-size: 1.4em;
    font-weight: 800;
    margin-bottom: 50px;
    letter-spacing: -1.5px;
  }

  .smallText {
    font-family: 'Pretendard-Regular';
    font-size: 1em;
    margin-top: 10px;
    font-weight: 400;
  }
}

.components {
  margin-top: 100px;
  margin-left: 180px;
}

footer {
  margin-bottom: 200px;
}

@media (max-width: 1440px) {
  .accountBox {
    width: 90%;
    justify-content: center;

    .accountBoard {
      display: none;
    }

    .components {
      margin-top: 100px;
      margin-left: auto;
    }
  }
}
</style>
