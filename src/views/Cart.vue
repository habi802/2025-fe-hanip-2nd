<script setup>
import { reactive, onMounted } from 'vue';
import { getItems, removeCart, removeItem } from '@/services/cartService';

const state = reactive({
  items: [],
});

onMounted(() => {
  load();
});

const load = async () => {
  const res = await getItems();
  if (res === undefined || res.status !== 200) return;
  state.items = res.data;
};

const remove = async (cartId) => {
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) return;
  load();
};

const clear = async () => {
  const res = await removeCart();
  if (res.status !== 200) return;
  load();
};
</script>

<template>
  <!-- 장바구니 비었을 때 안내 -->
  <div class="div18">장바구니에 담은 음식이 없습니다.</div>

  <!-- 추천 가게 보기 버튼 -->
  <div class="groupContainer">
    <div class="rectangleWrapper">
      <div class="groupItem" />
    </div>
    <div class="div19">추천 가게 보기</div>
  </div>

  <!-- 주문 단계 진행 표시 -->
  <div class="groupParent1">
    <div class="parent">
      <div class="div20">음식선택</div>
      <div class="div21">01</div>
    </div>
    <div class="group">
      <div class="div22">장바구니</div>
      <div class="div23">02</div>
    </div>
    <div class="parent1">
      <div class="div24">주문/결제</div>
      <div class="div21">03</div>
    </div>
    <div class="parent2">
      <div class="div21">04</div>
      <div class="div24">주문완료</div>
    </div>
    <img
      class="materialSymbolsarrowForwardIcon1"
      alt=""
      src="/src/imgs/cartimgs/arrowios.svg"
    />
    <img
      class="materialSymbolsarrowForwardIcon2"
      alt=""
      src="/src/imgs/cartimgs/arrowios.svg"
    />
    <img
      class="materialSymbolsarrowForwardIcon3"
      alt=""
      src="/src/imgs/cartimgs/arrowios.svg"
    />
  </div>
</template>

<style scoped>
.instanceChild {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  background-color: #525252;
}
.wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
}
.groupWrapper {
  position: absolute;
  height: 7.84%;
  width: 6.06%;
  top: 12.09%;
  right: 93.8%;
  bottom: 80.07%;
  left: 0.14%;
  font-size: 20px;
}
.container {
  position: absolute;
  height: 6.21%;
  width: 6.06%;
  top: 30.72%;
  right: 93.94%;
  bottom: 63.07%;
  left: 0%;
}
.frame {
  position: absolute;
  height: 6.21%;
  width: 7.66%;
  top: 30.39%;
  right: 77.35%;
  bottom: 63.4%;
  left: 14.99%;
}
.groupDiv {
  position: absolute;
  height: 6.21%;
  width: 7.66%;
  top: 30.39%;
  right: 61.61%;
  bottom: 63.4%;
  left: 30.72%;
}
.wrapper1 {
  position: absolute;
  height: 6.21%;
  width: 8.66%;
  top: 52.61%;
  right: 60.62%;
  bottom: 41.18%;
  left: 30.72%;
}
.wrapper2 {
  position: absolute;
  height: 6.21%;
  width: 3.07%;
  top: 41.83%;
  right: 96.93%;
  bottom: 51.96%;
  left: 0%;
}
.wrapper3 {
  position: absolute;
  height: 6.21%;
  width: 8.04%;
  top: 41.83%;
  right: 76.98%;
  bottom: 51.96%;
  left: 14.99%;
}
.wrapper4 {
  position: absolute;
  height: 6.21%;
  width: 8.04%;
  top: 41.83%;
  right: 61.24%;
  bottom: 51.96%;
  left: 30.72%;
}
.wrapper5 {
  position: absolute;
  height: 6.21%;
  width: 4.09%;
  top: 52.94%;
  right: 95.91%;
  bottom: 40.85%;
  left: 0%;
}
.wrapper6 {
  position: absolute;
  height: 7.84%;
  width: 6.06%;
  top: 12.09%;
  right: 78.95%;
  bottom: 80.07%;
  left: 14.99%;
  font-size: 20px;
}
.wrapper7 {
  position: absolute;
  height: 7.84%;
  width: 3.68%;
  top: 12.09%;
  right: 65.6%;
  bottom: 80.07%;
  left: 30.72%;
  font-size: 20px;
}
.hanip {
  position: absolute;
  width: 100%;
  top: 0%;
  left: 0%;
  font-weight: 600;
  display: inline-block;
}
.hanipWrapper {
  position: absolute;
  height: 7.84%;
  width: 8.96%;
  top: 12.09%;
  right: 21.42%;
  bottom: 80.07%;
  left: 69.62%;
  font-size: 20px;
}
.span {
  font-weight: 600;
}
.wrapper8 {
  position: absolute;
  height: 7.84%;
  width: 8.96%;
  top: 26.47%;
  right: 21.42%;
  bottom: 65.69%;
  left: 69.62%;
  font-size: 20px;
}
.wrapper9 {
  position: absolute;
  height: 15.69%;
  width: 13.35%;
  top: 37.91%;
  right: 17.03%;
  bottom: 46.41%;
  left: 69.62%;
  font-size: 20px;
}
.wrapper10 {
  position: absolute;
  height: 13.73%;
  width: 8.96%;
  top: 59.15%;
  right: 21.42%;
  bottom: 27.12%;
  left: 69.62%;
  font-size: 18px;
}
.wrapper11 {
  position: absolute;
  height: 6.86%;
  width: 8.96%;
  top: 12.75%;
  right: 5.07%;
  bottom: 80.39%;
  left: 85.97%;
  font-size: 18px;
}
.wrapper12 {
  position: absolute;
  height: 9.48%;
  width: 8.96%;
  top: 25.16%;
  right: 5.07%;
  bottom: 65.36%;
  left: 85.97%;
  font-size: 24px;
}
.green502navercom {
  position: absolute;
  width: 100%;
  top: 0%;
  left: 0%;
  display: inline-block;
}
.green502navercomWrapper {
  position: absolute;
  height: 6.86%;
  width: 14.03%;
  top: 37.91%;
  right: 0%;
  bottom: 55.23%;
  left: 85.97%;
  font-size: 18px;
}
.groupChild {
  position: absolute;
  height: 100.33%;
  width: 0.07%;
  top: -0.16%;
  right: 47.24%;
  bottom: -0.16%;
  left: 52.69%;
  border-right: 1px solid #fff;
  box-sizing: border-box;
}
.groupParent {
  position: absolute;
  height: 60.83%;
  width: 76.46%;
  top: 7.55%;
  right: 12.66%;
  bottom: 31.61%;
  left: 10.89%;
  text-align: left;
  font-size: 16px;
}
.allRightsReserved {
  position: absolute;
  top: 78.73%;
  left: 11.46%;
  font-weight: 600;
}
.hanipCompany2025 {
  position: absolute;
  top: 78.73%;
  left: 21.41%;
  font-weight: 600;
}
.div17 {
  position: absolute;
  height: 4.17%;
  width: 0.94%;
  top: 78.73%;
  left: 20.05%;
  font-size: 20px;
  font-family: Inter;
  display: inline-block;
}
.hanipLogo021Icon {
  position: absolute;
  width: 83.21%;
  top: 0px;
  right: 8.39%;
  left: 8.4%;
  max-width: 100%;
  overflow: hidden;
  height: 128.9px;
  object-fit: cover;
}
.hanipLogo061Icon {
  position: absolute;
  top: 40.2px;
  left: 0px;
  width: 154.9px;
  height: 154.9px;
  object-fit: cover;
}
.hanipLogo021Parent {
  position: absolute;
  width: 8.07%;
  top: 33px;
  right: 38.13%;
  left: 53.8%;
  height: 195.1px;
}
.rectangleParent {
  position: absolute;
  top: 927px;
  left: 0px;
  width: 1920px;
  height: 503px;
  font-size: 18px;
  color: #fff;
  font-family: Pretendard;
}
.materialSymbolsarrowForwardIcon {
  position: absolute;
  top: 158px;
  left: 283px;
  width: 42px;
  height: 42px;
  overflow: hidden;
  object-fit: contain;
}
.div18 {
  position: absolute;
  top: 328px;
  left: 759px;
  letter-spacing: -1px;
  text-align: left;
}
.groupItem {
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 8px;
  border: 2px solid #ff6666;
  box-sizing: border-box;
  width: 411px;
  height: 82px;
}
.rectangleWrapper {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 411px;
  height: 82px;
}
.div19 {
  position: absolute;
  top: 22px;
  left: 119px;
  letter-spacing: -0.07em;
  display: inline-block;
  width: 173px;
  height: 38px;
}
.groupContainer {
  position: absolute;
  top: 618px;
  left: 759px;
  width: 411px;
  height: 82px;
  color: #ff6666;
}
.div20 {
  position: absolute;
  top: 0px;
  left: 34px;
}
.div21 {
  position: absolute;
  top: 0px;
  left: 0px;
}
.parent {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 109px;
  height: 25px;
}
.div22 {
  position: absolute;
  top: 0px;
  left: 37px;
}
.div23 {
  position: absolute;
  top: 0px;
  left: 0px;
  color: #ff6666;
}
.group {
  position: absolute;
  top: 0px;
  left: 139px;
  width: 116px;
  height: 25px;
}
.div24 {
  position: absolute;
  top: 0px;
  left: 38px;
}
.parent1 {
  position: absolute;
  top: 0px;
  left: 281px;
  width: 127px;
  height: 25px;
}
.parent2 {
  position: absolute;
  top: 0px;
  left: 433px;
  width: 116px;
  height: 25px;
}
.materialSymbolsarrowForwardIcon1 {
  position: absolute;
  top: 2px;
  left: 116px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
.materialSymbolsarrowForwardIcon2 {
  position: absolute;
  top: 2px;
  left: 258px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
.materialSymbolsarrowForwardIcon3 {
  position: absolute;
  top: 2px;
  left: 410px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
.groupParent1 {
  position: absolute;
  top: 164px;
  left: 1088px;
  width: 549px;
  height: 26px;
  text-align: left;
  font-size: 24px;
}
.child {
  position: absolute;
  height: 2.46%;
  width: 2.43%;
  top: 1.33%;
  right: 22.18%;
  bottom: 96.21%;
  left: 75.39%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  cursor: pointer;
}
.item {
  position: absolute;
  top: 18px;
  left: 1361px;
  width: 46.5px;
  height: 36.2px;
}
.inner {
  position: absolute;
  top: 19px;
  left: 1534.08px;
  width: 58.1px;
  height: 35.2px;
}
.div28 {
  position: absolute;
  top: 28px;
  left: 1638px;
  font-size: 14px;
  letter-spacing: 0.01em;
  font-weight: 500;
  font-family: Pretendard;
  color: #ff6666;
}
.groupIcon {
  position: absolute;
  top: -27px;
  left: 289px;
  width: 132px;
  height: 132px;
  object-fit: cover;
}
.hanipLogo023Icon {
  position: absolute;
  top: -3px;
  left: 219px;
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.rectangleDiv {
  position: absolute;
  top: 18px;
  left: 678px;
  border-radius: 8px;
  border: 2px solid #ffc2c2;
  box-sizing: border-box;
  width: 564px;
  height: 36px;
}
.icon {
  position: absolute;
  top: 30.5px;
  left: 911.39px;
  width: 95.5px;
  height: 10.5px;
}
.weuilocationFilledIcon {
  position: absolute;
  top: 26px;
  left: 1188px;
  width: 20px;
  height: 20px;
  overflow: hidden;
}
.div29 {
  position: absolute;
  top: 152px;
  left: 331px;
  font-size: 50px;
}
.div {
  width: 100%;
  position: relative;
  background-color: #fff;
  height: 1430px;
  overflow: hidden;
  text-align: center;
  font-size: 32px;
  color: #000;
  font-family: 'BM JUA_OTF';
}
</style>
