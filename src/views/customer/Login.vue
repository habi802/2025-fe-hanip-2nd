<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/userService";
import { getStore } from "@/services/storeService";
import { useAccountStore, useOwnerStore } from "@/stores/account";
import AlertModal from "@/components/modal/AlertModal.vue";

const router = useRouter();
const account = useAccountStore();

const alertModal = ref(null);

const state = reactive({
  form: {
    loginId: "",
    loginPw: "",
    role: "고객",
  },
  saveId: false, // 아이디 저장용
});

const store = reactive({
  form: {},
});

// 로그인 여부
const submit = async () => {
  try {
    const res = await login(state.form);
    // console.log("응답 전체확인용:", res);
    // console.log("res.data.resultData:", res.data.resultData);

    if (res.status === 200) {
      // 서버에서 loginId 같이 내려주는지 확인 필요
      const { role, id } = res.data.resultData; // 회원 유형 고객 or 가게사장

      if (id) {
        localStorage.setItem("id", id); // 이걸 꼭 추가!(유저 정보 수정시 필요한거)
      } else {
        console.warn("id가 응답에 없습니다."); // 응답 확인용
      }

      // 아이디 저장 여부 확인
      if (state.saveId) {
        localStorage.setItem("savedLoginId", state.form.loginId);
      } else {
        localStorage.removeItem("savedLoginId");
      }

      account.setLoggedIn(true);

      if (role === "사장") {
        try {
          const ownerStore = useOwnerStore();
          const res = await ownerStore.fetchStoreInfo();
          const isActive = ownerStore.storeData?.isActive;
          if (isActive === 0) {
            router.push("/owner");
          } else {
            router.push("/owner/dashboard");
          }
        } catch (err) {
          console.error("가게 정보 조회 실패", err);
          router.push("/owner"); // fallback
        }
      } else {
        router.push("/"); // 고객용 메인화면
      }
    } else if (res.status === 401) {
      alertModal.value.open("아이디/비밀번호를 확인해주세요.");
    } else {
      alertModal.value.open("알 수 없는 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    alertModal.value.open("다시 한번 확인해주세요.");
  }
};

// 아이디 저장 (저장되긴하는데 마지막 사용자 기준으로 하는건지.. 의문)
onMounted(() => {
  const savedId = localStorage.getItem("savedLoginId");
  if (savedId) {
    state.form.loginId = savedId;
    state.saveId = true;
  }
});
</script>

<template>
  <div class="login">
    <div class="container">
      <form class="login-form" @submit.prevent="submit">
        <!-- 로고 이미지 -->
        <div class="logo">
          <img src="@/imgs/symbollogo.png" alt="한입 심볼 로고" />
        </div>
        <h1 class="title">로그인</h1>

        <!-- 회원 구분 -->
        <div class="radio-group">
          <label id="radio"
            ><input
              type="radio"
              class="circle"
              name="memberType"
              value="고객"
              v-model="state.form.role"
            />
            일반</label
          >
          <label
            ><input
              type="radio"
              class="circle"
              name="memberType"
              value="사장"
              v-model="state.form.role"
            />
            업주</label
          >
        </div>

        <div class="form-floating">
          <input
            type="text"
            id="loginId"
            placeholder="아이디 (영문, 숫자 4~16자)"
            v-model="state.form.loginId"
          />
          <label for="loginId"></label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            id="loginPw"
            placeholder="비밀번호 (영문, 숫자, 특수문자 혼합 8~16자)"
            v-model="state.form.loginPw"
            autocomplete="off"
          />
          <label for="loginPw"></label>
        </div>

        <div class="options">
          <label><input type="checkbox" class="circle" v-model="state.saveId" /> 아이디 저장</label>
          <div class="links">
            <a class="join" @click="router.push('/join')">회원가입</a>
          </div>
        </div>

        <button type="submit" class="btn login-btn">로그인</button>
        <button type="submit" class="btn naver-btn">네이버 로그인</button>
        <button type="submit" class="btn kakao-btn">카카오 로그인</button>
      </form>
    </div>
  </div>
  <!-- 모달창 -->
  <alert-modal ref="alertModal"></alert-modal>
</template>

<style scoped lang="scss">
@font-face {
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

* {
  font-family: "BMJUA";
  letter-spacing: 1px;
  box-sizing: border-box;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  min-height: 100vh;

  img {
    width: 150px;
    height: auto;
    margin-bottom: 0;
  }

  .container {
    margin-top: 60px;
    //max-width: 100%;
    width: 440px;
    padding: 2rem;

    .radio-group {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      gap: 2rem;
      margin-bottom: -0.5rem;
      margin-top: -0.5rem;

      label {
        font-weight: 400;
      }

      input[type="radio"].circle {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid #7d7d7d;
        position: relative;
        cursor: pointer;
        vertical-align: middle;
        margin-right: 8px;
        background-color: white;
      }

      input[type="radio"].circle:checked {
        background-color: #fff;
        border-color: #ff6666;
      }

      input[type="radio"].circle:checked::after {
        content: "";
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

    .login-form {
      width: 440px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;

      .logo {
        font-size: 2.5rem;
        font-weight: bold;
        color: #ff6666;
        text-align: center;
      }

      .title {
        font-size: 2.5rem;
        text-align: center;
        font-weight: 400;
      }

      .form-floating {
        position: relative;
        width: 100%;

        input {
          width: 440px;
          height: 50px;
          padding: 0.75rem 1rem;
          border: 1px solid #7d7d7d;
          border-radius: 6px;
          font-size: 14px;
          letter-spacing: -0.5px;
        }

        label {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #7d7d7d;
        }
      }

      .options {
        width: 440px;
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #000;

        label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 100;
        }

        input[type="checkbox"].circle {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 25%;
          border: 1px solid #7d7d7d;
          position: relative;
          cursor: pointer;
          vertical-align: middle;
          margin-right: 6px;

          &:checked {
            background-color: #ff6666;
            border-color: #ff6666;
          }

          &:checked::after {
            font-family: "Pretendard-Regular";
            content: "v";
            font-weight: 600;
            color: #fff;
            font-size: 12px;
            position: absolute;
            left: 5px;
            top: -1px;
          }
        }

        .links {
          display: flex;
          align-items: center;
          gap: 0.4rem;

          a {
            color: #ff6666;
            text-decoration: none;
            font-weight: 100;

            &:hover {
              text-decoration: underline;
            }
          }

          span {
            color: #000;
          }
        }
      }

      .btn {
        width: 440px;
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
      }

      .login-btn {
        background-color: white;
        color: #ff6666;
        border: 1px solid #ff6666;

        &:hover {
          background-color: #ffe5e5;
        }
      }
      .naver-btn {
        background-color: #3fc754;
        color: #fff;

        &:hover {
          background-color: darken(#3fc754, 5%);
        }
      }
      .kakao-btn {
        background-color: #ffea00;
        color: #000;

        &:hover {
          background-color: darken(#fbe400, 3%);
        }
      }
    }
  }
}
</style>
