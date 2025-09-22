import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { getUser } from '@/services/userService'
import { getOwnerStore, patchIsOpen } from '@/services/storeService';

export const useAccountStore = defineStore('account',
    () => {
        const state = reactive({
            loggedIn: false,
        });

        const setLoggedIn = (val) => (state.loggedIn = val);

        return { state, setLoggedIn };
    },
    { persist: true }
);

// 로그인 정보 불러오기
export const useUserInfo = defineStore('userInfo', {
    state: () => ({
        userId: null,
        userName: null,
        userAddr: '', 
    }),
    actions: {
        async fetchStore() {
            //console.log("📣 fetchStore 호출됨");
            try {
                const res = await getUser();
                //console.log("🤢유저 정보", res);
                if (res?.status === 200 && res?.data?.resultData) {
                    const data = res.data.resultData;
                    const address = (data.address ?? '') + (data.address_detail ?? '');
                    this.userId = data.id;
                    this.userName = data.name;
                    this.userAddr = address;
                }
                //console.log("🟢 저장된 주소:", this.userAddr);
            } catch (err) {
                console.error('유저 정보 불러오기 실패', err);
            }
        }
    }
});

// 가게 정보 불러오기
export const useOwnerStore = defineStore('owner',
    () => {
        const state = reactive({
            storeId: null,
            storeData: null
        });

        const fetchStoreInfo = async () => {
            try {
                const res = await getOwnerStore();
                console.log("📦 getOwnerStore 응답:", res);

                if (res.status === 200 && res.data.resultData) {
                    state.storeId = res.data.resultData.id;
                    state.storeData = res.data.resultData; // ✅ 추가
                    console.log("✅ 저장된 storeData:", this.storeData);
                } else {
                    console.error('가게 정보 불러오기 실패', res);
                }
            } catch (err) {
                console.error("가게 정보 오류", err);
            }
        };

        const setIsOpen = () => (state.storeData.isOpen = state.storeData.isOpen === 0 ? 1 : 0);

        return { state, fetchStoreInfo, setIsOpen };
    },
    { persist: true }
);

