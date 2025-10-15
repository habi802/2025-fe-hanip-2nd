<script setup>
import {ref , reactive,  onMounted , computed,watch } from 'vue';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");
const now = dayjs();

//dayjs로 날짜 포맷
const formatDate = (date) => {
  if (!date) return "----.--.--";
  return dayjs(date).format("YYYY.MM.DD");
};

// 에밋정의
const emit = defineEmits(["update-date"]);

const updateDate = () => {
  emit("update-date", {
      selectedChartOption: selectedChartOption.value,
      startDate:  dayjs(selectedDate.startDate).format("YYYY-MM-DD"),
      endDate:  dayjs(selectedDate.endDate).format("YYYY-MM-DD")
    })};


// 달력토글함수
const showDatePicker = ref(false);
const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};

// 날짜 조회 필터
const selectedLabel = ref("");
const selectedDate = reactive({
  startDate: "",
  endDate: "",
});

const dateOptions = ['연간', '월간', '주간' , '오늘'];
const selectedChartOption = ref(dateOptions[1]);  //기본값 : 한달

//날짜 필터 선택 시 날짜 전달
const selectRange = (range) => {
  selectedChartOption.value = range;
  const startDate = now;
  const endDate = now;// 기본:현재


  switch (range) {
    case dateOptions[3]:
    console.log("오늘")
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



// 직접 날짜 선택 후 적용
const applyCustomRange = () => {
  if (!selectedDate.startDate || !selectedDate.endDate) {
    alert("시작일과 종료일을 모두 선택해주세요.");
    return;
  }
  if (dayjs(selectedDate.startDate).isAfter(selectedDate.endDate)) {
    alert("종료일이 시작일보다 작을 수 없습니다.");
    return;
  }
  if (dayjs(selectedDate.startDate).isAfter(dayjs())) {
    alert("시작일 및 종료일은 오늘보다 클 수 없습니다.");
    return;
  }

  //직접입력 상태로 전환
  selectedLabel.value = "직접입력";
  selectedChartOption.value = "직접입력";

  showDatePicker.value = false;

  //부모로 즉시 emit
  updateDate();
};


onMounted(async () => {
  // 기본값 월간으로 셋팅
  selectRange("월간");
});



</script>

<template>
  <!-- ✅ 수정됨: 기존 드롭다운 + 커스텀 날짜 설정 통합 -->
  <div class="date-option dropdown" ref="orderDetail">
    <!-- 조회 기간 선택 버튼 -->
    <button class="date-filter white-card" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" >
      <img src="/src/imgs/owner/Icon_조회기간설정2.svg" alt="캘린더아이콘" />
      <!-- ✅ 수정됨: 선택된 라벨 표시 -->
      <div >
        <span>{{ selectedLabel || "조회 기간 선택" }}</span>
        <span v-if="selectedLabel === '직접입력'" style="font-size: 12px; color: #838383; font-weight: 300;">
          {{ formatDate(selectedDate.startDate) }} ~ {{ formatDate(selectedDate.endDate) }}
        </span>
      </div>
      <img src="/src/imgs/owner/Icon_목록단추.svg" alt="목록단추" />
    </button>

    <!-- 드롭다운 메뉴-->
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
      <!-- 기본 날짜 옵션 -->
      <li v-for="(op, idx) in dateOptions" :key="idx">
        <button class="dropdown-item" @click="selectRange(op)">
          {{ op }}
        </button>
      </li>

      <li class="dropdown-divider"></li>

      <!--커스텀 날짜 설정 영역 -->
      <li class="dropdown-item custom-range">
        <div class="date-picker-title">
          <div class="title-text"  @click.stop="toggleDatePicker">
            <span style="font-size: 16px; font-weight: 600;">직접입력</span>
            <span style="font-size: 12px; color: #838383; font-weight: 300;">
              {{ formatDate(selectedDate.startDate) }} ~ {{ formatDate(selectedDate.endDate) }}
            </span>
          </div>
          <img src="/src/imgs/owner/Icon_목록단추.svg" alt="달력 열기" title="달력 열기" style="cursor: pointer;" @click.stop="toggleDatePicker"/>
        </div>
        <!--달력 팝업 -->
        <transition name="fade">
          <div v-if="showDatePicker" class="date-picker-popup">
            <label>
              시작일
              <input type="date" v-model="selectedDate.startDate" />
            </label>
            <label>
              종료일
              <input type="date" v-model="selectedDate.endDate" />
            </label>
            <button class="btn-confirm" @click="applyCustomRange">적용</button>
          </div>
        </transition>
      </li>
    </ul>
  </div>
</template>



<style scoped scss="lang">
.date-filter{
  position: relative;
  border-radius: 15px;
  box-shadow: 2px 2px 5px 1px  #c6c6c6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  height: 90px;
  padding: 15px 30px;
  
  span {
    font-size: 1.2rem;
    text-align: left;
  
  }
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
      transform: translateY(-1px);
  }


.date-picker-popup {
  position: absolute;
  width: 100%;
  top: 93%;
  right: 0;
  z-index: 10;
  padding: 15px;
  margin-top: 8px;
  border-radius: 15px;
  box-shadow: 2px 2px 5px #ccc;
  border: none;
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

.dropdown-menu{
  width: 100%;
  border: none;
  border-radius: var(--card-lg-radius);
  box-shadow: var(--card-shadow);
}

.date-option {
  position: relative;
}

.date-picker-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.title-text {
  display: flex;
  flex-direction: column;
}

.date-picker-popup {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-picker-popup input {
  font-size: 13px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-confirm {
  margin-top: 6px;
  padding: 6px 10px;
  background-color: #333;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>