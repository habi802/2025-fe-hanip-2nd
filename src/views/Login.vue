<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const state = reactive({
  form: {
    loginId: '',
    loginPw: '',
  },
});

const submit = async () => {
  const res = await login(state.form);

  switch (res.status) {
    case 200:
      await router.push('/');
      break;
    case 404:
      alert('아이디/비밀번호를 확인해 주세요.');
      break;
    default:
      alert('알 수 없는 오류가 발생했습니다.');
  }
};
</script>

<template>
  <div class="login">
    <HeaderComponent />

    <div class="container">
      <form class="login-form" @submit.prevent="submit">
        <div class="logo">
          <img src="@/imgs/symbollogo.png" alt="한입 심볼 로고">
        </div>
        <h1 class="title">로그인</h1>

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
          <label><input type="checkbox" /> 아이디 저장</label>
          <div class="links">
            <a href="#">아이디 찾기</a><span>|</span><a href="#">비밀번호 찾기</a>
          </div>
        </div>

        <button type="submit" class="btn login-btn">로그인</button>
        <button type="button" class="btn signup-btn" @click="router.push('/join')">
          회원가입
        </button> 
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@font-face {
    font-family: 'BMJUA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
* {
  font-family: 'BMJUA';
  letter-spacing: 1px;
}
.login {
  display: flex;
  //flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  min-height: center;
  
  img {
    width: 150px;
    height: auto;
    margin-bottom: 0;
  }

  .container {
    margin-top: 60px;
    max-width: 440px;
    width: 100%;
    padding: 2rem;

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .logo {
        font-size: 2.5rem;
        font-weight: bold;
        color: #ff6666;
        text-align: center;
        margin-bottom: 1rem;
      }

      .title {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 1.5rem;
        font-weight: 600;
      }

      .form-floating {
        position: relative;

        input {
          width: 100%;
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
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #7d7d7d;

        label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .links {
          display: flex;
          align-items: center;
          gap: 0.4rem;

          a {
            color: #777;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }

          span {
            color: #aaa;
          }
        }
      }

      .btn {
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
      }

      .login-btn {
        background-color: #ff6666;;
        color: white;
        border: none;

        &:hover {
          background-color: darken(#ff6666, 5%);
        }
      }

      .signup-btn {
        background-color: white;
        color: #ff6666;;
        border: 1px solid #ff6666;;

        &:hover {
          background-color: #ffe5e5;
        }
        margin-bottom: 15rem;
      }
    }
  }
}
</style>
