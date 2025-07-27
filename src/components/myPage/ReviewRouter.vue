<script>
import { RouterLink } from 'vue-router';

</script>

<template>
  <div class="big-container">
    <div class="logo-box">
      <img class="logo" src="/src/imgs/haniplogo2.png" />
    </div>
    <div>
      <div class="text">리뷰가 등록되었습니다</div>
      <div class="text">소중한 리뷰 감사합니다</div>
    </div>
    <div class="buttons">
      <div>
        <div>
          <RouterLink to="/" id="one" class="btn">홈으로 돌아가기</RouterLink>
        </div>
        <div>
          <RouterLink to="/orders" id="two" class="btn">주문 내역으로 돌아가기</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
.big-container {
    text-align: center;
    font-family: 'BMJUA';
  margin-top: 70px;
  margin-bottom: 200px;
  .text{
    font-size: 30px;

  }
  .logo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      width: 200px;
    }
  }

  .buttons {
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    .btn{
        font-size: 35px;
        margin-top: 20px;
    }
    #one{
        background-color: #ff6666;
        color:#fff;
    }
    #two{
        background-color: #e8e8e8;
        color:#5f5f5f;
    }
  }
}
</style>
