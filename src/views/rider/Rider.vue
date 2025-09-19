<script setup>

</script>

<template>
  <div class="rider-container">
    <!-- 상단 로고 -->
    <header class="rider-header">
      <img src="@/imgs/rider.png" alt="rider logo" class="logo" />
    </header>

    <main class="rider-main">

      <section class="pickup">
        <h4 class="box-title">음식픽업</h4>
        <div class="info-box pickup-box">
          <p class="store-name">신당동 냉떡볶이</p>
          <p class="store-addr">
            대구 달서구 야외음악당로 20길 49,<br />
            205동 203호
          </p>
        </div>
      </section>

      <div class="arrow">&gt;</div>

      <section class="customer">
        <h4 class="box-title">고객주소</h4>
        <div class="info-box customer-box">
          <p>
            대구 달서구 야외음악당로 20길 49,<br />
            205동 203호
          </p>
        </div>
      </section>

      <aside class="order-info">
        <ul>
          <li><strong>주문번호</strong> <span>0001</span></li>
          <li><strong>메뉴</strong> <span>황금올리브 외 4건</span></li>
          <li><strong>결제금액</strong> <span>23,500원</span></li>
          <li><strong>요청사항</strong> <span>8282구다사이</span></li>
        </ul>
      </aside>
    </main>

    <footer class="rider-footer">
      <button class="pickup-btn">음식 픽업</button>
    </footer>
  </div>
</template>

<style scoped>
body {
  background: #ffffff;
  margin: 0;
  height: 100vh;
}

.rider-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: "Noto Sans KR", sans-serif;
}

.rider-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #f8f8f8;
  height: 142px;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;
}

.rider-header .logo {
  width: 201.78px;   
  height: 108px;     
  object-fit: contain;
  margin-bottom: 10px;
}

.rider-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.rider-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  padding: 20px;
}

.box-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
}

.info-box {
  width: 500px;
  height: 300px;
  padding: 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
  text-align: center;
  font-size: 16px;
  border: 2px solid #ff6868;
  box-sizing: border-box;
  font-weight: bold;
}

.pickup-box {
  background: #ff6868;
  color: #fff;
}

.customer-box {
  background: #fff;
  color: #000;
}

.store-name {
  font-size: 32px;
}

.store-addr {
  font-size: 16px;
  margin-top: 10px;
}

.arrow {
  font-size: 60px;
  color: #ff6868;
  align-self: center;
}

.order-info {
  width: 300px;
  padding: 20px;
}

.order-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-info li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  color: #000;
  line-height: 26px;
}

.order-info ul li + li {
  margin-top: 10px;
}

.rider-footer {
  text-align: center;
  background: #f8f8f8;
  height: 200px;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pickup-btn {
  background: #ffffff;
  border: 2px solid #ff6868;
  color: #ff6868;
  font-size: 20px;
  font-weight: bold;
  padding: 18px 60px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.pickup-btn:hover {
  background: #ff6868;
  color: #ffffff;
}
</style>
