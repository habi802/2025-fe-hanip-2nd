import axios from "./httpRequester";

const path = '/user';

export const join = args => {
    return axios.post(`${path}/join`, args).catch(e => e.response);
}

export const login = args => {
    return axios.post(`${path}/login`, args).catch(e => e.response);
}

export const check = () => {
    return axios.get(`${path}/check`).catch(e => e.response);
}

export const findId = ({ loginId, role }) => {
    return axios.post(`${path}/check-id`, { loginId, role }).catch(e => e.response);
}

export const logined = () => {
    return axios.get(path).catch(e => e.response);
}

export const logout = () => {
    return axios.post(`${path}/logout`).catch(e => e.response);
}

export const getUser = () => {
    return axios.get(`${path}`).catch(e => e.response);
}

export const checkPassword = password => {
    return axios.post(`${path}/check-password`, password, {
        headers: {
            'Content-Type': 'text/plain'
        }}).catch(e => e.response);
}

export const update = args => {
    return axios.put(`${path}`, args).catch(e => e.response);
}

