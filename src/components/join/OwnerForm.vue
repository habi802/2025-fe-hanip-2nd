<script setup>
import { ref, reactive, watch } from "vue";

// 부모에서 내려주는 데이터
const props = defineProps({
  form: Object, // 공용 입력 값
  errors: Object, // 유효성 검사 에러 메시지
  owner: Object,
});
// 부모로 이벤트 전달
const emit = defineEmits(["update:form", "update:errors", "addressSearch"]);

// readonly props를 직접 수정할 수 없으므로 localForm에 복사
const localOwner = reactive({
  ownerName: props.owner.ownerName ?? "",
  storeName: props.owner.storeName ?? "",
  postcode: props.owner.postcode ?? "",
  address: props.owner.address ?? "",
  addressDetail: props.owner.addressDetail ?? "",
  ownerPhone1: props.owner.ownerPhone1 ?? "010",
  ownerPhone2: props.owner.ownerPhone2 ?? "",
  ownerPhone3: props.owner.ownerPhone3 ?? "",
  storePhone1: props.owner.storePhone1 ?? "02",
  storePhone2: props.owner.storePhone2 ?? "",
  storePhone3: props.owner.storePhone3 ?? "",
  businessNumber: props.owner.businessNumber ?? "",
  openingDate: props.owner.openingDate ?? "",
  category: Array.isArray(props.owner.category) ? props.owner.category : [],
  businessFile: props.owner.businessFile ?? null,
  imagePath: props.owner.imagePath ?? null,
});

// input 변경 시 emit
function updateField(field, value) {
  if (
    [
      "ownerPhone1",
      "ownerPhone2",
      "ownerPhone3",
      "storePhone1",
      "storePhone2",
      "storePhone3",
    ].includes(field)
  ) {
    value = value.replace(/\D/g, "").slice(0, 4);
  }
  localOwner[field] = value;

  if (value && props.errors[field]) {
    emit("update:errors", { ...props.errors, [field]: "" });
  }
  updateParent(); // 반드시 호출
}


// 에러 초기화
function clearError(field) {
  emit("update:errors", { ...props.errors, [field]: "" });
}

// 주소 검색
function handleAddressSearch() {
  emit("addressSearch");
}

// 부모 form 변경 시 localForm 동기화
watch(
  () => props.owner,
  (newVal) => {
    // 여기서 기존에는 Object.assign을 사용했으나, 이제 주소만 동기화
    // 나머지 값은 기존 localOwner 값을 그대로 유지
    if (newVal.postcode !== undefined) {
      localOwner.postcode = newVal.postcode ?? localOwner.postcode;
      localOwner.address = newVal.address ?? localOwner.address;
      localOwner.addressDetail = newVal.addressDetail ?? localOwner.addressDetail;
    }
    // 나머지 값은 덮어쓰지 않음
  },
  { deep: true, immediate: true }
);
// 부모 form 업데이트 함수
function updateParent() {
  emit("update:form", getFormFromLocal());
}
//localForm → 부모 form 변환
function getFormFromLocal() {
  return {
    ...props.form,
    ownerName: localOwner.ownerName,
    storeName: localOwner.storeName,
    postcode: localOwner.postcode,
    address: localOwner.address,
    addressDetail: localOwner.addressDetail,
    businessNumber: localOwner.businessNumber,
    openingDate: localOwner.openingDate,
    category: localOwner.category,
    ownerPhone: {
      phone1: localOwner.ownerPhone1,
      phone2: localOwner.ownerPhone2,
      phone3: localOwner.ownerPhone3,
    },
    storePhone: {
      phone1: localOwner.storePhone1,
      phone2: localOwner.storePhone2,
      phone3: localOwner.storePhone3,
    },
    businessFile: localOwner.businessFile,
    imagePath: localOwner.imagePath,
  };
}
// 주소 검색 결과 세팅
function setAddress(postcode, roadAddress) {
  localOwner.postcode = postcode;
  localOwner.address = roadAddress;
  // 기존 form 전체 유지 + 주소만 업데이트
  emit("update:form", getFormFromLocal());
}

// 숫자만 입력 처리
// 전화번호 input 전용 처리
function handlePhoneInput(e, field, nextRef) {
  let value = e.target.value.replace(/\D/g, "").slice(0, 4);
  localOwner[field] = value;
  if (value && props.errors[field]) {
    emit("update:errors", { ...props.errors, [field]: "" });
  }
  updateParent();

  if (value.length === 4 && nextRef) {
    nextTick(() => {
      nextRef.focus();
    });
  }
}
// 사업자 등록번호 input 처리
function handleBusinessNumberInput(e) {
  let value = e.target.value.replace(/\D/g, "").slice(0, 10);
  localOwner.businessNumber = value;
  if (value && props.errors.businessNumber) {
    emit("update:errors", { ...props.errors, businessNumber: "" });
  }
  updateParent();
}

// 유효성 검사 함수
function validateBusinessNumber() {
  if (!/^\d{10}$/.test(localOwner.businessNumber)) {
    emit("update:errors", {
      ...props.errors,
      businessNumber: "사업자 등록번호 10자리 숫자로 입력해주세요.",
    });
  }
}

function validateOpeningDate() {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(localOwner.openingDate)) {
    emit("update:errors", {
      ...props.errors,
      openingDate: "개업일 형식은 YYYY.MM.DD 입니다.",
    });
  }
}

function validateAddress() {
  if (!localOwner.address || !localOwner.addressDetail) {
    emit("update:errors", { ...props.errors, address: "주소를 모두 입력해주세요." });
  }
}
// 사업자 등록증 업로드
const fileInput = ref(null); // 파일 input 참조
const selectedFile = ref(null); // 선택된 파일
const previewUrl = ref(null); // 이미지 미리보기

// 파일 선택 시 실행
function onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile.value = file;
  localOwner.businessFile = file;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => (previewUrl.value = e.target.result);
    reader.readAsDataURL(file);
  } else {
    previewUrl.value = null;
  }
  updateParent();
}

function triggerFileInput() {
  fileInput.value?.click();
}

// 카테고리 목록 (필요에 따라 추가/수정 가능)
const categoryOptions = [
  "한식",
  "일식",
  "중식",
  "양식",
  "아시안",
  "분식",
  "카페",
  "패스트푸드",
  "치킨",
  "피자",
  "야식",
];
// 셀렉트에서 카테고리 선택
function onCategorySelect(e) {
  const category = e.target.value;
  if (!category) return;

  if (localOwner.category.includes(category)) {
    alert("이미 선택된 카테고리입니다.");
    return;
  }
  if (localOwner.category.length >= 3) {
    alert("카테고리는 최대 3개까지 선택할 수 있습니다.");
    return;
  }
  localOwner.category.push(category);
  updateParent();
  e.target.value = ""; // 선택 후 select 초기화
}
// 선택 삭제
function removeCategory(index) {
  localOwner.category.splice(index, 1);
  updateParent();
}
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
          :value="localOwner.businessNumber"
          maxlength="10"
          @input="handleBusinessNumberInput"
          @blur="validateBusinessNumber"
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
        v-model="localOwner.openingDate"
        @blur="validateOpeningDate"
        placeholder="ex) 2025.09.01"
      />
    </div>
      <p v-if="errors.openingDate" class="error-msg">{{ errors.openingDate }}</p>
    <div class="sevLine"></div>

    <!-- 대표자 이름 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>대표자 이름</p>
      </div>
      <input
        type="text"
        :value="localOwner.ownerName"
        @input="(e) => updateField('ownerName', e.target.value)"
        @focus="() => clearError('ownerName')"
      />
    </div>
    <div class="sevLine"></div>

    <!-- 가게 주소 -->
    <div class="form-group address-group">
      <div class="sortation">
        <span>*</span>
        <p>가게 주소</p>
      </div>
      <div class="address-box">
        <div class="address-row">
          <input
            type="text"
            :value="localOwner.postcode"
            placeholder="우편번호"
            readonly
          />
          <button @click="handleAddressSearch" type="button">주소검색</button>
        </div>
        <input
          type="text"
          :value="localOwner.address"
          placeholder="기본주소"
          readonly
          class="full-width"
        />
        <input
          type="text"
          :value="localOwner.addressDetail"
          @blur="validateAddress"
          @input="(e) => updateField('addressDetail', e.target.value)"
          class="full-width"
          placeholder="상세주소"
        />
      </div>
        <p v-if="errors.address" class="error-msg">{{ errors.address }}</p>
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
          :value="localOwner.storePhone1"
          @change="(e) => updateField('storePhone1', e.target.value)"
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
          maxlength="4"
          :value="localOwner.storePhone2"
          @input="(e) => handlePhoneInput(e, 'storePhone2')"
          :class="{ invalid: errors.storePhone2 }"
        />
        <input
          type="text"
          maxlength="4"
          :value="localOwner.storePhone3"
          @input="(e) => handlePhoneInput(e, 'storePhone3')"
          :class="{ invalid: errors.storePhone3 }"
        />
      </div>
    </div>
    <p v-if="errors.storePhone2 || errors.storePhone3" class="error-msg">
      {{ errors.storePhone2 || errors.storePhone3 }}
    </p>
    <div class="sevLine"></div>

    <!-- 대표자 전화번호 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>전화번호</p>
      </div>
      <div class="phone-input">
        <select
          :value="localOwner.ownerPhone1"
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
          maxlength="4"
          :value="localOwner.ownerPhone2"
          @input="(e) => handlePhoneInput(e, 'ownerPhone2')"
          :class="{ invalid: errors.ownerPhone2 }"
        />
        <input
          type="text"
          maxlength="4"
          :value="localOwner.ownerPhone3"
          @input="(e) => handlePhoneInput(e, 'ownerPhone3')"
          :class="{ invalid: errors.ownerPhone3 }"
        />
      </div>
    </div>
    <p v-if="errors.ownerPhone2 || errors.ownerPhone3" class="error-msg">
      {{ errors.ownerPhone2 || errors.ownerPhone3 }}
    </p>
    <div class="sevLine"></div>

    <!-- 사업자 등록증 업로드 -->
    <div class="form-group owner-upload">
      <div class="sortation">
        <span>*</span>
        <p>사업자 등록증</p>
      </div>
      <div class="upload-box">
        <!-- 숨겨진 파일 input -->
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          accept="image/*,.pdf"
          style="display: none"
        />
        <!-- 업로드 버튼 -->
        <button type="button" @click="triggerFileInput">업로드</button>

        <!-- 파일명 표시 -->
        <span v-if="selectedFile" class="file-name">
          {{ selectedFile.name }}
        </span>

        <!-- 이미지 미리보기 -->
        <div v-if="previewUrl" class="preview">
          <!-- <img :src="previewUrl" alt="미리보기" /> -->
        </div>

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
        <input
          type="text"
          :value="localOwner.storeName"
          @input="(e) => updateField('storeName', e.target.value)"
          placeholder="가게 이름 입력"
        />
        <!-- 카테고리 선택 -->
        <select @change="onCategorySelect($event)">
          <option value="" disabled selected>카테고리 선택</option>
          <option v-for="cat in categoryOptions" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <!-- 선택된 카테고리 표시 -->
        <div class="selected-categories">
          <span
            v-for="(cat, index) in localOwner.category"
            :key="cat"
            class="category-item"
          >
            {{ cat }}
            <button type="button" @click="removeCategory(index)">x</button>
          </span>
        </div>
        <p>최대 3개까지 선택 가능합니다.</p>
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
// 업로드 파일명
.file-name {
  margin-left: 25px;
  padding: 10px 16px;
  border: 1px solid #c8c8c8;
  border-radius: 10px;
  color: #555;
}
// 업로드 주의사항
li {
  color: #555;
  margin-left: 20px;
  margin-top: 5px;
  font-size: 14px;
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
  // 유효성 검사 스타일
  input.invalid,
  select.invalid {
    box-shadow: 0 0 3px #ff6666(233, 0, 0, 0.3) !important;
    background-color: #ffe5e5;
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

// 가게 상호명 카테고리
.category-name {
  display: inline;
  gap: 20px;

  input[type="text"] {
    width: 300px;
    height: 50px;
    padding: 0 12px;
    font-size: 1rem;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    box-sizing: border-box;
  }

  select {
    width: 250px;
    height: 50px;
    padding: 0 12px;
    margin-left: 20px;
    border-radius: 8px;
    border: 1px solid #c8c8c8;
    font-size: 1rem;
    cursor: pointer;
  }

  .selected-categories {
    display: flex;
    flex-wrap: wrap; // 여러개 선택 시 줄바꿈
    gap: 8px;
    margin-top: 5px;

    .category-item {
      margin: 10px 0;
      height: 40px;
      display: flex;
      align-items: center;
      gap: 5px;
      color: #ff6666;
      padding: 0px 10px;
      border-radius: 10px;
      font-size: 0.9rem;
      border: 1px solid #ff6666;

      button {
        width: 10px;
        border: none;
        background: transparent;
        color: #ff6666;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }

  p {
    font-size: 0.85rem;
    color: #555;
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
