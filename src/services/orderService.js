import axios from "./httpRequester";

export const getOrder = () => {
  return axios.get(`/order`).catch((e) => e.response);
};

export const modifyStatus = (params) => {
  return axios.patch("/order/status", params).catch((e) => e.response)
}

export const getOwnerOrder = (id) => {
  return axios.get(`/order/owner/${id}`).catch((e) => e.response);
}

export const addOrder = args => {
  return axios.post('/order', args).catch(e => e.response);
}

export const deleteOrder = (id) => {
  return axios.patch(`/order/owner/${id}`).catch(e => e.response);
}


export default axios;
