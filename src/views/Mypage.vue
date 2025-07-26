<script setup>
import { reactive } from "vue";

// 컴포넌트 import
import Account from "@/components/myPage/Account.vue";

//
const user = reactive({
  name: "서하빈",
  orders: 0,
  cupon: 0,
  point: 0,
});
const myAccount = [
  "주문내역조회",
  "정보수정",
  "결제관리",
  "즐겨찾기",
  "고객센터",
];
</script>
<template>
  <div class="allBox">
    <div class="box">
      <!-- 보더 왼쪽 -->
      <div class="userboard">
        <div class="userLeft">
          <img class="userImg" src="/src/imgs/userImg.png" />
          <div class="user">
            <div>{{ user.name }}님 &nbsp; 반가워요!</div>
            <div class="smalluser">
              <span class="ip">한입</span>
              <span class="rank">등급</span>
            </div>
          </div>
        </div>
        <!-- 보더 오른쪽 -->
        <div class="userright">
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
      </div>
    </div>
  </div>
  <account></account>
</template>
<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: 600;
  font-style: normal;
}
.box {
  display: flex;
  justify-content: center;
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
      align-items: center;
      text-align: center;
      font-family: "BMJUA";
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

@media (max-width: 1400px) {
  .allBox {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box {
    width: 1390px;
    .userboard {
      width: 800px;
      flex-wrap: wrap;
      .userLeft {
        margin-top: 20px;
      }
    }
  }
}
</style>
