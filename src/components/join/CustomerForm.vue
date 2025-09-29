<script setup>
import { reactive, watch, nextTick } from "vue";

const props = defineProps({
  form: Object, // state.form 전달
  errors: Object, // state.errors 전달
  addresses: Array,
});

// 부모로 이벤트 전달
const emit = defineEmits(["update:form", "update:errors", "addressSearch"]);

// readonly props를 직접 수정할 수 없으므로 localForm에 복사
const localForm = reactive({
  name: props.form.name ?? "",
  postcode: props.form.postcode ?? "",
  address: props.form.address ?? "",
  addressDetail: props.form.addressDetail ?? "",
  phone1: props.form.phone1 ?? "010", // 기본값 010
  phone2: props.form.phone2 ?? "",
  phone3: props.form.phone3 ?? "",
});

// input 변경 시 localForm 업데이트 + 부모 emit
function updateField(field, value) {
  if (["phone1", "phone2", "phone3"].includes(field)) {
    emit("update:form", {
      ...props.form,
      phone: { ...props.form.phone, [field]: value },
    });
  } else {
    emit("update:form", { ...props.form, [field]: value });
  }
}

// 에러 초기화 함수
function clearError(field) {
  emit("update:errors", { ...props.errors, [field]: "" });
}

// 주소 검색 버튼 클릭 시 부모 이벤트 호출
function handleAddressSearch() {
  emit("addressSearch");
}

// 부모 form이 변경되면 localForm 동기화
watch(
  () => props.form,
  (newVal) => {
    Object.assign(localForm, {
      name: newVal.name ?? "",
      postcode: newVal.postcode ?? "",
      address: newVal.address ?? "",
      addressDetail: newVal.addressDetail ?? "",
      phone1: newVal.phone?.phone1 ?? "010",
      phone2: newVal.phone?.phone2 ?? "",
      phone3: newVal.phone?.phone3 ?? "",
    });
  },
  { deep: true }
);

function handlePhoneInput(event, field) {
  let value = event.target.value.replace(/\D/g, ""); // 숫자만
  if (value.length > 4) value = value.slice(0, 4);
  // localForm 업데이트
  localForm[field] = value;
  // 부모 form으로 emit
  emit("update:form", {
    ...props.form,
    phone: {
      ...props.form.phone,
      [field]: value,
    },
  });
  // 입력 중 실시간 유효성 검사
  validatePhone(field);
}

function validatePhone(field) {
  let phone = { ...localForm }; // localForm에서 가져오기

  if (field === "phone2" || field === "phone3") {
    const value = localForm[field];
    let errorMsg = "";
    if (!value) errorMsg = "전화번호를 입력해주세요.";
    else if (!/^\d{3,4}$/.test(value)) errorMsg = "전화번호 형식이 올바르지 않습니다.";

    emit("update:errors", {
      ...props.errors,
      [field]: errorMsg,
    });
  }
}
</script>

<template>
  <div class="customer-form">
    <!-- 이름 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>이름</p>
      </div>
      <input type="text" :value="localForm.name" @input="(e) => updateField('name', e.target.value)"
        @focus="() => clearError('name')" />
    </div>
    <div class="sevLine"></div>

    <!-- 주소 부분 -->
    <div class="form-group address-group">
      <div class="sortation">
        <span>*</span>
        <p>주소</p>
      </div>
      <div class="address-box">
        <!-- 1줄: 우편번호 + 주소검색 -->
        <div class="address-row">
          <input type="text" v-model="addresses[0].postcode" placeholder="우편번호" readonly />
          <button @click="handleAddressSearch" type="button">주소검색</button>
        </div>

        <!-- 2줄: 기본주소 -->
        <input type="text" v-model="addresses[0].address" placeholder="기본주소" readonly class="full-width" />

        <!-- 3줄: 상세주소 -->
        <input type="text" v-model="addresses[0].addressDetail" placeholder="상세주소"
          @input="(e) => updateField('addressDetail', e.target.value)" class="full-width" />
      </div>
    </div>
    <div class="sevLine"></div>

    <!-- 전화번호 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>전화번호</p>
      </div>
      <div class="phone-input">
        <select :value="localForm.phone1" @change="(e) => updateField('phone1', e.target.value)">
          <option>010</option>
          <option>016</option>
          <option>017</option>
          <option>018</option>
          <option>019</option>
        </select>
        <input type="text" maxlength="4" :value="localForm.phone2" @input="(e) => handlePhoneInput(e, 'phone2')"
          :class="{ invalid: errors.phone2 }" />
        <input type="text" maxlength="4" :value="localForm.phone3" @input="(e) => handlePhoneInput(e, 'phone3')"
          :class="{ invalid: errors.phone3 }" />
      </div>
    </div>
    <p class="error-msg" v-if="errors.phone2 || errors.phone3">
      {{ errors.phone2 || errors.phone3 }}
    </p>
    <div class="sevLine"></div>
  </div>
</template>

<style scoped lang="scss">
// 기본 폰트
* {
  box-sizing: border-box;
  font-family: "Pretendard-Regular";
}

// 섹션 구분선
.sevLine {
  width: 1130px;
  border-bottom: 0.5px solid #c8c8c8;
  margin: 10px 0;
}

// 에러 메시지
.error-msg {
  color: #ff6666;
  font-size: 15px;
  margin-left: 300px; // sortation 너비와 맞춤
  margin-top: 5px;
  margin-bottom: 5px;
}

// 구분 글씨
.sortation {
  display: inline-flex; // 옆으로 나란히
  align-items: center; // 세로 정렬 맞추기
  gap: 0;
  margin-left: 40px; // 사이 간격 제거
  width: 255px;
  height: 50px;

  span {
    color: #ff6666; // * 강조 색상
    margin-right: 10px; // 살짝만 띄우고 싶으면
  }

  p {
    font-size: 1rem;
    color: #000;
    margin-top: 10px;
  }
}

// form-group 레이아웃
.form-group {
  display: flex;
  align-items: flex-start; // 기본 input 위쪽 맞춤
  margin-bottom: 10px;

  input,
  select {
    width: 621px;
    height: 50px;
    padding: 0 12px;
    font-size: 1rem;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    box-sizing: border-box;
  }

  input[readonly] {
    background-color: #f5f5f5;
    cursor: default;
    pointer-events: none;
    color: #7d7d7d;
  }

  button {
    height: 50px;
    padding: 0 12px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #ff6666;
    background-color: #fff;
    color: #ff6666;
    font-weight: 600;

    &:hover {
      background-color: #ffe5e5;
    }
  }

  // 전화번호
  .phone-input {
    display: flex;
    gap: 10px;

    select,
    input {
      width: 200px; // 각각 고정
    }
  }
}

// 주소 그룹만 레이아웃 별도 적용
.address-group {
  display: flex;
  //flex-direction: column; // 세로 배치
  flex-direction: column;
  gap: 10px;

  .sortation {
    gap: 10px;
    margin-top: 75px;
    margin-bottom: -130px;
  }

  .address-box {
    margin-left: 55px;
  }

  /* 1줄: 우편번호 + 버튼 */
  .address-row {
    display: flex;
    gap: 10px;
    margin-left: 240px; // sortation 너비 맞춤

    input {
      width: 494px;
      height: 50px;
    }

    button {
      width: 115px;
      height: 50px;
      flex-shrink: 0;
      border: 1px solid #ff6666;
      background-color: #fff;
      color: #ff6666;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background-color: #ffe5e5;
      }
    }
  }

  /* 2,3줄: 기본주소, 상세주소 */
  input.full-width {
    display: block; // 세로로 쌓이게
    width: 621px;
    margin-left: 240px; // sortation 너비 맞춤
    height: 50px;
    margin-top: 10px;
  }
}
</style>
