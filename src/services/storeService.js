import axios from "./httpRequester";

export const getStore = (id) => {
  return axios.get(`/store/${id}`).catch((e) => e.response);
};

export const getOrder = () => {
  return axios.get(`/order`).catch((e) => e.response);
};

export const patchIsOpen = (id) => {
  return axios.patch(`/store/${id}`).catch((e) => e.response);
};

export const searchStore = (storeId) => {
  return axios.get(`/store/${storeId}`).catch((e) => e.response);
};

export const modify = (formData) => {
  const config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.put("/store/update", formData, config).catch((e) => e.response);
};
export const getStoreList = (params) => {
  return axios.get("/store", { params }).catch((e) => e.response);
};

export const getOwnerStore = () => {
  return axios.get("/store/owner").catch((e) => e.response);
};




// 새로 만든 서비스
export const getStoreId = (storeId)=> {
  return axios.get(`/store/${storeId}`).catch((e)=>e.response);
}


export default axios;
