<script setup>
import {ref , reactive,  onMounted , computed,watch } from 'vue';
import ChartCard from '@/components/owner/ChartCard.vue';
import TotalCard from '@/components/owner/TotalCard.vue';
import { useOwnerStore } from '@/stores/account';
import { useOrderStore } from '@/stores/orderStore';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { getStatus } from '@/services/orderService';
import StatsDateFilter from '@/components/owner/StatsDateFilter.vue';

//날짜기능호출
dayjs.extend(relativeTime);
dayjs.locale("ko");
const now = dayjs();
//storeid 호출
const ownerStore = useOwnerStore();

//가게에대한 주문정보(가격, 주문갯수) 호출
const data = ref([])
const fetchStatus = async (start , end) => {
  const params = reactive({
    storeId: ownerStore.state.storeData.id,
    startDate: start,
    endDate: end,
  });
  
  if (!ownerStore.state.storeData.id) {
    console.warn("storeId가 준비되지 않았습니다");
    return;
  }

  if (!start || !end) {
    console.warn("날짜정보가 입력되지 않았습니다");
    return;
  }

  try {
    const res = await getStatus(params);

    // res가 정상인지 확인
    if (!res || !res.data) {
      console.warn("API 응답 없음 또는 형식 불일치:", res);
      return;
    }
    data.value = res.data.resultData || [];
    console.log("data:", data.value);
  } catch (err) {
    console.error("API 호출 실패:", err);
  }
};


// 차트데이터 정의
const chartLabels = ref([]);
const chartData =  ref([]);
const chartForm = reactive({
    title: "주문추이",
    label: [],
    data: []
  });
  const chartForm2 = reactive({
    title: "매출추이",
    label: [],
    data: []
  });


//날짜 선택 상태 (emit)
const selectedDate = reactive({
  selectedChartOption:"",
  startDate: now.subtract(1, "month").format("YYYY-MM-DD"),
  endDate: now.format("YYYY-MM-DD"),
});

//날짜 선택 시 실행
const handleDateUpdate = ({ selectedChartOption, startDate, endDate }) => {
  selectedDate.selectedChartOption = selectedChartOption
  selectedDate.startDate = startDate;
  selectedDate.endDate = endDate;
  
  // 선택된 날짜 기준으로 서버 호출
  fetchStatus(startDate, endDate).then(()=>{
    switch(selectedChartOption){
    case "일간":
    chartLabels.value = Array.from({ length: 24 }, (_, i) => dayjs().hour(i).format("H시"));
    console.log(chartLabels.value)

    const hourlyAmounts = Array.from({ length: 24 }, () => 0);
    data.value.forEach( order => {
    const hour = dayjs(order.createdAt).hour(); // createdAt에서 시간 추출 (0~23)
    hourlyAmounts[hour] += order.amount;         // 해당 시간대 amount 합산
    });
    chartData.value = hourlyAmounts;
    console.log(chartData.value);

    chartForm.value.label = chartLabels.value.slice();
    chartForm.value.data  = chartData.value.slice();
    

    break;
  
    case "주간":
    chartLabels.value = ["월", "화", "수", "목", "금", "토", "일"];
    console.log(chartLabels.value)

    break;
  
    case "월간":
    const startOfMonth = now.startOf("month"); // 이번 달 1일
    const endOfMonth = now.endOf("month");     // 이번 달 마지막 날
    const startWeekDay = startOfMonth.day(); // 이번 달 1일 요일 (0:일, 1:월, ..., 6:토)
    const lastDate = endOfMonth.date(); // 이번 달 마지막 날짜
    const totalWeeks = Math.ceil((lastDate + startWeekDay) / 7); // 최대 몇 주까지 있는지 계산 (첫 주가 partial일 경우 + 마지막 날짜 포함)
    chartLabels.value = Array.from({ length: totalWeeks }, (_, i) => `${i + 1}주`);
    console.log(chartLabels.value)
    break;
  
    case "연간":
    chartLabels.value = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format("M월"));
    console.log(chartLabels.value)

    break;
    
  }

  })};





//전체 주문 수
const orderCount = computed(()=>{
  return data.value.length;
})
//전체 배달 수
const deliveredOrdersCount = computed(()=>{
  return data.value.filter(order => order.status === '05').length;
})

//취소주문 건
const canceledOrdersCount = computed(()=>{
  return data.value.filter(order => order.status === '06').length;
})

//총 매출
const totalPrice = computed(() => {
  // amount 값 다 더하고 만원 단위로 변환 (반올림)
  const result = data.value.reduce((sum, order) => sum + (order.amount || 0), 0);
  const manWon = Math.floor(result / 10000); // 만원 단위로 변환, 소수점 제거
  return manWon.toLocaleString("ko-KR");
});

//토탈카드 데이터
const totalCardData = [
{ title: '전체 주문 수', count: orderCount || "0" , toLocalString : '건' },
{ title: '전체 배달 수', count: deliveredOrdersCount || "0" , toLocalString: '건' },
{ title: '취소된 주문',  count: canceledOrdersCount || "0", toLocalString: '건' },
{ title: '총 매출',     count: totalPrice || "0" , toLocalString: '만' },
]










// 날짜필터 선택 시 chartForm[] 해당배열번호 리턴
// const currentChartData = computed(()=>{
//   const index = dateOptions.indexOf(selectedChartOption.value);
//   // 예외 시 빈 배열 반환 : chartForm의 길이가 dateOptions의 길이와 다르거나, index가 범위를 벗어나는 경우
//   if (index === -1 || index >= chartForm.length) {
//     return { label: [], data: [] };
//   }
//   return chartForm[index];
// })


onMounted(async () => {
});

</script>

<template>
  
  <div class="wrap">
    <!-- 조회기간 설정 (기본 한달) -->
     <StatsDateFilter @update-date="handleDateUpdate" ></StatsDateFilter>
    <!-- 조회기간설정카드 끝-->

    <div class="total-wrap">
      <TotalCard v-for="(data, idx) in totalCardData" :key="idx" :selected-chart-option=selectedChartOption :title=data.title :count=data.count :to-local-string=data.toLocalString></TotalCard>
    </div><!--total-wrap 끝 -->

    <div class="chart-wrap">
      <ChartCard class="white-card" :title=chartForm.title labelY="y축범례" type="bar" :chart-data="chartForm" />
      <ChartCard class="white-card" :title=chartForm2.title labelY="y축범례" type="line" :chart-data="chartForm" />
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
