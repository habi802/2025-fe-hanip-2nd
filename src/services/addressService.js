import axios from "./httpRequester";

const path = '/user/address';

// 유저 주소 조회
export const getAddresses = () => {
    return axios.get(path).catch(e => e.response);
}

// 주소 추가
export const addAddress = args => {
    return axios.post(path, args).catch(e => e.response);
}

// 주소 수정
export const putAddress = args => {
    return axios.put(path, args).catch(e => e.response);
}

// 기본 주소 변경
export const patchMainAddress = id => {
    return axios.patch(`${path}/${id}`).catch(e => e.response);
}

// 주소 삭제
export const deleteAddress = id => {
    return axios.delete(`${path}/${id}`).catch(e => e.response);
}