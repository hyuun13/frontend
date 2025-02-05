import axios from "axios";

const naverAxios = axios.create({
  baseURL: "/naver", // 프록시 설정의 경로와 일치
  headers: {
    "X-Naver-Client-Id": import.meta.env.VITE_NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": import.meta.env.VITE_NAVER_CLIENT_SECRET,
  },
});

export default naverAxios;
