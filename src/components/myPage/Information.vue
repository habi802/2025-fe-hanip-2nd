<script setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { getUser, checkPassword, updateUser } from "@/services/userService";
import { nextTick } from "vue";
import defaultUserProfile from "@/imgs/owner/user_profile.jpg";

const router = useRouter();
onMounted(() => {
  nextTick(() => {
    // 라우터 복원 후 강제 스크롤
    window.scrollTo(0, 0);
  });
});
const fileInput = ref(null);
const previewUrl = ref(defaultUserProfile); // 기본값을 defaultUserProfile로 세팅
// const previewUrl = ref(""); // 미리보기 이미지 URL
const selectedFile = ref(null); // 실제 선택된 파일

// 버튼 클릭 -> 숨겨진 input 클릭
function triggerFileInput() {
  fileInput.value?.click();
}

// 프로필 이미지
// const imgSrc = computed(() => {
//   // 파일을 선택했으면 미리보기 적용
//   if (selectedFile.value) return previewUrl.value;

//   // 서버 이미지 존재 시
//   if (state.form.id && state.form.imagePath && state.form.imagePath !== "null") {
//     return `${baseUrl.value}/images/user/${state.form.id}/${state.form.imagePath}`;
//   }

//   // 기본 이미지
//   return defaultUserProfile;
// });

const imgSrc = computed(() => {
  // 파일 선택 시 미리보기 우선
  if (selectedFile.value) return previewUrl.value;

  // 소셜 로그인(userPic이 외부 URL인 경우)
  if (state.form.providerType !== "로컬" && state.form.imagePath) {
    if (state.form.imagePath.startsWith("http")) {
      return state.form.imagePath.replace(/^http:\/\//, "https://");
    }
  }

  // 로컬 로그인 또는 서버 이미지
  if (state.form.id && state.form.imagePath && state.form.imagePath !== "null") {
    return `${baseUrl.value}/images/user/${state.form.id}/${state.form.imagePath}`;
  }

  // 기본 이미지
  return defaultUserProfile;
});

// const previewImage = ref(defaultImage);
const baseUrl = ref(import.meta.env.VITE_BASE_URL);

// 파일 선택 시 실행
function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target.result; // 미리보기 갱신
    };
    reader.readAsDataURL(file);
  }
}

// 사용자 정보 리스트
const state = reactive({
  form: {
    name: "",
    loginId: "", // ID 비활성화 해야함!!
    loginPw: "",
    newLoginPw: "",
    phone: "",
    email: "",
    providerType: "", // 소셜로그인 확인용
  },
});
const confirmPw = ref("");
const errors = reactive({
  loginPw: "",
  confirmPw: "",
  email: "",
  phone: "",
});

// 비밀번호 확인 유효성 코드
const checkResult = ref("");

// 새 비밀번호
const confirmPwCheck = ref(""); // 새 비밀번호

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
  // 소셜 로그인 회원이면 유효성 검사 생략
  if (state.form.providerType !== "로컬") return true;
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
  const regexPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,16}$/;

  if (!pw) {
    errors.confirmPw = "새 비밀번호를 입력해주세요.";
    isValid = false;
  } else if (sameAsOld) {
    errors.confirmPw = "새 비밀번호는 현재 비밀번호와 다르게 입력해주세요.";
    isValid = false;
  } else if (!regexPw.test(pw)) {
    errors.confirmPw = "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.";
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

  //   // 자동 포커스 이동
  //   if (modelRef === phone2 && val.length === 4) {
  //     nextTick(() => phone3Input.value?.focus());
  //   }
}
// 현재 비밀번호 서버 검증 함수
// const checkCorrectPassword = async () => {
//   if (!state.form.loginPw) {
//     errors.loginPw = "비밀번호를 입력해주세요.";
//     return;
//   }

//   const res = await checkPassword(state.form.loginPw);

//   if (res === undefined || res.data.resultStatus !== 200) {
//     showModal("비밀번호 확인 중 오류가 발생했습니다.");
//     return;
//   }

//   if (res.data.resultData !== 1) {
//     errors.loginPw = "비밀번호가 일치하지 않습니다.";
//   } else {
//     checkResult.value = "비밀번호가 확인되었습니다.";
//   }
// };
const checkCorrectPassword = async () => {
  // 로컬 로그인 유저만 실행
  if (state.form.providerType !== "로컬") return;

  if (!state.form.loginPw) {
    errors.loginPw = "비밀번호를 입력해주세요.";
    return;
  }

  const res = await checkPassword(state.form.loginPw);

  if (res === undefined || res.data.resultStatus !== 200) {
    showModal("비밀번호 확인 중 오류가 발생했습니다.");
    return;
  }

  if (res.data.resultData !== 1) {
    errors.loginPw = "비밀번호가 일치하지 않습니다.";
  } else {
    checkResult.value = "비밀번호가 확인되었습니다.";
  }
};

// 화살표/백스페이스 제외하고 숫자 외 입력 방지
function onPhoneKeydown(event) {
  const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  if (!/^\d$/.test(event.key) && !allowed.includes(event.key)) {
    event.preventDefault();
  }
}
// 컴포넌트 마운트 시 사용자 정보 조회
onMounted(async () => {
  const modalEl = document.getElementById("alertModal");
  if (modalEl) alertModal = new bootstrap.Modal(modalEl);

  try {
    const id = localStorage.getItem("id");
    if (!id) {
      showModal("로그인 정보가 없습니다. 로그인 후 이용해주세요.");
      router.push("/login");
      return;
    }

    const res = await getUser(id);

    if (res && res.data?.resultData) {
      Object.assign(state.form, res.data.resultData);
      console.log("providerType:", state.form.providerType);

      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      const imgPath = res.data.resultData.imagePath;

      // 절대 URL로 변환 + null 체크
      previewUrl.value =
        imgPath && imgPath !== "null"
          ? imgPath.startsWith("http")
            ? imgPath
            : `${baseURL.replace(/\/$/, "")}/${imgPath.replace(/^\/?/, "")}`
          : defaultUserProfile;

      if (res.data.resultData.phone) {
        const phoneParts = res.data.resultData.phone.split("-");
        phone1.value = phoneParts[0] || "";
        phone2.value = phoneParts[1] || "";
        phone3.value = phoneParts[2] || "";
      }
    } else {
      showModal("사용자 정보를 불러오는데 실패했습니다.");
    }
  } catch (err) {
    console.error("사용자 정보 로딩 실패:", err);
    showModal("사용자 정보 로딩 중 오류가 발생했습니다.");
  }
});
//  정보 수정 성공 여부

// const submitForm = async (e) => {
//   e.preventDefault();

//   // 현재 비밀번호 확인 필수
//   if (!state.form.loginPw) {
//     errors.loginPw = "현재 비밀번호를 입력해주세요.";
//     return;
//   }

//   // 새 비밀번호를 바꾸려는 경우만 validate
//   const isPwChanging = confirmPw.value || confirmPwCheck.value;
//   if (isPwChanging) {
//     if (confirmPw.value !== confirmPwCheck.value) {
//       errors.confirmPw = "새 비밀번호가 일치하지 않습니다.";
//       return;
//     }
//     // 비밀번호 확인 버튼 누르지 않았으면
//     if (checkResult.value !== "비밀번호가 확인되었습니다.") {
//       showModal("현재 비밀번호를 먼저 확인해주세요.");
//       return;
//     }
//   }

//   try {
//     const formData = new FormData();
//     const userPutReq = {
//       name: state.form.name,
//       loginPw: state.form.loginPw, // 항상 필요
//       newLoginPw: isPwChanging ? confirmPw.value : null, // 변경 시만 포함
//       phone: `${phone1.value}-${phone2.value}-${phone3.value}`,
//       email: state.form.email,
//     };

//     formData.append(
//       "req",
//       new Blob([JSON.stringify(userPutReq)], { type: "application/json" })
//     );

//     if (selectedFile.value) {
//       formData.append("pic", selectedFile.value); // 이미지만 변경 가능
//     }

//     const res = await updateUser(formData);

//     if (res.status === 200) {
//       showModal("정보가 성공적으로 수정되었습니다.");
//       router.push("/");
//     } else {
//       showModal("정보 수정에 실패했습니다.");
//     }
//   } catch (err) {
//     console.error("정보 수정 실패:", err);
//     showModal("정보 수정 중 오류가 발생했습니다.");
//   }
// };


// const submitForm = async (e) => {
//   e.preventDefault();

//   // 로컬 로그인이면 비밀번호 검증
//   if (state.form.providerType === "로컬") {
//     if (!state.form.loginPw) {
//       errors.loginPw = "현재 비밀번호를 입력해주세요.";
//       return;
//     }

//     const isPwChanging = confirmPw.value || confirmPwCheck.value;
//     if (isPwChanging) {
//       if (confirmPw.value !== confirmPwCheck.value) {
//         errors.confirmPw = "새 비밀번호가 일치하지 않습니다.";
//         return;
//       }
//       if (checkResult.value !== "비밀번호가 확인되었습니다.") {
//         showModal("현재 비밀번호를 먼저 확인해주세요.");
//         return;
//       }
//     }
//   }

//   try {
//     const formData = new FormData();

//     // 서버로 보낼 객체
//     const userPutReq = {
//       name: state.form.name,
//       phone: `${phone1.value}-${phone2.value}-${phone3.value}`,
//       email: state.form.email,
//     };

//     // 로컬 회원이면 비밀번호 포함
//     if (state.form.providerType === "로컬") {
//       userPutReq.loginPw = state.form.loginPw;
//       const isPwChanging = confirmPw.value || confirmPwCheck.value;
//       if (isPwChanging) userPutReq.newLoginPw = confirmPw.value;
//     }

//     formData.append(
//       "req",
//       new Blob([JSON.stringify(userPutReq)], { type: "application/json" })
//     );

//     if (selectedFile.value) {
//       formData.append("pic", selectedFile.value);
//     }

//     const res = await updateUser(formData);

//     if (res.status === 200) {
//       showModal("정보가 성공적으로 수정되었습니다.");
//       router.push("/");
//     } else {
//       showModal("정보 수정에 실패했습니다.");
//     }
//   } catch (err) {
//     console.error("정보 수정 실패:", err);
//     showModal("정보 수정 중 오류가 발생했습니다.");
//   }
// };
const submitForm = async (e) => {
  e.preventDefault();

  try {
    // FormData 생성
    const formData = new FormData();

    // 서버로 보낼 객체
    const userPutReq = {
      name: state.form.name,
      phone: `${phone1.value}-${phone2.value}-${phone3.value}`,
      email: state.form.email,
    };

    if (state.form.providerType === "로컬") {
      // 로컬 로그인 유저: 기존 비밀번호 처리
      if (!state.form.loginPw) {
        errors.loginPw = "현재 비밀번호를 입력해주세요.";
        return;
      }
      userPutReq.loginPw = state.form.loginPw;

      // 새 비밀번호 변경 시
      const isPwChanging = confirmPw.value || confirmPwCheck.value;
      if (isPwChanging) {
        if (confirmPw.value !== confirmPwCheck.value) {
          errors.confirmPw = "새 비밀번호가 일치하지 않습니다.";
          return;
        }
        // 비밀번호 확인 버튼 클릭 여부
        if (checkResult.value !== "비밀번호가 확인되었습니다.") {
          showModal("현재 비밀번호를 먼저 확인해주세요.");
          return;
        }
        userPutReq.newLoginPw = confirmPw.value;
      }
    } else if (state.form.providerType === "카카오") {
      // 카카오 로그인 유저: 더미 비밀번호 삽입
      const kakaoDummyPw = "kakao_LoginPw_Hanip_Custromer_info";
      userPutReq.loginPw = kakaoDummyPw;
      userPutReq.newLoginPw = kakaoDummyPw;
    }

    // FormData에 JSON 문자열로 추가
    formData.append(
      "req",
      new Blob([JSON.stringify(userPutReq)], { type: "application/json" })
    );

    // 프로필 사진 업로드가 있을 경우만 추가
    if (selectedFile.value) {
      formData.append("pic", selectedFile.value);
    }

    // 서버 PUT 요청
    const res = await updateUser(formData);

    if (res.status === 200) {
      showModal("정보가 성공적으로 수정되었습니다.");
      router.push("/");
    } else {
      console.error("PUT 요청 실패:", res.data);
      showModal("정보 수정에 실패했습니다.");
    }
  } catch (err) {
    console.error("정보 수정 중 오류 발생:", err);
    showModal("정보 수정 중 오류가 발생했습니다.");
  }
};

// 에러 지우기 (email, phone 등 key값 전달)
function clearError(key) {
  errors[key] = "";

  if (key === "loginPw") {
    checkResult.value = "";
  }
}

// 전화번호 입력 시 에러 초기화 + 숫자만 필터 + 자동 이동
function handlePhoneInput(modelRef, key) {
  let val = modelRef.value.replace(/\D/g, "");
  if (val.length > 4) val = val.slice(0, 4);
  modelRef.value = val;
  errors[key] = ""; // 에러 제거

  // if (key === "phone" && modelRef === phone2 && val.length === 4) {
  //   nextTick(() => phone3Input.value?.focus());
  // }
}

// 모달창
const showModal = (message) => {
  const modalBody = document.getElementById("alertModalBody");
  if (modalBody) modalBody.textContent = message;

  if (alertModal) {
    alertModal.show();
  }
};

const isPasswordChecked = ref(false); // 비밀번호 확인 여부
</script>

<template>
  <div class="box">
    <div>
      <div class="title">정보 수정</div>
      <div class="solid"></div>

      <div class="container">
        <form class="information-form" @submit.prevent="submitForm">
          <div class="form-group">
            <!-- 프로필 사진 수정 버튼 -->
            <div class="user">
              <!-- 이미지 미리보기 -->
              <img
                class="userImg"
                :src="imgSrc"
                @error="(e) => (e.target.src = defaultUserProfile)"
              />
              <!-- 실제 파일 업로드 input (숨김 처리) -->
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="onFileChange"
              />

              <!-- 버튼 클릭 시 input 클릭 -->
              <button type="button" @click="triggerFileInput">프로필 사진 수정</button>
            </div>
            <!-- 아이디 비활성화 -->
            <label> 아이디</label>
            <input
              type="text"
              class="form-input"
              :value="state.form.loginId"
              placeholder=""
              readonly
            />
          </div>
          <div class="sevLine"></div>

          <!-- 일반 회원 이름 -->
          <div class="form-group">
            <label> 이름</label>
            <input type="text" class="form-input" v-model="state.form.name" />
          </div>
          <div class="sevLine"></div>

          <!-- 닉네임 -->
          <!-- <div class="form-group">
            <label> 닉네임</label>
            <input
              type="text"
              class="form-input"
              v-model="state.form.name"
              placeholder="김아무아무개"
            />/
          </div>
          <div class="sevLine"></div> -->
          <!-- 비밀번호 입력칸 (LOCAL 전용) -->
          <div v-if="state.form.providerType === '로컬'">
            <!-- <div v-show="state.form.providerType === '로컬'"> -->
            <!-- 현재 비밀번호 -->
            <div class="form-group">
              <label>현재 비밀번호</label>

              <input
                type="password"
                class="form-input"
                v-model="state.form.loginPw"
                placeholder="현재 비밀번호를 입력해주세요."
                :class="{ error: errors.loginPw }"
                @input="clearError('loginPw')"
              />
              <button
                class="password"
                type="button"
                @click.prevent="checkCorrectPassword()"
              >
                <!-- <input type="password" class="form-input" v-model="state.form.loginPw" placeholder="현재 비밀번호를 입력해주세요."
              :class="{ error: errors.loginPw }" @input="clearError('loginPw')" />
            <button class="password" @click.prevent="checkCorrectPassword()"> -->

                비밀번호 확인
              </button>
              <p v-if="errors.loginPw" class="error-msg">{{ errors.loginPw }}</p>
              <p v-else-if="checkResult" class="success-msg">{{ checkResult }}</p>
            </div>
            <div class="sevLine"></div>

            <!-- 새 비밀번호 -->
            <div class="form-group">
              <label>새 비밀번호</label>
              <input
                type="password"
                class="form-input"
                v-model="confirmPw"
                placeholder="비밀번호는 영문, 숫자, 특수문자 포함 8~16자"
                :class="{ error: errors.confirmPw }"
                @input="clearError('confirmPw')"
              />
              <p v-if="errors.confirmPw" class="error-msg">
                {{ errors.confirmPw }}
              </p>
            </div>
            <div class="sevLine"></div>
            <!-- 새 비밀번호 확인 -->
            <div class="form-group">
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                class="form-input"
                v-model="confirmPwCheck"
                placeholder="새로운 비밀번호를 한번 더 입력해주세요"
                :class="{ error: errors.confirmPw }"
                @input="clearError('confirmPw')"
              />
              <p v-if="errors.confirmPw" class="error-msg">{{ errors.confirmPw }}</p>
            </div>
            <div class="sevLine"></div>
          </div>

          <!-- 휴대전화 -->
          <div class="form-group phone-input-wrap">
            <label> 전화번호 </label>
            <div class="phone-input">
              <select v-model="phone1">
                <option>010</option>
                <option>016</option>
                <option>017</option>
                <option>018</option>
                <option>019</option>
              </select>
              <input
                type="text"
                v-model="phone2"
                maxlength="4"
                @input="handlePhoneInput(phone2, 'phone')"
                @keydown="onPhoneKeydown($event)"
                :class="{ error: errors.phone }"
                ref="phone2Input"
              />
              <input
                type="text"
                v-model="phone3"
                maxlength="4"
                @input="handlePhoneInput(phone3, 'phone')"
                @keydown="onPhoneKeydown($event)"
                :class="{ error: errors.phone }"
                ref="phone3Input"
              />
            </div>
            <div class="phone-error-wrapper" v-if="errors.phone">
              <p class="error-msg">{{ errors.phone }}</p>
            </div>
          </div>
          <div class="sevLine"></div>

          <!-- 이메일 영역 -->
          <div class="form-group email-group">
            <label> 이메일</label>
            <input
              type="email"
              class="form-input"
              v-model="state.form.email"
              placeholder="반드시 사용 중인 메일을 @ 형식으로 입력하세요."
              @input="clearError('email')"
              :class="{ error: errors.email }"
            />
          </div>
          <!-- 이메일 에러 전용 wrapper -->
          <p v-if="errors.email" class="error-msg email-error">{{ errors.email }}</p>

          <div class="lastLine"></div>

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
          <button type="button" class="btn" data-bs-dismiss="modal">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  // 주아체
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  // 프리텐다드
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}

// input선택시
input:focus {
  outline: none;
  border-color: #ccc; // 포커스 상태에서도 기존 색상 유지
  background-color: #fff; // 혹시 다르게 바뀌는 경우 대비
}

.box {
  margin-top: -30px;
  font-size: 25px;
  letter-spacing: -1.5px;

  .solid {
    // 정보 수정 메인 선
    width: 1110px;
    border: 1px #000 solid;
    margin-top: 66px;
    margin-bottom: 55px;
  }
}

// 서브 라인
.sevLine {
  border-bottom: 0.5px solid #c8c8c8;
  width: 1110px;
}

// 서브 라인
.lastLine {
  border-bottom: 0.5px solid #c8c8c8;
  width: 1110px;
  margin-bottom: 10px;
  // margin-top: 15px;
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

// 프로필
.user {
  display: flex;
  flex-direction: column;
  align-items: center;

  .userImg {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 35px;
  }

  // 프로필 사진 수정 버튼
  button {
    width: 250px;
    height: 40px;
    margin-bottom: 50px;
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
    width: 130px;
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

.form-group:not(.address-group):not(.phone-input-wrap):not(.agreement):not(:has(.radio-group)) {
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
    margin-left: 105px;

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
  margin-left: 320px;
  margin-top: 10px;
  margin-bottom: -7px;
  color: #ff6666;
  font-size: 15px;
  font-weight: 600;
  transition: color 0.3s ease;
}

// 이메일 에러메세지
.email-error {
  margin-left: 360px;
  margin-top: -5px;
}

// 성공 메세지
.success-msg {
  color: #2f57db;
  font-size: 15px;
  font-weight: 600;
  margin-top: 10px;
  margin-left: 320px;
  margin-bottom: -7px;
  user-select: none;
  transition: color 0.3s ease;
}
.title {
  text-align: center;
  font-size: 1.2em;
}
</style>
