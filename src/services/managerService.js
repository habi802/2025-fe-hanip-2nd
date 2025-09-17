import axios from "./httpRequester";

const managerPath = import.meta.env.VITE_MANAGER_PATH;

// 관리자 계정 로그인
export const managerLogin = args => {
    return axios.post(`${managerPath}/actor/login`, args).catch(e => e.response);
};

// 유저 조회
export const getUserList = args => {
    return axios.post(`${managerPath}/actor/user`, args).catch(e => e.response);
};