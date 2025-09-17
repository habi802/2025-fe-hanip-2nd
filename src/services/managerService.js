import axios from "./httpRequester";

const managerPath = import.meta.env.VITE_MANAGER_PATH;
const actorPath = `${managerPath}/actor`;
const actionPath = `${managerPath}/action`;

// 관리자 계정 로그인
export const managerLogin = args => {
    return axios.post(`${actorPath}/login`, args).catch(e => e.response);
};

// 유저 조회
export const getUserList = args => {
    return axios.post(`${actorPath}/user`, args).catch(e => e.response);
};

// 가게 조회
export const getStoreList = args => {
    return axios.post(`${actorPath}/store`, args).catch(e => e.response);
};

// 가게 상세 조회
export const getStore = id => {
    return axios.get(`${actorPath}/store/${id}`).catch(e => e.response);
};

// 가게 영업 승인 상태 변경
export const patchIsActive = params => {
    return axios.patch(
        `${actorPath}/store`, null, { 
            params,
            paramsSerializer: params => {
                return Object.entries(params).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(v => `${key}=${v}`).join('&');
                    }
                    return `${key}=${value}`;
                }).join('&');
            }
        },
    ).catch(e => e.response);
}
