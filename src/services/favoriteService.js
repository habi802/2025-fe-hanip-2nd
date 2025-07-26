import axios from "./httpRequester";

const path = '/favorite';

export const getFavorite = id => {
    return axios.get(`${path}/${id}`).catch(e => e.response);
}

export const addFavorite = args => {
    return axios.post(path, args).catch(e => e.response);
}

export const deleteFavorite = id => {
    return axios.delete(`${path}/${id}`).catch(e => e.response);
}