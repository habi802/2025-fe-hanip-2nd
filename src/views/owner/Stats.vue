<script setup>
import {ref , reactive,  onMounted , computed } from 'vue';
import ChartCard from '@/components/owner/ChartCard.vue';
import TotalCard from '@/components/owner/TotalCard.vue';

// 토탈카드 임시데이터
const totalCardData = [
  //conunt 백엔드 자료 연결
{ title: '전체 주문 수', count: 2000, toLocalString: '건' },
{ title: '전체 배달 수', count: 2000, toLocalString: '건' },
{ title: '취소된 주문',  count: 2000, toLocalString: '건' },
{ title: '총 매출',     count: 2000, toLocalString: '만' }
]

// 차트 임시데이터
const chartData = [
  {
    title: '주문 추이',
    label: ['1월', '2월', '3월'],
    data: [47, 98, 250]
  }
  ,
  {
    title: '매출 추이',
    label: ['4월', '5월', '6월'],
    data: [1, 50, 200]
  }
];

// 날짜필터 선택 관련 변수
const chartOptions = ['연간', '월간', '주간' , '일간'];
const selectedChartOption = ref(chartOptions[1]);  //기본값 : 힌딜
// 날짜필터 선택 시 chartData[] 해당배열번호 리턴
const currentChartData = computed(()=>{
  const index = chartOptions.indexOf(selectedChartOption.value);
  // 예외 시 빈 배열 반환 : chartData의 길이가 chartOptions의 길이와 다르거나, index가 범위를 벗어나는 경우
  if (index === -1 || index >= chartData.length) {
    return { label: [], data: [] };
  }
  return chartData[index];
})

// 날짜 조회
const selectedLabel = ref("");
const data = reactive({
  // storeId: "",
  startDate: "",
  endDate: "",
});
//날짜 필터 선택 시
const selectRange = async (range) => {
  selectedChartOption.value = range;
  const end = new Date();
  end.setDate(end.getDate() + 1);
  let start;
  switch (range) {
    case chartOptions[3]:
    console.log("일간")
      selectedLabel.value = chartOptions[3];
      break;
    case chartOptions[2]:
    console.log("주간")
      selectedLabel.value = chartOptions[2];
      start = new Date();
      start.setDate(end.getDate() - 7);
      data.storeId = storeId?.value;
      data.startDate = formatDate(start);
      data.endDate = formatDate(end);
      break;
    case chartOptions[1]:
    console.log("월간")
      selectedLabel.value = chartOptions[1];
      start = new Date();
      start.setMonth(end.getMonth() - 1);
      data.storeId = storeId?.value;
      data.startDate = formatDate(start);
      data.endDate = formatDate(end);
      break;
    case chartOptions[0]:
      console.log("연간")
      selectedLabel.value = chartOptions[0];
      data.storeId = storeId?.value;
      data.startDate = null;
      data.endDate = null;
      break;
  }
  // console.log("res.data.resultData: ",data.storeId)
  const res = await getOrderByDate(data);
  console.log("res.data.resultData: ", res.data.resultData);
  if (res.status !== 200) {
    showAlert("데이터 조회에 실패하였습니다.");
    return;
  }
  if (res.status === 403) {
    showAlert("데이터 조회 권한이 없습니다.");
    return;
  }
  orderStore.orders = res.data.resultData;
};


onMounted(() => {
  
  // 월간 데이터 자동 선택
  selectRange(selectedChartOption.value);
  
});

</script>

<template>
  
  <div class="wrap">
    <!-- 조회기간 설정 (기본 한달) -->
    <div class="date-option dropdown" ref="orderDetail">
      <button class="date-filter" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
        <img src="/src/imgs/owner/Icon_조회기간설정2.svg" alt="캘린더아이콘" />
        <span> {{selectedLabel ? selectedLabel : "조회 기간 선택"}}</span>
        <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" />
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
        <li v-for="(op,idx) in chartOptions" :key="idx" >
          <button class="dropdown-item" @click="selectRange(chartOptions[idx])" >
            {{ op }}
          </button>
        </li>
      </ul>
    </div>
    <!-- 조회기간설정카드 끝-->

    <div class="total-wrap">
      <TotalCard v-for="(data, idx) in totalCardData" :key="idx" :selected-chart-option=selectedChartOption :title=data.title :count=data.count :to-local-string=data.toLocalString></TotalCard>
    </div><!--total-wrap 끝 -->

    <div class="chart-wrap">
      <ChartCard class="white-card" title="주문 추이" labelY="y축범례" type="bar" :chart-data="currentChartData" />
      <ChartCard class="white-card" title="매출 추이" labelY="y축범례" type="line" :chart-data="currentChartData" />
      <!-- <ChartCard class="white-card" title="주문 추이" labelY="y축범례" type="bar" :chart-data="currentChartData" />
      <ChartCard class="white-card" title="매출 추이" labelY="y축범례" type="line" :chart-data="currentChartData" /> -->
    </div>
  </div><!-- wrap 끝-->

</template>

<style scoped lang="scss">
.wrap{
width: 90%;
display: flex;
flex-direction: column;
justify-content: left;
gap: 20px;

.date-filter {
  width: 300px;
  height: 50px;
  background-color: #fff;
  border-radius: var(--card-lg-radius);
  box-shadow: var(--card-shadow);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 15px;
  span {
    display: block;
    width: 100%;
    font-size: 1.2rem;
    text-align: left;
    padding-left: 10%;
  }
  img:last-child {
    transform: translateY(-1px);
  }
}


.total-wrap{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  align-items: center;
  justify-content: center;
}

.chart-wrap{
  display: grid;
  grid-template-columns: repeat(2, 1.5fr);
  gap: 20px;
}
  
}//wrap
</style>
