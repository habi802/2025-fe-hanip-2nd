<script setup>
import { ref } from 'vue';
// myPage 컴포넌트 임포트
import OrderDetails from './OrderDetails.vue';
import Information from './Information.vue';
import Payment from './Payment.vue';
import Favorites from './Favorites.vue';
import customerCt from './customerCt.vue';
import AccountMain from './AccountMain.vue';

// 컴포넌트 v-if 처리
let main = ref(true);
let OrderDetail = ref(false);
let inf = ref(false);
// let pay = ref(false);
let favor = ref(false);
let ct = ref(false);

const orderClick = () => {
  OrderDetail.value = true;
  inf.value = false;
  // pay.value = false;
  favor.value = false;
  ct.value = false;
  main.value = false;
};

const infClick = () => {
  OrderDetail.value = false;
  inf.value = true;
  // pay.value = false;
  favor.value = false;
  ct.value = false;
  main.value = false;
};
const payClick = () => {
  OrderDetail.value = false;
  inf.value = false;
  // pay.value = true;
  favor.value = false;
  ct.value = false;
  main.value = false;
};

const favorClick = () => {
  OrderDetail.value = false;
  inf.value = false;
  // pay.value = false;
  favor.value = true;
  ct.value = false;
  main.value = false;
};

const ctClick = () => {
  OrderDetail.value = false;
  inf.value = false;
  // pay.value = false;
  favor.value = false;
  ct.value = true;
  main.value = false;
};

//
const myAccount = ['주문내역조회', '정보수정', '즐겨찾기', '고객센터'];
</script>

<template>
  <div class="accountBox">
    <div class="accountBoard">
      <div class="mainText">마이페이지</div>
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
      <div v-if="ct">
        <customerCt></customerCt>
      </div>
      <div v-if="main">
        <AccountMain></AccountMain>
      </div>
    </div>
  </div>
  <footer></footer>
</template>

<style lang="scss" scoped>
.accountBox {
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
    font-size: 0.9em;
    margin-top: 13px;
    font-weight: 800;
  }
}
.components {
  margin-top: 100px;
  margin-left: 180px;
}

footer {
  margin-bottom: 200px;
}
</style>
