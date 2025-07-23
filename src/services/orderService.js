import axios from "./httpRequester";

export const getOrder = () => {
  return axios.get(`/order`).catch((e) => e.response);
};

export default axios;
