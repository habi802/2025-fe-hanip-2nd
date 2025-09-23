import axios from "./httpRequester";

const path = "/menu";

// 메뉴 추가
export const saveMenu = (fromData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(path, fromData, config).catch((e) => e.response);
};

// 가게 메뉴 전체 조회
export const getOneMenu = (storeId) => {
  return axios.get(`${path}/${storeId}`).catch((e) => e.response);
};

// 메뉴 조회
export const getMenus = (menuId) => {
  return axios.get(`${path}/${menuId}`).catch((e) => e.response);
};

// 로그인 아이디에 따른 가게 메뉴 조회
export const getStoreIdAndMenus = () => {
  return axios.get(`${path}/owner`).catch((e) => e.response);
};

// 메뉴 한개 수정
export const modifyMenu = (fromData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.put(path, fromData, config).catch((e) => e.response);
};

// 메뉴 숨기기
export const modifiyMenuHide = (body) => {
  return axios.patch(`${path}`, body).catch((e) => e.response);
}

// 메뉴 삭제
export const deleteMenu = (menuId) => {
  return axios.delete(`${path}/${menuId}`).catch((e) => e.response);
};

export default axios;
