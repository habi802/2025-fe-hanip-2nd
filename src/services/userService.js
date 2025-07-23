import axios from "./httpRequester";

const path = '/user';

export const join = args => {
    return axios.post(`${path}/join`, args).catch(e => e.response);
}

export const login = args => {
    return axios.post(`${path}/login`, args).catch(e => e.response);
}

export const check = () => {
    return axios.get(`${path}/check`).catch(e => e.response);
}

export const logout = () => {
    return axios.post(`${path}/logout`).catch(e => e.response);
}
// 사용자 정보 가져오기
export const find = (userId) => {
    return axios.get(`${path}/${userId}`).catch(e => e.response);
}
// 사용자 정보 수정
export const update = (userId, data) => {
    return axios.put(`${path}/${userId}`, data).catch(e => e.response);
}