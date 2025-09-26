<script setup>
import {ref , onMounted , computed } from 'vue';
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

// 날짜 조회
const selectedLabel = ref("");

// const selectRange = async (range) => {
//   const end = new Date();
//   //end.setDate(end.getDate() + 1);
//   let start;
//   switch (range) {
//     case "1d":
//       selectedLabel.value = chartOptions[0];
//       console.log("추후작업");
//       break;
//     case "7d":
//       selectedLabel.value = "최근 1주일";
//       start = new Date();
//       start.setDate(end.getDate() - 7);
//       data.storeId = storeId?.value;
//       data.startDate = formatDate(start);
//       data.endDate = formatDate(end);
//       break;
//     case "1m":
//       selectedLabel.value = "최근 1개월";
//       start = new Date();
//       start.setMonth(end.getMonth() - 1);
//       data.storeId = storeId?.value;
//       data.startDate = formatDate(start);
//       data.endDate = formatDate(end);
//       break;
//     case "all":
//       selectedLabel.value = "전체";
//       selectedLabel.value = "전체";
//       data.storeId = storeId?.value;
//       data.startDate = null;
//       data.endDate = null;
//       break;
//   }
//   // console.log("res.data.resultData: ",data.storeId)
//   const res = await getOrderByDate(data);
//   console.log("res.data.resultData: ", res.data.resultData);
//   if (res.status !== 200) {
//     showAlert("데이터 조회에 실패하였습니다.");
//     return;
//   }
//   if (res.status === 403) {
//     showAlert("데이터 조회 권한이 없습니다.");
//     return;
//   }
//   orderStore.orders = res.data.resultData;
// };


</script>

<template>
  
  <div class="wrap">
    <!-- 조회기간 설정 (기본 한달) -->
    <select>
        <!-- 조회기간설정 카드 -->
        <div class="date-option dropdown" ref="orderDetail">
          <button class="date-filter" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
            <img src="/src/imgs/owner/Icon_조회기간설정2.svg" alt="캘린더아이콘" />
            <span> {{selectedLabel ? selectedLabel : "조회 기간 선택"}}</span>
            <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li v-for="(op,idx) in chartOptions" :key="idx" >
              <button class="dropdown-item" >
                {{ op }}
              </button>
            </li>
            <!-- <li>
              <button class="dropdown-item" @click="selectRange('1d')">
                오늘
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="selectRange('7d')">
                최근 1주일
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="selectRange('1m')">
                최근 1개월
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="selectRange('all')">
                전체
              </button>
            </li> -->
          </ul>
        </div>
        <!-- 조회기간설정카드 끝-->
    </select>
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
      <ChartCard class="white-card" :chart-data="currentChartData" />
      <ChartCard class="white-card" :chart-data="currentChartData" />
    </div>
  </div><!-- wrap 끝-->

</template>

<style scoped lang="scss">
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
}
</style>
