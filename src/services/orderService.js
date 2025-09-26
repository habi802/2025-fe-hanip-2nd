import axios from "./httpRequester";

export const getOrder = (params) => {
  return axios.get(`/order`, { params }).catch((e) => e.response);
};

export const modifyStatus = (params) => {
  return axios.patch("/order/status", params).catch((e) => e.response)
}

// PAID 조회
export const getOwnerPaidOrder = (id) => {
  return axios.get(`/order/status/ordered/${id}`).catch((e) => e.response);
}

// PREPARING 조회
export const getOwnerPreparingOrder = (id) => {
  return axios.get(`/order/status/preparing/${id}`).catch((e) => e.response);
}

// DELIVERED 조회
export const getOwnerDeliveredOrder = (id) => {
  return axios.get(`/order/status/delivered/${id}`).catch((e) => e.response);
}

// 주문 상태 변경 : 음식준비중
export const patchPreparingOrder = (orderId) => {
  return axios.patch(`/order/status/preparing/${orderId}`).catch((e) => e.response);
}

// 주문 상태 변경 : 배달중
export const patchDeliveredOrder = (orderId) => {
  return axios.patch(`/order/status/completed/${orderId}`).catch((e) => e.response)
}

// 주문 상태 변경 : 취소됨
export const patchCanceledOrder = (orderId) => {
  return axios.patch(`/order/status/canceled/${orderId}`).catch((e) => e.response)
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

export const sseEvent = (id) => `/api/sse/order/${id}`;

export default axios;
