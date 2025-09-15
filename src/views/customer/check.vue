<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

// 라우터 사용
const router = useRouter();

// 비밀번호 입력 상태
const state = reactive({
  form: {
    loginPw: "",
  },
});

// 제출 버튼 클릭 이벤트
const submitPassword = () => {
  if (!state.form.loginPw) {
    alert("비밀번호를 입력해주세요");
    return;
  }
  // 비밀번호 확인 후 /mypage로 이동
  router.push("/mypage");
};
</script>

<template>
  <div class="check">
    <div class="container">
      <!-- 로고 이미지 -->
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
</style>
