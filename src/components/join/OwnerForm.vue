<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  form: Object,
  owner: Object,
  errors: Object,
});
const emit = defineEmits([
  "update:form",
  "update:owner",
  "update:errors",
  "validateBusinessNumber",
]);

const { form, owner, errors } = props;

// 가게전화 쪼개기
const ownerTel1 = ref("02");
const ownerTel2 = ref("");
const ownerTel3 = ref("");

// 휴대전화 쪼개기
const ownerPhone1 = ref("010");
const ownerPhone2 = ref("");
const ownerPhone3 = ref("");

//  숫자만 입력 허용
const onlyNumberInput = (e) => {
  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
    e.preventDefault();
  }
};

// 전화번호 입력 시 자동 이동
const onOwnerTelInput = (e, current, next) => {
  if (e.target.value.length === 4 && next) {
    const nextInput = e.target
      .closest(".phone-input")
      .querySelector(`input[v-model='${next}']`);
    if (nextInput) nextInput.focus();
  }
};
const onOwnerPhoneInput = (e, current, next) => {
  if (e.target.value.length === 4 && next) {
    const nextInput = e.target
      .closest(".phone-input")
      .querySelector(`input[v-model='${next}']`);
    if (nextInput) nextInput.focus();
  }
};

// 값이 바뀌면 form/owner 갱신
watch([ownerTel1, ownerTel2, ownerTel3], () => {
  form.storePhone = `${ownerTel1.value}-${ownerTel2.value}-${ownerTel3.value}`;
  emit("update:form", form);
});
watch([ownerPhone1, ownerPhone2, ownerPhone3], () => {
  form.phone = `${ownerPhone1.value}-${ownerPhone2.value}-${ownerPhone3.value}`;
  emit("update:form", form);
});

// 사업자 등록번호
const businessNumber = ref(owner.businessNumber);

// 사업자 등록번호 변경 시 부모에게 전달
const onBusinessNumberChange = (e) => {
  businessNumber.value = e.target.value;
  emit("validateBusinessNumber", businessNumber.value); // 부모로 사업자 등록번호 전달
};

// 부모에서 전달받은 에러 메시지 처리
watch(
  () => errors.businessNumber,
  (newValue) => {
    if (newValue) {
      emit("update:errors", { businessNumber: newValue });
    }
  }
);
</script>

<template>
  <div class="owner-form">
    <!-- 기본 정보 (아이디/비밀번호는 공용) -->
    <label class="serveTitle">가게정보</label>
    <div class="titleLine"></div>

    <!-- 사업자 등록번호 -->
    <div class="owner-upload owner-form">
      <div class="sortation">
        <span>*</span>
        <p>사업자 등록번호</p>
      </div>
      <div class="upload-row owner-sigin">
        <input
          type="text"
          v-model="owner.businessNumber"
          @input="onBusinessNumberChange"
          :class="{ invalid: errors.businessNumber }"
          placeholder="사업자 등록번호 10자리를 입력해 주세요"
        />
        <button type="button">등록</button>
        <div class="owner-upload-num">
          <p v-if="errors.businessNumber" class="error-msg owner-up">
            {{ errors.businessNumber }}
          </p>
        </div>
      </div>
    </div>
    <div class="sevLine"></div>

    <!-- 개업년월일 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>개업년월일</p>
      </div>
      <input
        type="text"
        :value="form.name"
        placeholder="ex) 2025.09.01"
        @input="(e) => updateField('name', e.target.value)"
        @focus="() => clearError('name')"
      />
    </div>
    <div class="sevLine"></div>

    <!-- 대표자 이름 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>대표자 이름</p>
      </div>
      <input
        type="text"
        :value="form.name"
        @input="(e) => updateField('name', e.target.value)"
        @focus="() => clearError('name')"
      />
    </div>
    <div class="sevLine"></div>

    <!-- 가게 주소 부분 -->
    <div class="form-group address-group">
      <div class="sortation">
        <span>*</span>
        <p>가게 주소</p>
      </div>
      <div class="address-box">
        <!-- 1줄: 우편번호 + 주소검색 -->
        <div class="address-row">
          <input type="text" :value="form.postcode" placeholder="우편번호" readonly />
          <button @click="$emit('addressSearch')" type="button">주소검색</button>
        </div>

        <!-- 2줄: 기본주소 -->
        <input
          type="text"
          :value="form.address"
          placeholder="기본주소"
          readonly
          class="full-width"
        />

        <!-- 3줄: 상세주소 -->
        <input
          type="text"
          :value="form.addressDetail"
          placeholder="상세주소"
          @input="(e) => updateField('addressDetail', e.target.value)"
          class="full-width"
        />
      </div>
    </div>
    <div class="sevLine"></div>

    <!-- 가게번호 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>가게번호</p>
      </div>
      <div class="phone-input">
        <select
          :value="form.ownerTel1"
          @change="(e) => updateField('ownerTel1', e.target.value)"
        >
          <option>02</option>
          <option>031</option>
          <option>032</option>
          <option>033</option>
          <option>041</option>
          <option>042</option>
          <option>043</option>
          <option>051</option>
          <option>052</option>
          <option>053</option>
          <option>054</option>
          <option>055</option>
          <option>061</option>
          <option>063</option>
          <option>064</option>
          <option>070</option>
        </select>
        <input
          type="text"
          v-model="ownerTel2"
          maxlength="4"
          @input="onOwnerTelInput($event, 'ownerTel2', 'ownerTel3')"
          :class="{ invalid: errors.ownerTel2 }"
          @keydown="onlyNumberInput"
        />
        <input
          type="text"
          v-model="ownerTel3"
          maxlength="4"
          @input="onOwnerTelInput($event, 'ownerTel3')"
          :class="{ invalid: errors.ownerTel3 }"
          @keydown="onlyNumberInput"
        />
      </div>
    </div>
    <p v-if="errors.ownerTel2 || errors.ownerTel3" class="error-msg">
      {{ errors.ownerTel2 || errors.ownerTel3 }}
    </p>
    <div class="sevLine"></div>

    <!-- 전화번호 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>전화번호</p>
      </div>
      <div class="phone-input">
        <select
          :value="form.ownerPhone1"
          @change="(e) => updateField('ownerPhone1', e.target.value)"
        >
          <option>010</option>
          <option>016</option>
          <option>017</option>
          <option>018</option>
          <option>019</option>
        </select>
        <input
          type="text"
          v-model="ownerPhone2"
          maxlength="4"
          @input="onOwnerPhoneInput($event, 'ownerphone2', 'ownerphone3')"
          :class="{ invalid: errors.ownerPhone2 }"
          @keydown="onlyNumberInput"
        />
        <input
          type="text"
          v-model="ownerPhone3"
          maxlength="4"
          @input="onOwnerPhoneInput($event, 'ownerPhone3')"
          :class="{ invalid: errors.ownerPhone3 }"
          @keydown="onlyNumberInput"
        />
      </div>
    </div>
    <p class="error-msg" v-if="errors.ownerPhone2 || errors.ownerPhone3">
      {{ errors.ownerPhone2 || errors.owerPhone3 }}
    </p>
    <div class="sevLine"></div>

    <!-- 사업자 등록증 업로드 -->
    <div class="form-group owner-upload">
      <div class="sortation">
        <span>*</span>
        <p>사업자 등록증</p>
      </div>
      <div class="upload-box">
        <button type="button">업로드</button>
        <li>등록증 전체가 선명하게 촬영된 이미지 또는 PDF 파일을 업로드해야 합니다.</li>
        <li>
          사업자등록상의 대표자명과 가입자 정보가 다를 경우, 추가 인증이 필요합니다.
        </li>
      </div>
    </div>
    <div class="sevLine"></div>

    <!-- 가게 상호명 및 카테고리 -->
    <div class="form-group phone-input-wrap">
      <div class="sortation">
        <span>*</span>
        <p>가게 상호명 및 카테고리</p>
      </div>
      <div class="category-name">
        <div class="phone-input">
          <input
            type="text"
            v-model="owner.name"
            placeholder="가게 상호명"
            @input="() => (errors.ownerName = '')"
          />
          <select v-model="owner.category">
            <option>한식</option>
            <option>일식</option>
            <option>중식</option>
            <option>양식</option>
            <option>아시안</option>
            <option>분식</option>
            <option>카페</option>
            <option>패스트푸드</option>
            <option>치킨</option>
            <option>피자</option>
            <option>야식</option>
          </select>
        </div>
      </div>
    </div>
    <div class="sevLine"></div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: "Pretendard-Regular";
  box-sizing: border-box;
}

// 필수 입력칸입니다
strong {
  font-size: 15px;
  margin-bottom: -10px;
  margin-left: 40px;
  color: #ff6666;
  letter-spacing: 1px;
}

// 메인 구분 선
.titleLine {
  width: 1130px;
  border-bottom: 3px solid #7d7d7d;
  margin-top: 10px;
  margin-bottom: 10px;
}

// 구분 선
.sevLine {
  width: 1130px;
  border-bottom: 0.5px solid #c8c8c8;
  margin-top: 10px;
  margin-bottom: 10px;
}

// 섹션 제목 라벨
label.serveTitle {
  font-size: 20px !important;
  font-weight: 600 !important;
  margin-left: 10px;
  margin-top: 70px;
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

.sortation-address {
  display: inline-flex; // 옆으로 나란히
  margin-left: 40px; // 사이 간격 제거
  width: 205px;
  height: 20px;

  span {
    color: #ff6666;
    margin-right: 10px;
  }
}

// 유효성 검사
input[type="text"],
input[type="password"],
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  transition: border 0.2s ease;
}

input:focus,
select:focus {
  border-color: #ff6666;
  outline: none;
}

input.invalid,
select.invalid {
  box-shadow: 0 0 3px #ff6666(233, 0, 0, 0.3) !important;
  //border-color: #ff6666;
  background-color: #ffe5e5;
}

// 전화번호 에러메세지 정렬
.telNum {
  display: flex;
  margin: 10px 0 -13px 300px;
  color: #ff6666;
  font-size: 15px;
  font-weight: 600;
}

.upload-row {
  display: inline;
  align-items: center;
  gap: 10px; // input과 버튼 사이 간격

  input {
    height: 50px;
    width: 494px;
  }

  button {
    height: 50px;
    width: 110px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #ff6666;
    background-color: #fff;
    color: #ff6666;
    font-weight: 600;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
      background-color: #ffe5e5;
    }
  }
}

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

  button {
    height: 50px;
    width: 117px;
    margin-bottom: 5px;
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

  // 카테고리, 전화번호
  .phone-input {
    display: flex;
    gap: 10px;

    select,
    input {
      width: 200px; // 각각 고정
    }
  }

  .tel-input {
    display: flex;
    gap: 10px;

    select,
    input {
      width: 200px; // 각각 고정
    }
  }

  // 에러 메시지 정렬
  .owner-upload-num {
    margin-left: 255px; // 라벨 기준 들여쓰기
    margin-top: 5px;
  }
}
// 에러 메시지(가게 전호, 전화 번호)
.error-msg {
  color: #ff6666;
  font-size: 15px;
  margin-left: 300px; // sortation 너비와 맞춤
  margin-top: 5px;
  margin-bottom: -5px;
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

// 비활성화
input[readonly] {
  background-color: #f5f5f5;
  cursor: default; // 마우스 커서 변경
  border: 1px solid #ccc; // 기본 테두리 유지
  color: #7d7d7d;
  pointer-events: none;
}
</style>
