import axios from "./httpRequester";

export const getOrder = (params) => {
  return axios.get(`/order`, { params }).catch((e) => e.response);
};

export const modifyStatus = (params) => {
  return axios.patch("/order/status", params).catch((e) => e.response)
}

export const getOwnerOrder = (id) => {
  return axios.get(`/order/status/ordered/${id}`).catch((e) => e.response);
}

export const getOwnerOrder2 = (id) => {
  return axios.get(`/order/${id}`).catch((e) => e.response);
}

export const addOrder = args => {
  return axios.post('/order', args).catch(e => e.response);
}

export const deleteOrder = (id) => {
  return axios.patch(`/order/owner/${id}`).catch(e => e.response);
}

export const getOrderByDate = (params) => {
  return axios.get('/order/owner', {params}).catch(e => e.response);
}

export default axios;
