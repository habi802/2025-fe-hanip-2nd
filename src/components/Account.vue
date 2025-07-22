<script setup>
import { reactive } from 'vue';

const user = reactive({
  name: '서하빈',
  orders: 0,
  cupon: 0,
  point: 0,
});

const myAccount = [
  '주문내역조회',
  '정보수정',
  '결제관리',
  '즐겨찾기',
  '고객센터',
];
</script>

<template>
  <!-- 하단 -->
  <div class="bottom">
    <!-- 마이페이지 -->
    <div class="account">
      <div class="main">마이페이지</div>
      <!-- 하단 리스트 -->
      <div class="mainList">
        <div>{{ myAccount[0] }}</div>
        <div>{{ myAccount[1] }}</div>
        <div>{{ myAccount[2] }}</div>
        <div>{{ myAccount[3] }}</div>
        <div>{{ myAccount[4] }}</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff')
    format('woff');
  font-weight: 600;
  font-style: normal;
}
.box {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 500px;
  .userboard {
    align-items: center;
    //
    display: flex;
    justify-content: space-around;
    margin-top: 165px;
    width: 1390px;
    height: 228px;
    border-radius: 25px;
    border: #000 solid 1px;
    .userLeft {
      display: flex;
      .userImg {
        width: 14.5%;
        margin-left: 45px;
      }
      .user {
        font-family: 'BMJUA';
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
      align-items: center;
      text-align: center;
      font-family: 'BMJUA';
      font-size: 1.2em;
      margin-top: 20px;
      margin-left: -170px;
      width: 250px;
      .num {
        margin-top: 10px;
        font-size: 1.3em;
      }
    }
  }
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>
