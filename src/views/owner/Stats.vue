<script setup>
import {ref , reactive,  onMounted , computed } from 'vue';
import ChartCard from '@/components/owner/ChartCard.vue';
import TotalCard from '@/components/owner/TotalCard.vue';
import { useOrderStore } from '@/stores/orderStore';
import { getOrderByDate } from '@/services/orderService';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");
const now = dayjs();

//주문정보전체호출(피니아)
const orderStore = useOrderStore();
console.log("paidOrders : " , orderStore.paidOrders)

//필터 별 전체 주문 수
const orderCount = computed(()=>{
  const whole = orderStore.paidOrders.length + orderStore.deliveredOrders.length + orderStore.deliveredOrders.length;
  return whole;
})
//필터 별 전체 배달 수
const deliveredOrdersCount = computed(()=>{
  const whole = orderStore.deliveredOrders.length;
  return whole;
})

//필터 별 취소주문 건
const canceledOrdersCount = computed(()=>{
  const whole = null;
  return whole;
})

//필터 별 총 매출
const totalPrice = computed(() => {
  const whole = orderStore.deliveredOrders

    // 배열이 없을 경우 0 반환
  if (!orderStore.deliveredOrders || orderStore.deliveredOrders.length === 0) return 0;
  
  // amount 값 다 더하고 만원 단위로 변환 (반올림)
  return orderStore.deliveredOrders
    .reduce((sum, order) => sum + (order.amount || 0), 0) / 10000;

});



// 토탈카드 데이터
const totalCardData = [
{ title: '전체 주문 수', count: orderCount || "-" , toLocalString : '건' },
{ title: '전체 배달 수', count: deliveredOrdersCount || "-" , toLocalString: '건' },
{ title: '취소된 주문',  count: 2000, toLocalString: '건' },
{ title: '총 매출',     count: totalPrice || "-" , toLocalString: '만' }
]


const labels = ref([]);
const chartDataValue =  ref([]);
const charttitle = ref("주문추이");
// 차트데이터
const chartData = [
  {
    title: charttitle.value,
    label: labels.value,
    data: chartDataValue.value
  }
];

// const chartData = computed(() => {
//   const paidOrders = orderStore.paidOrders || [];
//   // 날짜별 카운트
//   const countsByDay = {};
//   paidOrders.forEach(order => {
//     const date = order.createdAt?.slice(0, 10); 
//     if (date) countsByDay[date] = (countsByDay[date] || 0) + 1;
//   });

//   // labels 정렬
//   const allDates = Object.keys(countsByDay).sort();
//   const allData = allDates.map(d => countsByDay[d]);

//   // 오늘 날짜 기준
//   const end = new Date();
//   const today = formatDate(end);

//   // 일간
//   const dailyLabels = [today];
//   const dailyData = [countsByDay[today] || 0];

//   // 주간 (최근 7일)
//   const startWeek = new Date();
//   startWeek.setDate(end.getDate() - 6);
//   const weeklyLabels = allDates.filter(d => d >= formatDate(startWeek));
//   const weeklyData = weeklyLabels.map(d => countsByDay[d]);

//   // 월간 (최근 30일)
//   const startMonth = new Date();
//   startMonth.setDate(end.getDate() - 29);
//   const monthlyLabels = allDates.filter(d => d >= formatDate(startMonth));
//   const monthlyData = monthlyLabels.map(d => countsByDay[d]);

//   // 연간 (최근 12개월 → 월 단위로 집계)
//   const countsByMonth = {};
//   paidOrders.forEach(order => {
//     const month = order.createdAt?.slice(0, 7); // yyyy-mm
//     if (month) countsByMonth[month] = (countsByMonth[month] || 0) + 1;
//   });
//   const yearlyLabels = Object.keys(countsByMonth).sort();
//   const yearlyData = yearlyLabels.map(m => countsByMonth[m]);

//   return {
//     일간: { title: '일간 주문 추이', label: dailyLabels, data: dailyData },
//     주간: { title: '주간 주문 추이', label: weeklyLabels, data: weeklyData },
//     월간: { title: '월간 주문 추이', label: monthlyLabels, data: monthlyData },
//     연간: { title: '연간 주문 추이', label: yearlyLabels, data: yearlyData },
//   };
// });




// 날짜필터 선택 관련 변수

const dateOptions = ['연간', '월간', '주간' , '일간'];
const selectedChartOption = ref(dateOptions[1]);  //기본값 : 한달

// 날짜필터 선택 시 chartData[] 해당배열번호 리턴
const currentChartData = computed(()=>{
  const index = dateOptions.indexOf(selectedChartOption.value);
  // 예외 시 빈 배열 반환 : chartData의 길이가 dateOptions의 길이와 다르거나, index가 범위를 벗어나는 경우
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
    case dateOptions[3]:
    console.log("일간")
      selectedLabel.value = dateOptions[3];
      labels.value = Array.from({length: 24}, (_, i) => {return `${i}시`;});
      chartDataValue.value = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4]
      console.log(labels.value)
      break;
    case dateOptions[2]:
    console.log("주간")
      selectedLabel.value = dateOptions[2];
      labels.value = Array.from({length: 7}, (_, i) => {return dayjs().day(i).format('ddd');});
      chartDataValue.value = [1,2,3,4,5,6,7]
      console.log(labels.value)
      // start = new Date();
      // start.setDate(end.getDate() - 7);
      // data.storeId = storeId?.value;
      // data.startDate = formatDate(start);
      // data.endDate = formatDate(end);
      break;
    case dateOptions[1]:
    console.log("월간")
      selectedLabel.value = dateOptions[1];
      const weekCount = Math.ceil(now.date() / 7);
      labels.value = Array.from({length: weekCount}, (_, i) => {return `${i + 1}주`;});
      chartDataValue.value = [1,2,3,4,5]
      console.log(labels.value)

      // start = new Date();
      // start.setMonth(end.getMonth() - 1);
      // data.storeId = storeId?.value;
      // data.startDate = formatDate(start);
      // data.endDate = formatDate(end);
      break;
    case dateOptions[0]:
      console.log("연간")
      selectedLabel.value = dateOptions[0];
      labels.value = Array.from({length: now.month() + 1}, (_, i) => { return dayjs().month(i).format('M월');});
      chartDataValue.value = [1,2,3,4,5,6,7,8,9]
      console.log(labels.value)
      
      // data.storeId = storeId?.value;
      // data.startDate = null;
      // data.endDate = null;
      break;
  }
};


onMounted(() => {
  
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
        <li v-for="(op,idx) in dateOptions" :key="idx" >
          <button class="dropdown-item" @click="selectRange(dateOptions[idx])" >
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
      <ChartCard class="white-card" title=charttitle.value labelY="y축범례" type="bar" :chart-data="currentChartData" />
      <ChartCard class="white-card" title=charttitle.value labelY="y축범례" type="line" :chart-data="currentChartData" />
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
