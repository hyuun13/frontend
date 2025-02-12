import axios from "axios";

export const getNaverBookInfo = async (isbn: string) => {
  const url = `https://openapi.naver.com/v1/search/book.json?query=${isbn}&display=1`;
  try {
    const response = await axios.get(url, {
      headers: {
        "X-Naver-Client-Id": import.meta.env.VITE_NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": import.meta.env.VITE_NAVER_CLIENT_SECRET,
      },
    });

    // 응답 객체의 items 배열에서 첫 번째 문서를 반환 (필요시 추가 검증)
    const items = response.data.items;
    return items && items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error("네이버 책 정보 조회 실패:", error);
    return null;
  }
};
