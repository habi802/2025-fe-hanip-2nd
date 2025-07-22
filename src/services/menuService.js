import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/api';
const path = '/menu';

// 메뉴 추가
export const saveMenu = (menuData) => {
  return axios.post(path, menuData).catch((e) => e.response);
};

// 가게 메뉴 전체 조회
export const getOneMenu = (storeId) => {
  return axios.get(`${path}/${storeId}`).catch((e) => e.response);
};

// 메뉴 조회
export const getMenus = (menuId) => {
  return axios.get(path, { params: menuId }).catch((e) => e.response);
};

// 메뉴 한개 수정
export const modifyMenu = (menuId, menuData) => {
  return axios.put(path, menuData, { params: menuId }).catch((e) => e.response);
};

// 메뉴 삭제
export const deleteMenu = (menuId) => {
  return axios.delete(`${path}/${menuId}`).catch((e) => e.response);
};

export default axios;
