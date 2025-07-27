<script setup>
import { getStoreList } from '@/services/storeService';
import { onMounted, reactive } from 'vue';
import RecomendStoreCard from './RecomendStoreCard.vue';

const state = reactive({
  form: [],
})

// 추천 가게 목록
const store = [ 
  {search_text: "강식당"},
  {search_text: "박쉪버거"},
  {search_text: "향택"},
  {search_text: "반월당부자식당"},
  {search_text: "오십계"},
  {search_text: "백홍식당"},
  {search_text: "설옥곰탕"},
  {search_text: "경탄성"},
]


onMounted(async () => {
  for (let i = 0; i < store.length; i++) {
    const res = await getStoreList(store[i]);
    state.form.push(...res.data.resultData);
  }
  console.log("res: ", state.form);
})

</script>
<template>
  <div class="f-text">한입 추천 가게</div>
  <div class="guideBox">
    <!--  -->
    <recomend-store-card v-for="store in state.form" :key="store.storeId" :stores="store"/>
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
  width: 1600px;
  height: 100%;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #fff;
}
</style>
