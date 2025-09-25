import axios from "@/services/httpRequester";

export const getOrderDelivery = () =>{
  return axios.get(`/order/rider`).catch(e => e.response);
}

export const patchDeliveryCompleted = (orderId) =>{
  return axios.patch(`/order/status/completed/${orderId}`).catch(e => e.response);
}

