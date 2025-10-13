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

const dateOptions = ['연간', '월간', '주간' , '일간', "직접선택"];
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
    default : 
      selectedDate.startDate = startDate;
      selectedDate.endDate = endDate;
    break;
  }
};


onMounted(async () => {
  // 기본값 월간으로 셋팅
  selectRange("월간");
});




// 임시보관용ㅎㅎ;




</script>

<template>
  <!-- ✅ 수정됨: 기존 드롭다운 + 커스텀 날짜 설정 통합 -->
  <div class="date-option dropdown" ref="orderDetail">
    <!-- 조회 기간 선택 버튼 -->
    <button
      class="date-filter"
      type="button"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
    >
      <img src="/src/imgs/owner/Icon_조회기간설정2.svg" alt="캘린더아이콘" />
      <!-- ✅ 수정됨: 선택된 라벨 표시 -->
      <span>{{ selectedLabel || "조회 기간 선택" }}</span>
      <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" />
    </button>

    <!-- ✅ 수정됨: 드롭다운 메뉴 통합 -->
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
      <!-- 기본 날짜 옵션 -->
      <li v-for="(op, idx) in dateOptions" :key="idx">
        <button class="dropdown-item" @click="selectRange(op)">
          {{ op }}
        </button>
      </li>

      <li class="dropdown-divider"></li>

      <!-- ✅ 수정됨: 커스텀 날짜 설정 영역 -->
      <li class="dropdown-item custom-range">
        <div class="date-picker-title">
          <img src="/src/imgs/owner/Icon_조회기간설정.svg" alt="캘린더아이콘" />
          <div class="title-text">
            <span style="font-size: 16px; font-weight: 600;">조회 기간 설정</span>
            <span style="font-size: 12px; color: #838383; font-weight: 300;">
              {{ formatDate(startDate) }} ~ {{ formatDate(endDate) }}
            </span>
          </div>
          <img
            src="/src/imgs/owner/Icon_목록단추.svg"
            alt="달력 열기"
            title="달력 열기"
            style="cursor: pointer;"
            @click.stop="toggleDatePicker"
          />
        </div>

        <!-- ✅ 수정됨: 달력 팝업 -->
        <transition name="fade">
          <div v-if="showDatePicker" class="date-picker-popup">
            <label>
              시작일
              <input type="date" v-model="startDate" />
            </label>
            <label>
              종료일
              <input type="date" v-model="endDate" />
            </label>
            <button class="btn-confirm" @click="applyCustomRange">적용</button>
          </div>
        </transition>
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

.date-filter {
position: relative;

.date-picker-popup {
  position: absolute;
  width: 100%;
  top: 93%;
  right: 0;
  z-index: 10;
  background: #fff;
  padding: 15px;
  margin-top: 8px;
  border-radius: 15px;
  box-shadow: 2px 2px 5px #ccc;
  display: flex;
  gap: 10px;
  justify-content: center;
  width: max-content;

  label {
    display: flex;
    flex-direction: column;
    font-size: 13px;
  }

  input[type="date"] {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
}
}
.date-filter{
background-color: #fff;
border-radius: 15px;
box-shadow: 2px 2px 5px 1px  #c6c6c6;
display: flex;
align-items: center;
justify-content: space-around;
width: 295px;
height: 75px;
padding: 15px 15px;
div{
    span{
        display: block;
        margin-right: 10px;
        line-height: 1.5;
    }
}
img:last-child{
    width: 24px;
    height: 24px;
}
}
</style>