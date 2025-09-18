import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { getUser, logined } from '@/services/userService'
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
    userAddr: '', 
  }),
  actions: {
    async fetchStore() {
      console.log("fetchStore 호출됨");
      try {
        const res = await getUser();
        console.log("유저 정보", res);
        if (res?.status === 200 && res?.data?.resultData) {
          const data = res.data.resultData;
          const address = (data.address ?? '') + (data.address_detail ?? '');
          this.userId = data.id;
          this.userName = data.name;
          this.userAddr = address;
        }
        console.log("저장된 주소:", this.userAddr);
      } catch (err) {
        console.error('유저 정보 불러오기 실패', err);
      }
    }
  }
});



//가게정보 불러오기
export const useOwnerStore = defineStore('owner', {
  state: () => ({
    storeData: null,
    storeId: null,
  }),
  actions: {
    async fetchStoreInfo() {
      try {
        const res = await getOwnerStore();
        console.log("getOwnerStore 응답:", res);

        if (res.status === 200 && res.data.resultData) {
          this.storeData = res.data.resultData; // ✅ 추가
          this.storeId = res.data.resultData.id;
          console.log("저장된 storeData:", this.storeData);
        } else {
          console.error('가게 정보 불러오기 실패', res);
        }
      } catch (err) {
        console.error("가게 정보 오류", err);
      }
    }
  }
});

