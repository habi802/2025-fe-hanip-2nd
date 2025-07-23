import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import {logined} from '@/services/userService'


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


//로그인정보 불러오기
export const useUserInfo = defineStore('userInfo', {
  state: () => ({
    userName: null,
  }),
  actions: {
    async fetchStore() {
      const res = await logined();
      console.log(res)
      if (res && res.status === 200) {
        this.userName = res.data.resultData.name;
        console.log(res);
      } else {
        console.error('유저 정보 불러오기 실패', res);
      }
    },
  },
});

