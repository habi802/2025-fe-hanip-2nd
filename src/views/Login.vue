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
        <div class="logo">hanip</div>
        <h2 class="title">로그인</h2>

        <div class="form-floating">
          <input
            type="text"
            id="loginId"
            placeholder="아이디"
            v-model="state.form.loginId"
          />
          <label for="loginId"></label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            id="loginPw"
            placeholder="비밀번호"
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

.login {
  display: flex;
  flex-direction: column;
  align-items: center;

  .container {
    margin-top: 60px;
    max-width: 420px;
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
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 1.5rem;
        font-weight: 600;
      }

      .form-floating {
        position: relative;

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }

        label {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #777;
        }
      }

      .options {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #555;

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
          background-color: darken(#ff6666, 10%);
        }
      }

      .signup-btn {
        background-color: white;
        color: #ff6666;;
        border: 1px solid #ff6666;;

        &:hover {
          background-color: #fff4e5;
        }
      }
    }
  }
}
</style>
