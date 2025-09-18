// src/services/index.js  나중에 해당파일 임포트 해제하고 httpservice 연결하기
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 가상 백엔드 URL
  timeout: 5000,
});

export default api;