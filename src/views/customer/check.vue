<script setup></script>

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
        <label for="loginPw"></label>
      </div>
      <button type="submit" class="btn login-btn">제출</button>
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

img {
  width: 150px;
  height: auto;
  margin-bottom: 0;
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
</style>
