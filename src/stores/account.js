import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { logined } from '@/services/userService'
import { getOwnerStore } from '@/services/storeService';


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
    userAddr: null, 
  }),
  actions: {
  async fetchStore() {
    try {
      const res = await logined();

      if (res?.status === 200 && res?.data?.resultData) {
        const data = res.data.resultData;
        this.userId = data.id;
        this.userName = data.name;
        this.userAddr = data.address + (data.address_detail ?? '');
        console.log("userId: 나오나? ㅇㅇ ", this.userId);
      } else {
        console.error('유저 정보 구조가 이상함', res);
      }
    } catch (err) {
      console.error('유저 정보 불러오기 실패 (예외)', err);
    }
  }
}});






//가게정보 불러오기
export const useOwnerStore = defineStore('owner', {
  state: () => ({
    storeData: null,
    storeId: null,
  }),
  actions: {
    async fetchStoreInfo() {
      const res = await getOwnerStore();
      if (res.status === 200) {
        this.storeId = res.data.resultData.id;
        console.log("storeID: 여기도? : ㅇㅇ ", this.storeId)
      } else {
        console.error('가게 정보 불러오기 실패', res);
      }
    }
  }
});

