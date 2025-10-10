<script setup>
import { reactive, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { join, findId } from "@/services/userService.js";
import CustomerForm from "@/components/join/CustomerForm.vue";
import OwnerForm from "@/components/join/OwnerForm.vue";
import axios from "axios";

const router = useRouter();
const memberType = ref("customer"); // 회원 구분 상태
const confirmPw = ref(""); // 비밀번호 확인

// 유효성 검사 에러 메세지
const errors = reactive({
  loginId: "",
  loginPw: "",
  confirmPw: "",
  email: "",
  name: "",
  address: "",
  phone2: "",
  phone3: "",
  businessNumber: "",
  storePhone2: "",
  storePhone3: "",
  ownerPhone2: "",
  ownerPhone3: "",
  openDate: "",
});

// form 데이터 상태 관리
const state = reactive({
  form: {
    name: "",
    loginId: "",
    loginPw: "",
    phone: {
      phone1: "010",
      phone2: "",
      phone3: "",
    },
    email: "",
    role: "", // USER / OWNER
  },
  addresses: [
    {
      title: "기본 주소",
      isMain: 1,
      postcode: "",
      address: "",
      addressDetail: "",
    },
  ],
  owner: {
    // 업주 가입 시 필요한 데이터
    name: "",
    comment: "",
    businessNumber: "",
    licensePath: "",
    imagePath: "",
    postcode: "",
    address: "",
    addressDetail: "",
    storePhone1: "02",
    storePhone2: "",
    storePhone3: "",
    ownerPhone1: "010",
    ownerPhone2: "",
    ownerPhone3: "",
    ownerName: "",
    openDate: "",
    category: [],
  },
  profilePic: null, // 프로필 이미지
});

// 아이디 중복 검사 유효성 코드
const checkResult = ref("");

// 아이디 중복 체크 버튼 눌렀는지 여부
const isIdChecked = ref(false);

// 유효성 검사 함수들
const validateLoginId = () => {
  const regex = /^[a-z0-9]{4,16}$/;
  errors.loginId = regex.test(state.form.loginId)
    ? ""
    : "아이디는 영문 소문자+숫자 4~16자여야 합니다.";
};

const validatePassword = () => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  errors.loginPw = regex.test(state.form.loginPw)
    ? ""
    : "비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.";
};

const validateConfirmPw = () => {
  errors.confirmPw =
    confirmPw.value === state.form.loginPw ? "" : "비밀번호가 일치하지 않습니다.";
};

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = regex.test(state.form.email) ? "" : "유효한 이메일 주소를 입력하세요.";
};
// // 이름
// const validateName = () => {
//   errors.name = state.form.name.trim().length >= 2 ? "" : "이름은 2자 이상이어야 합니다.";
// };

// 주소
const validateAddress = () => {
  // 고객/업주 분기
  const rawValue =
    memberType.value === "customer" ? state.addresses[0]?.address : state.owner.address;
  errors.address = (rawValue ?? "").trim() ? "" : "주소를 입력해주세요.";
};

// 업주 개업일 검사
const validateOpenDate = () => {
  errors.openDate = state.owner.openDate ? "" : "개업일을 선택해주세요.";
};

// 일반 고객 번호
const validatePhone = () => {
  const middleRegex = /^\d{3,4}$/;
  const lastRegex = /^\d{4}$/;
  errors.phone2 = middleRegex.test(state.form.phone.phone2)
    ? ""
    : "전화번호 다시 한번 확인해주세요.";
  errors.phone3 = lastRegex.test(state.form.phone.phone3)
    ? ""
    : "전화번호 다시 한번 확인해주세요.";
};

// 가게 전화
const validateOwnerTel = () => {
  const middleRegex = /^\d{3,4}$/;
  const lastRegex = /^\d{4}$/;
  errors.storePhone2 = middleRegex.test(state.owner.storePhone2)
    ? ""
    : "전화번호 다시 한번 확인해주세요.";
  errors.storePhone3 = lastRegex.test(state.owner.storePhone3)
    ? ""
    : "전화번호 다시 한번 확인해주세요.";
};

// 오너 개인 전화
const validateOwnerPhone = () => {
  const middleRegex = /^\d{3,4}$/;
  const lastRegex = /^\d{4}$/;
  errors.ownerPhone2 = middleRegex.test(state.owner.ownerPhone2)
    ? ""
    : "전화번호 다시 한번 확인해주세요.";
  errors.ownerPhone3 = lastRegex.test(state.owner.ownerPhone3)
    ? ""
    : "전화번호 다시 한번 확인해주세요.";
};

// 사업자 등록번호
const validateBusinessNumber = () => {
  const regex = /^[0-9]{10}$/;
  errors.businessNumber = regex.test(state.owner.businessNumber)
    ? "" // 조건 만족 → 메시지 제거
    : "사업자 등록번호는 10자리 숫자여야 합니다.";
};

// 제출 전 모든 필드 유효성 검사
const validateForm = () => {
  validateLoginId();
  validatePassword();
  validateConfirmPw();
  validateEmail();
  validateAddress();
  if (memberType.value === "customer") validatePhone();
  else {
    validateOwnerTel();
    validateOwnerPhone();
    validateBusinessNumber();
    validateOpenDate();
  }
  console.log("errors:", JSON.stringify(errors));
  return Object.values(errors).every((msg) => msg === "");
};
// 업주 input 시 에러 초기화
function handleOwnerInput(field) {
  // OwnerForm에서 필드명 전달받아 해당 에러 제거
  if (errors[field] !== undefined) {
    errors[field] = "";
  }
}

// 전화번호 입력 (숫자만 + 유효성 검사)
function handlePhoneInput(e, field, type = "customer") {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 4) v = v.slice(0, 4);
  if (type === "customer") {
    state.form.phone[field] = v;
    validatePhone();
  } else {
    state.owner[field] = v;
    if (field.includes("store")) validateOwnerTel();
    else validateOwnerPhone();
  }
}
// 사업자 등록번호 입력 처리
function handleBusinessNumberInput(e) {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 10) v = v.slice(0, 10);
  state.owner.businessNumber = v;
  validateBusinessNumber();
}
// 숫자 외 입력 차단
function onlyNumberInput(e) {
  const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
}
const addressSearch = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      if (memberType.value === "customer") {
        // 고객 주소만 수정
        state.addresses[0].postcode = data.zonecode;
        state.addresses[0].address = data.roadAddress;
      } else {
        // 오너 주소만 수정
        state.owner.postcode = data.zonecode;
        state.owner.address = data.roadAddress;
      } // 상세주소는 유지
      nextTick(() => {
        document.querySelector("input[placeholder='상세주소 (선택 입력 가능)']")?.focus();
      });
    },
  }).open();
};

// 아이디 중복 검사 함수
// const checkDuplicateId = async () => {
//   const loginId = state.form.loginId.trim();
//   validateLoginId();
//   if (errors.loginId) return;

//   try {
//     const res = await findId({ loginId, role: state.form.role }); // 객체로 전달
//     console.log("중복 검사 res:", res.data);

//     if (res.data.resultData) {
//       errors.loginId = "이미 사용 중인 아이디입니다.";
//       checkResult.value = "";
//       isIdChecked.value = false;
//     } else {
//       errors.loginId = "";
//       checkResult.value = "사용 가능한 아이디입니다.";
//       isIdChecked.value = true;
//     }
//   } catch (err) {
//     console.error("아이디 중복 검사 실패:", err);
//     showModal("아이디 중복 검사 중 오류가 발생했습니다.");
//     isIdChecked.value = false;
//   }
// };
const checkDuplicateId = async () => {
  const loginId = state.form.loginId.trim();
  validateLoginId();
  if (errors.loginId) return;
  console.log(loginId)

  try {
    const res = await findId(loginId);
    console.log("res: ", res.data.resultData)

    if (res.data.resultData) {
      errors.loginId = "이미 사용 중인 아이디입니다.";
      checkResult.value = "";
      isIdChecked.value = false;
    } else {
      errors.loginId = "";
      checkResult.value = "사용 가능한 아이디입니다.";
      isIdChecked.value = true;
    }

  } catch (err) {
    console.error("아이디 중복 검사 실패:", err.response || err);

    // 서버가 400이면 이미 존재
    if (err.response?.status === 400) {
      errors.loginId = "이미 사용 중인 아이디입니다.";
      checkResult.value = "";
      isIdChecked.value = false;
    } else {
      errors.loginId = "아이디 중복 검사 중 오류가 발생했습니다.";
      checkResult.value = "";
      isIdChecked.value = false;
    }
  }
};


// 입력 시 메시지 초기화
watch(
  () => state.form.loginId,
  () => {
    if (checkResult.value) checkResult.value = "";
    errors.loginId = "";
  }
);

// 약관 동의 상태
const agreement = reactive({
  allAgree: false,
  terms: {
    useTerms: false,
    privacyPolicy: false,
    thirdParty: false,
  },
  marketing: false,
  sms: false,
  email: false,
});

// 회원구분
watch(memberType, (val) => {
  state.form.role = val === "owner" ? "OWNER" : "CUSTOMER";
});

// input 이벤트 핸들러
const handleLoginIdInput = () => {
  errors.loginId = "";
  checkResult.value = "";
};

const clearConfirmPwError = () => {
  errors.confirmPw = "";
};

const clearPasswordError = () => {
  errors.loginPw = "";
};

// 약관 전체동의 toggle
function toggleAllAgree() {
  const checked = agreement.allAgree;
  agreement.terms.useTerms = checked;
  agreement.terms.privacyPolicy = checked;
  agreement.terms.thirdParty = checked;
  agreement.marketing = checked;
  agreement.sms = checked;
  agreement.email = checked;
}
// 쇼핑정보 수신 동의
watch(
  () => agreement.marketing,
  (newVal) => {
    agreement.sms = newVal;
    agreement.email = newVal;
  }
);

// 유저 정보 제출
// 전화번호 합치기
const getPhoneStr = () =>
  `${state.form.phone.phone1}-${state.form.phone.phone2}-${state.form.phone.phone3}`;

// 업주 StoreJoinReq 생성
const getStoreJoinReq = () => ({
  id: 0,
  name: state.owner.name,
  comment: state.owner.comment,
  businessNumber: state.owner.businessNumber,
  licensePath: state.owner.licensePath ?? "",
  imagePath: state.owner.imagePath ?? "",
  postcode: state.owner.postcode,
  address: state.owner.address,
  addressDetail: state.owner.addressDetail,
  tel: `${state.owner.storePhone1}-${state.owner.storePhone2}-${state.owner.storePhone3}`,
  ownerName: state.owner.ownerName,
  openDate: state.owner.openDate,
  enumStoreCategory: state.owner.category,
});

// 주소 리스트 생성
const getUserAddressPostReq = () => {
  const addresses = [...state.addresses].map((a) => ({
    title: a.title ?? "기본 주소",
    isMain: a.isMain ?? 1,
    postcode: a.postcode ?? "",
    address: a.address ?? "",
    addressDetail: a.addressDetail ?? "",
  }));
  return addresses;
};

const categoryLabels = state.owner.category
  .map((c) => {
    const cat = categories.find((cat) => cat.value === c);
    return cat ? cat.label : null;
  })
  .filter(Boolean);

// 제출 함수
const submit = async () => {
  console.log("제출 직전 state.owner:", JSON.stringify(state.owner));
  // 아이디 중복 체크 필수
  if (!isIdChecked.value) {
    showModal("아이디 중복 검사를 해주세요.");
    return;
  }
  // 유효성 검사
  if (!validateForm()) {
    showModal("입력값을 다시 확인해주세요.");
    return;
  }

  // openDate 형식 체크
  const openDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (memberType.value === "owner" && !openDateRegex.test(state.owner.openDate)) {
    showModal("개업일을 YYYY-MM-DD 형식으로 입력해주세요.");
    return;
  }

  try {
    const formData = new FormData();

    // 공통 유저 정보 JSON Blob
    const userPayload = {
      id: 0,
      name: memberType.value === "owner" ? state.owner.ownerName : state.form.name,
      loginId: state.form.loginId,
      loginPw: state.form.loginPw,
      phone:
        memberType.value === "owner"
          ? `${state.owner.ownerPhone1}-${state.owner.ownerPhone2}-${state.owner.ownerPhone3}`
          : `${state.form.phone.phone1}-${state.form.phone.phone2}-${state.form.phone.phone3}`,
      email: state.form.email,
      role: memberType.value === "owner" ? "사장" : "고객",
      userAddressPostReq: state.addresses.map((a) => ({
        title: a.title ?? "기본 주소",
        isMain: a.isMain ?? 1,
        postcode: a.postcode ?? "",
        address: a.address ?? "",
        addressDetail: a.addressDetail ?? "",
      })),
      storeJoinReq:
        memberType.value === "owner"
          ? {
              id: 0,
              ownerName: state.owner.ownerName,
              name: state.owner.storeName,
              postcode: state.owner.postcode,
              address: state.owner.address,
              addressDetail: state.owner.addressDetail,
              tel: `${state.owner.storePhone1}-${state.owner.storePhone2}-${state.owner.storePhone3}`,
              businessNumber: state.owner.businessNumber,
              openDate: state.owner.openDate,
              enumStoreCategory: categoryLabels, // Enum 배열 그대로 전송
              comment: state.owner.comment ?? "",
              licensePath: state.owner.licensePath?.trim()
                ? state.owner.licensePath
                : "default-license.png",
              imagePath: state.owner.imagePath ?? "",
            }
          : null,
    };
    if (state.owner.businessFile && state.owner.businessFile.size > 0) {
      formData.append("pic", state.owner.businessFile);
    }
    formData.append(
      "req",
      new Blob([JSON.stringify(userPayload)], { type: "application/json" })
    );

    // 업주 회원이면 storeJoinReq 추가
    // if (memberType.value === "owner") {
    //   const storePayload = {
    //     id: 0,
    //     ownerName: state.owner.ownerName,
    //     name: state.owner.storeName,
    //     postcode: state.owner.postcode,
    //     address: state.owner.address,
    //     addressDetail: state.owner.addressDetail,
    //     tel: `${state.owner.storePhone1}-${state.owner.storePhone2}-${state.owner.storePhone3}`,
    //     businessNumber: state.owner.businessNumber,
    //     openDate: state.owner.openDate,
    //     enumStoreCategory: state.owner.category, // Enum 배열 그대로 전송
    //     comment: state.owner.comment ?? "",
    //     licensePath: state.owner.licensePath ?? "",
    //     imagePath: state.owner.imagePath ?? "",
    //   };
    //   userPayload.phone = `${state.owner.ownerPhone1}-${state.owner.ownerPhone2}-${state.owner.ownerPhone3}`
    //   console.log("storepayload 데이터 확인용", storePayload);
    //   formData.append(
    //     "storeJoinReq",
    //     new Blob([JSON.stringify(storePayload)], { type: "application/json" })
    //   );

    //   // 사업자 등록증 파일 첨부
    //   if (state.owner.businessFile && state.owner.businessFile.size > 0) {
    //     formData.append("licenseFile", state.owner.businessFile);
    //   }
    // }

    // 프로필 이미지 첨부
    if (state.profilePic && state.profilePic.size > 0) {
      formData.append("pic", state.profilePic);
    }

    // Axios POST 요청
    const res = await axios.post("/user/join", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 결과 처리
    if (res.status === 200) {
      showModal("회원가입 완료!");
      localStorage.setItem("user", JSON.stringify(res.data.resultData));
      router.push("/");
    } else {
      showModal(res.data?.message || "회원가입 실패: 입력 정보를 확인해주세요.");
    }
  } catch (err) {
    console.error("❌ 회원가입 중 오류:", err);
    showModal("사업자 등록증과 가게 상호명 및 카테고리는 필수입니다.");
  }
};

// 약관 설명 텍스트 (마지막에 내용 다 넣기)
const termsText = {
  useTerms: "한입 이용약관 내용...",
  privacyPolicy: "개인정보 처리방침 내용...",
  thirdParty: "제3자 제공 안내 내용...",
};
// async function submitForm() {
//   if (memberType.value === "owner") {
//     validateOwnerFields();
//   }

//   const hasError = Object.values(errors).some((msg) => msg && msg.length > 0);
//   if (hasError) {
//     showModal("필수 항목을 모두 확인해주세요.");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     for (const key in form) {
//       // OwnerForm의 파일과 카테고리는 JSON 변환 또는 FormData append
//       if (key === "ownerPhone" || key === "storePhone" || key === "category") {
//         formData.append(key, JSON.stringify(form[key]));
//       } else if (key === "businessFile" || key === "imagePath") {
//         if (form[key]) formData.append(key, form[key]);
//       } else {
//         formData.append(key, form[key]);
//       }
//     }

//     const response = await join(formData);
//     console.log("회원가입 성공:", response.data);
//     alert("회원가입이 완료되었습니다.");
//     router.push("/login");
//   } catch (err) {
//     console.error(err);
//     alert("회원가입 중 오류가 발생했습니다.");
//   }
// }
// 모달창 함수
const showModal = (message) => {
  const modalBody = document.getElementById("alertModalBody");
  if (modalBody) modalBody.textContent = message;

  const modal = new bootstrap.Modal(document.getElementById("alertModal"));
  modal.show();
};
</script>

<template>
  <div class="join">
    <div class="container">
      <h2 class="join-title">회원가입</h2>
      <form class="join-form" @submit.prevent="submit">
        <strong>* 필수입력칸입니다.</strong>
        <div class="titleLine"></div>
        <!-- 회원구분 -->
        <div class="form-group">
          <div class="label">
            <div class="sortation">
              <span>*</span>
              <p>회원 구분</p>
            </div>
            <div class="radio-group">
              <label id="radio"
                ><input
                  type="radio"
                  class="circle"
                  name="memberType"
                  value="customer"
                  v-model="memberType"
                />
                일반</label
              >
              <label
                ><input
                  type="radio"
                  class="circle"
                  name="memberType"
                  value="owner"
                  v-model="memberType"
                />
                업주</label
              >
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 기본 정보 (아이디/비밀번호는 공용) -->
        <label class="serveTitle">기본정보</label>
        <div class="titleLine"></div>
        <div class="form-group">
          <!-- 아이디 -->
          <div class="id-from address-row">
            <div class="label">
              <div class="sortation">
                <span>*</span>
                <p>아이디</p>
              </div>
              <div class="id">
                <div class="id-input-group">
                  <input
                    v-model="state.form.loginId"
                    :class="{ invalid: errors.loginId }"
                    @input="handleLoginIdInput"
                    placeholder="영문 소문자/숫자, 4~16자"
                  />
                  <button class="idbox" @click="checkDuplicateId" type="button">
                    아이디 중복
                  </button>
                </div>
                <div class="id-message">
                  <p v-if="errors.loginId" class="error-msg">{{ errors.loginId }}</p>
                  <p v-else-if="checkResult" class="success-msg">{{ checkResult }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 비밀번호 -->
        <div class="form-group">
          <div class="label">
            <div class="sortation">
              <span>*</span>
              <p>비밀 번호</p>
            </div>
            <div class="password">
              <input
                type="password"
                v-model="state.form.loginPw"
                :class="{ invalid: errors.loginPw }"
                @input="() => (errors.loginPw = '')"
                @blur="validatePassword"
                autocomplete="new-password"
                placeholder="비밀번호는 영문, 숫자, 특수문자 포함 8~16자"
              />
              <p v-if="errors.loginPw" class="error-msg">
                {{ errors.loginPw }}
              </p>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <div class="label">
            <div class="sortation">
              <span>*</span>
              <p>비밀번호 확인</p>
            </div>
            <div class="password2">
              <input
                type="password"
                v-model="confirmPw"
                @input="() => (errors.confirmPw = '')"
                @blur="validateConfirmPw"
                :class="{ invalid: errors.confirmPw }"
                autocomplete="new-password"
                placeholder="비밀번호 재입력"
              />
              <p v-if="errors.confirmPw" class="error-msg">
                {{ errors.confirmPw }}
              </p>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>
        <!-- 이메일-->
        <div class="form-group">
          <div class="label">
            <div class="sortation">
              <span> </span>
              <p>이메일</p>
            </div>
            <div class="password2">
              <input
                v-model="state.form.email"
                @input="() => (errors.email = '')"
                @blur="validateEmail"
                :class="{ invalid: errors.email }"
                placeholder="올바른 이메일 형식으로 입력해주세요."
              />
              <p v-if="errors.email" class="error-msg">
                {{ errors.email }}
              </p>
            </div>
          </div>
        </div>
        <div class="sevLine"></div>

        <!-- 회원 구분에 따른 폼 분기 -->
        <CustomerForm
          v-if="memberType === 'customer'"
          v-model:form="state.form"
          v-model:errors="errors"
          :addresses="state.addresses"
          @addressSearch="addressSearch"
        />

        <OwnerForm
          v-if="memberType === 'owner'"
          v-model:form="state.form"
          v-model:owner="state.owner"
          v-model:errors="errors"
          @addressSearch="addressSearch"
          @ownerInput="handleOwnerInput"
        />

        <!-- 약관 동의 및 제출 -->
        <!-- 약관동의 -->
        <label class="serveTitle">약관동의</label>
        <div class="titleLine"></div>
        <div class="agreement">
          <!-- 전체 동의 -->
          <p class="all-agree">
            <label class="custom-checkbox">
              <input
                type="checkbox"
                class="circle"
                v-model="agreement.allAgree"
                @change="toggleAllAgree"
              />
              <strong class="all"><span class="highlight">전체동의</span></strong>
            </label>
          </p>
          <ul class="terms-list">
            <!-- 필수 이용약관 동의 -->
            <li>
              <label class="custom-checkbox"
                ><input
                  type="checkbox"
                  class="circle"
                  v-model="agreement.terms.useTerms"
                /><span class="highlight"> [필수]</span> 이용약관 동의</label
              >
            </li>
            <div class="terms-box">{{ termsText.useTerms }}</div>
            <!-- 필수 개인정보 수집 이용 동의 -->
            <li>
              <label class="custom-checkbox"
                ><input
                  type="checkbox"
                  class="circle"
                  v-model="agreement.terms.privacyPolicy"
                />
                <span class="highlight"> [필수]</span> 개인정보 수집 이용 동의</label
              >
            </li>
            <div class="terms-box">{{ termsText.privacyPolicy }}</div>
            <!-- 필수 개인정보 제3자 제공 동의 -->
            <li>
              <label class="custom-checkbox"
                ><input
                  type="checkbox"
                  class="circle"
                  v-model="agreement.terms.thirdParty"
                />
                <span class="highlight"> [필수]</span> 개인정보 제3자 제공 동의</label
              >
            </li>
            <div class="terms-box">{{ termsText.thirdParty }}</div>
          </ul>
          <!-- 선택 쇼핑정보 수신 동의 -->
          <div class="marketing">
            <p>
              <label class="custom-checkbox"
                ><input
                  type="checkbox"
                  class="circle"
                  v-model="agreement.marketing"
                /><span class="highlight"> [선택]</span> 쇼핑정보 수신 동의</label
              >
            </p>
          </div>
          <div class="sev-marketing">
            <span
              ><label class="custom-checkbox"
                ><input type="checkbox" class="circle" v-model="agreement.sms" /> SMS
                수신을 동의하십니까?</label
              ></span
            >
            <span
              ><label class="custom-checkbox"
                ><input type="checkbox" class="circle" v-model="agreement.email" /> 이메일
                수신을 동의하십니까?</label
              ></span
            >
          </div>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  </div>

  <!-- 공통 알림 모달 -->
  <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">알림</h5>
        </div>
        <div class="modal-body" id="alertModalBody">내용</div>
        <div class="modal-footer">
          <button type="button" class="btn" data-bs-dismiss="modal">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: "Pretendard-Regular";
  box-sizing: border-box;
  user-select: none;
  -webkit-user-drag: none;
}

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
  }
}

// 필수 입력칸 강조
strong {
  font-size: 15px;
  margin-bottom: -10px;
  margin-left: 40px;
  color: #ff6666;
  letter-spacing: 1px;
}

// 전체동의
strong.all {
  margin-left: -0.1px;
  font-size: 20px;
}

.radio-group {
  display: flex; // 가로 정렬
  align-items: center; // 수직 중앙
  gap: 30px; // 라벨 간격

  label {
    display: flex;
    align-items: center; // 라디오와 텍스트 중앙 정렬
    gap: 8px; // 라디오와 텍스트 간격
    cursor: pointer;
    font-size: 1rem;
    color: #000;
  }

  input[type="radio"].circle {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #7d7d7d;
    position: relative;
    cursor: pointer;
    background-color: white;

    &:checked {
      border-color: #ff6666;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        background-color: #ff6666;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

// 메인 구분 선
.titleLine {
  width: 1130px;
  border-bottom: 3px solid #7d7d7d;
}

// 섹션 구분 선
.sevLine {
  width: 1130px;
  border-bottom: 0.5px solid #c8c8c8;
}

// 섹션 제목 라벨
label.serveTitle {
  font-size: 20px !important;
  font-weight: 600 !important;
  margin-left: 10px;
}

// 입력 필드 기본 스타일
input[type="text"],
input[type="password"],
select {
  width: 100%;
  max-width: 621px;
}

input:focus,
select:focus {
  border-color: #ff6666;
  outline: none;
}

// 유효성 검사 스타일
input.invalid,
select.invalid {
  box-shadow: 0 0 3px #ff6666(233, 0, 0, 0.3) !important;
  background-color: #ffe5e5;
}

.id {
  display: flex;
  flex-direction: column; // input+버튼 위, 메시지 아래
  gap: 5px;

  .id-input-group {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
    margin-top: -100px;
    margin-bottom: -205px;
  }

  input {
    flex: 1; // 남는 공간 다 차지
    height: 50px;
  }

  button.idbox {
    flex: none; // 버튼 고정
    width: 115px;
    height: 50px;
  }

  .id-message {
    width: 100%;

    p {
      margin: 5px 0 0 0; // 위쪽 간격만 조금
      font-size: 14px;
    }
  }
}

// 에러 메시지 스타일
.container {
  .label {
    display: flex;
    align-items: center;

    // 에러 메시지
    p.error-msg,
    p.success-msg {
      margin: 10px 0 -5px 5px; // 위쪽 5px, 좌우 0
      color: #ff6666; // error-msg는 red
      font-size: 14px;
      font-weight: 500;
    }

    // 성공 메시지 (아이디 중복 확인 등)
    p.success-msg {
      color: #2f57db;
      font-size: 15px;
      font-weight: 500;
      margin-top: 10px;
      user-select: none;
      transition: color 0.3s ease;
    }

    span {
      color: #ff6666; // 필수 표시 별표
      font-size: 1rem;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: #000;
    }
  }
}

// 회원가입 전체 영역
.join {
  max-width: 1130px;
  margin: 0 auto;
  padding: 3rem 1rem;
  background: #fff;

  // 메인 타이틀 (회원가입)
  .join-title {
    font-family: "BMJUA";
    font-size: 50px;
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 60px;
  }

  // 섹션 제목 (기본 정보, 약관동의)
  .serveTitle {
    font-size: 1.3rem;
    margin-top: 2rem;
    margin-bottom: -1rem;
    font-weight: 500;
  }

  // 회원가입 폼 전체 스타일
  .join-form {
    width: 1130px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: -10px;
  }

  // 각 입력 그룹
  .form-group,
  .form-certified {
    display: inline-block;
    flex-direction: column;

    input:not([type="radio"]):not([type="checkbox"]),
    select {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #c8c8c8;
      border-radius: 8px;
      height: 50px;
      width: 621px;
      box-sizing: border-box;
    }

    button {
      width: 115px;
      border-radius: 8px;
      margin-left: 10px;
    }
  }

  // 약관동의
  .agreement {
    display: flex;
    flex-direction: column;
    margin-left: 100px;

    .highlight {
      color: #ff6666;
      font-weight: 500;
    }

    .all-agree {
      font-size: 25px;
      font-weight: 500;
    }

    .terms-list {
      list-style: none;
      padding: 0;
      margin-left: 40px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      // 약관 내용 박스
      .terms-box {
        width: 850px;
        height: 105px;
        border: 1px solid #ccc;
        padding: 15px;
        margin-top: 25px;
        margin-bottom: 25px;
        border-radius: 8px;
        background-color: #fff;
        overflow-y: scroll;
        font-size: 14px;
        white-space: pre-line;
      }
    }

    .marketing,
    .sev-marketing {
      margin-left: 40px;
    }

    .sev-marketing {
      display: flex;
      flex-direction: column;
      gap: 10px;

      span {
        display: flex;
        align-items: center;
        font-size: 0.95rem;
      }

      input[type="checkbox"] {
        margin-right: 8px;
      }

      label {
        font-weight: 400;
        margin-left: 50px;
      }
    }
  }

  // 체크박스 스타일
  input[type="checkbox"].circle {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #7d7d7d;
    position: relative;
    cursor: pointer;
    margin-right: 8px;

    &:checked {
      background-color: #ff6666;
      border-color: #ff6666;
    }

    &:checked::after {
      content: "V";
      color: white;
      font-size: 12px;
      position: absolute;
      left: 3px;
      top: 0.5px;
    }
  }
}

// 회원가입 완료 버튼
button {
  background-color: #fff;
  color: #ff6666;
  font-weight: 600;
  border: 1px solid #ff6666;
  padding: 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 100px auto 200px auto; // 상단 10px, 좌우 auto, 하단 10rem
  width: 620px;
  display: block; // auto margin이 적용되려면 block 필요

  &:hover {
    background-color: #ffe5e5;
  }
}

// 모달 버튼 전용 스타일
#alertModal .btn {
  margin: 0;
  width: auto;
  padding: 0.5rem 1rem;
}
</style>
