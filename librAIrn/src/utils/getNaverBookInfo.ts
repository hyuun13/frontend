import naverAxios from "./naverAxios";

export const getNaverBookInfo = async (isbn: string) => {
  try {
    const response = await naverAxios.get("/search/book.json", {
      // /v1은 제거
      params: {
        query: isbn,
        display: 1,
      },
    });
    return response.data.items[0] || null;
  } catch (error) {
    console.error("네이버 책 정보 조회 실패:", error);
    return null;
  }
};
