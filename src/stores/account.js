import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { logined } from '@/services/userService'
import { activeStore } from '@/services/storeService';


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




export const useOwnerStore = defineStore('owner', {
  state: () => ({
    storeData: null,
    storeId: null,
    userName: null,
  }),
  actions: {
    async fetchStoreInfo(id) {
      const res = await activeStore(id);
      console.log("아이디ㅣㅣ" ,id);
      console.log("여기제대로나오는가? : ㅇㅇ " , res);
      if (res.status === 200) {
        this.storeData = res.data.resultData;
        this.storeId = res.data.resultData.id;
        console.log("storeData: "+ this.storeData)
      } else {
        console.error('가게 정보 불러오기 실패', res);
      }
    }
  }
});


//로그인정보 불러오기
export const useUserInfo = defineStore('userInfo', {
  state: () => ({
    userName: null,
    storeId: null,
  }),
  actions: {
    async fetchStore() {
      const res = await logined();
      if (res && res.status === 200) {
        this.userName = res.data.resultData.name;
        
        // 유저가 사장인 경우에만 스토어 정보를 가져옴
        console.log("res.data.resultData.role:" + res.data.resultData.role);
        if (res.data.resultData.role === 'OWNER') {
          const ownerStore = useOwnerStore();
          await ownerStore.fetchStoreInfo(res.data.resultData.id);
          console.log("나옴 ㅇㅇ : " + res.data.resultData.id);


          console.log("이거는?: 안나옴 " + ownerStore.state)
          this.storeId = ownerStore.state.storeId;
          console.log("여긴 왜 안나와", storeId);
        }

        } else {
        console.error('유저 정보 불러오기 실패', res);
        }
    },
  },
});
