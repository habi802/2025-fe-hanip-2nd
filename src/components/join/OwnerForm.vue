<script setup>
import { ref, reactive, watch } from "vue";
import { nextTick } from "vue";
// 부모에서 내려주는 데이터
const props = defineProps({
  form: Object, // 공용 입력 값
  errors: Object, // 유효성 검사 에러 메시지
  owner: Object,
});
// 부모로 이벤트 전달
const emit = defineEmits(["update:form", "update:errors", "addressSearch", "update:owner"]);

// readonly props를 직접 수정할 수 없으므로 localOwner에 복사
const localOwner = reactive({
  ownerName: props.owner?.ownerName ?? "",
  storeName: props.owner?.storeName ?? "",
  postcode: props.owner?.postcode ?? "",
  address: props.owner?.address ?? "",
  addressDetail: props.owner?.addressDetail ?? "",
  ownerPhone1: props.owner?.ownerPhone1 ?? "010",
  ownerPhone2: props.owner?.ownerPhone2 ?? "",
  ownerPhone3: props.owner?.ownerPhone3 ?? "",
  storePhone1: props.owner?.storePhone1 ?? "02",
  storePhone2: props.owner?.storePhone2 ?? "",
  storePhone3: props.owner?.storePhone3 ?? "",
  businessNumber: props.owner?.businessNumber ?? "",
  openDate: props.owner?.openDate ?? "",
  category: Array.isArray(props.owner?.category) ? props.owner.category : [],
  businessFile: props.owner?.businessFile ?? props.owner?.licensePath ?? null,
  imagePath: props.owner?.imagePath ?? null,
});
console.log("localOwner 초기값:", localOwner.storeName, localOwner.addressDetail);
// 부모 form, state.owner 초기값 반영
nextTick(() => {
  updateParent(); // 부모 form 업데이트
  // 기존
  emit("update:owner", { ...localOwner });
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
  updateParent(); // 부모 form 업데이트
  emit("update:owner", { ...localOwner }); // 부모 state.owner 동기화
}
function clearError(field) {
  emit("update:errors", { ...props.errors, [field]: "" });
}
// 주소 검색
function handleAddressSearch() {
  emit("addressSearch");
}
// 부모 owner 변경 시 localOwner 동기화
watch(
  () => props.owner,
  (newVal) => {
    if (newVal.postcode !== undefined) {
      // 주소만 동기화, 기존 localOwner 값 유지
      localOwner.postcode = newVal.postcode ?? localOwner.postcode;
      localOwner.address = newVal.address ?? localOwner.address;
      localOwner.addressDetail = newVal.addressDetail ?? localOwner.addressDetail;
    }
  },
  { deep: true, immediate: true }
);
// 부모 form 업데이트 함수
function updateParent() {
  emit("update:form", getFormFromLocal());
}
//localOwner → 부모 form 변환
function getFormFromLocal() {
  return {
    ...props.form,
    storeJoinReq: {
      name: localOwner.storeName,
      comment: "",
      businessNumber: localOwner.businessNumber,
      licensePath: localOwner.businessFile,
      imagePath: localOwner.imagePath,
      postcode: localOwner.postcode,
      address: localOwner.address,
      addressDetail: localOwner.addressDetail,
      tel: `${localOwner.storePhone1}-${localOwner.storePhone2}-${localOwner.storePhone3}`,
      ownerName: localOwner.ownerName,
      openDate: localOwner.openDate,
      enumStoreCategory: localOwner.category,
    },
  };
}

// 주소 검색 결과 세팅
function setAddress(postcode, roadAddress) {
  localOwner.postcode = postcode;
  localOwner.address = roadAddress;
  updateParent();
  emit("update:owner", { ...localOwner });
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
  emit("update:owner", { ...localOwner });

  if (value.length === 4 && nextRef) {
    nextTick(() => nextRef.focus());
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
  emit("update:owner", { ...localOwner }); // ✅ state.owner 동기화
}

// 유효성 검사
function validateBusinessNumber() {
  if (!/^\d{10}$/.test(localOwner.businessNumber)) {
    emit("update:errors", {
      ...props.errors,
      businessNumber: "사업자 등록번호 10자리 숫자로 입력해주세요.",
    });
  }
}

function validateopenDate() {
  if (!localOwner.openDate) {
    emit("update:errors", { ...props.errors, openDate: "개업일을 선택해주세요." });
  } else {
    emit("update:errors", { ...props.errors, openDate: "" });
  }
}

function validateAddress() {
  if (!localOwner.address || !localOwner.addressDetail) {
    emit("update:errors", { ...props.errors, address: "주소를 모두 입력해주세요." });
  }
}

// 사업자 등록증 업로드
const fileInput = ref(null);
const selectedFile = ref(localOwner.businessFile || null);
const previewUrl = ref(localOwner.imagePath || null);

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
  emit("update:owner", { ...localOwner }); // state.owner 동기화
  console.log(localOwner.businessFile.name); // 업로드한 파일 이름
  console.log(localOwner.businessFile.size); // 파일 크기
}

function triggerFileInput() {
  fileInput.value?.click();
}

// 카테고리 목록 (필요에 따라 추가/수정 가능)
const categories = [
  { value: "KOREAN", label: "한식" },
  { value: "CHINESE", label: "중식" },
  { value: "JAPANESE", label: "일식" },
  { value: "WESTERN", label: "양식" },
  { value: "DESSERT", label: "디저트" },
  { value: "SNACK", label: "분식" },
  { value: "FAST", label: "패스트푸드" },
  { value: "ASIAN", label: "아시안" },
  { value: "CHICKEN", label: "치킨" },
  { value: "PIZZA", label: "피자" },
  { value: "NIGHT", label: "야식" },
];



// 셀렉트에서 카테고리 선택
function onCategorySelect(e) {
  const category = e.target.value;
  if (!category) return;

  if (localOwner.category.includes(category)) {
    showModal("이미 선택된 카테고리입니다.");
    return;
  }
  if (localOwner.category.length >= 3) {
    showModal("카테고리는 최대 3개까지 선택할 수 있습니다.");
    return;
  }
  localOwner.category.push(category);
  updateParent();
  e.target.value = "";
}

function removeCategory(index) {
  localOwner.category.splice(index, 1);
  updateParent();
}
// 개업년월 감시
watch(
  () => localOwner.openDate,
  (newVal) => {
    console.log("개업년월(openDate) 변경:", newVal);
  }
);

// 카테고리 배열 감시
watch(
  () => localOwner.category,
  (newVal) => {
    console.log("선택된 카테고리(category) 변경:", newVal);
  },
  { deep: true } // 배열 내부 변경도 감시
);
// 모달창 함수
const showModal = (message) => {
  const modalBody = document.getElementById("alertModalBody");
  if (modalBody) modalBody.textContent = message;

  const modal = new bootstrap.Modal(document.getElementById("alertModal"));
  modal.show();
};
// 카테고리와 날짜 변경 감시
watch(
  () => localOwner.openDate,
  (v) => console.log("개업년월(openDate):", v)
);
watch(
  () => localOwner.category,
  (v) => console.log("선택된 카테고리:", v),
  { deep: true }
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
        <input type="text" :value="localOwner.businessNumber" maxlength="10" @input="handleBusinessNumberInput"
          @blur="validateBusinessNumber" :class="{ invalid: errors.businessNumber }"
          placeholder="사업자 등록번호 10자리를 입력해 주세요" />
        <!-- <button type="button">등록</button> -->
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
      <input type="date" :value="localOwner.openDate" @input="updateField('openDate', $event.target.value)"
        @blur="validateopenDate" placeholder="ex) 2025.09.01" />
    </div>
    <p v-if="errors.openDate" class="error-msg">{{ errors.openDate }}</p>
    <div class="sevLine"></div>

    <!-- 대표자 이름 -->
    <div class="form-group">
      <div class="sortation">
        <span>*</span>
        <p>대표자 이름</p>
      </div>
      <input type="text" :value="localOwner.ownerName" @input="(e) => updateField('ownerName', e.target.value)"
        @focus="() => clearError('ownerName')" />
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
          <input type="text" :value="localOwner.postcode" placeholder="우편번호" readonly />
          <button @click="handleAddressSearch" type="button">주소검색</button>
        </div>
        <input type="text" :value="localOwner.address" placeholder="기본주소" readonly class="full-width" />
        <input type="text" v-model="localOwner.addressDetail" @blur="validateAddress" @input="
          (e) => {
            updateField('addressDetail', e.target.value);
            if (errors.address) emit('update:errors', { ...errors, address: '' });
          }
        " class="full-width" placeholder="상세주소" />
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
        <select :value="localOwner.storePhone1" @change="(e) => updateField('storePhone1', e.target.value)">
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
        <input type="text" maxlength="4" :value="localOwner.storePhone2"
          @input="(e) => handlePhoneInput(e, 'storePhone2')" :class="{ invalid: errors.storePhone2 }" />
        <input type="text" maxlength="4" :value="localOwner.storePhone3"
          @input="(e) => handlePhoneInput(e, 'storePhone3')" :class="{ invalid: errors.storePhone3 }" />
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
        <select :value="localOwner.ownerPhone1" @change="(e) => updateField('ownerPhone1', e.target.value)">
          <option>010</option>
          <option>016</option>
          <option>017</option>
          <option>018</option>
          <option>019</option>
        </select>
        <input type="text" maxlength="4" :value="localOwner.ownerPhone2"
          @input="(e) => handlePhoneInput(e, 'ownerPhone2')" :class="{ invalid: errors.ownerPhone2 }" />
        <input type="text" maxlength="4" :value="localOwner.ownerPhone3"
          @input="(e) => handlePhoneInput(e, 'ownerPhone3')" :class="{ invalid: errors.ownerPhone3 }" />
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
        <input type="file" ref="fileInput" @change="onFileChange" accept="image/*,.pdf" style="display: none" />
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
        <input type="text" v-model="localOwner.storeName" @input="(e) => updateField('storeName', e.target.value)"
          placeholder="가게 이름 입력" />
        <!-- 카테고리 선택 -->
        <select @change="onCategorySelect($event)">
          <option value="" disabled selected>카테고리 선택</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>

        <!-- 선택된 카테고리 표시 -->
        <div class="selected-categories">
          <span v-for="(cat, index) in localOwner.category" :key="cat" class="category-item">
            {{categories.find((c) => c.value === cat)?.label || cat}}
            <button type="button" @click="removeCategory(index)">x</button>
          </span>
        </div>
        <li> 카테고리는 최대 3개까지 선택 가능합니다. </li>
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

// 모달 버튼 전용 스타일
#alertModal .btn {
  margin: 0;
  /* 불필요한 상하 여백 제거 */
  width: auto;
  /* 필요 시 조정 */
  padding: 0.5rem 1rem;
  /* 버튼 크기 조정 */
}
</style>
