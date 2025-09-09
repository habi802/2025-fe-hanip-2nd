import axios from "./httpRequester";

const path = '/address'

export const addAddress = (args) => {
    return axios.post(path, args).catch(e => e.response);
  }