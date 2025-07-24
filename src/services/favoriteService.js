import axios from "./httpRequester";

const path = '/favorite';

export const addFavorite = args => {
    return axios.post(`${path}`, args).catch(e => e.response);
}