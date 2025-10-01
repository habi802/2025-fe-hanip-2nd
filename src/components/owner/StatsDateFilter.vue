<script setup>
import {ref , reactive,  onMounted , computed,watch } from 'vue';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");
const now = dayjs();

const emit = defineEmits(["update-date"]);



// 날짜 조회 필터
const selectedLabel = ref("");
const selectedDate = reactive({
  startDate: "",
  endDate: "",
});

const dateOptions = ['연간', '월간', '주간' , '일간'];
const selectedChartOption = ref(dateOptions[1]);  //기본값 : 한달

//날짜 필터 선택 시 날짜 전달
const selectRange = (range) => {
  selectedChartOption.value = range;
  const startDate = now;
  const endDate = now;// 기본:현재

  const updateDate = () => {emit("update-date", {
        selectedChartOption: selectedChartOption.value,
        startDate: selectedDate.startDate.format("YYYY-MM-DD"),
        endDate: selectedDate.endDate.format("YYYY-MM-DD")
      })};

  switch (range) {
    case dateOptions[3]:
    console.log("일간")
      selectedLabel.value = dateOptions[3];
      selectedDate.startDate = startDate;
      selectedDate.endDate = endDate;
      console.log(selectedDate.startDate , selectedDate.endDate )

      updateDate();

      break;


    case dateOptions[2]:
    console.log("주간")
      selectedLabel.value = dateOptions[2];
      //startDate를 7일 앞으로
      selectedDate.startDate = now.subtract(1, "week");;
      selectedDate.endDate = endDate;
      
      updateDate();

      break;


    case dateOptions[1]:
    console.log("월간")
      selectedLabel.value = dateOptions[1];
      //startDate를 1달 앞으로
      selectedDate.startDate = now.subtract(1, "month");
      selectedDate.endDate = endDate;
      console.log(selectedDate.startDate , selectedDate.endDate )

      updateDate();

      break;



    case dateOptions[0]:
      console.log("연간")
      selectedLabel.value = dateOptions[0];
      //startDate를 1달 앞으로
      selectedDate.startDate = now.subtract(1, "year");
      selectedDate.endDate = endDate;
      console.log(selectedDate.startDate , selectedDate.endDate )

      updateDate();

      break;
  }
};


onMounted(async () => {
  // 기본값 월간으로 셋팅
  selectRange("월간");
});

</script>

<template>
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
</template>

<style scoped scss="lang">
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
</style>