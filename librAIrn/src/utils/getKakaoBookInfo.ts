// src/utils/getKakaoBookInfo.ts
import axios from "axios";

export const getKakaoBookInfo = async (isbn: string) => {
  const url = `https://dapi.kakao.com/v3/search/book?target=isbn&query=${isbn}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
      },
    });
    // 응답 객체의 documents 배열에서 첫번째 문서를 반환 (필요시 추가 검증)
    const documents = response.data.documents;
    return documents && documents.length > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Kakao API 호출 실패:", error);
    return null;
  }
};
