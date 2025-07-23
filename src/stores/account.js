import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', () => {
  const state = reactive({
    checked: false,
    loggedIn: false,
  });

  // 로그인 되어있느지 체크
  const setChecked = (val) => (state.checked = val);

  // 로그인 여부 바꾸기
  const setLoggedIn = (val) => (state.loggedIn = val);

  return { state, setChecked, setLoggedIn };
});
