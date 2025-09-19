import axios from "./httpRequester";

export const naverPayReserve = (orderId) => {
    return axios.get(`/naver/naverPay/reserve/${orderId}`).catch((e) => e.response);
  };