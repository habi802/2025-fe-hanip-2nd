import axios from 'axios';

import { reissue } from './userService';
import { useAccountStore } from '@/stores/account';

axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}/api/`;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    res => res,
    async err => {
        //console.log('err:', err.response);
        const account = useAccountStore();

        if (err.response) {
            if (err.config.url === '/user/reissue' && err.response.status === 500) {
                // 토큰 재발행 API에서 오류가 발생한 경우 로그아웃
                account.setLoggedIn(false);
            } else if (err.response.status === 401 && account.state.loggedIn) {
                // 인증 관련 오류가 발생했는데 프론트에선 로그인이 되어 있는 상태인 경우
                // 토큰을 재발행한 뒤 원래 호출하려던 API를 다시 호출한다.
                await reissue();

                return await axios.request(err.config);
            }
        }

        return Promise.reject(err);
    }
);

export default axios;





// 목업으로 연결
// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api", // 가상 백엔드 URL
//   timeout: 5000,
// });

// export default api;
