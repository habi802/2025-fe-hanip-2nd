import axios from "./httpRequester";

const managerPath = import.meta.env.VITE_MANAGER_PATH;

export const managerLogin = args => {
    return axios.post(`/${managerPath}/actor/login`, args).catch((e) => e.response);
};