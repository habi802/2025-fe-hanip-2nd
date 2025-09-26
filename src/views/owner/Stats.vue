<script setup>
import ChartCard from '@/components/owner/ChartCard.vue';

// 임시데이터
const chartData = [
  {
    label: ['1월', '2월', '3월'],
    data: [47, 98, 250]
  }
  ,
  {
    label: ['4월', '5월', '6월'],
    data: [1, 50, 200]
  }
];


// 날짜필터 선택 관련 변수
const chartOptions = ['연간', '월간', '주간' , '일간'];
const selectedChartOption = ref(chartOptions[1]);  //한달간 자료 기본값
// 날짜필터 선택 시 chartData[] 해당배열번호 리턴
const currentChartData = computed(()=>{
  const index = chartOptions.indexOf(selectedChartOption.value);
  return chartData[index];
})

</script>

<template>
  
  <div class="wrap">
    <!-- 조회기간 설정 (기본 한달) -->

    <div class="total-wrap">
      <div class="white-card total-box">
        <div @click="b" class="circle"></div>
        <div>
          <span>{{ totalOrderCount }}</span>
          <span>전체 주문 수</span>
          <div class="change-rate">
            <span class="icon-up">↑</span><span>4%</span>
          </div>
        </div>
      </div>

      <div class="white-card total-box">
        <div @click="b" class="circle"></div>
        <div>
          <span>{{ totalDeliveryCount }}</span>
          <span>전체 배달 수</span>
          <div class="change-rate">
            <span class="icon-up">↑</span><span>4%</span>
          </div>
        </div>
      </div>

      <div class="white-card total-box">
        <div class="circle"></div>
        <div>
          <span>{{ totalCanceledCount }}</span>
          <span>취소된 주문</span>
          <div class="change-rate">
            <span class="icon-up">↑</span><span>4%</span>
          </div>
        </div>
      </div>

      <div class="white-card total-box">
        <div class="circle"></div>
        <div>
          <span>{{ totalPrice }}만</span>
          <span>총 매출</span>
          <div class="change-rate">
            <span class="icon-down">↓</span><span>12%</span>
          </div>
        </div>
      </div>
    </div><!--total-wrap 끝 -->

    <div class="d-flex gap-3">
      <ChartCard class="white-card" :title="selectedChartOption" :chart-data="currentChartData" />
      <ChartCard class="white-card" :title="selectedChartOption" :chart-data="currentChartData" />
    </div>
  </div><!-- wrap 끝-->

</template>

<style scoped>
.wrap{
width: 90%;
display: flex;
flex-direction: column;
gap: 20px;
}

.total-wrap{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  align-items: center;
  justify-content: center;

  .total-box{
    
  }

  
}
</style>
