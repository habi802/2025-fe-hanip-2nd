import axios from "@/services/httpRequester";

export const getOrderDelivery = () =>{
  return axios.get(`/order/rider`).catch(e => e.response);
}