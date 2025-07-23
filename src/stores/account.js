import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { logined } from '@/services/userService'
import { activeStore , getStore } from '@/services/storeService';


export const useAccountStore = defineStore('account', () => {
  const state = reactive({
    checked: false,
    loggedIn: false,
  });

  // 로그인 되어있는지 체크
  const setChecked = (val) => (state.checked = val);

  // 로그인 여부 바꾸기
  const setLoggedIn = (val) => (state.loggedIn = val);

  return { state, setChecked, setLoggedIn };
});


//로그인정보 불러오기
export const useUserInfo = defineStore('userInfo', {
  state: () => ({
    userId: null,
    userName: null,
  }),
  actions: {
    async fetchStore() {
      const res = await logined();
      if (res.status === 200) {
        this.userId = res.data.resultData.id;
        this.userName = res.data.resultData.name;
        console.log("userId: 나오나? ㅇㅇ ",this.userId);
        } else {
        console.error('유저 정보 불러오기 실패', res);
        }
    },
  },
});




//가게정보 불러오기
export const useOwnerStore = defineStore('owner', {
  state: () => ({
    storeData: null,
    storeId: null,
  }),
  actions: {
    async fetchStoreInfo() {
      const res = await getStore();
      if (res.status === 200) {
        this.storeId = res.data.resultData.id;
        console.log("storeID: 여기도? :  ", this.storeId)
      } else {
        console.error('가게 정보 불러오기 실패', res);
      }
    }
  }
});

