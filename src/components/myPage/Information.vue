<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getUser, update } from "@/services/userService";
import { nextTick } from "vue";

const router = useRouter();

// 사용자 정보 리스트
const state = reactive({
  form: {
    loginId: "", // ID 비활성화 해야함!!
    loginPw: "",
    name: "",
    postcode: "",
    address: "",
    addressDetail: "",
    phone: "",
    email: "",
  },
});
const confirmPw = ref(""); // 새 비밀번호
const errors = reactive({
  loginPw: "",
  confirmPw: "",
  email: "",
  phone: "",
});

//일반 회원용 전화번호 필드
const phone1 = ref("010");
const phone2 = ref("");
const phone3 = ref("");
const phone2Input = ref(null);
const phone3Input = ref(null);

// 부트스트랩 모달 인스턴스를 저장할 변수 (전역으로 관리)
let alertModal = null;

//전화번호 조합
watch([phone1, phone2, phone3], () => {
  state.form.phone = `${phone1.value}-${phone2.value}-${phone3.value}`;
});

// 유효성 검사 함수
function validateForm() {
  let isValid = true;

  // 현재 비밀번호 필수
  if (!state.form.loginPw) {
    errors.loginPw = "현재 비밀번호를 입력해주세요.";
    isValid = false;
  } else {
    errors.loginPw = "";
  }

  // 새 비밀번호 유효성: 다르고, 8~16자, 숫자/특수문자 포함
  const pw = confirmPw.value;
  const sameAsOld = pw === state.form.loginPw;
  const regexPw =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,16}$/;

  if (!pw) {
    errors.confirmPw = "새 비밀번호를 입력해주세요.";
    isValid = false;
  } else if (sameAsOld) {
    errors.confirmPw = "새 비밀번호는 현재 비밀번호와 다르게 입력해주세요.";
    isValid = false;
  } else if (!regexPw.test(pw)) {
    errors.confirmPw =
      "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.";
    isValid = false;
  } else {
    errors.confirmPw = "";
  }

  // 이메일 유효성
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!state.form.email || !emailRegex.test(state.form.email)) {
    errors.email = "유효한 이메일 주소를 입력해주세요.";
    isValid = false;
  } else {
    errors.email = "";
  }

  // 휴대전화 각 자리 검사
  const phoneRegex = /^[0-9]{3,4}$/;
  if (!phoneRegex.test(phone2.value) || !phoneRegex.test(phone3.value)) {
    errors.phone = "전화번호 다시 한번 확인해주세요.";
    isValid = false;
  } else {
    errors.phone = "";
  }

  return isValid;
}
// 숫자만 입력되게 하고 자동 이동
function onPhoneInput(modelRef, event) {
  let val = event.target.value.replace(/\D/g, ""); // 숫자만 남김
  if (val.length > 4) val = val.slice(0, 4); // 최대 4자리 제한
  modelRef.value = val;

  // 자동 포커스 이동
  if (modelRef === phone2 && val.length === 4) {
    nextTick(() => phone3Input.value?.focus());
  }
}

// 화살표/백스페이스 제외하고 숫자 외 입력 방지
function onPhoneKeydown(event) {
  const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  if (!/^\d$/.test(event.key) && !allowed.includes(event.key)) {
    event.preventDefault();
  }
}
// 컴포넌트 마운트 시 사용자 정보 조회
onMounted(async () => {
  // modal..
  const modalEl = document.getElementById("alertModal");
  if (modalEl) {
    alertModal = new bootstrap.Modal(modalEl);
  }
  try {
    // 로그인 시 localStorage에 저장된 사용자 ID 가져오기
    const id = localStorage.getItem("id"); // or 로그인 시 저장된 값
    console.log("localStorage loginId:", id); // user 로그인 정보를 저장하고 있는지 확인용

    if (!id) {
      showModal("로그인 정보가 없습니다. 로그인 후 이용해주세요.");
      router.push("/login");
      return;
    }

    // API 호출: 사용자 정보 조회
    const res = await getUser(id); // userService에서 끌고와야함

    if (res && res.data) {
      // 조회된 사용자 정보로 폼 초기화
      Object.assign(state.form, res.data.resultData); // 정보 채우기
    }
    if (res.data.resultData.phone) {
      // 전화번호 분해해서 phone1/phone2/phone3에 넣어주는 부분
      const phoneParts = res.data.resultData.phone.split("-");
      phone1.value = phoneParts[0] || "";
      phone2.value = phoneParts[1] || "";
      phone3.value = phoneParts[2] || "";
    } else {
      showModal("사용자 정보를 불러오는데 실패했습니다.");
    }
  } catch (err) {
    console.error("사용자 정보 로딩 실패:", err);
    showModal("사용자 정보 로딩 중 오류가 발생했습니다.");
  }
});

//  정보 수정 성공 여부
const submitForm = async (e) => {
  e.preventDefault();

  if (!validateForm()) return; // 유효성 검사 추가

  try {
    // 수정 요청 전 폼 유효성 체크 등 필요시 추가
    const id = localStorage.getItem("id");

    if (!id) {
      showModal("로그인 정보가 없습니다.");
      router.push("/login");
      return;
    }

    // API 호출: 사용자 정보 수정
    const res = await update(id, state.form);
    if (res.status === 200) {
      showModal("정보가 성공적으로 수정되었습니다.");
      router.push("/mypage");
    } else {
      showModal("정보 수정에 실패했습니다.");
    }
  } catch (err) {
    console.error("정보 수정 실패:", err);
    showModal("정보 수정 중 오류가 발생했습니다.");
  }
};
// 새비밀번호 입력창 아래에 비밀번호 조건 안내 문구
watch(phone2, (val) => {
  if (val.length === 4) {
    nextTick(() => phone3Input.value?.focus());
  }
});
// 에러 지우기 (email, phone 등 key값 전달)
function clearError(key) {
  errors[key] = "";
}

// 전화번호 입력 시 에러 초기화 + 숫자만 필터 + 자동 이동
function handlePhoneInput(modelRef, key) {
  let val = modelRef.value.replace(/\D/g, "");
  if (val.length > 4) val = val.slice(0, 4);
  modelRef.value = val;
  errors[key] = ""; // 에러 제거

  if (key === "phone" && modelRef === phone2 && val.length === 4) {
    nextTick(() => phone3Input.value?.focus());
  }
}

// 모달창
const showModal = (message) => {
  const modalBody = document.getElementById("alertModalBody");
  if (modalBody) modalBody.textContent = message;

  if (alertModal) {
    alertModal.show();
  }

  // const modalButton = document.querySelector(".modal-footer .btn");
  // if (modalButton) {
  //   modalButton.style.backgroundColor = "#FF6666";
  //   modalButton.style.color = "#fff";
  // }
};



</script>

<template>
  <div class="box">
    <div>
      <div>정보 수정</div>
      <div class="solid"></div>

      <div class="container">
        <form class="information-form" @submit.prevent="submitForm">
          <div class="form-group">
            <!-- 아이디 비활성화 -->
            <span>*</span>
            <label> 아이디</label>
            <input type="text" class="form-input" :value="state.form.loginId" placeholder="" readonly />
          </div>
          <div class="sevLine"></div>

          <!-- 현재 비밀번호 -->
          <div class="form-group">
            <span>*</span>
            <label>현재 비밀번호</label>
            <input type="password" class="form-input" v-model="state.form.loginPw" placeholder="현재 비밀번호를 입력해주세요."
              :class="{ error: errors.loginPw }" />
            <button class="password">비밀번호 확인</button>
            <p v-if="errors.loginPw" class="error-msg">{{ errors.loginPw }}</p>
          </div>
          <div class="sevLine"></div>

          <!-- 새 비밀번호 -->
          <div class="form-group">
            <span>*</span>
            <label>새 비밀번호</label>
            <input type="password" class="form-input" v-model="confirmPw" placeholder="비밀번호는 영문, 숫자, 특수문자 포함 8~16자"
              :class="{ error: errors.confirmPw }" />
            <p v-if="errors.confirmPw" class="error-msg">
              {{ errors.confirmPw }}
            </p>
          </div>
          <div class="sevLine"></div>

          <!-- 일반 회원 -->
          <div class="form-group">
            <span>*</span>
            <label> 이름</label>
            <input type="text" class="form-input" v-model="state.form.name" />
          </div>
          <div class="sevLine"></div>

          <!-- 주소 -->
          <div class="form-group address-group">
            <label> <span class="font-add">* </span> 주소 </label>
            <div class="address-fields">
              <!-- 우편번호 + 주소검색 버튼 -->
              <div class="address-row">
                <input type="text" placeholder="우편번호" v-model="state.form.postcode" readonly />
                <button type="button">주소검색</button>
              </div>

              <!-- 기본주소 단독 줄 -->
              <div class="address-input-row">
                <input type="text" placeholder="기본주소" v-model="state.form.address" readonly />
              </div>

              <!-- 상세주소 단독 줄 -->
              <div class="address-input-row">
                <input type="text" placeholder="상세주소 (선택입력가능)" v-model="state.form.addressDetail" />
              </div>
            </div>
          </div>
          <div class="sevLine"></div>

          <!-- 휴대전화 -->
          <div class="form-group phone-input-wrap">
            <label> <span class="font-num">*</span> 휴대전화 </label>
            <div class="phone-input">
              <select v-model="phone1">
                <option>010</option>
                <option>016</option>
                <option>017</option>
                <option>018</option>
                <option>019</option>
              </select>
              <input type="text" v-model="phone2" maxlength="4" @input="handlePhoneInput(phone2, 'phone')"
                @keydown="onPhoneKeydown($event)" :class="{ error: errors.phone }" ref="phone2Input" />
              <input type="text" v-model="phone3" maxlength="4" @input="handlePhoneInput(phone3, 'phone')"
                @keydown="onPhoneKeydown($event)" :class="{ error: errors.phone }" ref="phone3Input" />
            </div>
            <div class="phone-error-wrapper" v-if="errors.phone">
              <p class="error-msg">{{ errors.phone }}</p>
            </div>
          </div>
          <div class="sevLine"></div>


          <!-- 이메일 -->
          <div class="form-group">
            <span>*</span>
            <label> 이메일</label>
            <input type="email" class="form-input" v-model="state.form.email" placeholder="반드시 사용 중인 메일을 @ 형식으로 입력하세요."
              @input="clearError('email')" :class="{ error: errors.email }" />
          </div>
          <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
          <div class="sevLine"></div>

          <!-- 제출 버튼 -->
          <div class="form-submit">
            <button type="submit">수정</button>
          </div>
        </form>
      </div>
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
          <button type="button" class="btn" data-bs-dismiss="modal">
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 주아체
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}

span {
  color: #ff6666;
  margin-left: 40px;
}

// input선택시
input:focus {
  outline: none;
  border-color: #ccc; // 포커스 상태에서도 기존 색상 유지
  background-color: #fff; // 혹시 다르게 바뀌는 경우 대비
}

.box {
  // 주소 검색 박스
  font-family: "BMJUA";
  font-size: 25px;
  letter-spacing: -1.5px;

  .solid {
    // 정보 수정 메인 선
    width: 1110px;
    border: 1px #000 solid;
    margin-top: 15px;
    margin-bottom: 20px;
  }
}

// 서브 라인
.sevLine {
  border-bottom: 0.5px solid #c8c8c8;
  width: 1110px;
}

.container {
  font-family: "Pretendard-Regular";
  font-size: 16px;
  display: inline;

  .join-form {
    display: flex;
    flex-direction: column;
  }
}

// form 전체 정렬 정비
.information-form {
  width: 1110px;
  margin-top: -3rem;
  display: flex;
  flex-direction: column;
}

// 입력창 공통 스타일 (아이디, 비번, 이메일 등)
input[type="text"],
input[type="password"],
input[type="email"] {
  height: 45px;
  padding: 0 1rem;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

// form-group 기본 정렬 및 간격 정비
.form-group {
  display: flex; // label과 input을 같은 라인에 정렬
  align-items: center; // 수직 가운데 정렬
  gap: 1.5rem; // label과 input 간 간격
  margin-bottom: 15px;

  //에러메세지
  input.error {
    background-color: #ffe5e5 !important;
  }

  label {
    width: 150px; // ← 고정 너비로 정렬 맞추기
    font-size: 16px;
    margin-left: 50px;
  }

  // 입력창 공통 사이즈 (아이디, 비번, 이메일 )
  .form-input {
    width: 459px;
  }

  input,
  // 전화번호 정렬
  select {
    flex: 1;
    width: 170px;
  }

  button.password {
    width: 120px;
    height: 50px;
    margin-left: 10px;
    background-color: #fff;
    border: 1px solid #ff6666;
    border-radius: 8px;
    color: #ff6666;
    cursor: pointer;

    &:hover {
      background-color: #ffe5e5;
    }
  }
}

.form-group:not(.address-group):not(.phone-input-wrap):not(.agreement):not( :has(.radio-group)) {
  display: block;
  margin-top: 1rem;

  label {
    display: inline-block;
    width: 235px; // label 고정 폭
    text-align: left;
    margin-left: 50px;
    vertical-align: middle;
  }

  input,
  select {
    display: inline-block;
    width: 495px;
    height: 50px;
    font-size: 1rem;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    margin-left: 20px; // 중앙정렬
    vertical-align: middle;
  }
}

.font-add {
  margin-left: -10px;
  margin-right: 47px;
}

// 주소 입력 영역 정렬 (주소, 상세주소)
.address-group {
  display: flex;
  align-items: flex-start; // ← label은 위 정렬
  gap: 1.5rem;

  // 라벨은 왼쪽에 고정된 너비로
  label {
    width: 150px;
    font-size: 16px;
    padding-top: 23px; // 위에 살짝 띄워 정렬
  }

  // 오른쪽 전체 주소 input 그룹
  .address-fields {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-left: 50px;

    // 1줄: 우편번호 + 주소검색
    .address-row {
      display: flex;
      gap: 0.5rem;
      margin-left: 80px; // 중앙정렬

      input[type="text"] {
        margin-top: 1rem;
        width: 390px;
        height: 45px;
        padding: 0 1rem;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
      }
// 주소검색 버튼
      button {
        margin-top: 1rem;
        width: 90px;
        height: 45px;
        background-color: #fff;
        border: 1px solid #ff6666;
        border-radius: 8px;
        color: #ff6666;
        cursor: pointer;

        &:hover {
          background-color: #ffe5e5;
        }
      }
    }

    // 2~3줄: 기본주소 / 상세주소
    .address-input-row input[type="text"] {
      margin-left: 80px; // 중앙정렬
      width: 495px;
      height: 45px;
      padding: 0 1rem;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
  }
}

.font-num {
  margin-left: -10px;
  margin-right: 47px;
}

// 전화번호 입력 박스 정렬
.phone-input-wrap {
  display: inline;

  .phone-input {
    margin-left: 80px; // 중앙정렬
    display: inline-flex;
    max-width: 495px;
    gap: 10px;
    align-items: center;
    margin-left: 155px;

    select {
      margin-top: 1rem;
      width: 213px;
      height: 45px;
      border-radius: 8px;
      border: 1px solid #ccc;
      padding-left: 10px;
    }

    input {
      flex: 1;
      margin-top: 15px;
    }
  }

  .phone-error-wrapper {
    margin-left: 0px;
  }
}

// 수정 버튼 css
.form-submit {
  text-align: center;

  button {
    width: 600px;
    height: 55px;
    background-color: #fff;
    color: #ff6666;
    font-weight: 600;
    border: 1px solid #ff6666;
    border-radius: 8px;
    font-size: 22px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-bottom: 10rem;
    margin-top: 3rem;

    // 선택시 색바뀌는 반응
    &:hover {
      background-color: #ffe5e5;
    }
  }
}

// 아이디 비활성화
input[readonly] {
  background-color: #f5f5f5;
  cursor: default; // 마우스 커서 변경
  border: 1px solid #ccc; // 기본 테두리 유지
  color: #7d7d7d;
  pointer-events: none;
}

// 에러메세지
.error-msg {
  margin-left: 355px;
  margin-top: 10px;
  margin-bottom: -7px;
  color: #ff6666;
  font-size: 15px;
  font-weight: 600;
  transition: color 0.3s ease;
}
</style>
