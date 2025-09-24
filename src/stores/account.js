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
export const useUserInfo = defineStore('userInfo',
    () => {
        const state = reactive({
            userId: null,
            userName: null,
            userAddr: '',
            userData: null,
        });

        const fetchStore = async () => {
            try {
                const res = await getUser();

                if (res !== undefined && res.status === 200) {
                    const address = (res.data.resultData.address ?? '') + (res.data.resultData.address_detail ?? '');
                    state.userId = res.data.resultData.id;
                    state.userName = res.data.resultData.name;
                    state.userAddr = address;
                    state.userData = res.data.resultData;
                }
            } catch (err) {
                console.error('유저 정보 불러오기 실패', err);
            }
        };

        return { state, fetchStore };
    },
    { persist: true }
);

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

                if (res !== undefined && res.status === 200) {
                    state.storeId = res.data.resultData.id;
                    state.storeData = res.data.resultData;
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

