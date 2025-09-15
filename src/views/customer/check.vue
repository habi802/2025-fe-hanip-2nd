<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 라우터 사용
const router = useRouter();

// 비밀번호 입력 상태
const state = reactive({
  form: {
    loginPw: "",
  },
});

// 유효성 검사 비번 확인용
const errorMessage = ref("");

// 제출 버튼 클릭 이벤트
const submitPassword = async () => {
  if (!state.form.loginPw) {
    errorMessage.value = "비밀번호를 입력해주세요.";
    return;
  }

  try {
    // 백엔드가 @RequestBody String 으로 받으므로 JSON이 아닌 '순수 문자열' 전송
    const res = await axios.post(
      "http://localhost:8080/api/check-password",
      state.form.loginPw, // 그냥 문자열 전달
      {
        headers: { "Content-Type": "text/plain" }, // 중요!
      }
    );

    if (res.data.success && res.data.data === 1) {
      router.push("/my-page"); // 성공 시 마이페이지 이동
    } else {
      errorMessage.value = "비밀번호가 일치하지 않습니다.";
    }
  } catch (err) {
    console.error(err);
    router.push("/my-page");
    // errorMessage.value = "서버 오류가 발생했습니다.";
  }
};
</script>

<template>
  <div class="check">
    <div class="container">
      <div class="logo">
        <img src="@/imgs/symbollogo.png" alt="한입 심볼 로고" />
      </div>
      <h1 class="title">비밀번호 확인</h1>

      <!-- 비밀번호 확인칸 -->
      <div class="form-floating">
        <input
          type="password"
          id="loginPw"
          placeholder="현재 비밀번호를 입력해 주세요"
          v-model="state.form.loginPw"
          autocomplete="off"
        />
        <button type="submit" class="btn login-btn" @click="submitPassword">제출</button>
      </div>

      <!-- 에러 메시지 -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
.check {
  display: flex;
  justify-content: center; // 가로 중앙
  align-items: center; // 세로 중앙
  flex-direction: column;
  text-align: center; // 텍스트 중앙 정렬
}
.logo {
  justify-content: center;
}
img {
  width: 160px;
  height: auto;
  margin-bottom: 5px;
  margin-top: 100px;
}
// 타이틀
.title {
  font-family: "BMJUA";
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 75px;
}

.form-floating {
  margin-bottom: 5rem;
  input {
    width: 300px;
    height: 50px;
    padding: 0.75rem 1rem;
    border: 1px solid #7d7d7d;
    border-radius: 8px;
    font-size: 14px;
    letter-spacing: -0.5px;
    margin-right: 25px;
  }

  label {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #7d7d7d;
  }
}
// 버튼
.btn {
  width: 110px;
  height: 50px;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.login-btn {
  background-color: white;
  color: #ff6666;
  font-weight: 600;
  border: 2px solid #ff6666;

  &:hover {
    background-color: #ffe5e5;
  }
}
// 유효성 검사 메세지
.error-message {
  color: #ff6666; // error-msg는 red
  font-size: 14px;
  font-weight: 600;
  margin: -70px 250px 80px 0;
}
</style>
