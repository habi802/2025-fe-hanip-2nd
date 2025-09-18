//실제 백엔드 연결
//import axios from 'axios';
// axios.defaults.baseURL = '/api';

// export default axios;




// 목업으로 연결
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 가상 백엔드 URL
  timeout: 5000,
});

export default api;