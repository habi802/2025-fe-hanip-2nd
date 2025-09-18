import axios from 'axios';

axios.defaults.baseURL = import.meta.env.MODE === 'development' ? '/api' : `${import.meta.env.VITE_BASE_URL}/api/`;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    res => res,
    async err => {
        if (err.response) {
            
        }

        return Promise.reject(err);
    }
);

export default axios;
