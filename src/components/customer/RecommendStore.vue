<script setup>
import { getStoreList } from '@/services/storeService';
import { onMounted, reactive, computed } from 'vue';
import RecomendStoreCard from './RecomendStoreCard.vue';
const state = reactive({
  form: [],
  random: [],
})
// 추천 가게 목록
// const store = [
//   {search_text: "강식당"},
//   {search_text: "박쉪버거"},
//   {search_text: "향택"},
//   {search_text: "반월당부자식당"},
//   {search_text: "오십계"},
//   {search_text: "백홍식당"},
//   {search_text: "설옥곰탕"},
//   {search_text: "경탄성"},
// ]
//   랜덤 스토어용 값 가져오기
const randomList = async (params) => {
  const random = await getStoreList({ page: 0, size: 12 });
  console.log("random", random.data.resultData);
  state.random = random.data.resultData;
  console.log("ra", state.random);
};
// 랜덤 돌리기
const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};
const randomThreeStores = computed(() => {
  return shuffle(state.random).slice(0, 12);
});
onMounted(async () => {
  // for (let i = 0; i < store.length; i++) {
  //   const res = await getStoreList(store[i]);
  //   state.form.push(...res.data.resultData);
  // }
  // console.log("res: ", state.form);
  randomList();
  // console.log(state.random);
})
</script>
1:55
<template>
  <div class="f-text">한입 추천 가게</div>
  <div class="guideBox">
    <!--  -->
    <!-- <div
              v-for="(item, index) in randomThreeStores"
              :key="item.id"
            >
              <recommend-store-card :stores="item" />
            </div> -->
    <recomend-store-card v-for="store in randomThreeStores" :key="store.storeId" :stores="store" />
  </div>
  <div class="footer"></div>
</template>
<style lang="scss" scoped>
@font-face {
  font-family: 'BMJUA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
  font-weight: 600;
  font-style: normal;
}

.f-text {
  font-family: "BMJUA";
  letter-spacing: 2px;
  color: #FF6666;
  font-size: 2em;
  text-align: center;
  padding-top: 105px;
  margin-left: 15px;
}

.guideBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 90px 15px;
  width: 1450px;
  height: 100%;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #fff;
}
</style>