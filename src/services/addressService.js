import axios from "./httpRequester";

const path = '/address';

// 유저 주소 조회
export const getAddresses = () => {
    return axios.get('/user/adds').catch(e => e.response);
}

// 주소 추가
export const addAddress = (args) => {
    return axios.post(path, args).catch(e => e.response);
}

// 기본 주소 변경
export const patchMainAddress = id => {
    return axios.patch(`/user/adds/main/${id}`).catch(e => e.response);
}

// 주소 삭제
export const deleteAddress = id => {
    return axios.delete(`user/adds/${id}`).catch(e => e.response);
}